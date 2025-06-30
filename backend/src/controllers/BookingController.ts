import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Booking, BookingStatus } from '../models/Booking';
import { Court, CourtStatus } from '../models/Court';
import { validate } from 'class-validator';
import { AuthRequest } from '../middleware/auth';

export class BookingController {
  static async createBooking(req: AuthRequest, res: Response) {
    try {
      const { courtId, startTime, endTime, playerNames, notes } = req.body;
      const userId = req.user!.id;

      const bookingRepository = AppDataSource.getRepository(Booking);
      const courtRepository = AppDataSource.getRepository(Court);

      // Validate court exists and is available
      const court = await courtRepository.findOne({
        where: { id: courtId, isActive: true, status: CourtStatus.AVAILABLE }
      });

      if (!court) {
        return res.status(404).json({ message: 'Court not found or unavailable' });
      }

      // Check for booking conflicts
      const conflictingBooking = await bookingRepository
        .createQueryBuilder('booking')
        .where('booking.courtId = :courtId', { courtId })
        .andWhere('booking.status = :status', { status: BookingStatus.CONFIRMED })
        .andWhere(
          '(booking.startTime < :endTime AND booking.endTime > :startTime)',
          { startTime, endTime }
        )
        .getOne();

      if (conflictingBooking) {
        return res.status(400).json({ message: 'Time slot is already booked' });
      }

      // Calculate total amount
      const start = new Date(startTime);
      const end = new Date(endTime);
      const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      // Determine if it's peak hour (6 PM - 10 PM)
      const hour = start.getHours();
      const isPeakHour = hour >= 18 && hour < 22;
      const rate = isPeakHour ? court.peakHourRate : court.hourlyRate;
      const totalAmount = durationHours * rate;

      // Create booking
      const booking = new Booking();
      booking.userId = userId;
      booking.courtId = courtId;
      booking.startTime = start;
      booking.endTime = end;
      booking.totalAmount = totalAmount;
      booking.playerNames = playerNames ? JSON.stringify(playerNames) : null;
      booking.notes = notes;
      booking.status = BookingStatus.CONFIRMED; // Auto-confirm for now

      const errors = await validate(booking);
      if (errors.length > 0) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.map(err => err.constraints)
        });
      }

      const savedBooking = await bookingRepository.save(booking);

      // Load the complete booking with relations
      const completeBooking = await bookingRepository.findOne({
        where: { id: savedBooking.id },
        relations: ['user', 'court']
      });

      res.status(201).json(completeBooking);
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getUserBookings(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const bookingRepository = AppDataSource.getRepository(Booking);

      const bookings = await bookingRepository.find({
        where: { userId },
        relations: ['court'],
        order: { startTime: 'DESC' }
      });

      res.json(bookings);
    } catch (error) {
      console.error('Get user bookings error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getAllBookings(req: Request, res: Response) {
    try {
      const { status, date, courtId } = req.query;
      const bookingRepository = AppDataSource.getRepository(Booking);

      let query = bookingRepository.createQueryBuilder('booking')
        .leftJoinAndSelect('booking.user', 'user')
        .leftJoinAndSelect('booking.court', 'court');

      if (status) {
        query = query.andWhere('booking.status = :status', { status });
      }

      if (courtId) {
        query = query.andWhere('booking.courtId = :courtId', { courtId: parseInt(courtId as string) });
      }

      if (date) {
        const startOfDay = new Date(date as string);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date as string);
        endOfDay.setHours(23, 59, 59, 999);

        query = query.andWhere('booking.startTime >= :startOfDay', { startOfDay })
                    .andWhere('booking.startTime <= :endOfDay', { endOfDay });
      }

      const bookings = await query.orderBy('booking.startTime', 'ASC').getMany();

      res.json(bookings);
    } catch (error) {
      console.error('Get all bookings error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateBooking(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const userId = req.user!.id;

      const bookingRepository = AppDataSource.getRepository(Booking);
      const booking = await bookingRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['user']
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check if user owns the booking or is admin
      if (booking.userId !== userId && req.user!.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      if (status) booking.status = status;
      if (notes !== undefined) booking.notes = notes;

      const updatedBooking = await bookingRepository.save(booking);
      
      // Load complete booking with relations
      const completeBooking = await bookingRepository.findOne({
        where: { id: updatedBooking.id },
        relations: ['user', 'court']
      });

      res.json(completeBooking);
    } catch (error) {
      console.error('Update booking error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async cancelBooking(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const bookingRepository = AppDataSource.getRepository(Booking);
      const booking = await bookingRepository.findOne({
        where: { id: parseInt(id) }
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check if user owns the booking or is admin
      if (booking.userId !== userId && req.user!.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Check if booking can be cancelled (not in the past)
      const now = new Date();
      if (booking.startTime < now) {
        return res.status(400).json({ message: 'Cannot cancel past bookings' });
      }

      booking.status = BookingStatus.CANCELLED;
      await bookingRepository.save(booking);

      res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
      console.error('Cancel booking error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}