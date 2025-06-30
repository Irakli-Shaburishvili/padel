import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Auth state
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  
  // UI state
  selectedDate: string;
  selectedCourt: string | null;
  
  // Actions
  setAuth: (user: { id: string; name: string; email: string }) => void;
  logout: () => void;
  setSelectedDate: (date: string) => void;
  setSelectedCourt: (courtId: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      selectedDate: new Date().toISOString().split('T')[0],
      selectedCourt: null,
      
      // Actions
      setAuth: (user) =>
        set({
          isAuthenticated: true,
          user,
        }),
      
      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
        }),
      
      setSelectedDate: (date) =>
        set({ selectedDate: date }),
      
      setSelectedCourt: (courtId) =>
        set({ selectedCourt: courtId }),
    }),
    {
      name: 'higgs-app-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        selectedDate: state.selectedDate,
      }),
    }
  )
);