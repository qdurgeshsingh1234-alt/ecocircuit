import { Link } from 'react-router-dom';
import { Mail, ExternalLink, Leaf } from 'lucide-react';

function LogoMark({ size = 28 }: { size?: number }) {
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

export default function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-[var(--paper)] pt-16 pb-8">
      <div className="max-w-content mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <LogoMark size={32} />
              <span className="text-xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>EcoCircuit</span>
            </div>
            <p className="text-sm text-[var(--paper)]/60 leading-relaxed max-w-xs">
              Helping LPU students and staff recycle electronics safely — from hostel blocks to authorized collection points.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[var(--signal)]">
              <Leaf size={12} />
              <span>Every device recycled matters</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-medium tracking-widest uppercase text-[var(--paper)]/40" style={{ fontFamily: 'var(--font-body)' }}>
              Navigate
            </h4>
            <nav className="flex flex-col gap-2">
              {[
                ['/guide', 'Classification Guide'],
                ['/centers', 'Find a Center'],
                ['/pickup', 'Request Collection'],
                ['/dashboard', 'My Dashboard'],
                ['/admin', 'Admin'],
              ].map(([to, label]) => (
                <Link key={to} to={to} className="text-sm text-[var(--paper)]/70 hover:text-[var(--signal)] transition-colors w-fit">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-medium tracking-widest uppercase text-[var(--paper)]/40" style={{ fontFamily: 'var(--font-body)' }}>
              About
            </h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:ecocircuit@example.com" className="flex items-center gap-2 text-sm text-[var(--paper)]/70 hover:text-[var(--signal)] transition-colors">
                <Mail size={14} />ecocircuit@example.com
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[var(--paper)]/70 hover:text-[var(--signal)] transition-colors">
                <ExternalLink size={14} />GitHub Repository
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--paper)]/10 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <p className="text-xs text-[var(--paper)]/40">© 2024 EcoCircuit — Prototype for Lovely Professional University (Sample data).</p>
          <p className="text-xs text-[var(--paper)]/40 flex items-center gap-1">
            <span className="text-[var(--signal)]">◆</span>
            Built for CHE110 Environmental Studies
          </p>
        </div>
      </div>
    </footer>
  );
}
