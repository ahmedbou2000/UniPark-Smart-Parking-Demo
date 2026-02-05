/**
 * API Service - Ready to connect to your Express/MongoDB backend
 * 
 * To connect to your backend:
 * 1. Update API_BASE_URL with your backend URL
 * 2. Ensure your backend returns data in the expected format
 * 3. Update endpoints as needed
 */

import type {
  User,
  Parking,
  Slot,
  Reservation,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
  ParkingStats,
  DailyStats,
  HourlyStats,
} from '@/types';
import {
  mockUsers,
  mockParkings,
  mockSlots,
  mockReservations,
  mockDailyStats,
  mockHourlyStats,
  calculateParkingStats,
} from '@/data/mockData';

// Configuration - Change this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management
let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => authToken;

// Base fetch wrapper with auth header
const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// Simulated delay for mock data
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============ AUTH API ============

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // TODO: Connect to real backend
    await delay(800);
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    const token = `mock-jwt-token-${user.id}`;
    setAuthToken(token);
    return { user, token, refreshToken: `refresh-${token}` };
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    // TODO: Connect to real backend
    await delay(800);
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: new Date(),
    };
    const token = `mock-jwt-token-${newUser.id}`;
    setAuthToken(token);
    return { user: newUser, token, refreshToken: `refresh-${token}` };
  },

  logout: async (): Promise<void> => {
    setAuthToken(null);
  },

  getCurrentUser: async (): Promise<User | null> => {
    // TODO: Connect to real backend
    await delay(300);
    if (!authToken) return null;
    return mockUsers[0];
  },
};

// ============ PARKING API ============

export const parkingApi = {
  getAll: async (): Promise<Parking[]> => {
    // TODO: Connect to real backend
    // return apiFetch<ApiResponse<Parking[]>>('/parkings').then(r => r.data);
    await delay(500);
    return mockParkings;
  },

  getById: async (id: string): Promise<Parking> => {
    await delay(300);
    const parking = mockParkings.find(p => p.id === id);
    if (!parking) throw new Error('Parking non trouvé');
    return parking;
  },

  create: async (parking: Omit<Parking, 'id'>): Promise<Parking> => {
    await delay(500);
    const newParking: Parking = { ...parking, id: `parking-${Date.now()}` };
    return newParking;
  },

  update: async (id: string, data: Partial<Parking>): Promise<Parking> => {
    await delay(500);
    const parking = mockParkings.find(p => p.id === id);
    if (!parking) throw new Error('Parking non trouvé');
    return { ...parking, ...data };
  },

  delete: async (id: string): Promise<void> => {
    await delay(500);
  },

  getStats: async (): Promise<ParkingStats> => {
    await delay(300);
    return calculateParkingStats();
  },
};

// ============ SLOTS API ============

export const slotsApi = {
  getByParking: async (parkingId: string): Promise<Slot[]> => {
    await delay(400);
    return mockSlots[parkingId] || [];
  },

  updateStatus: async (slotId: string, status: Slot['status']): Promise<Slot> => {
    await delay(300);
    // Find and update slot
    for (const slots of Object.values(mockSlots)) {
      const slot = slots.find(s => s.id === slotId);
      if (slot) {
        slot.status = status;
        return slot;
      }
    }
    throw new Error('Place non trouvée');
  },
};

// ============ RESERVATIONS API ============

export const reservationsApi = {
  getByUser: async (userId: string): Promise<Reservation[]> => {
    await delay(400);
    return mockReservations.filter(r => r.userId === userId);
  },

  getAll: async (): Promise<Reservation[]> => {
    await delay(400);
    return mockReservations;
  },

  create: async (data: {
    slotId: string;
    parkingId: string;
    startTime: Date;
    endTime: Date;
  }): Promise<Reservation> => {
    await delay(500);
    const parking = mockParkings.find(p => p.id === data.parkingId);
    const slot = mockSlots[data.parkingId]?.find(s => s.id === data.slotId);
    
    if (!parking || !slot) throw new Error('Parking ou place non trouvé');
    
    const hours = (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60 * 60);
    
    const reservation: Reservation = {
      id: `res-${Date.now()}`,
      userId: 'user-1', // Would come from auth context
      slotId: data.slotId,
      parkingId: data.parkingId,
      parkingName: parking.name,
      slotNumber: slot.number,
      startTime: data.startTime,
      endTime: data.endTime,
      status: 'active',
      totalPrice: Math.round(hours * parking.pricePerHour),
      createdAt: new Date(),
    };
    
    // Update slot status
    slot.status = 'reserved';
    
    return reservation;
  },

  cancel: async (reservationId: string): Promise<void> => {
    await delay(400);
    const reservation = mockReservations.find(r => r.id === reservationId);
    if (reservation) {
      reservation.status = 'cancelled';
      // Reset slot status
      const slot = mockSlots[reservation.parkingId]?.find(s => s.id === reservation.slotId);
      if (slot) slot.status = 'available';
    }
  },
};

// ============ STATS API ============

export const statsApi = {
  getDaily: async (): Promise<DailyStats[]> => {
    await delay(300);
    return mockDailyStats;
  },

  getHourly: async (): Promise<HourlyStats[]> => {
    await delay(300);
    return mockHourlyStats;
  },

  getOverview: async (): Promise<{
    totalUsers: number;
    totalParkings: number;
    totalReservations: number;
    revenue: number;
  }> => {
    await delay(300);
    return {
      totalUsers: mockUsers.length,
      totalParkings: mockParkings.length,
      totalReservations: mockReservations.length,
      revenue: mockDailyStats.reduce((acc, d) => acc + d.revenue, 0),
    };
  },
};

// ============ USERS API (Admin) ============

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    await delay(400);
    return mockUsers;
  },

  updateRole: async (userId: string, role: User['role']): Promise<User> => {
    await delay(400);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('Utilisateur non trouvé');
    user.role = role;
    return user;
  },

  delete: async (userId: string): Promise<void> => {
    await delay(400);
  },
};
