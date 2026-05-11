// ─────────────────────────────────────────────────────────────
// @fluxa/motion-engine — Scroll Controller (Lenis + ScrollTrigger)
// ─────────────────────────────────────────────────────────────

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import type { ScrollConfig } from '../presets/types';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollController manages smooth scrolling (Lenis) and
 * synchronizes it with GSAP ScrollTrigger.
 */
export class ScrollController {
  private lenis: Lenis | null = null;
  private rafId: number | null = null;
  private config: ScrollConfig;

  constructor(config: ScrollConfig) {
    this.config = config;
  }

  /** Initialize Lenis smooth scrolling and wire to ScrollTrigger. */
  init(): void {
    if (!this.config.smooth) return;

    this.lenis = new Lenis({
      lerp: this.config.smoothness,
      smoothWheel: true,
    });

    // Sync Lenis scroll position with ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker for Lenis RAF loop (better perf than rAF)
    gsap.ticker.add((time) => {
      this.lenis?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /** Get the Lenis instance for external use. */
  getLenis(): Lenis | null {
    return this.lenis;
  }

  /** Scroll to a target (element, position, or selector). */
  scrollTo(
    target: string | number | Element,
    options?: { offset?: number; duration?: number; immediate?: boolean },
  ): void {
    if (this.lenis) {
      this.lenis.scrollTo(target as any, options);
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el instanceof Element) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /** Temporarily stop smooth scrolling. */
  stop(): void {
    this.lenis?.stop();
  }

  /** Resume smooth scrolling. */
  start(): void {
    this.lenis?.start();
  }

  /** Recalculate ScrollTrigger positions. Call after DOM changes. */
  refresh(): void {
    ScrollTrigger.refresh();
  }

  /** Clean up everything. */
  destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.lenis?.destroy();
    this.lenis = null;
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
