import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Bell, 
  Smartphone, 
  Shield, 
  Zap,
  CreditCard,
  Navigation
} from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Localisation en temps réel',
    description: 'Visualisez les places disponibles sur une carte interactive du campus.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Clock,
    title: 'Réservation instantanée',
    description: 'Réservez votre place en quelques secondes, où que vous soyez.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: Bell,
    title: 'Notifications intelligentes',
    description: 'Recevez des alertes quand une place se libère dans votre zone préférée.',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    icon: Navigation,
    title: 'Navigation guidée',
    description: 'Laissez-vous guider jusqu\'à votre place réservée sans stress.',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: Shield,
    title: 'Sécurité renforcée',
    description: 'Capteurs IoT et surveillance 24/7 pour votre tranquillité.',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    icon: CreditCard,
    title: 'Paiement simplifié',
    description: 'Payez directement via l\'application, sans passer par une borne.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 relative">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Fonctionnalités
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une solution complète qui simplifie votre quotidien sur le campus
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-card border border-border rounded-2xl p-6 h-full hover:border-primary/30 transition-colors">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bgColor} ${feature.color} mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
