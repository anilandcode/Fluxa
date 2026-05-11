// ─────────────────────────────────────────────────────────────
// @fluxa/motion-engine — Stagger Animations
// ─────────────────────────────────────────────────────────────

import gsap from 'gsap';
import type { StaggerFrom } from '../presets/types';

/**
 * Cascade stagger — sequential reveal from one edge.
 * Classic Apple-style: items appear one after another.
 */
export function cascadeStagger(
  targets: gsap.TweenTarget,
  config: {
    from?: StaggerFrom;
    amount?: number;
    duration?: number;
    ease?: string;
    y?: number;
  } = {},
): gsap.core.Tween {
  const {
    from = 'start',
    amount = 0.6,
    duration = 0.8,
    ease = 'power2.out',
    y = 40,
  } = config;

  return gsap.from(targets, {
    autoAlpha: 0,
    y,
    duration,
    ease,
    stagger: {
      amount,
      from,
    },
  });
}

/**
 * Wave stagger — elements ripple from center outward.
 * Creates a breathing, organic feel.
 */
export function waveStagger(
  targets: gsap.TweenTarget,
  config: {
    amount?: number;
    duration?: number;
    ease?: string;
    y?: number;
    scale?: number;
  } = {},
): gsap.core.Tween {
  const {
    amount = 0.8,
    duration = 0.6,
    ease = 'power2.out',
    y = 30,
    scale = 0.95,
  } = config;

  return gsap.from(targets, {
    autoAlpha: 0,
    y,
    scale,
    duration,
    ease,
    stagger: {
      amount,
      from: 'center',
      ease: 'power1.inOut',
    },
  });
}

/**
 * Random stagger — chaotic, unpredictable reveal order.
 * Great for grid layouts, galleries, and cyberpunk aesthetics.
 */
export function randomStagger(
  targets: gsap.TweenTarget,
  config: {
    amount?: number;
    duration?: number;
    ease?: string;
    y?: number;
    rotation?: number;
  } = {},
): gsap.core.Tween {
  const {
    amount = 1.0,
    duration = 0.5,
    ease = 'power3.out',
    y = 50,
    rotation = 0,
  } = config;

  return gsap.from(targets, {
    autoAlpha: 0,
    y,
    rotation,
    duration,
    ease,
    stagger: {
      amount,
      from: 'random',
    },
  });
}

/**
 * Edge stagger — items reveal from both edges toward center.
 * Dramatic, symmetrical feel.
 */
export function edgeStagger(
  targets: gsap.TweenTarget,
  config: {
    amount?: number;
    duration?: number;
    ease?: string;
    y?: number;
  } = {},
): gsap.core.Tween {
  const {
    amount = 0.6,
    duration = 0.7,
    ease = 'power2.out',
    y = 40,
  } = config;

  return gsap.from(targets, {
    autoAlpha: 0,
    y,
    duration,
    ease,
    stagger: {
      amount,
      from: 'edges',
    },
  });
}

/**
 * Creates a stagger animation from a StaggerFrom configuration.
 * Used by the orchestrator to apply preset stagger patterns.
 */
export function createStagger(
  targets: gsap.TweenTarget,
  from: StaggerFrom,
  options: {
    amount?: number;
    duration?: number;
    ease?: string;
    y?: number;
  } = {},
): gsap.core.Tween {
  switch (from) {
    case 'center':
      return waveStagger(targets, options);
    case 'random':
      return randomStagger(targets, options);
    case 'edges':
      return edgeStagger(targets, options);
    case 'start':
    case 'end':
    default:
      return cascadeStagger(targets, { ...options, from });
  }
}
