// ─────────────────────────────────────────────────────────────
// @fluxa/motion-engine — FluxaMotion Orchestrator
// ─────────────────────────────────────────────────────────────

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { FluxaMotionOptions, MotionPreset } from '../presets/types';
import { getPreset, mergePreset } from '../presets/registry';
import { ScrollController } from './scroll-controller';
import { TimelineManager } from './timeline-manager';
import { withAccessibility, getEffectiveDuration } from '../utils/accessibility';

gsap.registerPlugin(ScrollTrigger);

/**
 * FluxaMotion — the top-level animation controller.
 *
 * Usage:
 * ```ts
 * const fluxa = new FluxaMotion({
 *   container: '.hero-section',
 *   preset: 'apple',
 * });
 * fluxa.play();
 * // later:
 * fluxa.destroy();
 * ```
 */
export class FluxaMotion {
  private container: HTMLElement;
  private preset: MotionPreset;
  private scrollController: ScrollController;
  private timelineManager: TimelineManager;
  private matchMedia: gsap.MatchMedia | null = null;
  private introTimeline: gsap.core.Timeline | null = null;
  private debug: boolean;

  constructor(options: FluxaMotionOptions) {
    // Resolve container
    const el =
      typeof options.container === 'string'
        ? document.querySelector(options.container)
        : options.container;

    if (!el) {
      throw new Error(`[FluxaMotion] Container not found: ${options.container}`);
    }

    this.container = el as HTMLElement;
    this.debug = options.debug ?? false;

    // Resolve preset
    let basePreset: MotionPreset;
    if (typeof options.preset === 'string') {
      const found = getPreset(options.preset);
      if (!found) {
        throw new Error(`[FluxaMotion] Preset not found: "${options.preset}". Available: ${listPresetsFromRegistry()}`);
      }
      basePreset = found;
    } else {
      basePreset = options.preset;
    }

    // Apply overrides
    this.preset = options.overrides
      ? mergePreset(basePreset, options.overrides)
      : basePreset;

    // Set GSAP defaults
    gsap.defaults({
      duration: this.preset.duration.normal,
      ease: this.preset.ease.enter,
    });

    // Initialize subsystems
    this.scrollController = new ScrollController(this.preset.scroll);
    this.timelineManager = new TimelineManager(this.preset);
  }

  /** Initialize all subsystems and set up accessibility. */
  init(): FluxaMotion {
    this.matchMedia = withAccessibility(
      (conditions) => {
        if (conditions.reduceMotion) {
          // Override all durations to 0 for reduced motion
          gsap.defaults({ duration: 0 });
        } else {
          gsap.defaults({ duration: this.preset.duration.normal });
        }

        // Init smooth scroll (skip if reduced motion)
        if (!conditions.reduceMotion) {
          this.scrollController.init();
        }

        // Create intro animation
        this.introTimeline = this.timelineManager.createIntro(this.container);

        return () => {
          // Cleanup on condition change
          this.introTimeline?.kill();
        };
      },
      this.container,
    );

    return this;
  }

  /** Play the intro animation. */
  play(): FluxaMotion {
    if (!this.introTimeline) this.init();
    this.introTimeline?.play();
    return this;
  }

  /** Pause the intro animation. */
  pause(): FluxaMotion {
    this.introTimeline?.pause();
    return this;
  }

  /** Reverse the intro animation. */
  reverse(): FluxaMotion {
    this.introTimeline?.reverse();
    return this;
  }

  /** Get the current preset. */
  getPreset(): MotionPreset {
    return this.preset;
  }

  /** Get the scroll controller for external use. */
  getScrollController(): ScrollController {
    return this.scrollController;
  }

  /** Get the timeline manager for external use. */
  getTimelineManager(): TimelineManager {
    return this.timelineManager;
  }

  /** Switch to a different preset at runtime. */
  switchPreset(presetName: string, overrides?: Partial<MotionPreset>): FluxaMotion {
    const newPreset = getPreset(presetName);
    if (!newPreset) {
      console.warn(`[FluxaMotion] Preset not found: "${presetName}"`);
      return this;
    }

    // Tear down current animation
    this.introTimeline?.kill();
    this.timelineManager.destroy();

    // Apply new preset
    this.preset = overrides ? mergePreset(newPreset, overrides) : newPreset;
    this.timelineManager = new TimelineManager(this.preset);

    // Rebuild
    gsap.defaults({
      duration: this.preset.duration.normal,
      ease: this.preset.ease.enter,
    });

    // Reset element styles before re-animating
    gsap.set(this.container.querySelectorAll('*'), { clearProps: 'all' });

    this.introTimeline = this.timelineManager.createIntro(this.container);
    this.introTimeline.play();

    return this;
  }

  /** Clean up all animations, ScrollTriggers, and Lenis. */
  destroy(): void {
    this.introTimeline?.kill();
    this.introTimeline = null;
    this.timelineManager.destroy();
    this.scrollController.destroy();
    this.matchMedia?.revert();
    this.matchMedia = null;
  }
}

/** Helper to list presets (avoids circular import). */
function listPresetsFromRegistry(): string {
  try {
    const { listPresets } = require('../presets/registry');
    return listPresets().join(', ');
  } catch {
    return '(unknown)';
  }
}
