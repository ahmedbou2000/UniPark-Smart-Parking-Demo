// User Types
export type UserRole = 'student' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

// Parking Types
export interface Parking {
  id: string;
  name: string;
  zone: string;
  capacity: number;
  availableSpots: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  openHours: string;
  pricePerHour: number;
  image?: string;
}

// Slot Types
export type SlotStatus = 'available' | 'reserved' | 'occupied';

export interface Slot {
  id: string;
  parkingId: string;
  number: string;
  status: SlotStatus;
  floor?: number;
  section?: string;
  isHandicap?: boolean;
  isElectric?: boolean;
}

// Reservation Types
export interface Reservation {
  id: string;
  userId: string;
  slotId: string;
  parkingId: string;
  parkingName: string;
  slotNumber: string;
  startTime: Date;
  endTime: Date;
  status: 'active' | 'completed' | 'cancelled';
  totalPrice: number;
  createdAt: Date;
}

// Sensor/IoT Types
export interface Sensor {
  id: string;
  slotId: string;
  state: SlotStatus;
  lastUpdate: Date;
  batteryLevel?: number;
}

// Statistics Types
export interface ParkingStats {
  totalSpots: number;
  availableSpots: number;
  reservedSpots: number;
  occupiedSpots: number;
  occupancyRate: number;
}

export interface DailyStats {
  date: string;
  occupancy: number;
  reservations: number;
  revenue: number;
}

export interface HourlyStats {
  hour: string;
  occupancy: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
