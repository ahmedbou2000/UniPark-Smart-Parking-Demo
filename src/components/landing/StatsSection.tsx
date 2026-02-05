import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Car, Users, Clock, MapPin } from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, suffix = '', label, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
      <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 text-center hover:border-primary/30 transition-colors">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4">
          {icon}
        </div>
        <div className="text-4xl font-bold mb-2">
          {displayValue.toLocaleString()}{suffix}
        </div>
        <div className="text-muted-foreground text-sm">{label}</div>
      </div>
    </motion.div>
  );
};

const StatsSection: React.FC = () => {
  const stats = [
    { icon: <Car className="h-7 w-7" />, value: 120, label: 'Places de parking', delay: 0 },
    { icon: <Users className="h-7 w-7" />, value: 2500, suffix: '+', label: 'Utilisateurs actifs', delay: 0.1 },
    { icon: <Clock className="h-7 w-7" />, value: 98, suffix: '%', label: 'Temps économisé', delay: 0.2 },
    { icon: <MapPin className="h-7 w-7" />, value: 3, label: 'Zones couvertes', delay: 0.3 },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            Nos chiffres parlent d'eux-mêmes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            UniPark est devenu la référence du stationnement intelligent sur le campus
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
