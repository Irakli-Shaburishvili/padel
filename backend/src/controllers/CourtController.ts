import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Court, CourtStatus } from '../models/Court';
import { Booking, BookingStatus } from '../models/Booking';
import { validate } from 'class-validator';
import { AuthRequest } from '../middleware/auth';

export class CourtController {
  static async getAllCourts(req: Request, res: Response) {
    try {
      const courtRepository = AppDataSource.getRepository(Court);
      const courts = await courtRepository.find({
        where: { isActive: true },
        order: { name: 'ASC' }
      });

      res.json(courts);
    } catch (error) {
      console.error('Get courts error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getCourtById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const courtRepository = AppDataSource.getRepository(Court);
      
      const court = await courtRepository.findOne({
        where: { id: parseInt(id), isActive: true }
      });

      if (!court) {
        return res.status(404).json({ message: 'Court not found' });
      }

      res.json(court);
    } catch (error) {
      console.error('Get court error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createCourt(req: AuthRequest, res: Response) {
    try {
      const { name, type, hourlyRate, peakHourRate, description } = req.body;
      const courtRepository = AppDataSource.getRepository(Court);

      const court = new Court();
      court.name = name;
      court.type = type;
      court.hourlyRate = hourlyRate;
      court.peakHourRate = peakHourRate;
      court.description = description;

      const errors = await validate(court);
      if (errors.length > 0) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.map(err => err.constraints)
        });
      }

      const savedCourt = await courtRepository.save(court);
      res.status(201).json(savedCourt);
    } catch (error) {
      console.error('Create court error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateCourt(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, type, hourlyRate, peakHourRate, description, status } = req.body;
      const courtRepository = AppDataSource.getRepository(Court);

      const court = await courtRepository.findOne({ where: { id: parseInt(id) } });
      if (!court) {
        return res.status(404).json({ message: 'Court not found' });
      }

      court.name = name || court.name;
      court.type = type || court.type;
      court.hourlyRate = hourlyRate || court.hourlyRate;
      court.peakHourRate = peakHourRate || court.peakHourRate;
      court.description = description || court.description;
      court.status = status || court.status;

      const errors = await validate(court);
      if (errors.length > 0) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.map(err => err.constraints)
        });
      }

      const updatedCourt = await courtRepository.save(court);
      res.json(updatedCourt);
    } catch (error) {
      console.error('Update court error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getCourtAvailability(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { date } = req.query;
      
      if (!date) {
        return res.status(400).json({ message: 'Date parameter is required' });
      }

      const courtRepository = AppDataSource.getRepository(Court);
      const bookingRepository = AppDataSource.getRepository(Booking);

      const court = await courtRepository.findOne({
        where: { id: parseInt(id), isActive: true, status: CourtStatus.AVAILABLE }
      });

      if (!court) {
        return res.status(404).json({ message: 'Court not found or unavailable' });
      }

      // Get bookings for the specific date
      const startOfDay = new Date(date as string);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date as string);
      endOfDay.setHours(23, 59, 59, 999);

      const bookings = await bookingRepository.find({
        where: {
          courtId: parseInt(id),
          status: BookingStatus.CONFIRMED,
          startTime: { $gte: startOfDay } as any,
          endTime: { $lte: endOfDay } as any
        },
        select: ['startTime', 'endTime']
      });

      // Generate available time slots (assuming 8 AM to 10 PM, 1-hour slots)
      const availableSlots = [];
      const startHour = 8;
      const endHour = 22;

      for (let hour = startHour; hour < endHour; hour++) {
        const slotStart = new Date(startOfDay);
        slotStart.setHours(hour, 0, 0, 0);
        
        const slotEnd = new Date(startOfDay);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        // Check if this slot conflicts with any booking
        const isBooked = bookings.some(booking => {
          const bookingStart = new Date(booking.startTime);
          const bookingEnd = new Date(booking.endTime);
          return (slotStart < bookingEnd && slotEnd > bookingStart);
        });

        if (!isBooked) {
          // Determine if it's peak hour (typically 6 PM - 10 PM)
          const isPeakHour = hour >= 18;
          const rate = isPeakHour ? court.peakHourRate : court.hourlyRate;

          availableSlots.push({
            startTime: slotStart,
            endTime: slotEnd,
            rate,
            isPeakHour
          });
        }
      }

      res.json({
        court,
        date,
        availableSlots,
        bookedSlots: bookings
      });
    } catch (error) {
      console.error('Get availability error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}