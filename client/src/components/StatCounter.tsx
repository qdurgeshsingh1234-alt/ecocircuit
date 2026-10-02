import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';

interface StatCounterProps {
  value: number;
  unit: string;
  label: string;
  source: string;
  delay?: number;
}

export default function StatCounter({ value, unit, label, source, delay = 0 }: StatCounterProps) {
  const { ref, inView } = useInView({ threshold: 0.3 });
  const [displayed, setDisplayed] = useState(0);
  const animRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayed(value);
      return;
    }
    const duration = 1800;
    const startTime = performance.now() + delay * 1000;
    const tick = (now: number) => {
      if (now < startTime) { animRef.current = requestAnimationFrame(tick); return; }
      if (!startRef.current) startRef.current = now;
      const progress = Math.min((now - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * value * 10) / 10);
      if (progress < 1) animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); startRef.current = undefined; };
  }, [inView, value, delay]);

  const formatted = value % 1 !== 0 ? displayed.toFixed(1) : Math.round(displayed).toString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay }}
      className="space-y-2 group"
    >
      <div className="flex items-end gap-1.5">
        <span
          className="text-4xl md:text-5xl font-semibold text-[var(--paper)] tabular-nums group-hover:text-[var(--copper)] transition-colors duration-300"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {formatted}
        </span>
        <span className="text-xl font-medium text-[var(--signal)] mb-1">{unit}</span>
      </div>
      <p className="text-sm text-[var(--paper)]/65 leading-snug">{label}</p>
      <p className="text-xs text-[var(--paper)]/35">— {source}</p>
    </motion.div>
  );
}
