import { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  listPresets,
  getPreset,
} from '@fluxa/motion-engine';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [activePreset, setActivePreset] = useState('apple');
  const containerRef = useRef<HTMLDivElement>(null);
  const presets = listPresets();

  const runAnimations = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const preset = getPreset(activePreset);
    if (!preset) return;

    // ── Inject Design Language ──
    if ((preset as any).design) {
      const design = (preset as any).design;
      const root = document.documentElement;
      
      // Colors
      root.style.setProperty('--bg', design.colors.bg);
      root.style.setProperty('--surface', design.colors.surface);
      root.style.setProperty('--border', design.colors.border);
      root.style.setProperty('--text', design.colors.text);
      root.style.setProperty('--text-secondary', design.colors.textSecondary);
      root.style.setProperty('--accent', design.colors.accent);
      root.style.setProperty('--accent-glow', design.colors.accentGlow);

      // Typography
      root.style.setProperty('--font-heading', design.typography.fontFamily);
      root.style.setProperty('--font-body', design.typography.fontFamily);
      root.style.setProperty('--tracking-heading', design.typography.headingTracking);
      root.style.setProperty('--leading-base', design.typography.baseLeading);

      // Rhythm
      root.style.setProperty('--radius-container', design.rhythm.radius);
      root.style.setProperty('--padding-container', design.rhythm.containerPadding);
      root.style.setProperty('--gap-item', design.rhythm.itemGap);

      // Atmosphere
      root.style.setProperty('--shadow-strength', design.atmosphere.shadowStrength.toString());
      root.style.setProperty('--border-width', design.atmosphere.borderWidth);
      root.style.setProperty('--glass-opacity', design.atmosphere.glassmorphism ? '0.02' : '0');

      // Inject Font URL
      if (design.typography.fontUrl) {
        let link = document.getElementById('fluxa-font-' + preset.name) as HTMLLinkElement | null;
        if (!link) {
          link = document.createElement('link') as HTMLLinkElement;
          link.id = 'fluxa-font-' + preset.name;
          link.rel = 'stylesheet';
          link.href = design.typography.fontUrl;
          document.head.appendChild(link);
        }
      }
    }

    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf(container.querySelectorAll('*'));

    const allItems = container.querySelectorAll('[data-fluxa-item]');
    gsap.set(allItems, { autoAlpha: 1 });

    requestAnimationFrame(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // ── Hero ──
        const heroItems = container.querySelectorAll('.hero [data-fluxa-item]');
        const distance = preset.reveals[0]?.distance ?? 25;

        gsap.from(heroItems, {
          autoAlpha: 0,
          y: distance,
          duration: preset.duration.slow,
          ease: preset.ease.enter,
          stagger: preset.stagger.amount,
        });

        // ── Bento Cards ──
        const cards = container.querySelectorAll('.card-shell');
        cards.forEach((card) => {
          gsap.from(card, {
            autoAlpha: 0,
            y: distance * 1.2,
            duration: preset.duration.normal,
            ease: preset.ease.enter,
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          });
        });

        // ── Type Lines ──
        const typeLines = container.querySelectorAll('.type-line');
        gsap.from(typeLines, {
          autoAlpha: 0,
          scale: 0.98,
          y: distance,
          duration: preset.duration.slow * 1.2,
          ease: preset.ease.enter,
          stagger: preset.stagger.amount * 1.5,
          scrollTrigger: {
            trigger: '.type-showcase',
            start: 'top 85%',
          },
        });

        // ── Parallax ──
        const shapes = container.querySelectorAll('.parallax-shape');
        shapes.forEach((shape, i) => {
          gsap.to(shape, {
            y: (i + 1) * -300 * preset.parallax.strength,
            rotation: i * 50 * preset.parallax.strength,
            scrollTrigger: {
              trigger: '.parallax-container',
              start: 'top bottom',
              end: 'bottom top',
              scrub: preset.scroll.scrub,
            },
          });
        });
      });

      mm.add("(max-width: 767px)", () => {
        // ── Mobile Animations (Optimized) ──
        const distance = (preset.reveals[0]?.distance ?? 25) * 0.5; // Halve distance
        const durationMod = 0.8; // Faster
        const staggerMod = 0.5; // Faster stagger

        const heroItems = container.querySelectorAll('.hero [data-fluxa-item]');
        gsap.from(heroItems, {
          autoAlpha: 0,
          y: distance,
          duration: preset.duration.slow * durationMod,
          ease: preset.ease.enter,
          stagger: preset.stagger.amount * staggerMod,
        });

        const cards = container.querySelectorAll('.card-shell');
        cards.forEach((card) => {
          gsap.from(card, {
            autoAlpha: 0,
            y: distance * 1.2,
            duration: preset.duration.normal * durationMod,
            ease: preset.ease.enter,
            scrollTrigger: {
              trigger: card,
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            },
          });
        });

        const typeLines = container.querySelectorAll('.type-line');
        gsap.from(typeLines, {
          autoAlpha: 0,
          scale: 0.98,
          y: distance,
          duration: preset.duration.slow * durationMod,
          ease: preset.ease.enter,
          stagger: preset.stagger.amount * staggerMod,
          scrollTrigger: {
            trigger: '.type-showcase',
            start: 'top 90%',
          },
        });

        const shapes = container.querySelectorAll('.parallax-shape');
        shapes.forEach((shape, i) => {
          gsap.to(shape, {
            y: (i + 1) * -100 * preset.parallax.strength, // Reduced parallax translation, no rotation
            scrollTrigger: {
              trigger: '.parallax-container',
              start: 'top bottom',
              end: 'bottom top',
              scrub: preset.scroll.scrub,
            },
          });
        });
      });

      return () => mm.revert();
    });
  }, [activePreset]);

  useEffect(() => {
    runAnimations();
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [runAnimations]);

  return (
    <div ref={containerRef} className="app">
      {/* ── Preset Nav ── */}
      <nav className="preset-nav">
        <span className="preset-nav__label">Style</span>
        <div className="preset-nav__pills">
          {presets.map((name) => (
            <button
              key={name}
              className={`preset-pill ${name === activePreset ? 'preset-pill--active' : ''}`}
              onClick={() => setActivePreset(name)}
              style={name === activePreset ? { background: 'var(--accent)', color: 'var(--bg)' } : {}}
            >
              {name}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <p className="hero__eyebrow" data-fluxa-item>PaperFlow Design System</p>
        <h1 className="hero__title" data-fluxa-item>
          Streamline operations<br />
          with <span style={{ color: 'var(--accent)' }}>smart workflows.</span>
        </h1>
        <p className="hero__subtitle" data-fluxa-item>
          Optimize your daily tasks and harness data for clear outcomes.
          Built with Fluxa Motion Engine.
        </p>
        <div className="hero__meta" data-fluxa-item>
          <button className="badge" style={{ border: 'none', cursor: 'pointer', background: 'var(--accent)', color: 'var(--bg)' }}>Get Started</button>
          <span className="badge badge--outline">v1.0.0</span>
        </div>
      </section>

      {/* ── Bento Grid ── */}
      <section className="demo-section">
        <div className="card-grid">
          {/* Card 1 */}
          <div className="card-shell card-shell--wide">
            <div className="card">
              <span className="card__number">01</span>
              <h3 className="card__label">Frameworks.</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                Robust interface frameworks, dynamic components, and polished
                applications designed for modern scale.
              </p>
              <div className="card__bar" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="card-shell card-shell--standard">
            <div className="card" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-widest)' }}>Typography</span>
              <h2 style={{ fontSize: 'var(--text-5xl)', fontWeight: 500, letterSpacing: 'var(--tracking-tight)', lineHeight: 'var(--leading-tight)' }}>Inter Sans</h2>
              <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                <div><p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', letterSpacing: 'var(--tracking-wide)' }}>WEIGHTS</p><p style={{ fontWeight: 600, fontSize: 'var(--text-lg)' }}>9</p></div>
                <div><p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', letterSpacing: 'var(--tracking-wide)' }}>CATEGORY</p><p style={{ fontWeight: 600, fontSize: 'var(--text-lg)' }}>Neo</p></div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card-shell card-shell--standard">
            <div className="card">
              <div style={{ width: '40px', height: '40px', background: 'var(--surface-hover)', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', border: '1px solid var(--border)' }} />
              <h3 className="card__label">Assets.</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Premium UI kits and production-ready assets.</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="card-shell card-shell--wide">
            <div className="card" style={{ textAlign: 'center', alignItems: 'center' }}>
               <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--accent)' }} />
               </div>
               <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 500, letterSpacing: 'var(--tracking-tight)' }}>Discover crafted interface patterns.</h2>
               <p style={{ color: 'var(--text-secondary)', maxWidth: '50ch', margin: '0.5rem auto 1.5rem', fontSize: 'var(--text-base)' }}>
                 Showcasing hundreds of premium interactions and tailored layouts for SaaS applications.
               </p>
               <button className="badge badge--outline" style={{ cursor: 'pointer' }}>Explore Gallery ↗</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Type Showcase ── */}
      <section className="demo-section">
        <div className="type-showcase">
          <div className="type-line type-line--large" data-fluxa-item>Refined</div>
          <div className="type-line type-line--large" data-fluxa-item>Product</div>
          <div className="type-line type-line--large" data-fluxa-item style={{ color: 'var(--accent)' }}>Assets.</div>
        </div>
      </section>

      {/* ── Parallax ── */}
      <section className="demo-section">
        <div className="parallax-container">
          <div className="parallax-shape parallax-shape--circle" />
          <div className="parallax-shape parallax-shape--square" style={{ marginLeft: '-100px', marginTop: '100px' }} />
          <div style={{ position: 'absolute', textAlign: 'center', zIndex: 5 }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 500, letterSpacing: 'var(--tracking-tight)' }}>Tactile UI Kit</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>Latest drop • Nov 12, 2023</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--accent)' }} />
          <span style={{ fontWeight: 600, fontSize: 'var(--text-lg)', letterSpacing: 'var(--tracking-tight)' }}>PaperFlow</span>
        </div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>© 2024 Fluxa Motion Engine. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
