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
  ChevronUp,
  Battery,
  Wrench,
  XCircle,
  ShieldAlert,
  Ban,
  Flame,
  Megaphone,
  Check,
  Sparkles,
  Monitor,
  Cpu,
  Lightbulb,
  Cable,
  Refrigerator,
  HardDrive,
} from 'lucide-react';
import { SectionHeading } from '../components/ui';
import { CATEGORIES, type CategoryInfo } from '../data/categories';
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

// ── Verdict styles ───────────────────────────────────────────────────────────
const VERDICT_STYLES: Record<
  GuideVerdict,
  {
    bg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    icon: typeof CheckCircle2;
    label: string;
  }
> = {
  'E-waste': {
    bg: '#2F4E3A',
    border: 'rgba(47, 78, 58, 0.35)',
    badgeBg: 'rgba(47, 78, 58, 0.12)',
    badgeText: '#2F4E3A',
    icon: CheckCircle2,
    label: 'Verified E-waste',
  },
  'Special handling': {
    bg: '#9B4A3E',
    border: 'rgba(155, 74, 62, 0.35)',
    badgeBg: 'rgba(155, 74, 62, 0.12)',
    badgeText: '#9B4A3E',
    icon: AlertTriangle,
    label: 'Hazardous Handling',
  },
  'Not e-waste': {
    bg: '#14170F',
    border: 'rgba(20, 23, 15, 0.25)',
    badgeBg: 'rgba(20, 23, 15, 0.08)',
    badgeText: '#14170F',
    icon: XCircle,
    label: 'Standard Refuse (Not E-waste)',
  },
  'Repair or reuse first': {
    bg: '#B5652D',
    border: 'rgba(181, 101, 45, 0.35)',
    badgeBg: 'rgba(181, 101, 45, 0.12)',
    badgeText: '#B5652D',
    icon: Wrench,
    label: 'Repair / Reuse Recommended',
  },
};

const METADATA_BY_CAT: Record<string, { mass: string; co2: string; hazard: 'Low' | 'Medium' | 'High' }> = {
  'it-equipment': { mass: '~2.1 kg', co2: '~3.0 kg', hazard: 'Medium' },
  'mobiles-accessories': { mass: '~0.18 kg', co2: '~0.26 kg', hazard: 'Low' },
  'batteries': { mass: '~0.08 kg', co2: '~0.12 kg', hazard: 'High' },
  'large-appliances': { mass: '~28 kg', co2: '~40.3 kg', hazard: 'Medium' },
  'small-appliances': { mass: '~1.2 kg', co2: '~1.7 kg', hazard: 'Low' },
  'lighting': { mass: '~0.15 kg', co2: '~0.22 kg', hazard: 'High' },
  'cables-peripherals': { mass: '~0.25 kg', co2: '~0.36 kg', hazard: 'Low' },
};

// ── 3D Tactile Item Card Component ─────────────────────────────────────
function ItemCard({ item }: { item: GuideItem }) {
  const [expanded, setExpanded] = useState(false);
  const style = VERDICT_STYLES[item.verdict];
  const VerdictIcon = style.icon;

  const metadata = item.categorySlug
    ? METADATA_BY_CAT[item.categorySlug] || { mass: '~0.5 kg', co2: '~0.7 kg', hazard: 'Low' }
    : {
        mass: 'N/A',
        co2: '0 kg',
        hazard: item.verdict === 'Special handling' ? 'High' : 'Low',
      };

  const steps = item.beforeYouHandIn || [];
  const hasManySteps = steps.length > 2;
  const visibleSteps = expanded ? steps : steps.slice(0, 2);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="card-3d-tactile flex flex-col justify-between overflow-hidden bg-[#F4F1E9]"
    >
      {/* Top PCB Pin Header Strip */}
      <div
        className={`h-1.5 w-full ${
          item.verdict === 'Special handling'
            ? 'bg-[#9B4A3E]'
            : item.verdict === 'Repair or reuse first'
            ? 'bg-[#B5652D]'
            : 'bg-gradient-to-r from-[#2F4E3A] via-[#6B8F71] to-[#B5652D]'
        }`}
      />

      {/* Card Header & Body */}
      <div className="p-6 space-y-4">
        {/* Top Status & 3D Isometric Emblem */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: style.badgeBg, color: style.badgeText }}
              >
                <VerdictIcon size={13} />
                {style.label}
              </span>
            </div>
            {item.categorySlug && (
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#14170F]/50 pl-0.5">
                {item.categorySlug.replace('-', ' ')}
              </span>
            )}
          </div>

          {/* 3D Isometric Category Emblem */}
          <div className="w-11 h-11 rounded-xl bg-[#E4DCC6]/60 border border-[#14170F]/15 shadow-[3px_3px_0px_#E4DCC6] flex items-center justify-center shrink-0">
            {item.categorySlug === 'mobiles-accessories' ? (
              <Cpu size={20} className="text-[#2F4E3A]" />
            ) : item.categorySlug === 'batteries' ? (
              <Battery size={20} className="text-[#9B4A3E]" />
            ) : item.categorySlug === 'lighting' ? (
              <Lightbulb size={20} className="text-[#B5652D]" />
            ) : item.categorySlug === 'cables-peripherals' ? (
              <Cable size={20} className="text-[#6B8F71]" />
            ) : item.categorySlug === 'large-appliances' ? (
              <Refrigerator size={20} className="text-[#14170F]" />
            ) : (
              <Monitor size={20} className="text-[#2F4E3A]" />
            )}
          </div>
        </div>

        {/* Item Title & Rationale */}
        <div>
          <h4 className="text-lg font-serif font-bold text-[#14170F] leading-snug">
            {item.name}
          </h4>
          <p className="text-xs text-[#14170F]/70 leading-relaxed mt-1">
            {item.reason}
          </p>
        </div>

        {/* Hardware Telemetry Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#E4DCC6]/50 border border-[#14170F]/10 text-[#14170F]">
            Mass: <strong>{metadata.mass}</strong>
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#2F4E3A]/10 border border-[#2F4E3A]/20 text-[#2F4E3A]">
            CO₂e Saved: <strong>{metadata.co2}</strong>
          </span>
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-mono border ${
              metadata.hazard === 'High'
                ? 'bg-[#9B4A3E]/10 border-[#9B4A3E]/30 text-[#9B4A3E]'
                : 'bg-[#6B8F71]/10 border-[#6B8F71]/25 text-[#2F4E3A]'
            }`}
          >
            Hazard: <strong>{metadata.hazard}</strong>
          </span>
        </div>

        {/* Checklist Steps (Collapsible Drawer) */}
        {steps.length > 0 && (
          <div className="rounded-xl border border-[#14170F]/10 bg-[#E4DCC6]/20 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#2F4E3A] flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#B5652D]" />
                Pre-Disposal Prep ({steps.length} {steps.length === 1 ? 'step' : 'steps'})
              </span>
              {hasManySteps && (
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="text-[11px] font-semibold text-[#B5652D] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  {expanded ? (
                    <>
                      Less <ChevronUp size={12} />
                    </>
                  ) : (
                    <>
                      Full prep ({steps.length}) <ChevronDown size={12} />
                    </>
                  )}
                </button>
              )}
            </div>

            <ul className="space-y-1.5">
              {visibleSteps.map((step) => (
                <li key={step} className="flex items-start gap-2 text-xs text-[#14170F]/80 leading-relaxed">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#6B8F71] shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disposal Hazard Tip */}
        {item.disposalTip && (
          <div className="flex items-start gap-2.5 rounded-xl border border-[#9B4A3E]/30 bg-[#9B4A3E]/8 p-3 text-xs text-[#9B4A3E]">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{item.disposalTip}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-3 border-t border-[#14170F]/10 mt-auto bg-[#F4F1E9]/50 flex items-center justify-between gap-3">
        {item.categorySlug ? (
          <>
            <Link
              to={`/centers?category=${item.categorySlug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#2F4E3A]/30 text-[#2F4E3A] bg-[#2F4E3A]/5 hover:bg-[#2F4E3A]/10 active:scale-95 transition-all"
            >
              <MapPin size={12} className="text-[#B5652D]" />
              <span>Campus Points</span>
            </Link>
            <Link
              to={`/pickup?category=${item.categorySlug}`}
              className="btn-3d-copper px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 active:scale-95"
            >
              <Calendar size={12} />
              <span>Book Collection</span>
            </Link>
          </>
        ) : (
          <span className="text-xs italic text-[#14170F]/50">
            Standard campus dustbins or specialized vendor recovery.
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ── Horizontal Interactive 3D Bento Safety Banner ────────────────────────────
function UniversalSafetyBento() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const bentoCards = [
    {
      idx: 1,
      title: 'Wipe & Unlink Accounts',
      category: 'Data Privacy',
      desc: 'Sign out of Microsoft 365, Google, and banking apps. Trigger factory reset on phones and laptops before handover.',
      icon: HardDrive,
      color: '#2F4E3A',
    },
    {
      idx: 2,
      title: 'Isolate Lithium Cells',
      category: 'Fire Safety',
      desc: 'Check for bloated or damaged phone/laptop batteries. Tape open terminals with electrical tape to avoid thermal shorts.',
      icon: Battery,
      color: '#9B4A3E',
    },
    {
      idx: 3,
      title: 'Bundle Power & Peripherals',
      category: 'Circular Sorting',
      desc: 'Untangle cables, bag loose mice/dongles together, and detach removable power adapters for high-yield copper shredding.',
      icon: Cable,
      color: '#B5652D',
    },
  ];

  const toggleCheck = (idx: number) => {
    setChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#B5652D]">
            Standard Handover Protocol
          </span>
          <h3 className="text-xl font-serif font-bold text-[#14170F]">
            3 Golden Rules Before You Hand Any Device In
          </h3>
        </div>
        <span className="hidden sm:inline-block text-xs font-mono text-[#14170F]/60">
          Click cards to mark verified
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {bentoCards.map((card) => {
          const isDone = !!checked[card.idx];
          const Icon = card.icon;
          return (
            <div
              key={card.idx}
              onClick={() => toggleCheck(card.idx)}
              className={`card-3d-tactile p-6 cursor-pointer select-none transition-all ${
                isDone
                  ? 'border-[#2F4E3A] bg-[#2F4E3A]/5 shadow-[0_4px_0_0_#2F4E3A]'
                  : 'hover:border-[#B5652D]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${card.color}15`,
                    color: card.color,
                  }}
                >
                  {card.category}
                </span>
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all ${
                    isDone
                      ? 'bg-[#2F4E3A] text-[#F4F1E9]'
                      : 'border border-[#14170F]/20 text-[#14170F]/50 bg-[#E4DCC6]/40'
                  }`}
                >
                  {isDone ? <Check size={14} /> : `0${card.idx}`}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-[#14170F]/10"
                  style={{ backgroundColor: `${card.color}15`, color: card.color }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className={`text-base font-bold ${isDone ? 'line-through text-[#14170F]/50' : 'text-[#14170F]'}`}>
                    {card.title}
                  </h4>
                  <p className="text-xs text-[#14170F]/70 mt-1 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Category Accordion Component ──────────────────────────────────────────────
function CategoryAccordion({
  category,
  isOpen,
  onToggle,
}: {
  category: CategoryInfo;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = ICON_MAP[category.icon] ?? Cpu;
  return (
    <div
      className={`rounded-2xl border transition-all overflow-hidden bg-[#F4F1E9] ${
        isOpen
          ? 'border-[#2F4E3A] shadow-md'
          : 'border-[#14170F]/15 hover:border-[#14170F]/30'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left group transition-colors cursor-pointer"
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
          style={{
            backgroundColor: isOpen ? `${category.color}25` : `${category.color}15`,
            color: category.color,
          }}
        >
          <Icon size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-serif font-bold text-[#14170F]">
              {category.name}
            </h3>
            <span
              className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border"
              style={{
                borderColor: `${category.color}40`,
                backgroundColor: `${category.color}10`,
                color: category.color,
              }}
            >
              {category.shortName}
            </span>
          </div>
          <p className="text-xs text-[#14170F]/70 mt-0.5 line-clamp-1">
            {category.disposalMethod}
          </p>
        </div>
        <div
          className={`w-8 h-8 rounded-full border border-[#14170F]/15 flex items-center justify-center shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180 bg-[#E4DCC6]' : 'bg-[#F4F1E9]'
          }`}
        >
          <ChevronDown size={16} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
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
                {category.examples.map((ex) => (
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
                <p className="leading-relaxed text-[#14170F]/80">
                  {category.hazardDetails}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#2F4E3A]/30 bg-[#2F4E3A]/8 text-xs">
                <p className="font-semibold text-[#2F4E3A] mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Safe Preparation Protocol
                </p>
                <p className="leading-relaxed text-[#14170F]/80">
                  {category.whatToDo}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to={`/centers?category=${category.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-[#2F4E3A]/40 text-[#2F4E3A] bg-[#2F4E3A]/5 hover:bg-[#2F4E3A]/15 active:scale-95 transition-all"
              >
                <MapPin size={13} className="text-[#B5652D]" />
                <span>View Campus Points</span>
              </Link>
              <Link
                to={`/pickup?category=${category.slug}`}
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

// ── Guide Page Root ───────────────────────────────────────────────────────────
export default function Guide() {
  const [search, setSearch] = useState('');
  const [verdictFilter, setVerdictFilter] = useState<GuideVerdict | 'all'>('all');
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
    <main className="min-h-screen pt-24 pb-20 bg-circuit-soil">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 space-y-14">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="space-y-4">
          <SectionHeading
            eyebrow="Campus Disposal Guide"
            title="Can I bin this? Instant verification lookup."
            subtitle="Search across 36 common campus devices, cords, and electronics to verify recycling eligibility and hostel pre-disposal protocols."
          />
        </div>

        {/* ── Top Horizontal 3D Bento Safety Banner ──────────────────── */}
        <UniversalSafetyBento />

        {/* ── Search & Filter Hardware Dock ──────────────────────────── */}
        <div className="card-3d-tactile p-6 space-y-4 bg-[#F4F1E9]">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
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

            {/* Item Counter */}
            <div className="text-xs font-mono text-[#14170F]/70 shrink-0">
              Showing <strong>{filteredItems.length}</strong> of {GUIDE_ITEMS.length} verified campus items
            </div>
          </div>

          {/* Verdict Filter Chips */}
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
                      ? 'bg-[#14170F] text-[#F4F1E9] border-[#14170F] shadow-sm font-semibold'
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

        {/* ── Full-Width 3-Column Item Cards Grid ────────────────────── */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <ItemCard key={item.name} item={item} />
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

        {/* ── Section: Battery Safety Callout ──────────────────────────── */}
        <section id="battery-safety">
          <div className="p-8 rounded-3xl border-2 border-[#9B4A3E]/40 bg-[#9B4A3E]/6 space-y-6 shadow-sm">
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
                {
                  icon: Ban,
                  title: 'Cease charging immediately',
                  text: 'Disconnect chargers and power bricks at once. Never attempt recharging a swollen cell.',
                },
                {
                  icon: ShieldAlert,
                  title: 'Zero compression',
                  text: 'Never puncture, compress, bend, or force a swollen battery into a tight bag or drawer.',
                },
                {
                  icon: Flame,
                  title: 'Isolate in cool perimeter',
                  text: 'Keep in a ceramic dish, metallic tin, or concrete floor away from bedding, paper, and fabrics.',
                },
                {
                  icon: Megaphone,
                  title: 'Explicitly flag to collectors',
                  text: 'Inform the campus collection crew upfront that the parcel contains a damaged cell for fire-safe handling.',
                },
              ].map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="card-3d-tactile p-5 bg-[#F4F1E9] border-[#9B4A3E]/20 space-y-2"
                >
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

        {/* ── Section: Category Directory ─────────────────────────────── */}
        <section id="categories" className="space-y-6">
          <SectionHeading
            eyebrow="Category Directory"
            title="Learn by category"
            subtitle="Explore regulatory classifications, hazardous constituent metals, and recovery guidelines under CPCB E-Waste Rules 2022."
          />

          <div className="space-y-4">
            {CATEGORIES.map((cat) => (
              <CategoryAccordion
                key={cat.id}
                category={cat}
                isOpen={openCategory === cat.id}
                onToggle={() => setOpenCategory(openCategory === cat.id ? null : cat.id)}
              />
            ))}
          </div>
        </section>

        {/* ── Footnote & Regulatory Sources ────────────────────────────── */}
        <div className="rounded-2xl border border-[#14170F]/15 bg-[#E4DCC6]/30 p-5 text-xs text-[#14170F]/70 leading-relaxed">
          <strong>Regulatory Sources:</strong> Central Pollution Control Board (CPCB) India — E-Waste Management Rules 2022 · United Nations Global E-waste Monitor (GEM 2024) · WHO Chemical Safety Guidelines 2023. Campus points and collection estimates represent demonstration prototype data for Lovely Professional University.
        </div>
      </div>
    </main>
  );
}
