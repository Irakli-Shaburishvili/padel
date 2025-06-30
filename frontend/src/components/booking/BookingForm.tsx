import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { bookingApi } from '../../services/api';
import type { CreateBookingRequest, TimeSlot } from '../../types';
import { formatTime, formatDate } from '../../utils/dateUtils';
import { useAppStore } from '../../stores/appStore';

interface BookingFormProps {
  courtId: string;
  timeSlot: TimeSlot;
  onSuccess: (bookingId: string) => void;
  onCancel: () => void;
}

interface FormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  courtId,
  timeSlot,
  onSuccess,
  onCancel
}) => {
  const { selectedDate } = useAppStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const createBookingMutation = useMutation({
    mutationFn: (data: CreateBookingRequest) => bookingApi.createBooking(data),
    onSuccess: (response) => {
      // Invalidate time slots query to refresh availability
      queryClient.invalidateQueries({ queryKey: ['timeSlots'] });
      onSuccess(response.id);
    },
  });

  const onSubmit = (data: FormData) => {
    const bookingRequest: CreateBookingRequest = {
      courtId,
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      notes: data.notes,
    };

    createBookingMutation.mutate(bookingRequest);
  };

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Booking Details
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Date:</span>
              <p className="text-gray-900">{formatDate(selectedDate)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Time:</span>
              <p className="text-gray-900">
                {formatTime(timeSlot.startTime)} - {formatTime(timeSlot.endTime)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Duration:</span>
              <p className="text-gray-900">1 hour</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            {...register('customerName', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
            error={errors.customerName?.message}
            placeholder="Enter your full name"
          />

          <Input
            label="Phone Number *"
            type="tel"
            {...register('customerPhone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[+]?[\d\s\-()]{8,}$/,
                message: 'Please enter a valid phone number',
              },
            })}
            error={errors.customerPhone?.message}
            placeholder="+995 555 123 456"
          />
        </div>

        <Input
          label="Email Address *"
          type="email"
          {...register('customerEmail', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address',
            },
          })}
          error={errors.customerEmail?.message}
          placeholder="your@email.com"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes (Optional)
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Any special requests or notes..."
          />
        </div>

        {createBookingMutation.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">
              Failed to create booking. Please try again.
            </p>
          </div>
        )}

        <div className="flex space-x-4 pt-4">
          <Button
            type="submit"
            disabled={!isValid || createBookingMutation.isPending}
            className="flex-1"
          >
            {createBookingMutation.isPending ? 'Creating Booking...' : 'Book Now'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={createBookingMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default BookingForm;