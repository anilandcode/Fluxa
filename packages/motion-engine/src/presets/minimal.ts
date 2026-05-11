import type { MotionPreset } from './types';

/** Minimal — clean, reduced, functional. Less is more. */
export const minimalPreset: MotionPreset = {
  name: 'minimal',
  description: 'Clean, reduced motion, functional transitions, whitespace-focused, calm pacing',
  keywords: ['minimal', 'clean', 'simple', 'functional', 'quiet', 'zen'],
  duration: { fast: 0.3, normal: 0.5, slow: 0.8 },
  stagger: { amount: 0.2, from: 'start' },
  ease: { enter: 'sine.out', exit: 'sine.in', move: 'sine.inOut', scrub: 'none' },
  intensity: 0.2,
  reveals: [{ type: 'fade', direction: 'up', distance: 20, autoAlpha: true }],
  parallax: { strength: 0.05, layers: 1, baseSpeed: -0.03 },
  typography: { animation: 'fade', split: false, splitType: 'words', letterSpacing: false },
  scroll: { scrub: 1, pin: false, snap: false, smooth: true, smoothness: 0.1 },
  design: {
    colors: {
      bg: '#FFFFFF',
      surface: '#FAFAFA',
      border: 'transparent',
      text: '#000000',
      textSecondary: '#888888',
      accent: '#000000',
      accentGlow: 'rgba(0, 0, 0, 0.05)',
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      fontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
      headingTracking: "-0.04em",
      baseLeading: "1.8",
    },
    rhythm: {
      radius: "4px",
      containerPadding: "64px",
      itemGap: "48px",
    },
    atmosphere: {
      shadowStrength: 0.02,
      glassmorphism: false,
      borderWidth: "0px",
    }
  }
};
