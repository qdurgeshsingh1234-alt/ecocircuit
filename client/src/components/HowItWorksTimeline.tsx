import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { Search, MapPin, CalendarCheck, BarChart2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Learn & Identify',
    description: 'Browse our classification guide to understand which devices count as e-waste and why proper disposal prevents hazardous material leaching into soil.',
    color: 'var(--signal)',
  },
  {
    icon: MapPin,
    number: '02',
    title: 'Find or Request',
    description: 'Locate a campus drop-off point on the interactive map, or request a collection for your hostel block or department on a scheduled collection day.',
    color: 'var(--copper)',
  },
  {
    icon: CalendarCheck,
    number: '03',
    title: 'Hand Over Safely',
    description: 'Bring items to a drop-off point, or hand them to our collector visiting your hostel block or department on scheduled days. Every item is tracked from handover through processing.',
    color: 'var(--moss)',
  },
  {
    icon: BarChart2,
    number: '04',
    title: 'Track Your Impact',
    description: 'Your personal dashboard shows real metrics — kg diverted from landfills, toxic elements contained, and cumulative impact over time.',
    color: 'var(--copper)',
  },
];

export default function HowItWorksTimeline() {
  const lineRef = useRef<SVGLineElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReduced || !lineRef.current) return;
    const line = lineRef.current;
    const totalLength = 1000;
    gsap.set(line, { strokeDasharray: totalLength, strokeDashoffset: totalLength });
    const ctx = gsap.context(() => {
      gsap.to(line, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          end: 'bottom 30%',
          scrub: 1.2,
        },
      });
    });
    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <div ref={containerRef} className="relative">
      <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] pointer-events-none" style={{ zIndex: 0 }}>
        <svg className="w-full overflow-visible" viewBox="0 0 1000 4" preserveAspectRatio="none" style={{ height: '4px' }}>
          <line x1="0" y1="2" x2="1000" y2="2" stroke="var(--sand)" strokeWidth="2" />
          <line ref={lineRef} x1="0" y1="2" x2="1000" y2="2" stroke="var(--signal)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative" style={{ zIndex: 1 }}>
        {steps.map((step, i) => (
          <StepCard key={step.number} step={step} index={i} Icon={step.icon} prefersReduced={prefersReduced} />
        ))}
      </div>
    </div>
  );
}

function StepCard({
  step, index, Icon, prefersReduced,
}: {
  step: typeof steps[number];
  index: number;
  Icon: typeof Search;
  prefersReduced: boolean;
}) {
  const { ref, inView } = useInView({ threshold: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: index * 0.12 }}
      className="relative flex flex-col gap-4"
    >
      {index < steps.length - 1 && (
        <div className="lg:hidden absolute left-6 top-14 w-px h-8 bg-[var(--signal)]/30" />
      )}

      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div
            className="hidden lg:block absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-[var(--sand)] transition-all duration-500"
            style={{ backgroundColor: inView ? step.color : 'var(--sand)' }}
          />
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: step.color + '18', color: step.color }}
          >
            <Icon size={22} />
          </div>
        </div>
        <span className="text-3xl font-semibold text-[var(--ink)]/15" style={{ fontFamily: 'var(--font-heading)' }}>
          {step.number}
        </span>
      </div>

      <h3 className="text-[var(--ink)] leading-snug">{step.title}</h3>
      <p className="text-sm text-[var(--ink)]/60 leading-relaxed">{step.description}</p>
    </motion.div>
  );
}
