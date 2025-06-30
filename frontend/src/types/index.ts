export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface Court {
  id: string;
  name: string;
  description: string;
  hourlyRate: {
    amount: number;
    currency: string;
  };
  isActive: boolean;
  openingTime: string;
  closingTime: string;
}

export interface Booking {
  id: string;
  courtId: string;
  userId: string;
  timeSlot: TimeSlot;
  totalPrice: {
    amount: number;
    currency: string;
  };
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  createdAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export interface CreateBookingRequest {
  courtId: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}

export interface CourtPricing {
  courtId: string;
  courtName: string;
  hourlyRate: {
    amount: number;
    currency: string;
  };
}