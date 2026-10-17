import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Lock } from 'lucide-react';

const navLinks = [
  { to: '/guide', label: 'Guide' },
  { to: '/centers', label: 'Find a Center' },
  { to: '/dashboard', label: 'Impact Dashboard' },
  { to: '/admin', label: 'Collector Portal', isProtected: true },
];

function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="transition-transform duration-300 transform-gpu"
    >
      <path d="M20 4L34 12V28L20 36L6 28V12L20 4Z" fill="#2F4E3A" stroke="#B5652D" strokeWidth="1.2" />
      <line x1="12" y1="20" x2="18" y2="20" stroke="#6B8F71" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="20" x2="28" y2="20" stroke="#6B8F71" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="12" x2="20" y2="17" stroke="#6B8F71" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="23" x2="20" y2="28" stroke="#6B8F71" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="20" r="3.5" fill="#B5652D" className="animate-[pulseCopper_2s_infinite]" />
      <circle cx="20" cy="20" r="1.5" fill="#F4F1E9" />
      <circle cx="12" cy="20" r="2" fill="none" stroke="#6B8F71" strokeWidth="1.2" />
      <circle cx="28" cy="20" r="2" fill="none" stroke="#6B8F71" strokeWidth="1.2" />
      <circle cx="20" cy="12" r="2" fill="none" stroke="#6B8F71" strokeWidth="1.2" />
      <circle cx="20" cy="28" r="2" fill="none" stroke="#6B8F71" strokeWidth="1.2" />
      <path d="M27 13 Q31 9 31 13 Q27 17 27 13Z" fill="#6B8F71" opacity="0.85" />
    </svg>
  );
}

// Hero scroll ends at ~300vh on the landing page
const HERO_SCROLL_END_VH = 300;

export default function Nav() {
  const [scrollState, setScrollState] = useState<'top' | 'animation' | 'solid'>('top');
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      if (location.pathname !== '/') {
        setScrollState(scrollY > 20 ? 'solid' : 'top');
        return;
      }

      const heroEnd = (HERO_SCROLL_END_VH / 100) * vh;
      if (scrollY <= 40) {
        setScrollState('top');
      } else if (scrollY < heroEnd - vh * 0.1) {
        setScrollState('animation');
      } else {
        setScrollState('solid');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => setMobileOpen(false), [location]);

  const isHome = location.pathname === '/';
  const isDark = isHome && (scrollState === 'top' || scrollState === 'animation');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDark
          ? 'bg-[#14170F]/85 backdrop-blur-md border-b border-[#F4F1E9]/10'
          : 'bg-[#F4F1E9]/90 backdrop-blur-md border-b border-[#14170F]/10 shadow-[0_4px_12px_rgba(20,23,15,0.05)]'
      }`}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between h-16 px-4 sm:px-8">
        {/* Logo with 3D Rotating Hexagonal PCB-Leaf */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
            <LogoMark size={34} />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`font-serif text-xl font-bold tracking-tight transition-colors duration-200 ${
                isDark ? 'text-[#F4F1E9]' : 'text-[#14170F]'
              }`}
            >
              EcoCircuit
            </span>
            <span
              className={`hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isDark
                  ? 'bg-[#F4F1E9]/10 border-[#F4F1E9]/20 text-[#F4F1E9]/70'
                  : 'bg-[#14170F]/5 border-[#14170F]/10 text-[#14170F]/60'
              }`}
            >
              LPU CAMPUS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation: Centered Tactile Pill Dock + 3D Button */}
        <div className="hidden md:flex items-center gap-4">
          <nav
            className={`flex items-center gap-1 p-1 rounded-full border ${
              isDark
                ? 'bg-[#F4F1E9]/10 border-[#F4F1E9]/15'
                : 'bg-[#14170F]/5 border-[#14170F]/10'
            }`}
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? isDark
                        ? 'bg-[#B5652D] text-[#F4F1E9] shadow-xs'
                        : 'bg-[#2F4E3A] text-[#F4F1E9] shadow-xs'
                      : isDark
                      ? 'text-[#F4F1E9]/80 hover:text-[#F4F1E9] hover:bg-[#F4F1E9]/10'
                      : 'text-[#14170F]/70 hover:text-[#14170F] hover:bg-[#14170F]/10'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.isProtected && (
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold ${
                        isActive
                          ? 'bg-black/20 text-[#F4F1E9]'
                          : isDark
                          ? 'bg-[#B5652D]/30 text-[#F4F1E9]'
                          : 'bg-[#B5652D]/15 text-[#B5652D]'
                      }`}
                    >
                      <Lock size={9} className="mr-0.5 inline" /> PIN
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Request Collection CTA with .btn-3d-copper */}
          <Link
            to="/pickup"
            className="btn-3d-copper px-4 py-2 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer no-underline"
          >
            Request Collection
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className={`flex md:hidden p-2 rounded-xl transition cursor-pointer ${
            isDark ? 'text-[#F4F1E9] hover:bg-white/10' : 'text-[#14170F] hover:bg-black/5'
          }`}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="md:hidden overflow-hidden border-b border-[#14170F]/10 bg-[#F4F1E9]/95 backdrop-blur-xl shadow-xl"
          >
            <div className="px-5 py-4 flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-between ${
                      isActive
                        ? 'bg-[#2F4E3A] text-[#F4F1E9]'
                        : 'text-[#14170F] hover:bg-black/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.isProtected && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#B5652D]/20 text-[#B5652D]">
                        <Lock size={10} className="inline mr-1" /> PIN Gate
                      </span>
                    )}
                  </Link>
                );
              })}
              <Link
                to="/pickup"
                onClick={() => setMobileOpen(false)}
                className="mt-2 btn-3d-copper py-2.5 text-center text-sm font-semibold rounded-xl block"
              >
                Request Collection
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}