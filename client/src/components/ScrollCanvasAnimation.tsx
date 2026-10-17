import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollCanvasAnimationProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  totalFrames?: number;
  framePathPrefix?: string;
}

// Story beats: each fires at a % of total animation progress
// and shows a label + headline + sub using strictly brand tokens
const STORY_BEATS = [
  {
    id: 'assembled',
    from: 0,
    to: 0.18,
    tag: 'The Problem',
    headline: 'Every year, millions of laptops are thrown away.',
    sub: 'Most end up in landfill — leaching lead, mercury & cadmium into soil.',
    accent: 'var(--copper)',
  },
  {
    id: 'opening',
    from: 0.2,
    to: 0.42,
    tag: 'Look Inside',
    headline: 'Inside every "old" laptop are parts worth saving.',
    sub: 'The motherboard, RAM, SSD & GPU still have real market value.',
    accent: 'var(--signal)',
  },
  {
    id: 'components',
    from: 0.44,
    to: 0.66,
    tag: 'Recoverable Components',
    headline: 'Gold, copper & rare earths — all recoverable.',
    sub: '10 old phones hold ~34g of gold. One laptop contains ~0.6kg of copper.',
    accent: 'var(--copper)',
  },
  {
    id: 'recycle',
    from: 0.68,
    to: 0.88,
    tag: 'Two Paths Forward',
    headline: 'Sell the parts. Or let us recycle them properly.',
    sub: 'EcoCircuit connects the LPU community with responsible collection points and authorized recyclers in the Phagwara–Jalandhar area.',
    accent: 'var(--moss)',
  },
  {
    id: 'cta',
    from: 0.9,
    to: 1.0,
    tag: 'Your Turn',
    headline: 'One device. Endless second chances.',
    sub: 'Request a collection for your hostel or department and we handle the rest safely.',
    accent: 'var(--copper)',
  },
];

export default function ScrollCanvasAnimation({
  sectionRef,
  totalFrames = 198,
  framePathPrefix = '/frames/ezgif-frame-',
}: ScrollCanvasAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [activeStory, setActiveStory] = useState<string | null>('assembled');
  const [progress, setProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── HiDPI canvas resize ──────────────────────────────────────────
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctxRef.current = ctx;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      drawFrame(currentFrameRef.current);
    };

    // ── Draw frame with object-fit:contain (95% viewport coverage) ────
    const drawFrame = (index: number) => {
      const ctx = ctxRef.current;
      if (!ctx || !canvas) return;
      const img = imagesRef.current[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const dpr = window.devicePixelRatio || 1;
      const cssW = canvas.width / dpr;
      const cssH = canvas.height / dpr;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const scale = Math.min(cssW / iw, cssH / ih) * 1.05;
      const drawW = iw * scale;
      const drawH = ih * scale;
      const offX = (cssW - drawW) / 2;
      const offY = (cssH - drawH) / 2;

      ctx.clearRect(0, 0, cssW, cssH);
      ctx.drawImage(img, offX, offY, drawW, drawH);
    };

    // ── Scroll → frame + story state ───────────────────────────────
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const trackLen = section.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.min(Math.max(scrolled / trackLen, 0), 1);
      setProgress(p);

      // Update story beat
      const beat = STORY_BEATS.find((b) => p >= b.from && p <= b.to);
      setActiveStory(beat ? beat.id : null);

      if (prefersReducedMotion) return; // Static frame if user prefers reduced motion

      const frameIndex = Math.min(Math.floor(p * (totalFrames - 1)), totalFrames - 1);
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
      }
    };

    // ── Preload frames ───────────────────────────────────────────
    const images: HTMLImageElement[] = new Array(totalFrames);
    let loaded = 0;

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.decoding = 'async';
      const idx = i;
      const padded = String(i + 1).padStart(3, '0');
      img.src = `${framePathPrefix}${padded}.jpg`;
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
        if (idx === 0) {
          resizeCanvas();
          drawFrame(0);
        }
        if (loaded >= Math.min(15, totalFrames)) {
          setIsReady(true);
        }
        if (loaded === totalFrames) {
          setIsReady(true);
          drawFrame(currentFrameRef.current);
        }
      };
      img.onerror = () => {
        loaded++;
        setLoadedCount(loaded);
      };
      images[i] = img;
    }
    imagesRef.current = images;

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    resizeCanvas();
    onScroll();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', onScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [sectionRef, totalFrames, framePathPrefix, prefersReducedMotion]);

  const beat = STORY_BEATS.find((b) => b.id === activeStory);
  // On mobile (<768px), suppress story overlay when at top of page (progress < 0.08)
  // so the hero headline, description, and primary CTA buttons have zero obstruction
  const showStoryOverlay = beat && (!isMobile || progress >= 0.08);

  return (
    <>
      {/* Loading progress indicator */}
      {!isReady && loadedCount < totalFrames && (
        <div
          className="absolute top-20 right-4 md:right-8 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--sand)]/20 bg-[var(--ink)]/90 text-xs font-mono text-[var(--paper)]/80 pointer-events-none shadow"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--copper)] animate-ping" />
          <span>Loading visual frames {Math.round((loadedCount / totalFrames) * 100)}%</span>
        </div>
      )}

      {/* Reduced motion notice if active */}
      {prefersReducedMotion && (
        <div className="absolute top-20 left-4 md:left-8 z-30 px-3 py-1.5 rounded-full border border-[var(--sand)]/20 bg-[var(--ink)]/90 text-xs text-[var(--paper)]/80 pointer-events-none">
          Static view (reduced motion active)
        </div>
      )}

      {/* Hi-DPI canvas — covers full sticky viewport */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'block',
          pointerEvents: 'none',
          opacity: 0.92,
          mixBlendMode: 'screen',
          zIndex: 1,
        }}
      />

      {/* Cinematic Vignettes to eliminate harsh left/right/bottom canvas seams */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#14170F] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#14170F] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#14170F] to-transparent z-10" />

      {/* ── Story overlay ── */}
      <AnimatePresence mode="wait">
        {showStoryOverlay && (
          <motion.div
            key={beat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-20 pointer-events-none left-4 right-4 bottom-6 md:left-auto md:right-12 md:bottom-20 md:max-w-sm rounded-2xl p-5 md:p-6 bg-[#14170F]/85 backdrop-blur-xl border border-[#B5652D]/45 shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
          >
            {/* Tag pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                border: `1px solid ${beat.accent}`,
                background: 'rgba(20, 23, 15, 0.7)',
                marginBottom: '0.75rem',
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: beat.accent,
                  boxShadow: `0 0 10px ${beat.accent}`,
                }}
                className="animate-pulse"
              />
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: beat.accent,
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                {beat.tag}
              </span>
            </div>

            {/* Headline */}
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
                fontWeight: 600,
                lineHeight: 1.3,
                color: 'var(--paper)',
                marginBottom: '0.5rem',
              }}
            >
              {beat.headline}
            </h3>

            {/* Sub */}
            <p
              style={{
                fontSize: '0.8rem',
                lineHeight: 1.6,
                color: 'rgba(244, 241, 233, 0.85)',
              }}
            >
              {beat.sub}
            </p>

            {/* Progress bar for this beat */}
            <div
              style={{
                marginTop: '0.85rem',
                height: 3,
                borderRadius: 3,
                background: 'rgba(244, 241, 233, 0.15)',
                overflow: 'hidden',
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  backgroundColor: beat.accent,
                  borderRadius: 3,
                  width: `${Math.min(
                    100,
                    Math.max(0, ((progress - beat.from) / (beat.to - beat.from)) * 100)
                  )}%`,
                }}
                transition={{ duration: 0.05 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scroll progress dots (right edge on desktop only) ── */}
      <div
        className="hidden md:flex"
        style={{
          position: 'absolute',
          right: '1.25rem',
          top: '50%',
          transform: 'translateY(-50%)',
          flexDirection: 'column',
          gap: '0.5rem',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        {STORY_BEATS.map((b) => {
          const isActive = b.id === activeStory;
          return (
            <motion.div
              key={b.id}
              animate={{
                height: isActive ? 24 : 6,
                backgroundColor: isActive ? b.accent : 'rgba(244,241,233,0.25)',
                opacity: isActive ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
              style={{ width: 3, borderRadius: 3 }}
            />
          );
        })}
      </div>
    </>
  );
}