import { Router } from 'express';
import { body, param } from 'express-validator';
import { BookingController } from '../controllers/BookingController';
import { handleValidationErrors } from '../middleware/validation';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Validation middleware
const createBookingValidation = [
  body('courtId').isInt({ min: 1 }).withMessage('Valid court ID required'),
  body('startTime').isISO8601().withMessage('Valid start time required'),
  body('endTime').isISO8601().withMessage('Valid end time required'),
  body('playerNames').optional().isArray().withMessage('Player names must be an array'),
  body('notes').optional().trim(),
  handleValidationErrors
];

const updateBookingValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid booking ID required'),
  body('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed']),
  body('notes').optional().trim(),
  handleValidationErrors
];

const bookingIdValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid booking ID required'),
  handleValidationErrors
];

// Routes
router.post('/', authenticateToken, createBookingValidation, BookingController.createBooking);
router.get('/my-bookings', authenticateToken, BookingController.getUserBookings);
router.get('/', authenticateToken, requireAdmin, BookingController.getAllBookings);
router.put('/:id', authenticateToken, updateBookingValidation, BookingController.updateBooking);
router.delete('/:id', authenticateToken, bookingIdValidation, BookingController.cancelBooking);

export default router;