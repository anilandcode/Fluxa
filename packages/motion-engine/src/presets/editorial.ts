import type { MotionPreset } from './types';

/** Editorial — immersive, narrative, scroll-driven. Inspired by long-form storytelling sites. */
export const editorialPreset: MotionPreset = {
  name: 'editorial',
  description: 'Immersive reading, image-focused layouts, cinematic transitions, scrolling narrative pacing',
  keywords: ['editorial', 'storytelling', 'immersive', 'narrative', 'reading', 'magazine'],
  duration: { fast: 0.4, normal: 0.8, slow: 1.4 },
  stagger: { amount: 0.4, from: 'start' },
  ease: { enter: 'power2.inOut', exit: 'power2.in', move: 'power2.out', scrub: 'none' },
  intensity: 0.5,
  reveals: [
    { type: 'fade', direction: 'up', distance: 50, autoAlpha: true },
    { type: 'mask', direction: 'left', distance: 0, autoAlpha: true },
  ],
  parallax: { strength: 0.2, layers: 3, baseSpeed: -0.08 },
  typography: { animation: 'fade', split: false, splitType: 'lines', letterSpacing: false },
  scroll: { scrub: 1, pin: true, snap: true, smooth: true, smoothness: 0.07 },
  design: {
    colors: {
      bg: '#F4F1EA',
      surface: '#FCFAF6',
      border: '#D6D3D1',
      text: '#1C1917',
      textSecondary: '#57534E',
      accent: '#D946EF', // Fuchsia
      accentGlow: 'rgba(217, 70, 239, 0.15)',
    },
    typography: {
      fontFamily: "'Newsreader', serif",
      fontUrl: "https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap",
      headingTracking: "-0.01em",
      baseLeading: "1.6",
    },
    rhythm: {
      radius: "4px",
      containerPadding: "24px",
      itemGap: "16px",
    },
    atmosphere: {
      shadowStrength: 0.05,
      glassmorphism: false,
      borderWidth: "1px",
    }
  }
};
