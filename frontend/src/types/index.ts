export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'player' | 'admin';
  createdAt: string;
}

export interface Court {
  id: number;
  name: string;
  type: 'indoor' | 'outdoor';
  status: 'available' | 'maintenance' | 'unavailable';
  hourlyRate: number;
  peakHourRate: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: number;
  userId: number;
  courtId: number;
  user?: User;
  court?: Court;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  notes?: string;
  playerNames?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Tournament {
  id: number;
  name: string;
  description?: string;
  type: 'single_elimination' | 'double_elimination' | 'round_robin';
  status: 'registration' | 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxParticipants: number;
  entryFee: number;
  prizePool: number;
  rules?: string;
  bracket?: any;
  participants?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: number;
  player1Id: number;
  player2Id: number;
  courtId: number;
  tournamentId?: number;
  player1?: User;
  player2?: User;
  court?: Court;
  tournament?: Tournament;
  scheduledTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  player1Sets: number;
  player2Sets: number;
  setScores?: Array<{ p1: number; p2: number }>;
  winnerId?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  id: number;
  userId: number;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  setsWon: number;
  setsLost: number;
  eloRating: number;
  tournamentsPlayed: number;
  tournamentsWon: number;
  winRate: number;
  setWinRate: number;
}

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  rate: number;
  isPeakHour: boolean;
}