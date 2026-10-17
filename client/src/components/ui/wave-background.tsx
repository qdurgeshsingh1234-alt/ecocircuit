import * as React from 'react';
import { useEffect, useRef } from 'react';
import { createNoise2D } from 'simplex-noise';

interface Point {
  x: number;
  y: number;
  wave: { x: number; y: number };
  cursor: {
    x: number;
    y: number;
    vx: number;
    vy: number;
  };
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
  strokeColor = 'rgba(181, 101, 45, 0.18)',
  backgroundColor = 'transparent',
  pointerSize = 0.65,
  variant = 'light',
}: WavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const mouseRef = useRef({
    x: -100,
    y: -100,
    lx: 0,
    ly: 0,
    sx: -100,
    sy: -100,
    v: 0,
    vs: 0,
    a: 0,
    set: false,
  });
  const pathsRef = useRef<SVGPathElement[]>([]);
  const linesRef = useRef<Point[][]>([]);
  const noiseRef = useRef<((x: number, y: number) => number) | null>(null);
  const rafRef = useRef<number | null>(null);
  const boundingRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    noiseRef.current = createNoise2D();
    setSize();
    setLines();

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [strokeColor]);

  const setSize = () => {
    if (!containerRef.current || !svgRef.current) return;
    boundingRef.current = containerRef.current.getBoundingClientRect();
    const { width, height } = boundingRef.current;
    svgRef.current.style.width = `${width}px`;
    svgRef.current.style.height = `${height}px`;
  };

  const setLines = () => {
    if (!svgRef.current || !boundingRef.current) return;

    const { width, height } = boundingRef.current;
    linesRef.current = [];

    pathsRef.current.forEach((path) => path.remove());
    pathsRef.current = [];

    const xGap = 18;
    const yGap = 18;

    const oWidth = width + 160;
    const oHeight = height + 40;

    const totalLines = Math.ceil(oWidth / xGap);
    const totalPoints = Math.ceil(oHeight / yGap);

    const xStart = (width - xGap * totalLines) / 2;
    const yStart = (height - yGap * totalPoints) / 2;

    for (let i = 0; i < totalLines; i++) {
      const points: Point[] = [];
      for (let j = 0; j < totalPoints; j++) {
        points.push({
          x: xStart + xGap * i,
          y: yStart + yGap * j,
          wave: { x: 0, y: 0 },
          cursor: { x: 0, y: 0, vx: 0, vy: 0 },
        });
      }

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.classList.add('a__line', 'js-line');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', i % 3 === 0 ? 'rgba(47, 78, 58, 0.16)' : strokeColor);
      path.setAttribute('stroke-width', '1.1');

      svgRef.current.appendChild(path);
      pathsRef.current.push(path);
      linesRef.current.push(points);
    }
  };

  const onResize = () => {
    setSize();
    setLines();
  };

  const onMouseMove = (e: MouseEvent) => {
    updateMousePosition(e.clientX, e.clientY);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!e.touches[0]) return;
    updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
  };

  const updateMousePosition = (x: number, y: number) => {
    if (!boundingRef.current) return;
    const mouse = mouseRef.current;
    mouse.x = x - boundingRef.current.left;
    mouse.y = y - boundingRef.current.top;

    if (!mouse.set) {
      mouse.sx = mouse.x;
      mouse.sy = mouse.y;
      mouse.lx = mouse.x;
      mouse.ly = mouse.y;
      mouse.set = true;
    }

    if (containerRef.current) {
      containerRef.current.style.setProperty('--x', `${mouse.sx}px`);
      containerRef.current.style.setProperty('--y', `${mouse.sy}px`);
    }
  };

  const movePoints = (time: number) => {
    const { current: lines } = linesRef;
    const { current: mouse } = mouseRef;
    const { current: noise } = noiseRef;
    if (!noise) return;

    lines.forEach((points) => {
      points.forEach((p: Point) => {
        const move =
          noise((p.x + time * 0.008) * 0.003, (p.y + time * 0.003) * 0.002) * 8;

        p.wave.x = Math.cos(move) * 12;
        p.wave.y = Math.sin(move) * 6;

        const dx = p.x - mouse.sx;
        const dy = p.y - mouse.sy;
        const d = Math.hypot(dx, dy);
        const l = Math.max(190, mouse.vs);

        if (d < l) {
          const s = 1 - d / l;
          const f = Math.cos(d * 0.001) * s;
          p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00042;
          p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00042;
        }

        p.cursor.vx += (0 - p.cursor.x) * 0.012;
        p.cursor.vy += (0 - p.cursor.y) * 0.012;
        p.cursor.vx *= 0.94;
        p.cursor.vy *= 0.94;

        p.cursor.x += p.cursor.vx;
        p.cursor.y += p.cursor.vy;

        p.cursor.x = Math.min(55, Math.max(-55, p.cursor.x));
        p.cursor.y = Math.min(55, Math.max(-55, p.cursor.y));
      });
    });
  };

  const moved = (point: Point, withCursorForce = true) => ({
    x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
    y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
  });

  const drawLines = () => {
    const { current: lines } = linesRef;
    const { current: paths } = pathsRef;

    lines.forEach((points, lIndex) => {
      if (points.length < 2 || !paths[lIndex]) return;
      const firstPoint = moved(points[0], false);
      let d = `M ${firstPoint.x} ${firstPoint.y}`;
      for (let i = 1; i < points.length; i++) {
        const current = moved(points[i]);
        d += `L ${current.x} ${current.y}`;
      }
      paths[lIndex].setAttribute('d', d);
    });
  };

  const tick = (time: number) => {
    const { current: mouse } = mouseRef;

    mouse.sx += (mouse.x - mouse.sx) * 0.12;
    mouse.sy += (mouse.y - mouse.sy) * 0.12;

    const dx = mouse.x - mouse.lx;
    const dy = mouse.y - mouse.ly;
    const d = Math.hypot(dx, dy);

    mouse.v = d;
    mouse.vs += (d - mouse.vs) * 0.1;
    mouse.vs = Math.min(100, mouse.vs);

    mouse.lx = mouse.x;
    mouse.ly = mouse.y;
    mouse.a = Math.atan2(dy, dx);

    if (containerRef.current) {
      containerRef.current.style.setProperty('--x', `${mouse.sx}px`);
      containerRef.current.style.setProperty('--y', `${mouse.sy}px`);
    }

    movePoints(time);
    drawLines();

    rafRef.current = requestAnimationFrame(tick);
  };

  return (
    <div
      ref={containerRef}
      className={`waves-component pointer-events-none select-none overflow-hidden ${className}`}
      style={
        {
          backgroundColor,
          '--x': '-100px',
          '--y': '50%',
        } as React.CSSProperties
      }
    >
      {/* Dynamic Cursor Ambient Halo */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background:
            variant === 'dark'
              ? 'radial-gradient(650px circle at var(--x) var(--y), rgba(181, 101, 45, 0.16), rgba(47, 78, 58, 0.12) 40%, transparent 75%)'
              : 'radial-gradient(600px circle at var(--x) var(--y), rgba(181, 101, 45, 0.18), rgba(47, 78, 58, 0.12) 45%, transparent 75%)',
        }}
      />
      <svg ref={svgRef} className="block w-full h-full js-svg relative z-10" xmlns="http://www.w3.org/2000/svg" />
      <div
        className="pointer-dot z-20"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${pointerSize}rem`,
          height: `${pointerSize}rem`,
          background: '#B5652D',
          boxShadow: '0 0 16px 4px rgba(181, 101, 45, 0.55)',
          borderRadius: '50%',
          transform: 'translate3d(calc(var(--x) - 50%), calc(var(--y) - 50%), 0)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}

