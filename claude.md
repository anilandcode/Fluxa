# Fluxa — AI Motion & Layout Engine

Fluxa is a high-performance cinematic animation and layout engine built for the modern web. It is designed to bridge the gap between AI-driven design intent and production-grade motion orchestration.

## 🌟 Vision
The goal is to create a "Prompt-to-Experience" pipeline where natural language descriptions are transformed into premium, highly-polished web sections that rival the quality of curated design brands like Apple, Stripe, and Linear.

## 🏗 System Architecture
Fluxa follows a modular monorepo architecture using npm workspaces:

### 1. @fluxa/motion-engine (Core)
The brain of the system. It orchestrates GSAP, ScrollTrigger, and Lenis.
- **Orchestrator**: Central entry point (`FluxaMotion`) for managing animation lifecycles.
- **TimelineManager**: Creates orchestrated GSAP timelines with preset-aware defaults.
- **ScrollController**: Handles smooth scrolling (Lenis) and frame-syncing with the GSAP ticker.
- **Preset Registry**: A type-safe store for visual personalities (Apple, Cyberpunk, etc.).

### 2. @fluxa/layout-engine (Upcoming)
Handles structural generation (Bento grids, Editorial flows, Split layouts).

### 3. apps/demo-site
A Vite-powered showcase for visual regression testing and preset validation.

## 🛠 Technology Stack
- **Framework**: React 19, TypeScript
- **Motion**: GSAP 3.12+ (Animations), ScrollTrigger (Scrubbing/Pinning), Lenis (Smooth Scroll)
- **Bundling**: `tsup` for high-performance dual-format (CJS/ESM) output.
- **Styling**: Vanilla CSS with modern custom properties (CSS Variables) for dynamic themes.

## 🎨 The Preset System (DNA)
Presets define the "feel" of the motion. Each preset encodes:

### Apple (Subtle & Calm)
- **Ease**: `power2.out`
- **Duration**: 0.6s
- **Intensity**: 0.3
- **Vibe**: Focuses on clarity and weight. Elements feel "physical" and premium.

### Startup (Energetic & Bold)
- **Ease**: `back.out(1.7)`
- **Duration**: 0.4s
- **Intensity**: 0.7
- **Vibe**: High energy, snappy entrances, and playful staggers.

### Luxury (Cinematic & Refined)
- **Ease**: `power3.inOut`
- **Duration**: 1.2s
- **Intensity**: 0.4
- **Vibe**: Slow, graceful reveals. Elements fade in with large masking effects.

### Cyberpunk (Neon & Digital)
- **Ease**: `expo.out`
- **Duration**: 0.3s
- **Intensity**: 0.9
- **Vibe**: Glitchy, fast-paced, high intensity movement with cyan/magenta accents.

### Brutalist (Raw & Hard)
- **Ease**: `none`
- **Duration**: 0.2s
- **Intensity**: 0.8
- **Vibe**: Sudden transitions, hard cuts, and extreme staggers.

## 🎞 Animation Factories
Reusable logic stored in `src/animations/`:
- `reveals.ts`: Handles entrance animations (fade, slide, mask, circular clip).
- `parallax.ts`: Multi-layered depth scrolling with gap prevention.
- `stagger.ts`: Directional entrance patterns (cascade, wave, random).
- `typography.ts`: Kinetic text effects (split-text, scramble, letter-spacing).
- `scroll-sequences.ts`: Advanced scroll patterns like pinning and horizontal flow.

## ⌨️ Coding Standards & Best Practices

### 1. Motion Lifecycle
Always initialize Fluxa within a `gsap.context()`. This ensures that every ScrollTrigger, timeline, and event listener is properly garbage collected on component unmount.
```ts
useEffect(() => {
  const ctx = gsap.context(() => {
    const fluxa = new FluxaMotion({ container: ref.current });
    fluxa.init().play();
  }, ref);
  return () => ctx.revert();
}, []);
```

### 2. Scroll Syncing
Never use Lenis's internal `requestAnimationFrame`. Always bind it to the GSAP ticker to prevent layout thrashing and jitter during scroll-linked animations.
```ts
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

### 3. Performance First
- Only animate `transform` (x, y, scale, rotate) and `opacity`.
- Avoid animating `width`, `height`, `margin`, or `padding` as they trigger layout reflow.
- Use `will-change: transform` sparingly on elements with heavy scroll-driven parallax.

### 4. Type Safety
Avoid `any`. The `MotionPreset` type is the single source of truth for all animation configurations. If extending a preset, use the `mergePreset()` utility.

### 5. Accessibility
Always wrap animation declarations in `withAccessibility()`. This automatically handles `prefers-reduced-motion` settings by neutralizing durations or reducing movement distance.

## 🚀 Development Workflow
1. **Engine Changes**: Modify files in `packages/motion-engine/src`.
2. **Build**: Run `npm run build` in the engine directory to generate `dist`.
3. **Demo**: The `demo-site` links to the engine via `file:` protocol. Hot reloading is supported through the build-watch cycle.

## 🧠 AI Integration Path
In Phase 3, we will implement the `AI-Motion-Mapping` layer. This layer will use an LLM to take a string prompt and return a JSON configuration that overrides specific tokens in the `Registry`.
- **Input**: "Make it feel like a dreamy cloud"
- **Output**: `{ ease: 'sine.inOut', duration: { normal: 1.5 }, intensity: 0.2 }`

---
*Created for AI Agents. Maintain the cinematic standard.*
*Lines: ~140*

