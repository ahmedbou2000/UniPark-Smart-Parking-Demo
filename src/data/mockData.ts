import type { User, Parking, Slot, Reservation, DailyStats, HourlyStats } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Ahmed Benali',
    email: 'ahmed.benali@univ.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'user-2',
    name: 'Fatima Zahra',
    email: 'fatima.zahra@univ.edu',
    role: 'staff',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'admin-1',
    name: 'Mohamed Admin',
    email: 'admin@univ.edu',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    createdAt: new Date('2023-09-01'),
  },
];

// Mock Parkings
export const mockParkings: Parking[] = [
  {
    id: 'parking-1',
    name: 'Parking Central',
    zone: 'Zone A - Faculté des Sciences',
    capacity: 40,
    availableSpots: 12,
    coordinates: { lat: 33.5731, lng: -7.5898 },
    address: 'Boulevard Hassan II, Campus Principal',
    openHours: '06:00 - 22:00',
    pricePerHour: 5,
  },
  {
    id: 'parking-2',
    name: 'Parking Bibliothèque',
    zone: 'Zone B - Bibliothèque Centrale',
    capacity: 35,
    availableSpots: 8,
    coordinates: { lat: 33.5745, lng: -7.5912 },
    address: 'Avenue Mohammed V, Campus Est',
    openHours: '07:00 - 21:00',
    pricePerHour: 4,
  },
  {
    id: 'parking-3',
    name: 'Parking Résidence',
    zone: 'Zone C - Cité Universitaire',
    capacity: 45,
    availableSpots: 25,
    coordinates: { lat: 33.5718, lng: -7.5875 },
    address: 'Rue des Étudiants, Campus Sud',
    openHours: '24/7',
    pricePerHour: 3,
  },
];

// Generate Mock Slots for each parking
export const generateSlots = (parkingId: string, count: number): Slot[] => {
  const statuses: Slot['status'][] = ['available', 'reserved', 'occupied'];
  const sections = ['A', 'B', 'C', 'D'];
  
  return Array.from({ length: count }, (_, i) => {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const section = sections[Math.floor(i / 10)];
    
    return {
      id: `${parkingId}-slot-${i + 1}`,
      parkingId,
      number: `${section}${(i % 10) + 1}`,
      status: randomStatus,
      floor: Math.floor(i / 20) + 1,
      section,
      isHandicap: i % 15 === 0,
      isElectric: i % 12 === 0,
    };
  });
};

export const mockSlots: Record<string, Slot[]> = {
  'parking-1': generateSlots('parking-1', 40),
  'parking-2': generateSlots('parking-2', 35),
  'parking-3': generateSlots('parking-3', 45),
};

// Mock Reservations
export const mockReservations: Reservation[] = [
  {
    id: 'res-1',
    userId: 'user-1',
    slotId: 'parking-1-slot-5',
    parkingId: 'parking-1',
    parkingName: 'Parking Central',
    slotNumber: 'A5',
    startTime: new Date(),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: 'active',
    totalPrice: 10,
    createdAt: new Date(),
  },
  {
    id: 'res-2',
    userId: 'user-1',
    slotId: 'parking-2-slot-12',
    parkingId: 'parking-2',
    parkingName: 'Parking Bibliothèque',
    slotNumber: 'B2',
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 22 * 60 * 60 * 1000),
    status: 'completed',
    totalPrice: 8,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'res-3',
    userId: 'user-2',
    slotId: 'parking-3-slot-20',
    parkingId: 'parking-3',
    parkingName: 'Parking Résidence',
    slotNumber: 'C10',
    startTime: new Date(Date.now() - 48 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 45 * 60 * 60 * 1000),
    status: 'completed',
    totalPrice: 9,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
];

// Mock Daily Stats
export const mockDailyStats: DailyStats[] = [
  { date: 'Lun', occupancy: 75, reservations: 45, revenue: 225 },
  { date: 'Mar', occupancy: 82, reservations: 52, revenue: 260 },
  { date: 'Mer', occupancy: 68, reservations: 38, revenue: 190 },
  { date: 'Jeu', occupancy: 90, reservations: 65, revenue: 325 },
  { date: 'Ven', occupancy: 85, reservations: 58, revenue: 290 },
  { date: 'Sam', occupancy: 45, reservations: 22, revenue: 110 },
  { date: 'Dim', occupancy: 30, reservations: 15, revenue: 75 },
];

// Mock Hourly Stats
export const mockHourlyStats: HourlyStats[] = [
  { hour: '06:00', occupancy: 15 },
  { hour: '08:00', occupancy: 65 },
  { hour: '10:00', occupancy: 85 },
  { hour: '12:00', occupancy: 75 },
  { hour: '14:00', occupancy: 90 },
  { hour: '16:00', occupancy: 88 },
  { hour: '18:00', occupancy: 60 },
  { hour: '20:00', occupancy: 35 },
  { hour: '22:00', occupancy: 10 },
];

// Calculate overall stats
export const calculateParkingStats = () => {
  const allSlots = Object.values(mockSlots).flat();
  const available = allSlots.filter(s => s.status === 'available').length;
  const reserved = allSlots.filter(s => s.status === 'reserved').length;
  const occupied = allSlots.filter(s => s.status === 'occupied').length;
  const total = allSlots.length;
  
  return {
    totalSpots: total,
    availableSpots: available,
    reservedSpots: reserved,
    occupiedSpots: occupied,
    occupancyRate: Math.round(((reserved + occupied) / total) * 100),
  };
};
