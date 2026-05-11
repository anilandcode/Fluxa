// ─────────────────────────────────────────────────────────────
// @fluxa/motion-engine — Parallax Animations
// ─────────────────────────────────────────────────────────────

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Creates a single parallax layer — an element that moves at a
 * different rate than the scroll, creating depth.
 *
 * Uses transform `y` for GPU-accelerated performance.
 */
export function createParallaxLayer(
  target: gsap.TweenTarget,
  config: {
    /** Speed multiplier. Negative = moves opposite to scroll */
    speed?: number;
    /** ScrollTrigger trigger element */
    trigger?: string | Element;
    /** Start position */
    start?: string;
    /** End position */
    end?: string;
    /** Scrub smoothing */
    scrub?: number | boolean;
  } = {},
): gsap.core.Tween {
  const {
    speed = -0.3,
    trigger,
    start = 'top bottom',
    end = 'bottom top',
    scrub = true,
  } = config;

  // Calculate movement distance based on speed
  const distance = speed * 100;

  return gsap.to(target, {
    y: distance,
    ease: 'none',
    scrollTrigger: {
      trigger: (trigger as string) ?? (target as string),
      start,
      end,
      scrub,
    },
  });
}

/**
 * Creates a multi-layer depth parallax system.
 * Each child at increasing depth moves progressively slower.
 *
 * @param container - Parent element containing parallax layers
 * @param layers - Array of layer configs (or auto-discover via [data-parallax-speed])
 */
export function depthParallax(
  container: string | Element,
  config: {
    /** Number of automatic depth layers */
    layerCount?: number;
    /** Base speed for shallowest layer */
    baseSpeed?: number;
    /** Speed multiplier per depth level */
    depthMultiplier?: number;
    /** Layer selector pattern (uses nth-child) */
    layerSelector?: string;
    /** Scrub smoothing */
    scrub?: number | boolean;
  } = {},
): gsap.core.Tween[] {
  const {
    layerCount = 3,
    baseSpeed = -0.1,
    depthMultiplier = 1.5,
    layerSelector = '[data-parallax]',
    scrub = 1,
  } = config;

  const containerEl =
    typeof container === 'string'
      ? document.querySelector(container)
      : container;

  if (!containerEl) return [];

  const layers = containerEl.querySelectorAll(layerSelector);
  const tweens: gsap.core.Tween[] = [];

  layers.forEach((layer, index) => {
    const customSpeed = layer.getAttribute('data-parallax-speed');
    const speed = customSpeed
      ? parseFloat(customSpeed)
      : baseSpeed * Math.pow(depthMultiplier, index);

    tweens.push(
      createParallaxLayer(layer, {
        speed,
        trigger: containerEl as Element,
        scrub,
      }),
    );
  });

  return tweens;
}

/**
 * Image parallax — the classic "background moves slower" effect.
 * Scales the image slightly larger to prevent gaps during movement.
 */
export function imageParallax(
  target: gsap.TweenTarget,
  config: {
    speed?: number;
    trigger?: string | Element;
    scrub?: number | boolean;
  } = {},
): gsap.core.Tween {
  const { speed = -0.2, trigger, scrub = true } = config;

  // Set initial scale to prevent gaps
  gsap.set(target, { scale: 1.15 });

  return createParallaxLayer(target, { speed, trigger, scrub });
}
