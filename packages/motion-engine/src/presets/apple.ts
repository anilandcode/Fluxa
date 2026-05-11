import type { MotionPreset } from './types';

/** Apple — subtle, precise, calm. Inspired by apple.com product pages. */
export const applePreset: MotionPreset = {
  name: 'apple',
  description: 'Subtle motion, smooth stagger reveals, precise easing, elegant parallax, calm pacing',
  keywords: ['subtle', 'clean', 'precise', 'calm', 'minimal', 'premium'],
  duration: { fast: 0.4, normal: 0.8, slow: 1.2 },
  stagger: { amount: 0.15, from: 'start' },
  ease: { enter: 'power3.out', exit: 'power2.in', move: 'power3.inOut', scrub: 'none' },
  intensity: 0.2,
  reveals: [{ type: 'fade', direction: 'up', distance: 25, autoAlpha: true }],
  parallax: { strength: 0.1, layers: 2, baseSpeed: -0.05 },
  typography: { animation: 'fade', split: false, splitType: 'words', letterSpacing: false },
  scroll: { scrub: 1.5, pin: true, snap: false, smooth: true, smoothness: 0.05 },
  design: {
    colors: {
      bg: '#050505',
      surface: '#0A0A0A',
      border: 'rgba(255, 255, 255, 0.06)',
      text: '#F3F4F6',
      textSecondary: '#9CA3AF',
      accent: '#E65C00',
      accentGlow: 'rgba(230, 92, 0, 0.15)',
    },
    typography: {
      fontFamily: "'Inter', -apple-system, sans-serif",
      fontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
      headingTracking: "-0.02em",
      baseLeading: "1.65",
    },
    rhythm: {
      radius: "16px",
      containerPadding: "24px",
      itemGap: "16px",
    },
    atmosphere: {
      shadowStrength: 0.5,
      glassmorphism: true,
      borderWidth: "1px",
    }
  }
};
