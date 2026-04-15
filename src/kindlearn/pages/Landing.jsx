import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import ChallengeSteps from '../components/landing/ChallengeSteps';
import KidsPreview from '../components/landing/KidsPreview';
import Footer from '../components/landing/Footer';
import AnimatedBackground from '../components/landing/AnimatedBackground';

const inApp = typeof window !== 'undefined' && !!window.Capacitor;

export default function Landing() {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar />
        <div className={inApp ? 'pt-0' : 'pt-16'}>
          <Hero />
          <Features />
          <ChallengeSteps />
          <KidsPreview />
          <Footer />
        </div>
      </div>
    </div>
  );
}