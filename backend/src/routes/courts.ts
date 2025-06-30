import { Router } from 'express';
import { body, param } from 'express-validator';
import { CourtController } from '../controllers/CourtController';
import { handleValidationErrors } from '../middleware/validation';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Validation middleware
const createCourtValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Court name must be at least 2 characters'),
  body('type').isIn(['indoor', 'outdoor']).withMessage('Court type must be indoor or outdoor'),
  body('hourlyRate').isFloat({ min: 0 }).withMessage('Hourly rate must be a positive number'),
  body('peakHourRate').isFloat({ min: 0 }).withMessage('Peak hour rate must be a positive number'),
  body('description').optional().trim(),
  handleValidationErrors
];

const updateCourtValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid court ID required'),
  body('name').optional().trim().isLength({ min: 2 }),
  body('type').optional().isIn(['indoor', 'outdoor']),
  body('hourlyRate').optional().isFloat({ min: 0 }),
  body('peakHourRate').optional().isFloat({ min: 0 }),
  body('status').optional().isIn(['available', 'maintenance', 'unavailable']),
  body('description').optional().trim(),
  handleValidationErrors
];

const courtIdValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid court ID required'),
  handleValidationErrors
];

// Routes
router.get('/', CourtController.getAllCourts);
router.get('/:id', courtIdValidation, CourtController.getCourtById);
router.get('/:id/availability', courtIdValidation, CourtController.getCourtAvailability);
router.post('/', authenticateToken, requireAdmin, createCourtValidation, CourtController.createCourt);
router.put('/:id', authenticateToken, requireAdmin, updateCourtValidation, CourtController.updateCourt);

export default router;