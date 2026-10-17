import { Link } from 'react-router-dom';
import { Mail, ExternalLink, Leaf, ArrowUp, ShieldCheck, MapPin } from 'lucide-react';

function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 4L34 12V28L20 36L6 28V12L20 4Z" fill="#2F4E3A" stroke="#B5652D" strokeWidth="1.2" />
      <line x1="12" y1="20" x2="18" y2="20" stroke="#6B8F71" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="20" x2="28" y2="20" stroke="#6B8F71" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="12" x2="20" y2="17" stroke="#6B8F71" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="23" x2="20" y2="28" stroke="#6B8F71" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="20" r="3.5" fill="#B5652D" />
      <circle cx="20" cy="20" r="1.5" fill="#F4F1E9" />
      <circle cx="12" cy="20" r="2" fill="none" stroke="#6B8F71" strokeWidth="1.2" />
      <circle cx="28" cy="20" r="2" fill="none" stroke="#6B8F71" strokeWidth="1.2" />
      <circle cx="20" cy="12" r="2" fill="none" stroke="#6B8F71" strokeWidth="1.2" />
      <circle cx="20" cy="28" r="2" fill="none" stroke="#6B8F71" strokeWidth="1.2" />
      <path d="M27 13 Q31 9 31 13 Q27 17 27 13Z" fill="#6B8F71" opacity="0.8" />
    </svg>
  );
}

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#14170F] text-[#F4F1E9] relative overflow-hidden border-t-2 border-[#B5652D]/40">
      {/* Decorative SVG Circuit-Trace & Root Divider along top */}
      <div className="w-full h-8 overflow-hidden opacity-70">
        <svg
          viewBox="0 0 1200 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          <path
            d="M0 16 H240 L260 6 H480 L500 24 H720 L740 10 H960 L980 22 H1200"
            stroke="#B5652D"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <path
            d="M0 24 H180 L200 12 H360 L380 28 H600 L620 14 H840 L860 26 H1200"
            stroke="#2F4E3A"
            strokeWidth="1.2"
          />
          {/* Junction pads & pulsing nodes */}
          <circle cx="260" cy="6" r="3" fill="#B5652D" />
          <circle cx="500" cy="24" r="3" fill="#6B8F71" className="animate-ping" style={{ transformOrigin: '500px 24px' }} />
          <circle cx="500" cy="24" r="2" fill="#6B8F71" />
          <circle cx="740" cy="10" r="3" fill="#B5652D" />
          <circle cx="980" cy="22" r="3" fill="#6B8F71" />
        </svg>
      </div>

      {/* Live Campus Sustainability Telemetry Bar */}
      <div className="border-b border-[#F4F1E9]/10 bg-black/25">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[#F4F1E9]/80">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6B8F71] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#6B8F71]" />
              </span>
              <span className="font-semibold text-[#F4F1E9]">8 Active LPU Drop-off Points</span>
              <span className="text-[10px] text-[#B5652D] bg-[#B5652D]/15 px-1.5 py-0.5 rounded border border-[#B5652D]/30">
                Sample
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B5652D]" />
              <span>7 Regulated E-Waste Categories</span>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <ShieldCheck size={13} className="text-[#6B8F71]" />
              <span>UN GEM 2024 Impact Standard</span>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="btn-3d-moss px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <ArrowUp size={12} />
            <span>Back to Top ↑</span>
          </button>
        </div>
      </div>

      {/* Main Footer Navigation & Directory */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-12 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand & LPU Campus Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <LogoMark size={34} />
              <div className="flex flex-col">
                <span className="text-xl font-bold font-serif text-[#F4F1E9]">EcoCircuit</span>
                <span className="text-[10px] font-mono tracking-widest text-[#B5652D] uppercase">
                  Lovely Professional University
                </span>
              </div>
            </div>
            <p className="text-sm text-[#F4F1E9]/70 leading-relaxed max-w-md">
              A student-led circular electronics initiative for LPU Phagwara. We help students and faculty safely channel end-of-life devices out of hostel drawers and into authorized recycling pipelines.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#6B8F71] font-mono">
              <Leaf size={14} />
              <span>Zero informal burning · Zero groundwater landfill leaching</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-[#B5652D]">
              Navigation
            </h4>
            <nav className="flex flex-col gap-2">
              {[
                ['/guide', 'Classification Guide'],
                ['/centers', 'Find a Center'],
                ['/pickup', 'Request Hostel Collection'],
                ['/dashboard', 'My Impact Dashboard'],
                ['/admin', 'Collector Portal (PIN 2026)'],
              ].map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm text-[#F4F1E9]/70 hover:text-[#E4DCC6] hover:translate-x-1 transition-all w-fit"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact & Campus Attribution */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-[#B5652D]">
              Campus Contact
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-[#F4F1E9]/70">
              <a
                href="mailto:ecocircuit.lpu@phagwara.in"
                className="flex items-center gap-2 hover:text-[#E4DCC6] transition-colors"
              >
                <Mail size={14} className="text-[#B5652D]" />
                <span>ecocircuit.lpu@phagwara.in (Sample)</span>
              </a>
              <div className="flex items-start gap-2 text-xs opacity-75">
                <MapPin size={14} className="text-[#6B8F71] shrink-0 mt-0.5" />
                <span>LPU Campus, NH-44, Phagwara, Punjab 144411</span>
              </div>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#E4DCC6] transition-colors pt-1"
              >
                <ExternalLink size={14} className="text-[#B5652D]" />
                <span>Project GitHub Repository</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Assignment Attribution */}
        <div className="border-t border-[#F4F1E9]/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F4F1E9]/50">
          <p>© 2026 EcoCircuit — Lovely Professional University (CHE110 Environmental Studies).</p>
          <p className="flex items-center gap-2">
            <span className="text-[#6B8F71]">◆</span>
            <span>All campus points, dates & metrics are Sample Data for academic demonstration.</span>
          </p>
        </div>
      </div>

      {/* Subtle Oversized Typographic Watermark */}
      <div className="text-[7vw] font-serif font-bold tracking-tighter text-[#F4F1E9]/[0.03] select-none pointer-events-none leading-none text-center pb-2">
        ECOCIRCUIT // LPU
      </div>
    </footer>
  );
}
