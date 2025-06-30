import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { bookingApi } from '../../services/api';
import { useAppStore } from '../../stores/appStore';
import { formatTime } from '../../utils/dateUtils';
import type { TimeSlot } from '../../types';

interface TimeSlotPickerProps {
  courtId: string;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
  selectedTimeSlot?: TimeSlot;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  courtId,
  onTimeSlotSelect,
  selectedTimeSlot
}) => {
  const { selectedDate } = useAppStore();
  const [duration] = useState(60); // Default 1 hour

  const { data: timeSlots, isLoading, error } = useQuery({
    queryKey: ['timeSlots', courtId, selectedDate, duration],
    queryFn: () => bookingApi.getAvailableTimeSlots(courtId, selectedDate, duration),
    enabled: !!courtId && !!selectedDate,
  });

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
          <span className="ml-2 text-gray-600">Loading available time slots...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-red-600">Failed to load time slots. Please try again.</p>
        </div>
      </Card>
    );
  }

  if (!timeSlots || timeSlots.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-600">No available time slots for the selected date.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Available Time Slots
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {timeSlots.map((slot, index) => {
          const isSelected = selectedTimeSlot && 
            selectedTimeSlot.startTime === slot.startTime && 
            selectedTimeSlot.endTime === slot.endTime;

          return (
            <Button
              key={index}
              variant={isSelected ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onTimeSlotSelect(slot)}
              className="text-center"
            >
              <div>
                <div className="font-medium">
                  {formatTime(slot.startTime)}
                </div>
                <div className="text-xs opacity-75">
                  {formatTime(slot.endTime)}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default TimeSlotPicker;