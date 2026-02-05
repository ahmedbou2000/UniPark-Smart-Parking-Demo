import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Sarah Benali',
    role: 'Étudiante en Médecine',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: 'Fini le stress de chercher une place pendant 30 minutes ! Avec UniPark, je réserve ma place avant même de quitter la maison.',
    rating: 5,
  },
  {
    name: 'Prof. Youssef Amrani',
    role: 'Département Informatique',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Youssef',
    content: 'Une innovation remarquable. L\'interface est intuitive et le système de notification me fait gagner un temps précieux.',
    rating: 5,
  },
  {
    name: 'Amina Khaldi',
    role: 'Personnel Administratif',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amina',
    content: 'L\'application est devenue indispensable. Le paiement intégré et la réservation anticipée changent vraiment la donne.',
    rating: 5,
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Témoignages
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs satisfaits sur le campus
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-card border border-border rounded-2xl p-6 h-full hover:border-primary/30 transition-colors">
                {/* Quote icon */}
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                
                {/* Content */}
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
