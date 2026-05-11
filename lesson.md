# Lessons Learned — Phase 1: Motion Engine

## 1. GSAP + Lenis Synchronization
Synchronizing a smooth scroll library (Lenis) with GSAP ScrollTrigger requires a centralized ticker.
- **Problem**: ScrollTrigger updates might lag behind Lenis smooth scrolling if not synced.
- **Solution**: Use `gsap.ticker.add((time) => lenis.raf(time * 1000))` and disable Lenis's internal RAF. This ensures frame-perfect alignment.

## 2. React Cleanup is Non-Negotiable
Animations in a component-based environment (React) easily lead to memory leaks and "ghost" triggers.
- **Lesson**: `gsap.context()` is the safest way to manage scope. Wrapping the entire Fluxa initialization in a context allows for a single `ctx.revert()` call to clean up all timelines, ScrollTriggers, and event listeners.

## 3. Preset DNA vs. Hardcoded Values
Hardcoding durations and eases makes a motion system rigid.
- **Lesson**: Encoding personality into a `MotionPreset` object allows the entire site to change its "vibe" by simply switching one reference. This is critical for the upcoming AI Prompting feature (Phase 3).

## 4. Monorepo local resolution (npm)
When using npm workspaces for a local package (`@fluxa/motion-engine`):
- **Lesson**: Use `file:../path/to/pkg` in `package.json` for reliable local linking during development before publishing to a registry.

## 5. TypeScript for Motion
Typed easing names and duration tiers prevent "magic numbers" in the codebase.
- **Lesson**: Defining a strict `DurationTiers` type ensures that "slow" always means the same thing across the engine, maintaining visual rhythm.

## 6. Layout-Motion Decoupling
The Motion Engine should not care about the layout, and vice versa.
- **Lesson**: By using `data-fluxa-item` attributes, the engine can find and animate elements regardless of the grid structure (Editorial, Bento, etc.).

## 7. Build Orchestration
Using `tsup` for dual CJS/ESM output with dts generation is the fastest way to build modern TypeScript packages.
- **Tip**: Ensure `types` is listed first in the `exports` field of `package.json` to help IDEs resolve types correctly.
