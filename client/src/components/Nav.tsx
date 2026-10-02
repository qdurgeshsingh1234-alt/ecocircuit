import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/guide', label: 'Guide' },
  { to: '/centers', label: 'Find a Center' },
  { to: '/pickup', label: 'Request Collection' },
  { to: '/dashboard', label: 'Dashboard' },
];

function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 4L34 12V28L20 36L6 28V12L20 4Z" fill="var(--moss)" />
      <line x1="12" y1="20" x2="18" y2="20" stroke="#6B8F71" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="22" y1="20" x2="28" y2="20" stroke="#6B8F71" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20" y1="12" x2="20" y2="17" stroke="#6B8F71" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20" y1="23" x2="20" y2="28" stroke="#6B8F71" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="20" cy="20" r="3.5" fill="var(--copper)" />
      <circle cx="20" cy="20" r="1.5" fill="#F4F1E9" />
      <circle cx="12" cy="20" r="2" fill="none" stroke="#6B8F71" strokeWidth="1.2"/>
      <circle cx="28" cy="20" r="2" fill="none" stroke="#6B8F71" strokeWidth="1.2"/>
      <circle cx="20" cy="12" r="2" fill="none" stroke="#6B8F71" strokeWidth="1.2"/>
      <circle cx="20" cy="28" r="2" fill="none" stroke="#6B8F71" strokeWidth="1.2"/>
      <path d="M27 13 Q31 9 31 13 Q27 17 27 13Z" fill="var(--signal)" opacity="0.8"/>
    </svg>
  );
}

// HERO_SCROLL_HEIGHT_VH: the hero section uses 300vh, so the animation ends at 300vh from top
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
        // Non-home pages: always solid after tiny scroll
        setScrollState(scrollY > 40 ? 'solid' : 'top');
        return;
      }

      // Home page: transparent through 300vh animation, solid after
      const heroEnd = (HERO_SCROLL_END_VH / 100) * vh;
      if (scrollY <= 40) {
        setScrollState('top');
      } else if (scrollY < heroEnd - vh * 0.1) {
        // still inside the animation scroll track — stay transparent
        setScrollState('animation');
      } else {
        // past the animation — go solid
        setScrollState('solid');
      }
    };

    handleScroll(); // run on mount
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => setMobileOpen(false), [location]);

  const isHome = location.pathname === '/';
  // isDark only applies on the home page while the dark hero animation is showing
  const isDark = isHome && (scrollState === 'top' || scrollState === 'animation');
  const isSolid = scrollState === 'solid';

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
        background: isSolid || !isHome
          ? 'rgba(244, 241, 233, 0.96)'
          : isDark && scrollState === 'animation'
          ? 'rgba(20, 23, 15, 0.25)'
          : 'transparent',
        backdropFilter: isSolid || !isHome ? 'blur(12px)' : scrollState === 'animation' ? 'blur(8px)' : 'none',
        borderBottom: isSolid || !isHome ? '1px solid var(--sand)' : '1px solid transparent',
        boxShadow: isSolid || !isHome ? '0 1px 12px rgba(20,23,15,0.06)' : 'none',
      }}
    >
      <div className="max-w-[1280px] mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div whileHover={{ rotate: 15, scale: 1.08 }} transition={{ duration: 0.2 }}>
            <LogoMark size={34} />
          </motion.div>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: isDark ? 'var(--paper)' : 'var(--ink)',
              transition: 'color 0.3s ease',
            }}
          >
            EcoCircuit
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  position: 'relative',
                  padding: '0.375rem 0.875rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isDark
                    ? isActive ? 'var(--copper)' : 'rgba(244,241,233,0.8)'
                    : isActive ? 'var(--moss)' : 'rgba(20,23,15,0.7)',
                  transition: 'color 0.25s ease, background 0.2s ease',
                  textDecoration: 'none',
                }}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '0.5rem',
                      pointerEvents: 'none',
                      background: isDark ? 'rgba(181,101,45,0.15)' : 'rgba(47,78,58,0.08)',
                      border: `1px solid ${isDark ? 'rgba(181,101,45,0.3)' : 'rgba(47,78,58,0.2)'}`,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
          <Link
            to="/pickup"
            style={{
              marginLeft: '0.75rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--copper)',
              color: 'var(--paper)',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderRadius: '0.5rem',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              boxShadow: isDark ? '0 0 0 1px rgba(255,255,255,0.15)' : 'none',
            }}
          >
            Request Collection
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          style={{
            display: 'flex',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            color: isDark ? 'var(--paper)' : 'var(--ink)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ background: 'var(--paper)', borderBottom: '1px solid var(--sand)', overflow: 'hidden' }}
            className="md:hidden shadow-lg"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--ink)] hover:bg-[var(--sand)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/pickup"
                className="mt-2 px-4 py-2.5 bg-[var(--copper)] text-[var(--paper)] text-sm font-medium rounded-lg text-center"
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