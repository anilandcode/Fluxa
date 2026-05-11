// ─────────────────────────────────────────────────────────────
// @fluxa/motion-engine — Reveal Animations
// ─────────────────────────────────────────────────────────────

import gsap from 'gsap';
import type { RevealConfig, RevealDirection } from '../presets/types';

/** Direction-to-axis mapping */
const DIRECTION_MAP: Record<RevealDirection, { prop: string; value: number }> = {
  up: { prop: 'y', value: 1 },
  down: { prop: 'y', value: -1 },
  left: { prop: 'x', value: 1 },
  right: { prop: 'x', value: -1 },
};

/**
 * Fade reveal — elements fade in with optional directional movement.
 */
export function fadeReveal(
  targets: gsap.TweenTarget,
  config: {
    direction?: RevealDirection;
    distance?: number;
    duration?: number;
    ease?: string;
    stagger?: number | gsap.StaggerVars;
    delay?: number;
  } = {},
): gsap.core.Tween {
  const {
    direction = 'up',
    distance = 60,
    duration = 0.8,
    ease = 'power2.out',
    stagger = 0.1,
    delay = 0,
  } = config;

  const dir = DIRECTION_MAP[direction];

  return gsap.from(targets, {
    autoAlpha: 0,
    [dir.prop]: distance * dir.value,
    duration,
    ease,
    stagger,
    delay,
  });
}

/**
 * Slide reveal — elements slide in from off-screen with full opacity.
 */
export function slideReveal(
  targets: gsap.TweenTarget,
  config: {
    direction?: RevealDirection;
    distance?: number;
    duration?: number;
    ease?: string;
    stagger?: number | gsap.StaggerVars;
  } = {},
): gsap.core.Tween {
  const {
    direction = 'up',
    distance = 120,
    duration = 0.6,
    ease = 'power3.out',
    stagger = 0.08,
  } = config;

  const dir = DIRECTION_MAP[direction];

  return gsap.from(targets, {
    [dir.prop]: distance * dir.value,
    duration,
    ease,
    stagger,
  });
}

/**
 * Mask reveal — elements revealed via clip-path animation.
 * Creates a cinematic "wipe" effect.
 */
export function maskReveal(
  targets: gsap.TweenTarget,
  config: {
    direction?: RevealDirection;
    duration?: number;
    ease?: string;
    stagger?: number | gsap.StaggerVars;
  } = {},
): gsap.core.Tween {
  const {
    direction = 'up',
    duration = 1.0,
    ease = 'power3.inOut',
    stagger = 0.15,
  } = config;

  const clipPaths: Record<RevealDirection, { from: string; to: string }> = {
    up: {
      from: 'inset(100% 0% 0% 0%)',
      to: 'inset(0% 0% 0% 0%)',
    },
    down: {
      from: 'inset(0% 0% 100% 0%)',
      to: 'inset(0% 0% 0% 0%)',
    },
    left: {
      from: 'inset(0% 0% 0% 100%)',
      to: 'inset(0% 0% 0% 0%)',
    },
    right: {
      from: 'inset(0% 100% 0% 0%)',
      to: 'inset(0% 0% 0% 0%)',
    },
  };

  const clip = clipPaths[direction];

  return gsap.fromTo(
    targets,
    { clipPath: clip.from },
    {
      clipPath: clip.to,
      duration,
      ease,
      stagger,
    },
  );
}

/**
 * Clip reveal — circular or custom clip-path expansion.
 */
export function clipReveal(
  targets: gsap.TweenTarget,
  config: {
    shape?: 'circle' | 'ellipse';
    duration?: number;
    ease?: string;
    stagger?: number | gsap.StaggerVars;
  } = {},
): gsap.core.Tween {
  const {
    shape = 'circle',
    duration = 1.2,
    ease = 'power3.out',
    stagger = 0.1,
  } = config;

  const from =
    shape === 'circle'
      ? 'circle(0% at 50% 50%)'
      : 'ellipse(0% 0% at 50% 50%)';

  const to =
    shape === 'circle'
      ? 'circle(100% at 50% 50%)'
      : 'ellipse(100% 100% at 50% 50%)';

  return gsap.fromTo(
    targets,
    { clipPath: from },
    { clipPath: to, duration, ease, stagger },
  );
}

/**
 * Creates a reveal animation from a RevealConfig.
 * Used by the orchestrator to apply preset reveals.
 */
export function createReveal(
  targets: gsap.TweenTarget,
  revealConfig: RevealConfig,
  options: { duration?: number; ease?: string; stagger?: number } = {},
): gsap.core.Tween {
  const { type, direction, distance, autoAlpha } = revealConfig;

  switch (type) {
    case 'fade':
      return fadeReveal(targets, { direction, distance, ...options });
    case 'slide':
      return slideReveal(targets, { direction, distance, ...options });
    case 'mask':
      return maskReveal(targets, { direction, ...options });
    case 'clip':
      return clipReveal(targets, { ...options });
    default:
      return fadeReveal(targets, { direction, distance, ...options });
  }
}
