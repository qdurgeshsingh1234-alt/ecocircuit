import { useEffect, useRef } from 'react';
import { createNoise2D } from 'simplex-noise';

interface Point {
  x: number;
  y: number;
  wave: { x: number; y: number };
}

interface WavesProps {
  className?: string;
  strokeColor?: string;
  backgroundColor?: string;
  pointerSize?: number;
  variant?: 'light' | 'dark';
}

export function Waves({
  className = '',
  backgroundColor = 'transparent',
  variant = 'light',
}: WavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({
    x: -500,
    y: -500,
    sx: -500,
    sy: -500,
    glowX: -500,
    glowY: -500,
  });
  const noiseRef = useRef<((x: number, y: number) => number) | null>(null);
  const rafRef = useRef<number | null>(null);
  const gridRef = useRef<Point[][]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    noiseRef.current = createNoise2D();

    const handleResize = () => {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      buildGrid(rect.width, rect.height);
    };

    const buildGrid = (w: number, h: number) => {
      const xGap = 40;
      const yGap = 22;
      const extraX = 160;
      const extraY = 80;

      const totalLines = Math.ceil((w + extraX) / xGap);
      const totalPoints = Math.ceil((h + extraY) / yGap);

      const xStart = (w - xGap * totalLines) / 2;
      const yStart = (h - yGap * totalPoints) / 2;

      const lines: Point[][] = [];
      for (let i = 0; i < totalLines; i++) {
        const pts: Point[] = [];
        for (let j = 0; j < totalPoints; j++) {
          pts.push({
            x: xStart + xGap * i,
            y: yStart + yGap * j,
            wave: { x: 0, y: 0 },
          });
        }
        lines.push(pts);
      }
      gridRef.current = lines;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0] || !container) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = e.touches[0].clientX - rect.left;
      mouseRef.current.y = e.touches[0].clientY - rect.top;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const render = (time: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx || !noiseRef.current) return;

      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const m = mouseRef.current;
      // Instant, responsive lerp smoothing: 0.65 for magnetic wave, 0.85 for glow
      m.sx += (m.x - m.sx) * 0.65;
      m.sy += (m.y - m.sy) * 0.65;
      m.glowX += (m.x - m.glowX) * 0.85;
      m.glowY += (m.y - m.glowY) * 0.85;

      // Soft ambient proximity spotlight at cursor
      if (m.glowX > -200 && m.glowX < rect.width + 200) {
        const grad = ctx.createRadialGradient(m.glowX, m.glowY, 0, m.glowX, m.glowY, 260);
        grad.addColorStop(0, 'rgba(181, 101, 45, 0.08)');
        grad.addColorStop(0.45, 'rgba(107, 143, 113, 0.035)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, rect.width, rect.height);
      }

      const noise = noiseRef.current;
      const t = time * 0.00035;
      const lines = gridRef.current;
      const isDark = variant === 'dark';

      // Base line stroke color
      const baseAlpha = 0.045;
      const baseColor = isDark
        ? `rgba(244, 241, 233, ${baseAlpha})`
        : `rgba(20, 23, 15, ${baseAlpha})`;

      // Draw the submerged silk-circuit lines
      for (let i = 0; i < lines.length; i++) {
        const pts = lines[i];
        if (pts.length < 2) continue;

        // Calculate smooth silk wave displacement
        for (let j = 0; j < pts.length; j++) {
          const p = pts[j];
          const n = noise(p.x * 0.0012 + t, p.y * 0.0012 + t * 0.5);
          p.wave.x = Math.cos(n * Math.PI * 2) * 14;
          p.wave.y = Math.sin(n * Math.PI * 2) * 8;

          // Subtle magnetic cursor deflection
          const dx = p.x - m.sx;
          const dy = p.y - m.sy;
          const d = Math.hypot(dx, dy);
          if (d < 240 && d > 0) {
            const force = (1 - d / 240) * 12;
            p.wave.x += (dx / d) * force;
            p.wave.y += (dy / d) * force;
          }
        }

        // Draw segmented lines with local proximity brightening
        for (let j = 0; j < pts.length - 1; j++) {
          const p1 = pts[j];
          const p2 = pts[j + 1];

          const x1 = p1.x + p1.wave.x;
          const y1 = p1.y + p1.wave.y;
          const x2 = p2.x + p2.wave.x;
          const y2 = p2.y + p2.wave.y;

          const midX = (x1 + x2) * 0.5;
          const midY = (y1 + y2) * 0.5;
          const dist = Math.hypot(midX - m.sx, midY - m.sy);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);

          if (dist < 240) {
            const prox = 1 - dist / 240;
            const boostAlpha = baseAlpha + prox * 0.14;
            // Warm copper for even lines, emerald for odd lines
            ctx.strokeStyle =
              i % 2 === 0
                ? `rgba(181, 101, 45, ${boostAlpha})`
                : `rgba(47, 78, 58, ${boostAlpha})`;
            ctx.lineWidth = 0.75 + prox * 0.4;
            ctx.stroke();

            // Micro-circuit node illumination along every 5th vertex inside cursor proximity
            if (j % 5 === 0) {
              ctx.beginPath();
              ctx.arc(x1, y1, 1.5, 0, Math.PI * 2);
              ctx.fillStyle =
                i % 2 === 0
                  ? `rgba(181, 101, 45, ${prox * 0.45})`
                  : `rgba(107, 143, 113, ${prox * 0.45})`;
              ctx.fill();
            }
          } else {
            ctx.strokeStyle = baseColor;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [variant]);

  return (
    <div
      ref={containerRef}
      className={`waves-component pointer-events-none select-none overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
    </div>
  );
}
