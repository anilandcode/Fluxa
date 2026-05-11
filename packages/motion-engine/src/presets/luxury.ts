import type { MotionPreset } from './types';

/** Luxury — slow, cinematic, refined. Inspired by high-end fashion and luxury brands. */
export const luxuryPreset: MotionPreset = {
  name: 'luxury',
  description: 'Slow cinematic transitions, premium spacing, elegant masking reveals, soft motion, refined typography',
  keywords: ['luxury', 'cinematic', 'elegant', 'premium', 'refined', 'fashion'],
  duration: { fast: 0.5, normal: 1.2, slow: 2.0 },
  stagger: { amount: 0.5, from: 'start' },
  ease: { enter: 'power3.inOut', exit: 'power2.in', move: 'power3.inOut', scrub: 'none' },
  intensity: 0.4,
  reveals: [{ type: 'mask', direction: 'up', distance: 0, autoAlpha: true }],
  parallax: { strength: 0.1, layers: 2, baseSpeed: -0.05 },
  typography: { animation: 'split', split: true, splitType: 'chars', letterSpacing: true },
  scroll: { scrub: 1.5, pin: true, snap: false, smooth: true, smoothness: 0.05 },
  design: {
    colors: {
      bg: '#0F0E0E',
      surface: '#151414',
      border: 'rgba(212, 175, 55, 0.15)',
      text: '#FDFBF7',
      textSecondary: '#A8A29E',
      accent: '#D4AF37', // Gold
      accentGlow: 'rgba(212, 175, 55, 0.1)',
    },
    typography: {
      fontFamily: "'Playfair Display', serif",
      fontUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap",
      headingTracking: "0.02em",
      baseLeading: "1.8",
    },
    rhythm: {
      radius: "0px",
      containerPadding: "48px",
      itemGap: "32px",
    },
    atmosphere: {
      shadowStrength: 0.8,
      glassmorphism: false,
      borderWidth: "1px",
    }
  }
};
