// ─────────────────────────────────────────────────────────────
// @fluxa/motion-engine — Timeline Manager
// ─────────────────────────────────────────────────────────────

import gsap from 'gsap';
import type { AnimationStep, MotionPreset } from '../presets/types';

/**
 * TimelineManager creates and coordinates GSAP timelines
 * with preset-driven defaults (duration, ease, stagger).
 */
export class TimelineManager {
  private preset: MotionPreset;
  private timelines: gsap.core.Timeline[] = [];

  constructor(preset: MotionPreset) {
    this.preset = preset;
  }

  /** Create a new timeline with preset defaults. */
  createTimeline(
    config?: gsap.TimelineVars,
  ): gsap.core.Timeline {
    const tl = gsap.timeline({
      defaults: {
        duration: this.preset.duration.normal,
        ease: this.preset.ease.enter,
      },
      ...config,
    });

    this.timelines.push(tl);
    return tl;
  }

  /** Add a sequence of animation steps to a timeline. */
  addSequence(
    timeline: gsap.core.Timeline,
    steps: AnimationStep[],
  ): gsap.core.Timeline {
    steps.forEach((step) => {
      if (step.label) {
        timeline.addLabel(step.label, step.position);
      }
      timeline.to(step.targets, step.vars, step.position);
    });
    return timeline;
  }

  /** Add multiple animations that play at the same time. */
  addParallel(
    timeline: gsap.core.Timeline,
    animations: AnimationStep[],
    position?: string | number,
  ): gsap.core.Timeline {
    const startPos = position ?? '<';
    animations.forEach((anim, i) => {
      timeline.to(anim.targets, anim.vars, i === 0 ? startPos : '<');
    });
    return timeline;
  }

  /** Create an intro timeline (fade-in, stagger reveal). */
  createIntro(
    container: Element,
    selectors: { heading?: string; text?: string; items?: string; media?: string } = {},
  ): gsap.core.Timeline {
    const tl = this.createTimeline({ paused: true });
    const { heading = 'h1, h2, h3', text = 'p', items = '[data-fluxa-item]', media = 'img, video' } = selectors;

    const headings = container.querySelectorAll(heading);
    const texts = container.querySelectorAll(text);
    const staggerItems = container.querySelectorAll(items);
    const mediaEls = container.querySelectorAll(media);

    if (headings.length) {
      tl.from(headings, {
        autoAlpha: 0,
        y: this.preset.reveals[0]?.distance ?? 40,
        duration: this.preset.duration.normal,
        ease: this.preset.ease.enter,
        stagger: 0.1,
      });
    }

    if (texts.length) {
      tl.from(texts, {
        autoAlpha: 0,
        y: 20,
        duration: this.preset.duration.fast,
        ease: this.preset.ease.enter,
        stagger: 0.05,
      }, '-=0.3');
    }

    if (staggerItems.length) {
      tl.from(staggerItems, {
        autoAlpha: 0,
        y: this.preset.reveals[0]?.distance ?? 30,
        duration: this.preset.duration.normal,
        ease: this.preset.ease.enter,
        stagger: {
          amount: this.preset.stagger.amount,
          from: this.preset.stagger.from,
        },
      }, '-=0.2');
    }

    if (mediaEls.length) {
      tl.from(mediaEls, {
        autoAlpha: 0,
        scale: 0.95,
        duration: this.preset.duration.slow,
        ease: this.preset.ease.enter,
        stagger: 0.1,
      }, '-=0.4');
    }

    return tl;
  }

  /** Kill all managed timelines. */
  destroy(): void {
    this.timelines.forEach(tl => tl.kill());
    this.timelines = [];
  }
}
