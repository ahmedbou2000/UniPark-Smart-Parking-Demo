import React from 'react';
import { Header, Footer } from '@/components/layout';
import {
  HeroSection,
  StatsSection,
  FeaturesSection,
  TestimonialsSection,
  CTASection,
} from '@/components/landing';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
