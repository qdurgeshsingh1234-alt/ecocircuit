import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MapPin, Calendar, BookOpen, ChevronDown, Recycle, Shield, TrendingUp } from 'lucide-react';
import { Button } from '../components/Button';
import { SectionHeading, Reveal } from '../components/ui';
import StatCounter from '../components/StatCounter';
import HowItWorksTimeline from '../components/HowItWorksTimeline';
import ScrollCanvasAnimation from '../components/ScrollCanvasAnimation';
import { Waves } from '../components/ui/wave-background';

gsap.registerPlugin(ScrollTrigger);

function CircuitBg({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 900 600" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.2" opacity="0.4">
        <line x1="0" y1="150" x2="180" y2="150" /><line x1="230" y1="150" x2="420" y2="150" />
        <line x1="470" y1="150" x2="680" y2="150" /><line x1="730" y1="150" x2="900" y2="150" />
        <line x1="0" y1="300" x2="140" y2="300" /><line x1="190" y1="300" x2="380" y2="300" />
        <line x1="430" y1="300" x2="620" y2="300" /><line x1="670" y1="300" x2="900" y2="300" />
        <line x1="0" y1="450" x2="270" y2="450" /><line x1="320" y1="450" x2="520" y2="450" />
        <line x1="570" y1="450" x2="900" y2="450" />
        <line x1="200" y1="80" x2="200" y2="180" /><line x1="200" y1="240" x2="200" y2="330" />
        <line x1="450" y1="60" x2="450" y2="180" /><line x1="450" y1="240" x2="450" y2="390" />
        <line x1="450" y1="420" x2="450" y2="540" /><line x1="700" y1="90" x2="700" y2="180" />
        <line x1="700" y1="240" x2="700" y2="390" /><line x1="700" y1="420" x2="700" y2="540" />
        <polyline points="140,300 140,450 270,450" /><polyline points="570,300 570,450" />
        <rect x="420" y="258" width="60" height="84" rx="4" strokeWidth="1.5" />
        <line x1="420" y1="278" x2="400" y2="278" /><line x1="420" y1="296" x2="400" y2="296" />
        <line x1="480" y1="278" x2="500" y2="278" /><line x1="480" y1="296" x2="500" y2="296" />
        <circle cx="200" cy="150" r="5" fill="none" strokeWidth="1.5" />
        <circle cx="450" cy="150" r="5" fill="none" strokeWidth="1.5" />
        <circle cx="700" cy="150" r="5" fill="none" strokeWidth="1.5" />
        <circle cx="200" cy="300" r="5" fill="none" strokeWidth="1.5" />
        <circle cx="700" cy="300" r="5" fill="none" strokeWidth="1.5" />
        <circle cx="450" cy="300" r="4" fill="currentColor" opacity="0.4" />
        <path d="M810 500 Q828 478 848 500 Q828 522 810 500Z" strokeWidth="1.2" />
        <path d="M52 530 Q70 510 88 530 Q70 550 52 530Z" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

function FloatingParticles() {
  const particles = [
    { id: 0, x: 12, y: 25, size: 3, duration: 6, delay: 0 },
    { id: 1, x: 78, y: 15, size: 4, duration: 8, delay: 1 },
    { id: 2, x: 45, y: 65, size: 2.5, duration: 5, delay: 0.5 },
    { id: 3, x: 88, y: 70, size: 3.5, duration: 7, delay: 2 },
    { id: 4, x: 22, y: 82, size: 3, duration: 6, delay: 1.5 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, backgroundColor: 'var(--signal)', opacity: 0.25 }}
          animate={{ y: [0, -25, 0], opacity: [0.15, 0.45, 0.15] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

const stats = [
  { value: 62, unit: 'Mt', label: 'of e-waste generated globally in 2023', source: 'Global E-waste Monitor 2024', delay: 0 },
  { value: 22.3, unit: '%', label: 'formally collected & recycled worldwide', source: 'Global E-waste Monitor 2024', delay: 0.1 },
  { value: 60, unit: '+', label: 'hazardous substances including lead, mercury & cadmium', source: 'WHO, 2023', delay: 0.2 },
  { value: 91, unit: 'B$', label: 'in raw material value lost annually', source: 'UNITAR / ITU, 2024', delay: 0.3 },
];

const actionCards = [
  { icon: BookOpen, color: 'var(--signal)', theme: 'theme-card-slate', eyebrow: 'Learn', title: 'What counts as e-waste?', body: 'Check whether your item is e-waste, what hazards it contains, and what to do before handing it in.', cta: 'Read the Guide', to: '/guide' },
  { icon: MapPin, color: 'var(--copper)', theme: 'theme-card-copper', eyebrow: 'Locate', title: 'Find a collection point', body: 'Campus drop-off points near hostels and academic blocks, plus authorized recyclers in the Phagwara–Jalandhar area.', cta: 'Open the Map', to: '/centers' },
  { icon: Calendar, color: 'var(--moss)', theme: 'theme-card-emerald', eyebrow: 'Collect', title: 'Request a hostel or department collection', body: "Can't reach a drop-off? Request a collection for your hostel block or department — a collector visits on scheduled days.", cta: 'Request Collection', to: '/pickup' },
];

const trustBadges = [
  { icon: Recycle, text: 'Certified Recycling Partners' },
  { icon: Shield, text: 'Data & Privacy Safe' },
  { icon: TrendingUp, text: 'Real Impact Numbers' },
];

export default function Landing() {
  // heroRef goes on the OUTER 300vh div (the scroll track)
  const heroRef = useRef<HTMLDivElement>(null);
  const circuitRef = useRef<HTMLDivElement>(null);
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Framer scroll progress tracks across the full 300vh outer div
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroTextY = useTransform(scrollYProgress, [0, 0.33], ['0%', '10%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    if (prefersReduced || !circuitRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(circuitRef.current, {
        y: '-20%',
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '33% top', scrub: 1.8 },
      });
    });
    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <main>
      {/* ── Hero: 300vh scroll track + sticky 100vh pin ── */}
      <div ref={heroRef} style={{ position: 'relative', height: '300vh' }}>
        <section
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            backgroundColor: 'var(--ink)',
            overflow: 'hidden',
          }}
        >
          {/* Waves living topographic ripple in hero background */}
          <Waves
            className="absolute inset-0 z-0 opacity-45 pointer-events-none"
            strokeColor="rgba(181, 101, 45, 0.22)"
            variant="dark"
            backgroundColor="transparent"
          />

          {/* Canvas scroll animation — fills full sticky viewport */}
          <ScrollCanvasAnimation sectionRef={heroRef as React.RefObject<HTMLElement>} />

          {/* Circuit SVG parallax background */}
          {!prefersReduced && (
            <div
              ref={circuitRef}
              className="gsap-parallax absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              style={{ willChange: 'transform', zIndex: 2 }}
            >
              <CircuitBg className="w-full h-full max-w-5xl mx-auto" style={{ color: 'var(--signal)' } as React.CSSProperties} />
            </div>
          )}

          {/* Floating particles */}
          {!prefersReduced && <FloatingParticles />}

          {/* Left gradient — keeps text readable over the image */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, var(--ink) 0%, color-mix(in srgb, var(--ink) 80%, transparent) 45%, transparent 100%)',
              zIndex: 3,
            }}
          />
          {/* Bottom fade */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, color-mix(in srgb, var(--ink) 70%, transparent) 0%, transparent 40%)',
              zIndex: 3,
            }}
          />

          {/* Hero text content */}
          <motion.div
            style={{ y: heroTextY, opacity: heroOpacity }}
            className="relative z-10 h-full flex items-center pt-24 md:pt-0 pb-12 md:pb-0"
          >
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 w-full">
              <div style={{ maxWidth: '42rem' }}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#B5652D]/40 bg-[#14170F]/85 backdrop-blur-md mb-5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B5652D] animate-pulse" />
                  <span className="text-xs font-mono font-medium text-[#E4DCC6] tracking-wider uppercase">Campus E-Waste Management — LPU, Phagwara</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-heading font-semibold text-[#F4F1E9] leading-[1.12] mb-6"
                >
                  The world generated{' '}
                  <span className="text-[#B5652D] relative underline decoration-[#B5652D]/40 underline-offset-8">62 million tonnes</span>{' '}
                  of e-waste last year.{' '}
                  <span className="text-[#E4DCC6]/85 font-normal">Only 22% was recycled.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
                  className="text-lg text-[#E4DCC6]/85 max-w-xl leading-relaxed mb-8"
                >
                  EcoCircuit helps LPU students and staff safely dispose of dead phones, chargers, laptops, and more — from your hostel drawer to responsible recycling.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}
                >
                  <Link to="/pickup"><Button size="lg" variant="primary">Request a Collection <ArrowRight size={16} /></Button></Link>
                  <Link to="/guide">
                    <Button size="lg" variant="ghost" className="!text-[#F4F1E9] !border-white/25 hover:!bg-white/10">
                      See How It Works
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }}
                  className="flex flex-wrap gap-4 text-xs font-mono text-[#E4DCC6]/75"
                >
                  {trustBadges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <div key={badge.text} className="flex items-center gap-1.5">
                        <Icon size={14} className="text-[#6B8F71]" />
                        <span>{badge.text}</span>
                      </div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator (desktop only) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-white/35 z-10"
          >
            <span style={{ fontSize: '0.625rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
              <ChevronDown size={16} />
            </motion.div>
          </motion.div>
        </section>
      </div>

      {/* ── Stats strip: commanding dark architectural container ── */}
      <section className="py-14 relative overflow-hidden bg-[#14170F] text-[#F4F1E9] border-y border-[#B5652D]/30 shadow-2xl">
        <div className="max-w-content mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-white/10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-[#B5652D]/15 text-[#E4DCC6] border border-[#B5652D]/35">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B5652D] animate-pulse" />
              Sample Campus Projections & Global Context
            </div>
            <span className="text-xs text-[#E4DCC6]/60 font-mono">UNITAR / ITU / WHO / LPU Baseline Data</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => <StatCounter key={i} {...stat} />)}
          </div>
        </div>
      </section>

      {/* ── Action cards ── */}
      <section className="section-pad relative bg-[#F4F1E9]/88 backdrop-blur-[1px] border-b border-[#14170F]/10">
        <div className="max-w-content mx-auto px-4 md:px-6">
          <SectionHeading
            eyebrow="Take action"
            title="Three ways to make a difference"
            subtitle="Whether you want to learn, locate a drop-off, or request a collection — start wherever makes sense."
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {actionCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <Reveal key={card.to} delay={i * 0.12}>
                  <Link to={card.to} className="block h-full group">
                    <div className="h-full p-8 rounded-2xl bg-[#FAF8F3]/95 border border-[#14170F]/12 hover:border-[#B5652D]/40 transition-all duration-300 card-3d-tactile shadow-sm hover:shadow-md flex flex-col justify-between">
                      <div>
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: card.color + '18',
                            color: card.color,
                            marginBottom: '1.25rem',
                          }}
                        >
                          <Icon size={22} />
                        </div>
                        <p
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: card.color,
                            marginBottom: '0.5rem',
                            fontFamily: 'var(--font-mono, monospace)',
                          }}
                        >
                          {card.eyebrow}
                        </p>
                        <h3 className="text-xl font-bold font-heading text-[#14170F] mb-2">{card.title}</h3>
                        <p className="text-sm text-[#14170F]/75 leading-relaxed mb-6">{card.body}</p>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: card.color,
                        }}
                      >
                        {card.cta} <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works timeline ── */}
      <section className="section-pad relative bg-[#EFECE2]/90 backdrop-blur-[1px] border-b border-[#14170F]/10">
        <div className="max-w-content mx-auto px-4 md:px-6">
          <SectionHeading
            eyebrow="The process"
            title="How EcoCircuit works"
            subtitle="Four steps that close the loop on your e-waste — from your hostel drawer to responsible recycling."
            align="center"
          />
          <div className="mt-14"><HowItWorksTimeline /></div>
        </div>
      </section>

      {/* ── Impact section ── */}
      <section className="section-pad relative bg-[#F4F1E9]/88 backdrop-blur-[1px] border-b border-[#14170F]/10">
        <div className="max-w-content mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal direction="left">
              <SectionHeading
                eyebrow="Your impact, measured"
                title="Every kg diverted is a kg of lead kept out of groundwater"
                subtitle="E-waste contains over 60 hazardous substances. EcoCircuit connects the LPU community to certified processors who recover these materials safely."
              />
              <div className="mt-8 space-y-4">
                {[
                  ['1 laptop recycled', '~4.5 kg diverted from informal disposal (UN Global E-waste Monitor 2024)'],
                  ['1 old TV', '~22 kg including up to 2 kg of lead (Basel Action Network)'],
                  ['10 mobile phones', '~34g gold & 350g silver recovered safely (US EPA e-cycling estimates)'],
                ].map(([item, impact]) => (
                  <div key={item} className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F3]/90 border border-[#14170F]/10 shadow-sm">
                    <div style={{ width: 8, height: 8, marginTop: 6, borderRadius: '50%', backgroundColor: 'var(--signal)', flexShrink: 0 }} />
                    <div>
                      <p className="text-sm font-semibold text-[#14170F]">{item}</p>
                      <p className="text-xs text-[#14170F]/70 mt-1">{impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal direction="right">
              <div style={{ position: 'relative', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    style={{
                      position: 'absolute',
                      borderRadius: '50%',
                      border: '1px solid color-mix(in srgb, var(--signal) 20%, transparent)',
                      width: `${40 + i * 28}%`,
                      height: `${40 + i * 28}%`,
                    }}
                    animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3 + i * 0.8, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
                  />
                ))}
                <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '2rem', backgroundColor: 'var(--moss)', borderRadius: '1rem', boxShadow: '0 25px 50px color-mix(in srgb, var(--moss) 30%, transparent)' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 600, color: 'var(--paper)', fontFamily: 'var(--font-heading)' }}>65.5</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--signal)', marginTop: 4 }}>kg diverted (Sample data)</div>
                  <div style={{ marginTop: 12, height: 1, backgroundColor: 'color-mix(in srgb, var(--paper) 10%, transparent)' }} />
                  <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.75rem', color: 'color-mix(in srgb, var(--paper) 60%, transparent)' }}>
                    <div><div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--paper)', fontFamily: 'var(--font-heading)' }}>3</div>Collections (Sample)</div>
                    <div><div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--paper)', fontFamily: 'var(--font-heading)' }}>6</div>Items</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="section-pad relative overflow-hidden bg-[#14170F] text-[#F4F1E9]">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <CircuitBg className="w-full h-full" style={{ color: 'var(--signal)' } as React.CSSProperties} />
        </div>
        <div className="max-w-content mx-auto px-4 md:px-6 text-center relative z-10">
          <Reveal>
            <p style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--signal)', marginBottom: '0.75rem' }}>Ready to start?</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-[#F4F1E9]">Your old phone is worth more than landfill.</h2>
            <p className="mt-4 text-[#E4DCC6]/75 max-w-md mx-auto leading-relaxed">
              Request a collection for your hostel or department in under two minutes. Every device responsibly recycled keeps hazardous metals out of soil and groundwater.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link to="/pickup"><Button size="lg" variant="primary">Request a Collection <ArrowRight size={16} /></Button></Link>
              <Link to="/centers">
                <Button size="lg" variant="ghost" className="!text-[#F4F1E9] !border-white/25 hover:!bg-white/10">
                  <MapPin size={16} /> Find Drop-off Points
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}