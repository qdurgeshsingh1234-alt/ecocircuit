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

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <header className="fixed top-3 inset-x-0 z-50 px-4 sm:px-8 pointer-events-none transition-all duration-300">
      <div className="pointer-events-auto max-w-[1380px] mx-auto h-16 px-5 rounded-2xl bg-[#14170F]/95 backdrop-blur-xl border border-[#F4F1E9]/15 shadow-[0_12px_32px_-8px_rgba(20,23,15,0.45)] flex items-center justify-between">
        {/* Logo with 3D Rotating Hexagonal PCB-Leaf */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
            <LogoMark size={34} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-bold tracking-tight text-[#F4F1E9]">
              EcoCircuit
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full border bg-[#F4F1E9]/10 border-[#F4F1E9]/20 text-[#F4F1E9]/80">
              LPU CAMPUS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation: Centered Dock + 3D CTA */}
        <div className="hidden md:flex items-center gap-4">
          <nav className="flex items-center gap-1.5 p-1 rounded-full border bg-[#F4F1E9]/10 border-[#F4F1E9]/15">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2F4E3A] to-[#3B6349] text-[#F4F1E9] shadow-[0_2px_10px_rgba(107,143,113,0.4)] border border-[#6B8F71]/40 font-semibold'
                      : 'text-[#F4F1E9]/80 hover:text-[#F4F1E9] hover:bg-[#F4F1E9]/10'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.isProtected && (
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold ${
                        isActive
                          ? 'bg-black/25 text-[#F4F1E9]'
                          : 'bg-[#B5652D]/35 text-[#F4F1E9] border border-[#B5652D]/40'
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
          className="flex md:hidden p-2 rounded-xl text-[#F4F1E9] hover:bg-white/10 transition cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="pointer-events-auto mt-2 max-w-[1380px] mx-auto rounded-2xl bg-[#14170F]/95 backdrop-blur-xl border border-[#F4F1E9]/15 shadow-2xl overflow-hidden md:hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-between ${
                      isActive
                        ? 'bg-gradient-to-r from-[#2F4E3A] to-[#3B6349] text-[#F4F1E9] border border-[#6B8F71]/40'
                        : 'text-[#F4F1E9]/80 hover:bg-white/10'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.isProtected && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#B5652D]/30 text-[#F4F1E9] border border-[#B5652D]/40">
                        <Lock size={10} className="inline mr-1" /> PIN Gate
                      </span>
                    )}
                  </Link>
                );
              })}
              <Link
                to="/pickup"
                onClick={() => setMobileOpen(false)}
                className="mt-1 btn-3d-copper py-2.5 text-center text-sm font-semibold rounded-xl block"
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