import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { Search, MapPin, CalendarCheck, BarChart2, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Search & Classify',
    description:
      'Browse our classification guide to understand which devices count as hazardous e-waste and why proper handling prevents toxic elements leaching into soil.',
    color: '#6B8F71',
    linkText: 'Explore Guide',
    linkTo: '/guide',
  },
  {
    icon: MapPin,
    number: '02',
    title: 'Locate Drop-off',
    description:
      'Locate a verified campus drop-off point near Uni-Mall or academic blocks, or authorized recycler depots across Phagwara and Jalandhar.',
    color: '#B5652D',
    linkText: 'View Map',
    linkTo: '/centers',
  },
  {
    icon: CalendarCheck,
    number: '03',
    title: 'Request Pickup',
    description:
      'Cannot carry heavy equipment? Request a collector visit directly to your hostel block or university department on scheduled days.',
    color: '#2F4E3A',
    linkText: 'Book Slot',
    linkTo: '/pickup',
  },
  {
    icon: BarChart2,
    number: '04',
    title: 'Track Impact',
    description:
      'Monitor real-time metrics — kg diverted from landfills, toxic elements contained safely, and cumulative campus environmental savings.',
    color: '#B5652D',
    linkText: 'View Metrics',
    linkTo: '/dashboard',
  },
];

export default function HowItWorksTimeline() {
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative" style={{ zIndex: 1 }}>
      {steps.map((step, i) => (
        <StepCard key={step.number} step={step} index={i} Icon={step.icon} prefersReduced={prefersReduced} />
      ))}
    </div>
  );
}

function StepCard({
  step,
  index,
  Icon,
  prefersReduced,
}: {
  step: (typeof steps)[number];
  index: number;
  Icon: typeof Search;
  prefersReduced: boolean;
}) {
  const { ref, inView } = useInView({ threshold: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className="h-full bg-[#FAF8F3]/90 border border-[#14170F]/12 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#B5652D]/40 transition-all duration-300 card-3d-tactile flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-3xl font-semibold text-[#B5652D]/80"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {step.number}
          </span>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ backgroundColor: step.color + '18', color: step.color }}
          >
            <Icon size={20} />
          </div>
        </div>

        <h3
          className="text-lg font-bold text-[#14170F] mb-2 leading-snug"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {step.title}
        </h3>
        <p className="text-sm text-[#14170F]/75 leading-relaxed mb-6">
          {step.description}
        </p>
      </div>

      <Link
        to={step.linkTo}
        className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#B5652D] hover:text-[#14170F] transition-colors pt-3 border-t border-[#14170F]/8 group-hover:border-[#B5652D]/30"
      >
        <span>{step.linkText}</span>
        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}
