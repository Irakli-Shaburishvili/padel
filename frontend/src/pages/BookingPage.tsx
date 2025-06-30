import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TimeSlotPicker from '../components/booking/TimeSlotPicker';
import BookingForm from '../components/booking/BookingForm';
import { bookingApi } from '../services/api';
import { useAppStore } from '../stores/appStore';
import { formatDate, addDays } from '../utils/dateUtils';
import type { TimeSlot } from '../types';

const BookingPage: React.FC = () => {
  const { selectedDate, setSelectedDate } = useAppStore();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // For now, we'll use a default court ID. In a real app, this would come from court selection
  const courtId = "11111111-1111-1111-1111-111111111111"; 

  const { data: pricing } = useQuery({
    queryKey: ['pricing'],
    queryFn: () => bookingApi.getPricing(),
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setSelectedTimeSlot(null);
    setShowBookingForm(false);
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setShowBookingForm(false);
  };

  const handleContinueToBooking = () => {
    if (selectedTimeSlot) {
      setShowBookingForm(true);
    }
  };

  const handleBookingSuccess = (id: string) => {
    setBookingId(id);
    setBookingSuccess(true);
    setShowBookingForm(false);
    setSelectedTimeSlot(null);
  };

  const handleCancelBooking = () => {
    setShowBookingForm(false);
  };

  const handleNewBooking = () => {
    setBookingSuccess(false);
    setBookingId(null);
    setSelectedTimeSlot(null);
  };

  // Generate next 7 days for quick selection
  const quickDates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date().toISOString().split('T')[0], i);
    return {
      date,
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : formatDate(date).split(',')[0],
    };
  });

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-4">
              Your booking has been successfully created.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Booking ID</p>
              <p className="font-mono text-lg text-gray-900">{bookingId}</p>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              You will receive a confirmation email shortly with all the details.
            </p>
            <Button onClick={handleNewBooking}>
              Make Another Booking
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Your Padel Court</h1>
          <p className="text-gray-600">
            Select your preferred date and time slot to book a court
          </p>
          {pricing && pricing.length > 0 && (
            <p className="text-lg font-semibold text-red-600 mt-2">
              {pricing[0].hourlyRate.amount} {pricing[0].hourlyRate.currency} per hour
            </p>
          )}
        </div>

        {!showBookingForm ? (
          <div className="space-y-6">
            {/* Date Selection */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Date</h2>
              
              {/* Quick Date Selection */}
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2 mb-4">
                {quickDates.map(({ date, label }) => (
                  <Button
                    key={date}
                    variant={selectedDate === date ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDate(date)}
                    className="text-center p-3"
                  >
                    <div>
                      <div className="text-xs font-medium">{label}</div>
                      <div className="text-xs opacity-75">
                        {new Date(date).getDate()}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>

              {/* Custom Date Input */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Or choose a custom date:</span>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-auto"
                />
              </div>
            </Card>

            {/* Time Slot Selection */}
            <TimeSlotPicker
              courtId={courtId}
              onTimeSlotSelect={handleTimeSlotSelect}
              selectedTimeSlot={selectedTimeSlot || undefined}
            />

            {/* Continue Button */}
            {selectedTimeSlot && (
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Selected Time</h3>
                    <p className="text-gray-600">
                      {formatDate(selectedDate)} at {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
                    </p>
                  </div>
                  <Button onClick={handleContinueToBooking}>
                    Continue to Booking
                  </Button>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <BookingForm
            courtId={courtId}
            timeSlot={selectedTimeSlot!}
            onSuccess={handleBookingSuccess}
            onCancel={handleCancelBooking}
          />
        )}
      </div>
    </div>
  );
};

export default BookingPage;