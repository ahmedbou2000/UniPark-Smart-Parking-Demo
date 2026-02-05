import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  TrendingUp, 
  DollarSign,
  Play,
  Pause,
  RefreshCw,
  FileDown,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { parkingApi, usersApi, statsApi } from '@/services/api';
import { mockDailyStats, mockHourlyStats, calculateParkingStats } from '@/data/mockData';
import type { Parking, User, ParkingStats } from '@/types';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

const Admin: React.FC = () => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<ParkingStats | null>(null);
  const [overviewStats, setOverviewStats] = useState<any>(null);
  const [isIotRunning, setIsIotRunning] = useState(false);
  const [iotLogs, setIotLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [parkingsData, usersData, overviewData] = await Promise.all([
        parkingApi.getAll(),
        usersApi.getAll(),
        statsApi.getOverview(),
      ]);
      setParkings(parkingsData);
      setUsers(usersData);
      setOverviewStats(overviewData);
      setStats(calculateParkingStats());
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // IoT Simulation
  const toggleIotSimulation = () => {
    setIsIotRunning(!isIotRunning);
    if (!isIotRunning) {
      addIotLog('🟢 Simulation IoT démarrée');
    } else {
      addIotLog('🔴 Simulation IoT arrêtée');
    }
  };

  const addIotLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('fr-FR');
    setIotLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)]);
  };

  useEffect(() => {
    if (!isIotRunning) return;
    
    const interval = setInterval(() => {
      const actions = [
        '📡 Capteur P1-A5: Véhicule détecté',
        '📡 Capteur P2-B3: Place libérée',
        '📡 Capteur P3-C8: Véhicule détecté',
        '⚡ Borne P1-E2: Recharge en cours',
        '✅ Réservation confirmée: P2-D4',
      ];
      addIotLog(actions[Math.floor(Math.random() * actions.length)]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isIotRunning]);

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('UniPark - Rapport Statistiques', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 35);
    
    if (overviewStats) {
      doc.text(`Total Parkings: ${overviewStats.totalParkings}`, 20, 50);
      doc.text(`Total Utilisateurs: ${overviewStats.totalUsers}`, 20, 60);
      doc.text(`Total Réservations: ${overviewStats.totalReservations}`, 20, 70);
      doc.text(`Revenus: ${overviewStats.revenue} DH`, 20, 80);
    }

    if (stats) {
      doc.text(`Places totales: ${stats.totalSpots}`, 20, 100);
      doc.text(`Places libres: ${stats.availableSpots}`, 20, 110);
      doc.text(`Taux d'occupation: ${stats.occupancyRate}%`, 20, 120);
    }

    doc.save('unipark-stats.pdf');
    toast({
      title: 'Export réussi',
      description: 'Le rapport PDF a été téléchargé',
    });
  };

  const PIE_COLORS = ['hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)'];

  const pieData = stats ? [
    { name: 'Libres', value: stats.availableSpots },
    { name: 'Réservées', value: stats.reservedSpots },
    { name: 'Occupées', value: stats.occupiedSpots },
  ] : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Administration</h1>
            <p className="text-muted-foreground">Gérez vos parkings et consultez les statistiques</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportPDF}>
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Parking
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Parkings', value: overviewStats?.totalParkings || 0, icon: Car, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Utilisateurs', value: overviewStats?.totalUsers || 0, icon: Users, color: 'text-accent', bg: 'bg-accent/10' },
            { label: 'Réservations', value: overviewStats?.totalReservations || 0, icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
            { label: 'Revenus', value: `${overviewStats?.revenue || 0} DH`, icon: DollarSign, color: 'text-warning', bg: 'bg-warning/10' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
            <TabsTrigger value="parkings">Parkings</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="iot">Simulation IoT</TabsTrigger>
          </TabsList>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Occupancy Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Occupation hebdomadaire</CardTitle>
                  <CardDescription>Taux d'occupation par jour</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockDailyStats}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="occupancy" 
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary) / 0.2)" 
                          name="Occupation %"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition actuelle</CardTitle>
                  <CardDescription>État des places en temps réel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {pieData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    {pieData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: PIE_COLORS[index] }} 
                        />
                        <span className="text-xs text-muted-foreground">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hourly Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Heures de pointe</CardTitle>
                <CardDescription>Occupation moyenne par heure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockHourlyStats}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="hour" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="occupancy" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Occupation %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Parkings Tab */}
          <TabsContent value="parkings">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Parkings</CardTitle>
                <CardDescription>Créez, modifiez ou supprimez des parkings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Zone</TableHead>
                      <TableHead>Capacité</TableHead>
                      <TableHead>Disponibles</TableHead>
                      <TableHead>Tarif</TableHead>
                      <TableHead>Horaires</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parkings.map((parking) => (
                      <TableRow key={parking.id}>
                        <TableCell className="font-medium">{parking.name}</TableCell>
                        <TableCell>{parking.zone}</TableCell>
                        <TableCell>{parking.capacity}</TableCell>
                        <TableCell>
                          <Badge variant={parking.availableSpots > 10 ? 'default' : parking.availableSpots > 0 ? 'secondary' : 'destructive'}>
                            {parking.availableSpots}
                          </Badge>
                        </TableCell>
                        <TableCell>{parking.pricePerHour} DH/h</TableCell>
                        <TableCell>{parking.openHours}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Utilisateurs</CardTitle>
                <CardDescription>Visualisez et gérez les comptes utilisateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Inscrit le</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : user.role === 'staff' ? 'secondary' : 'outline'}>
                            {user.role === 'admin' ? 'Admin' : user.role === 'staff' ? 'Personnel' : 'Étudiant'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Modifier le rôle
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* IoT Tab */}
          <TabsContent value="iot">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contrôle Simulation IoT</CardTitle>
                  <CardDescription>Simulez les changements d'état des capteurs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button 
                      size="lg"
                      onClick={toggleIotSimulation}
                      variant={isIotRunning ? 'destructive' : 'default'}
                    >
                      {isIotRunning ? (
                        <>
                          <Pause className="mr-2 h-5 w-5" />
                          Arrêter
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" />
                          Démarrer
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={loadData}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Rafraîchir
                    </Button>
                  </div>

                  <div className="p-4 bg-muted rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${isIotRunning ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
                      <span className="font-medium">
                        {isIotRunning ? 'Simulation en cours' : 'Simulation arrêtée'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isIotRunning 
                        ? 'Les capteurs émettent des données toutes les 2 secondes'
                        : 'Cliquez sur Démarrer pour lancer la simulation'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Logs en temps réel</CardTitle>
                  <CardDescription>Activité des capteurs IoT</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] overflow-y-auto bg-muted/50 rounded-xl p-4 font-mono text-sm space-y-1">
                    {iotLogs.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Aucun log. Démarrez la simulation.
                      </p>
                    ) : (
                      iotLogs.map((log, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-muted-foreground"
                        >
                          {log}
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
