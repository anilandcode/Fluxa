import type { MotionPreset } from './types';

/** Startup — energetic, sharp, bold. Inspired by Y Combinator launches. */
export const startupPreset: MotionPreset = {
  name: 'startup',
  description: 'Energetic reveals, sharp transitions, layered parallax, bold typography, dynamic layouts',
  keywords: ['energetic', 'bold', 'sharp', 'dynamic', 'modern', 'tech'],
  duration: { fast: 0.2, normal: 0.4, slow: 0.7 },
  stagger: { amount: 0.4, from: 'start' },
  ease: { enter: 'back.out(1.7)', exit: 'power3.in', move: 'power3.out', scrub: 'none' },
  intensity: 0.7,
  reveals: [
    { type: 'slide', direction: 'up', distance: 80, autoAlpha: true },
    { type: 'fade', direction: 'left', distance: 60, autoAlpha: true },
  ],
  parallax: { strength: 0.3, layers: 3, baseSpeed: -0.15 },
  typography: { animation: 'slide', split: true, splitType: 'words', letterSpacing: false },
  scroll: { scrub: 0.5, pin: true, snap: false, smooth: true, smoothness: 0.06 },
  design: {
    colors: {
      bg: '#F8FAFC',
      surface: '#FFFFFF',
      border: 'rgba(0, 0, 0, 0.05)',
      text: '#0F172A',
      textSecondary: '#64748B',
      accent: '#3B82F6',
      accentGlow: 'rgba(59, 130, 246, 0.2)',
    },
    typography: {
      fontFamily: "'Outfit', sans-serif",
      fontUrl: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap",
      headingTracking: "-0.03em",
      baseLeading: "1.5",
    },
    rhythm: {
      radius: "24px",
      containerPadding: "32px",
      itemGap: "24px",
    },
    atmosphere: {
      shadowStrength: 0.15,
      glassmorphism: false,
      borderWidth: "1px",
    }
  }
};
