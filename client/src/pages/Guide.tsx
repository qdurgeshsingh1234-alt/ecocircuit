import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Calendar,
  ChevronDown,
  Battery,
  Wrench,
  XCircle,
  ShieldAlert,
  Ban,
  Flame,
  Megaphone,
  Sparkles,
  Monitor,
  Cpu,
  Lightbulb,
  Cable,
  Refrigerator,
  HardDrive,
  X,
  ArrowRight,
} from 'lucide-react';
import { SectionHeading } from '../components/ui';
import { CATEGORIES } from '../data/categories';
import { GUIDE_ITEMS, type GuideItem, type GuideVerdict } from '../data/guideItems';

// ── Icon map for category accordions ────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  Monitor,
  Battery,
  Cpu,
  Lightbulb,
  Cable,
  Refrigerator,
};

// ── Metadata & Theme Mapping ──────────────────────────────────────────────────
interface ItemTheme {
  cardClass: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  iconColor: string;
}

function getItemTheme(item: GuideItem): ItemTheme {
  if (item.verdict === 'Special handling' || item.categorySlug === 'batteries' || item.categorySlug === 'lighting') {
    return {
      cardClass: 'theme-card-hazard',
      accentColor: '#9B4A3E',
      badgeBg: 'rgba(155, 74, 62, 0.15)',
      badgeText: '#9B4A3E',
      iconBg: 'rgba(155, 74, 62, 0.15)',
      iconColor: '#9B4A3E',
    };
  }
  if (item.categorySlug === 'it-equipment' || item.categorySlug === 'mobiles-accessories') {
    return {
      cardClass: 'theme-card-emerald',
      accentColor: '#2F4E3A',
      badgeBg: 'rgba(47, 78, 58, 0.15)',
      badgeText: '#2F4E3A',
      iconBg: 'rgba(47, 78, 58, 0.15)',
      iconColor: '#2F4E3A',
    };
  }
  if (item.verdict === 'Repair or reuse first' || item.verdict === 'Not e-waste') {
    return {
      cardClass: 'theme-card-slate',
      accentColor: '#3B6E8C',
      badgeBg: 'rgba(59, 110, 140, 0.15)',
      badgeText: '#3B6E8C',
      iconBg: 'rgba(59, 110, 140, 0.15)',
      iconColor: '#3B6E8C',
    };
  }
  return {
    cardClass: 'theme-card-copper',
    accentColor: '#B5652D',
    badgeBg: 'rgba(181, 101, 45, 0.15)',
    badgeText: '#B5652D',
    iconBg: 'rgba(181, 101, 45, 0.15)',
    iconColor: '#B5652D',
  };
}

const METADATA_BY_CAT: Record<string, { mass: string; co2: string; hazard: 'Low' | 'Medium' | 'High' }> = {
  'it-equipment': { mass: '~2.1 kg', co2: '~3.0 kg', hazard: 'Medium' },
  'mobiles-accessories': { mass: '~0.18 kg', co2: '~0.26 kg', hazard: 'Low' },
  'batteries': { mass: '~0.08 kg', co2: '~0.12 kg', hazard: 'High' },
  'large-appliances': { mass: '~28 kg', co2: '~40.3 kg', hazard: 'Medium' },
  'small-appliances': { mass: '~1.2 kg', co2: '~1.7 kg', hazard: 'Low' },
  'lighting': { mass: '~0.15 kg', co2: '~0.22 kg', hazard: 'High' },
  'cables-peripherals': { mass: '~0.25 kg', co2: '~0.36 kg', hazard: 'Low' },
};

// ── Hover-Reveal Card Component ───────────────────────────────────────────────
function HoverRevealItemCard({
  item,
  onOpenModal,
}: {
  item: GuideItem;
  onOpenModal: (item: GuideItem) => void;
}) {
  const theme = getItemTheme(item);
  const metadata = item.categorySlug
    ? METADATA_BY_CAT[item.categorySlug] || { mass: '~0.5 kg', co2: '~0.7 kg', hazard: 'Low' }
    : { mass: 'N/A', co2: '0 kg', hazard: item.verdict === 'Special handling' ? 'High' : 'Low' };

  return (
    <div
      onClick={() => onOpenModal(item)}
      className={`${theme.cardClass} h-[270px] relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 select-none`}
    >
      {/* Top Accent Strip */}
      <div
        className="absolute top-0 inset-x-0 h-1.5"
        style={{ backgroundColor: theme.accentColor }}
      />

      {/* Row 1: Status Pill & 3D Category Icon Box */}
      <div className="flex items-start justify-between gap-3">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase font-mono"
          style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
        >
          {item.verdict === 'Special handling' ? (
            <AlertTriangle size={12} />
          ) : item.verdict === 'Repair or reuse first' ? (
            <Wrench size={12} />
          ) : item.verdict === 'Not e-waste' ? (
            <XCircle size={12} />
          ) : (
            <CheckCircle2 size={12} />
          )}
          {item.verdict}
        </span>

        <div
          className="w-11 h-11 rounded-xl shadow-xs border border-[#14170F]/15 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform"
          style={{ backgroundColor: theme.iconBg, color: theme.iconColor }}
        >
          {item.categorySlug === 'mobiles-accessories' ? (
            <Cpu size={20} />
          ) : item.categorySlug === 'batteries' ? (
            <Battery size={20} />
          ) : item.categorySlug === 'lighting' ? (
            <Lightbulb size={20} />
          ) : item.categorySlug === 'cables-peripherals' ? (
            <Cable size={20} />
          ) : item.categorySlug === 'large-appliances' ? (
            <Refrigerator size={20} />
          ) : (
            <Monitor size={20} />
          )}
        </div>
      </div>

      {/* Middle: Title & Category Subtitle */}
      <div className="space-y-1">
        <h4 className="text-xl font-serif font-bold text-[#14170F] leading-snug line-clamp-2">
          {item.name}
        </h4>
        <span
          className="text-[11px] font-mono font-bold tracking-wider uppercase block"
          style={{ color: theme.accentColor }}
        >
          {item.categorySlug ? item.categorySlug.replace('-', ' ') : 'General Campus Item'}
        </span>
      </div>

      {/* Bottom Row (At Rest): Visual Impact Strip & Hover Prompt */}
      <div className="flex items-center justify-between pt-3 border-t border-[#14170F]/10">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#14170F]/8 text-[#14170F]">
            ⚡ {metadata.mass}
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#2F4E3A]/12 text-[#2F4E3A]">
            🌱 {metadata.co2}
          </span>
        </div>
        <span className="text-[11px] font-mono font-semibold text-[#B5652D] group-hover:opacity-0 transition-opacity">
          Hover →
        </span>
      </div>

      {/* ── Hover-Reveal Drawer (Slides Up on Group Hover) ── */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-[#14170F]/95 backdrop-blur-md text-[#F4F1E9] p-5 rounded-t-2xl border-t-2 border-[#B5652D] flex flex-col justify-between h-[84%] z-10 shadow-2xl">
        <div className="space-y-2">
          <p className="text-xs text-[#F4F1E9]/80 leading-relaxed line-clamp-2">
            {item.reason}
          </p>

          {item.beforeYouHandIn.length > 0 && (
            <div className="text-[11px] font-mono text-[#6B8F71] flex items-center gap-1.5 pt-1">
              <Sparkles size={12} className="text-[#B5652D] shrink-0" />
              <span className="line-clamp-1">Rule 1: {item.beforeYouHandIn[0]}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t border-[#F4F1E9]/15">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(item);
            }}
            className="w-full py-1.5 rounded-lg text-xs font-mono font-semibold text-[#E4DCC6] bg-[#F4F1E9]/10 hover:bg-[#F4F1E9]/20 transition flex items-center justify-center gap-1"
          >
            <span>View Full Checklist ({item.beforeYouHandIn.length} steps)</span>
            <ArrowRight size={11} />
          </button>

          <div className="flex items-center gap-2">
            {item.categorySlug && (
              <>
                <Link
                  to={`/centers?category=${item.categorySlug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 py-1.5 text-center text-xs font-medium rounded-lg bg-[#F4F1E9]/10 hover:bg-[#F4F1E9]/20 text-[#F4F1E9] border border-[#F4F1E9]/15 transition"
                >
                  Points
                </Link>
                <Link
                  to={`/pickup?category=${item.categorySlug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 py-1.5 text-center text-xs font-semibold rounded-lg btn-3d-copper transition"
                >
                  Collection
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 3D Device X-Ray Spec Modal ────────────────────────────────────────────────
function DeviceSpecModal({
  item,
  onClose,
}: {
  item: GuideItem | null;
  onClose: () => void;
}) {
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  if (!item) return null;

  const theme = getItemTheme(item);
  const metadata = item.categorySlug
    ? METADATA_BY_CAT[item.categorySlug] || { mass: '~0.5 kg', co2: '~0.7 kg', hazard: 'Low' }
    : { mass: 'Variable', co2: 'Variable', hazard: item.verdict === 'Special handling' ? 'High' : 'Low' };

  const toggleStep = (idx: number) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg card-3d-tactile p-7 bg-[#F4F1E9] border-2 border-[#14170F] space-y-5 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#14170F]/60 hover:text-[#14170F] hover:bg-[#14170F]/5 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-8">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase"
              style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
            >
              {item.verdict}
            </span>
            {item.categorySlug && (
              <span className="text-xs font-mono text-[#14170F]/50 uppercase">
                {item.categorySlug.replace('-', ' ')}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-serif font-bold text-[#14170F]">
            {item.name}
          </h3>
          <p className="text-xs text-[#14170F]/75 leading-relaxed">
            {item.reason}
          </p>
        </div>

        {/* Impact Telemetry Hardware Box */}
        <div className="p-4 rounded-xl bg-[#E4DCC6]/40 border border-[#14170F]/15 grid grid-cols-3 gap-3 text-center">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#14170F]/60 block">Avg Mass</span>
            <span className="text-sm font-mono font-bold text-[#14170F]">{metadata.mass}</span>
          </div>
          <div className="border-x border-[#14170F]/10">
            <span className="text-[10px] font-mono uppercase text-[#14170F]/60 block">CO₂e Saved</span>
            <span className="text-sm font-mono font-bold text-[#2F4E3A]">{metadata.co2}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#14170F]/60 block">Hazard Level</span>
            <span className="text-sm font-mono font-bold" style={{ color: theme.accentColor }}>
              {metadata.hazard}
            </span>
          </div>
        </div>

        {/* Pre-Disposal Checklist (Interactive Checkboxes) */}
        {item.beforeYouHandIn.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2F4E3A] flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#B5652D]" />
                Interactive Pre-Disposal Protocol
              </span>
              <span className="text-xs font-mono text-[#14170F]/50">
                Check off items as completed
              </span>
            </div>

            <div className="space-y-2">
              {item.beforeYouHandIn.map((step, idx) => {
                const isChecked = !!checkedSteps[idx];
                return (
                  <div
                    key={step}
                    onClick={() => toggleStep(idx)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isChecked
                        ? 'bg-[#2F4E3A]/10 border-[#2F4E3A] text-[#14170F]'
                        : 'bg-[#F4F1E9] border-[#14170F]/15 hover:border-[#14170F]/30'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs font-bold transition ${
                        isChecked
                          ? 'bg-[#2F4E3A] text-[#F4F1E9]'
                          : 'border border-[#14170F]/30 bg-[#E4DCC6]/40 text-transparent'
                      }`}
                    >
                      ✓
                    </div>
                    <span className={`text-xs leading-relaxed ${isChecked ? 'line-through opacity-60' : 'font-medium'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Hazard Callout */}
        {item.disposalTip && (
          <div className="p-3.5 rounded-xl border border-[#9B4A3E]/30 bg-[#9B4A3E]/10 flex items-start gap-2.5 text-xs text-[#9B4A3E]">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{item.disposalTip}</span>
          </div>
        )}

        {/* Action Footer */}
        <div className="pt-3 border-t border-[#14170F]/15 flex items-center justify-between gap-3">
          {item.categorySlug ? (
            <>
              <Link
                to={`/centers?category=${item.categorySlug}`}
                className="flex-1 py-2.5 rounded-xl text-center text-xs font-semibold border border-[#2F4E3A]/40 text-[#2F4E3A] bg-[#2F4E3A]/5 hover:bg-[#2F4E3A]/15 transition"
              >
                Find Campus Drop-off
              </Link>
              <Link
                to={`/pickup?category=${item.categorySlug}`}
                className="flex-1 py-2.5 rounded-xl text-center text-xs font-semibold btn-3d-copper"
              >
                Schedule Hostel Collection
              </Link>
            </>
          ) : (
            <span className="text-xs italic text-[#14170F]/50">
              Non-regulated refuse. Dispose in standard hostel bins.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Compact 3-Pill Golden Rules Ribbon ────────────────────────────────────────
function GoldenRulesRibbon() {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const rules = [
    {
      id: 1,
      icon: HardDrive,
      title: '01. Wipe Accounts',
      badge: 'Data Privacy',
      desc: 'Sign out of Microsoft 365, Google, and banking apps. Trigger factory reset on laptops and phones before handover.',
      color: '#2F4E3A',
    },
    {
      id: 2,
      icon: Battery,
      title: '02. Tape Lithium Cells',
      badge: 'Fire Safety',
      desc: 'Check for bloated batteries. Tape contact terminals with electrical tape to prevent short circuits and thermal runaway.',
      color: '#9B4A3E',
    },
    {
      id: 3,
      icon: Cable,
      title: '03. Bundle Cables',
      badge: 'Circular Yield',
      desc: 'Untangle power bricks, bundle mice and dongles together for certified copper and precious metal recovery.',
      color: '#B5652D',
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#B5652D]">
          Universal Pre-Disposal Protocol:
        </span>
        <span className="text-xs font-mono text-[#14170F]/60">
          Hover pills to inspect requirements
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {rules.map((rule) => {
          const Icon = rule.icon;
          const isOpen = activeTooltip === rule.id;
          return (
            <div
              key={rule.id}
              onMouseEnter={() => setActiveTooltip(rule.id)}
              onMouseLeave={() => setActiveTooltip(null)}
              onClick={() => setActiveTooltip(isOpen ? null : rule.id)}
              className="relative card-3d-tactile p-3.5 bg-[#F4F1E9] cursor-pointer transition hover:border-[#14170F]/40"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white font-bold"
                  style={{ backgroundColor: rule.color }}
                >
                  <Icon size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-[#14170F] block truncate">
                    {rule.title}
                  </span>
                  <span className="text-[10px] font-mono text-[#14170F]/50 block">
                    {rule.badge}
                  </span>
                </div>
              </div>

              {/* Hover Popover */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute inset-x-0 top-full mt-2 z-20 p-3.5 rounded-xl bg-[#14170F] text-[#F4F1E9] text-xs leading-relaxed shadow-xl border border-[#F4F1E9]/20"
                  >
                    <p>{rule.desc}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Verdict Filter Chips ──────────────────────────────────────────────────────
const VERDICT_FILTERS: { key: GuideVerdict | 'all'; label: string; icon: typeof CheckCircle2 }[] = [
  { key: 'all', label: 'All 36 Items', icon: Sparkles },
  { key: 'E-waste', label: 'Verified E-waste', icon: CheckCircle2 },
  { key: 'Special handling', label: 'Hazardous / Special', icon: AlertTriangle },
  { key: 'Not e-waste', label: 'Non-electronic', icon: XCircle },
  { key: 'Repair or reuse first', label: 'Repair First', icon: Wrench },
];

// ── Main Guide Page ───────────────────────────────────────────────────────────
export default function Guide() {
  const [search, setSearch] = useState('');
  const [verdictFilter, setVerdictFilter] = useState<GuideVerdict | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<GuideItem | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>('it-equipment');

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase().trim();
    return GUIDE_ITEMS.filter((item) => {
      const matchesSearch =
        q === '' ||
        item.name.toLowerCase().includes(q) ||
        item.aliases.some((a) => a.includes(q));
      const matchesVerdict = verdictFilter === 'all' || item.verdict === verdictFilter;
      return matchesSearch && matchesVerdict;
    });
  }, [search, verdictFilter]);

  return (
    <main className="min-h-screen pt-28 pb-20 relative z-10 bg-transparent">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 space-y-10">
        {/* Page Header */}
        <div className="space-y-3">
          <SectionHeading
            eyebrow="Campus Classification Engine"
            title="Can I bin this? Instant verification lookup."
            subtitle="Search across 36 common campus devices, accessories, and cords. Hover any tile for quick actions or click for full preparation specs."
          />
        </div>

        {/* Compact 3-Pill Golden Rules Ribbon */}
        <GoldenRulesRibbon />

        {/* Search & Filter Dock */}
        <div className="card-3d-tactile p-5 bg-[#F4F1E9] space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14170F]/50 pointer-events-none"
              />
              <input
                id="item-search"
                type="text"
                placeholder="Search device: phone, laptop charger, CFL bulb, power bank, vape..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#14170F]/20 bg-[#F4F1E9] text-[#14170F] placeholder:text-[#14170F]/40 outline-none focus:border-[#2F4E3A] focus:ring-1 focus:ring-[#2F4E3A] shadow-inner transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#14170F]/50 hover:text-[#14170F]"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="text-xs font-mono text-[#14170F]/70 shrink-0">
              Showing <strong>{filteredItems.length}</strong> of {GUIDE_ITEMS.length} verified campus items
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center pt-2 border-t border-[#14170F]/10">
            {VERDICT_FILTERS.map((f) => {
              const Icon = f.icon;
              const active = verdictFilter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setVerdictFilter(f.key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                    active
                      ? 'bg-[#14170F] text-[#F4F1E9] border-[#14170F] shadow-xs font-semibold'
                      : 'bg-[#E4DCC6]/60 text-[#14170F] border-[#14170F]/15 hover:bg-[#E4DCC6]'
                  }`}
                >
                  <Icon size={12} />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 4-Column / 3-Column Responsive Grid of Compact Hover-Reveal Cards ── */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <HoverRevealItemCard
                  key={item.name}
                  item={item}
                  onOpenModal={(it) => setSelectedItem(it)}
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredItems.length === 0 && (
            <div className="py-20 text-center rounded-2xl border border-[#14170F]/15 bg-[#F4F1E9] card-3d-tactile">
              <Search size={36} className="mx-auto mb-3 text-[#14170F]/30" />
              <p className="text-lg font-serif font-bold text-[#14170F]">
                No catalog matches for "{search}"
              </p>
              <p className="text-xs mt-1 text-[#14170F]/60">
                Check our detailed category directory below, or consult the campus environmental team.
              </p>
            </div>
          )}
        </div>

        {/* ── Battery Protocol Callout ── */}
        <section id="battery-safety">
          <div className="p-8 rounded-3xl border-2 border-[#9B4A3E]/40 bg-[#9B4A3E]/8 space-y-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#9B4A3E]/15 border border-[#9B4A3E]/30 text-[#9B4A3E] flex items-center justify-center shrink-0">
                <Battery size={24} />
              </div>
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#9B4A3E]">
                  Critical Campus Safety Warning
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#14170F] mt-0.5">
                  Swollen or damaged lithium battery protocol
                </h3>
                <p className="text-sm text-[#14170F]/75 mt-1 leading-relaxed max-w-3xl">
                  Degraded lithium-ion cells generate flammable organic gases internally. Punctured or compressed cells can enter thermal runaway inside hostel rooms or garbage chutes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Ban, title: 'Cease charging immediately', text: 'Disconnect chargers at once. Never attempt recharging a swollen cell.' },
                { icon: ShieldAlert, title: 'Zero compression', text: 'Never puncture, compress, bend, or force a swollen battery into a tight drawer.' },
                { icon: Flame, title: 'Isolate in cool perimeter', text: 'Keep in a ceramic dish, metallic tin, or concrete floor away from bedding.' },
                { icon: Megaphone, title: 'Explicitly flag to collectors', text: 'Inform campus collection crew upfront that parcel contains a damaged cell.' },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="card-3d-tactile p-5 bg-[#F4F1E9] border-[#9B4A3E]/20 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#9B4A3E]/15 text-[#9B4A3E] flex items-center justify-center">
                    <Icon size={16} />
                  </div>
                  <h5 className="text-xs font-bold text-[#14170F]">{title}</h5>
                  <p className="text-xs text-[#14170F]/70 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Category Directory ── */}
        <section id="categories" className="space-y-6">
          <SectionHeading
            eyebrow="Category Directory"
            title="Learn by category"
            subtitle="Explore regulatory classifications, hazardous constituent metals, and recovery guidelines under CPCB E-Waste Rules 2022."
          />

          <div className="space-y-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className={`rounded-2xl border transition-all overflow-hidden bg-[#F4F1E9] ${
                  openCategory === cat.id ? 'border-[#2F4E3A] shadow-md' : 'border-[#14170F]/15 hover:border-[#14170F]/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenCategory(openCategory === cat.id ? null : cat.id)}
                  className="w-full flex items-center gap-4 p-5 text-left group transition-colors cursor-pointer"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                  >
                    {(() => {
                      const IconComp = ICON_MAP[cat.icon] ?? Cpu;
                      return <IconComp size={22} />;
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-serif font-bold text-[#14170F]">{cat.name}</h3>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border bg-[#E4DCC6]/60 text-[#14170F]">
                        {cat.shortName}
                      </span>
                    </div>
                    <p className="text-xs text-[#14170F]/70 mt-0.5 line-clamp-1">{cat.disposalMethod}</p>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full border border-[#14170F]/15 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      openCategory === cat.id ? 'rotate-180 bg-[#E4DCC6]' : 'bg-[#F4F1E9]'
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                <AnimatePresence>
                  {openCategory === cat.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-[#14170F]/10 px-6 py-5 bg-[#E4DCC6]/20 space-y-4"
                    >
                      <div>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#14170F]/60">
                          Common Campus Items
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {cat.examples.map((ex) => (
                            <span
                              key={ex}
                              className="px-2.5 py-1 text-xs rounded-lg border border-[#14170F]/15 bg-[#F4F1E9] text-[#14170F] font-medium shadow-2xs"
                            >
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-[#9B4A3E]/30 bg-[#9B4A3E]/8 text-xs">
                          <p className="font-semibold text-[#9B4A3E] mb-1 flex items-center gap-1.5">
                            <ShieldAlert size={14} /> Environmental & Health Risk Profile
                          </p>
                          <p className="leading-relaxed text-[#14170F]/80">{cat.hazardDetails}</p>
                        </div>

                        <div className="p-4 rounded-xl border border-[#2F4E3A]/30 bg-[#2F4E3A]/8 text-xs">
                          <p className="font-semibold text-[#2F4E3A] mb-1 flex items-center gap-1.5">
                            <CheckCircle2 size={14} /> Safe Preparation Protocol
                          </p>
                          <p className="leading-relaxed text-[#14170F]/80">{cat.whatToDo}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <Link
                          to={`/centers?category=${cat.slug}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-[#2F4E3A]/40 text-[#2F4E3A] bg-[#2F4E3A]/5 hover:bg-[#2F4E3A]/15 active:scale-95 transition-all"
                        >
                          <MapPin size={13} className="text-[#B5652D]" />
                          <span>View Campus Points</span>
                        </Link>
                        <Link
                          to={`/pickup?category=${cat.slug}`}
                          className="btn-3d-copper px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 active:scale-95"
                        >
                          <Calendar size={13} />
                          <span>Schedule Hostel Pickup</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* Regulatory Citation */}
        <div className="rounded-2xl border border-[#14170F]/15 bg-[#E4DCC6]/30 p-5 text-xs text-[#14170F]/70 leading-relaxed">
          <strong>Regulatory Sources:</strong> Central Pollution Control Board (CPCB) India — E-Waste Management Rules 2022 · United Nations Global E-waste Monitor (GEM 2024) · WHO Chemical Safety Guidelines 2023. Campus points and collection estimates represent demonstration prototype data for Lovely Professional University.
        </div>
      </div>

      {/* 3D Device X-Ray Spec Modal */}
      <DeviceSpecModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </main>
  );
}
