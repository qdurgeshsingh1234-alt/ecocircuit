import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollCanvasAnimationProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  totalFrames?: number;
  framePathPrefix?: string;
}

// Story beats: each fires at a % of total animation progress
// and shows a label + headline + sub
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
    accent: '#B8A36A',
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
  framePathPrefix = '/scroll_animation/ezgif-frame-',
}: ScrollCanvasAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [activeStory, setActiveStory] = useState<string | null>('assembled');
  const [progress, setProgress] = useState(0);

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

    // ── Draw frame with object-fit:cover ───────────────────────────
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

      // Object-fit: contain with slight zoom (95% of viewport coverage)
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

      const frameIndex = Math.min(Math.floor(p * (totalFrames - 1)), totalFrames - 1);
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
      }
    };

    // ── Preload all frames ───────────────────────────────────────────
    const images: HTMLImageElement[] = new Array(totalFrames);
    let loaded = 0;

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.decoding = 'async';
      const idx = i;
      const padded = String(i + 1).padStart(3, '0');
      img.src = `${framePathPrefix}${padded}.png`;
      img.onload = () => {
        loaded++;
        if (idx === 0) { resizeCanvas(); drawFrame(0); }
        if (loaded === totalFrames) drawFrame(currentFrameRef.current);
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
  }, [sectionRef, totalFrames, framePathPrefix]);

  const beat = STORY_BEATS.find((b) => b.id === activeStory);

  return (
    <>
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

      {/* ── Story overlay ── rendered on the RIGHT half, lower ── */}
      <AnimatePresence mode="wait">
        {beat && (
          <motion.div
            key={beat.id}
            initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              right: '3rem',
              bottom: '5rem',
              maxWidth: '22rem',
              zIndex: 20,
              pointerEvents: 'none',
            }}
          >
            {/* Tag pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              border: `1px solid ${beat.accent}55`,
              background: `${beat.accent}18`,
              marginBottom: '0.75rem',
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                backgroundColor: beat.accent,
                boxShadow: `0 0 6px ${beat.accent}`,
              }} />
              <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: beat.accent, fontFamily: 'var(--font-body)' }}>
                {beat.tag}
              </span>
            </div>

            {/* Headline */}
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
              fontWeight: 500,
              lineHeight: 1.25,
              color: 'var(--paper)',
              marginBottom: '0.6rem',
              textShadow: '0 2px 16px rgba(0,0,0,0.5)',
            }}>
              {beat.headline}
            </h3>

            {/* Sub */}
            <p style={{
              fontSize: '0.8rem',
              lineHeight: 1.65,
              color: 'rgba(244,241,233,0.65)',
              textShadow: '0 1px 8px rgba(0,0,0,0.5)',
            }}>
              {beat.sub}
            </p>

            {/* Progress bar for this beat */}
            <div style={{
              marginTop: '1rem',
              height: 2,
              borderRadius: 2,
              background: 'rgba(244,241,233,0.12)',
              overflow: 'hidden',
            }}>
              <motion.div
                style={{
                  height: '100%',
                  backgroundColor: beat.accent,
                  borderRadius: 2,
                  width: `${Math.min(100, Math.max(0, ((progress - beat.from) / (beat.to - beat.from)) * 100))}%`,
                }}
                transition={{ duration: 0.05 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scroll progress dots (right edge) ── */}
      <div style={{
        position: 'absolute',
        right: '1.25rem',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        zIndex: 20,
        pointerEvents: 'none',
      }}>
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