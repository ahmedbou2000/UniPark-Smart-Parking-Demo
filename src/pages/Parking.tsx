import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Car, Zap, Accessibility, Info } from 'lucide-react';
import { Header } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { parkingApi, slotsApi, reservationsApi } from '@/services/api';
import type { Parking as ParkingType, Slot } from '@/types';

const Parking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [parking, setParking] = useState<ParkingType | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isReserving, setIsReserving] = useState(false);
  const [duration, setDuration] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'reserved' | 'occupied'>('all');
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const [parkingData, slotsData] = await Promise.all([
          parkingApi.getById(id),
          slotsApi.getByParking(id),
        ]);
        setParking(parkingData);
        setSlots(slotsData);
      } catch (error) {
        console.error('Error loading parking data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  const filteredSlots = slots.filter(slot => {
    if (filter === 'all') return true;
    return slot.status === filter;
  });

  const handleReserve = async () => {
    if (!selectedSlot || !parking) return;
    setIsReserving(true);

    try {
      const startTime = new Date();
      const endTime = new Date(Date.now() + duration * 60 * 60 * 1000);

      await reservationsApi.create({
        slotId: selectedSlot.id,
        parkingId: parking.id,
        startTime,
        endTime,
      });

      toast({
        title: 'Réservation confirmée !',
        description: `Place ${selectedSlot.number} réservée pour ${duration}h`,
      });

      // Update local slot status
      setSlots(prev => prev.map(s => 
        s.id === selectedSlot.id ? { ...s, status: 'reserved' } : s
      ));
      setSelectedSlot(null);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de réserver cette place',
        variant: 'destructive',
      });
    } finally {
      setIsReserving(false);
    }
  };

  const getSlotColor = (status: Slot['status']) => {
    switch (status) {
      case 'available': return 'bg-success/20 border-success hover:bg-success/30 cursor-pointer';
      case 'reserved': return 'bg-warning/20 border-warning cursor-not-allowed';
      case 'occupied': return 'bg-destructive/20 border-destructive cursor-not-allowed';
    }
  };

  const getSlotIcon = (slot: Slot) => {
    if (slot.isElectric) return <Zap className="h-4 w-4" />;
    if (slot.isHandicap) return <Accessibility className="h-4 w-4" />;
    return <Car className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-64 bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!parking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-8 text-center">
          <p className="text-muted-foreground">Parking non trouvé</p>
          <Button asChild className="mt-4">
            <Link to="/dashboard">Retour au dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6">
        {/* Back button */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour au dashboard
        </Link>

        {/* Parking Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{parking.name}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {parking.zone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {parking.openHours}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {parking.pricePerHour} DH/h
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Legend & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success" />
              <span className="text-sm">Libre ({slots.filter(s => s.status === 'available').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-warning" />
              <span className="text-sm">Réservé ({slots.filter(s => s.status === 'reserved').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-destructive" />
              <span className="text-sm">Occupé ({slots.filter(s => s.status === 'occupied').length})</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {(['all', 'available', 'reserved', 'occupied'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'Tout' : f === 'available' ? 'Libre' : f === 'reserved' ? 'Réservé' : 'Occupé'}
              </Button>
            ))}
          </div>
        </div>

        {/* Slots Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {filteredSlots.map((slot, index) => (
                  <motion.button
                    key={slot.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={slot.status === 'available' ? { scale: 1.05 } : {}}
                    whileTap={slot.status === 'available' ? { scale: 0.95 } : {}}
                    onClick={() => slot.status === 'available' && setSelectedSlot(slot)}
                    disabled={slot.status !== 'available'}
                    className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${getSlotColor(slot.status)}`}
                  >
                    {getSlotIcon(slot)}
                    <span className="text-xs font-semibold">{slot.number}</span>
                  </motion.button>
                ))}
              </div>

              {filteredSlots.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Aucune place trouvée avec ce filtre
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Special slots legend */}
        <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span>Borne électrique</span>
          </div>
          <div className="flex items-center gap-2">
            <Accessibility className="h-4 w-4 text-primary" />
            <span>Place handicapé</span>
          </div>
        </div>
      </main>

      {/* Reservation Dialog */}
      <Dialog open={!!selectedSlot} onOpenChange={() => setSelectedSlot(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Réserver la place {selectedSlot?.number}</DialogTitle>
            <DialogDescription>
              {parking.name} - {parking.zone}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
              <Info className="h-5 w-5 text-primary" />
              <div className="text-sm">
                <p className="font-medium">Tarif : {parking.pricePerHour} DH/heure</p>
                <p className="text-muted-foreground">Total estimé : {parking.pricePerHour * duration} DH</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Durée (heures)</Label>
              <Input
                id="duration"
                type="number"
                min={1}
                max={12}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>

            {selectedSlot?.isElectric && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <Zap className="h-4 w-4" />
                <span>Cette place dispose d'une borne de recharge électrique</span>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedSlot(null)}>
              Annuler
            </Button>
            <Button onClick={handleReserve} disabled={isReserving}>
              {isReserving ? 'Réservation...' : `Réserver pour ${parking.pricePerHour * duration} DH`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Parking;
