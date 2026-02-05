import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Car, Calendar, ChevronRight, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { parkingApi, reservationsApi } from '@/services/api';
import { calculateParkingStats } from '@/data/mockData';
import type { Parking, Reservation, ParkingStats } from '@/types';

const Dashboard: React.FC = () => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<ParkingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [parkingsData, reservationsData] = await Promise.all([
          parkingApi.getAll(),
          reservationsApi.getByUser('user-1'),
        ]);
        setParkings(parkingsData);
        setReservations(reservationsData);
        setStats(calculateParkingStats());
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const activeReservation = reservations.find(r => r.status === 'active');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground">Bienvenue ! Trouvez votre place de parking.</p>
          </div>
          <Button asChild>
            <Link to="/parking/parking-1">
              <Navigation className="mr-2 h-4 w-4" />
              Trouver une place
            </Link>
          </Button>
        </div>

        {/* Active Reservation Alert */}
        {activeReservation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Car className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Réservation active</p>
                      <p className="text-sm text-muted-foreground">
                        {activeReservation.parkingName} - Place {activeReservation.slotNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="default" className="bg-primary">
                      <Clock className="mr-1 h-3 w-3" />
                      {Math.round((new Date(activeReservation.endTime).getTime() - Date.now()) / (1000 * 60))} min restantes
                    </Badge>
                    <Button size="sm" variant="outline">
                      Voir détails
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Car className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.availableSpots}</p>
                      <p className="text-xs text-muted-foreground">Places libres</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.reservedSpots}</p>
                      <p className="text-xs text-muted-foreground">Réservées</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <Car className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.occupiedSpots}</p>
                      <p className="text-xs text-muted-foreground">Occupées</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Occupation</span>
                      <span className="font-semibold">{stats.occupancyRate}%</span>
                    </div>
                    <Progress value={stats.occupancyRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Parkings List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Parkings disponibles</h2>
            <Button variant="ghost" size="sm">
              Voir tout
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {parkings.map((parking, index) => (
              <motion.div
                key={parking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link to={`/parking/${parking.id}`}>
                  <Card className="group hover:shadow-lg transition-all hover:border-primary/30 cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {parking.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {parking.zone}
                          </CardDescription>
                        </div>
                        <Badge variant={parking.availableSpots > 10 ? 'default' : parking.availableSpots > 0 ? 'secondary' : 'destructive'}>
                          {parking.availableSpots} libres
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Capacité</span>
                          <span>{parking.availableSpots}/{parking.capacity}</span>
                        </div>
                        <Progress 
                          value={(1 - parking.availableSpots / parking.capacity) * 100} 
                          className="h-2" 
                        />
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {parking.openHours}
                          </div>
                          <span className="font-semibold text-primary">{parking.pricePerHour} DH/h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Reservations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Historique récent</h2>
            <Button variant="ghost" size="sm">
              Voir tout
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {reservations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Aucune réservation pour le moment
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {reservations.slice(0, 5).map((reservation) => (
                    <div key={reservation.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          reservation.status === 'active' 
                            ? 'bg-primary/10 text-primary' 
                            : reservation.status === 'completed'
                            ? 'bg-success/10 text-success'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <Car className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{reservation.parkingName}</p>
                          <p className="text-sm text-muted-foreground">
                            Place {reservation.slotNumber} • {new Date(reservation.startTime).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{reservation.totalPrice} DH</p>
                        <Badge variant={
                          reservation.status === 'active' ? 'default' : 
                          reservation.status === 'completed' ? 'secondary' : 'outline'
                        }>
                          {reservation.status === 'active' ? 'En cours' : 
                           reservation.status === 'completed' ? 'Terminée' : 'Annulée'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
