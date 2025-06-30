import axios from 'axios';
import type { TimeSlot, Booking, CreateBookingRequest, CourtPricing } from '../types';

const API_BASE_URL = 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token if needed
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const bookingApi = {
  // Get available time slots for a court
  async getAvailableTimeSlots(courtId: string, date: string, durationMinutes = 60): Promise<TimeSlot[]> {
    const response = await apiClient.get(`/api/courts/${courtId}/availability`, {
      params: { date, durationMinutes }
    });
    return response.data;
  },

  // Create a new booking
  async createBooking(request: CreateBookingRequest): Promise<{ id: string }> {
    const response = await apiClient.post('/api/bookings', request);
    return response.data;
  },

  // Get booking by ID
  async getBooking(id: string): Promise<Booking> {
    const response = await apiClient.get(`/api/bookings/${id}`);
    return response.data;
  },

  // Get current pricing
  async getPricing(): Promise<CourtPricing[]> {
    const response = await apiClient.get('/api/pricing');
    return response.data;
  },

  // Admin endpoints (require authentication)
  async getAllBookings(): Promise<Booking[]> {
    const response = await apiClient.get('/api/bookings');
    return response.data;
  },

  async cancelBooking(id: string, reason: string): Promise<void> {
    await apiClient.delete(`/api/bookings/${id}`, {
      data: { reason }
    });
  },
};

export default apiClient;