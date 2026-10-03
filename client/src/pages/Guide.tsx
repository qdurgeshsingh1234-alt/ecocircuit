import { useState, useMemo, useRef } from 'react';
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
  Check,
  Sparkles,
  Monitor,
  Cpu,
  Lightbulb,
  Cable,
  Refrigerator,
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
    bg: 'var(--signal)',
    border: 'color-mix(in srgb, var(--signal) 30%, transparent)',
    badgeBg: 'color-mix(in srgb, var(--signal) 12%, transparent)',
    badgeText: 'var(--signal)',
    icon: CheckCircle2,
    label: 'Verified E-waste',
  },
  'Special handling': {
    bg: 'var(--rust)',
    border: 'color-mix(in srgb, var(--rust) 30%, transparent)',
    badgeBg: 'color-mix(in srgb, var(--rust) 12%, transparent)',
    badgeText: 'var(--rust)',
    icon: AlertTriangle,
    label: 'Special Hazardous Handling',
  },
  'Not e-waste': {
    bg: 'var(--ink)',
    border: 'color-mix(in srgb, var(--sand) 80%, transparent)',
    badgeBg: 'color-mix(in srgb, var(--ink) 8%, transparent)',
    badgeText: 'var(--ink)',
    icon: XCircle,
    label: 'Standard Refuse (Not E-waste)',
  },
  'Repair or reuse first': {
    bg: 'var(--copper)',
    border: 'color-mix(in srgb, var(--copper) 30%, transparent)',
    badgeBg: 'color-mix(in srgb, var(--copper) 12%, transparent)',
    badgeText: 'var(--copper)',
    icon: Wrench,
    label: 'Repair / Reuse Recommended',
  },
};

// ── 3D Interactive Tilting Card Component ─────────────────────────────────────
function ItemCard({ item }: { item: GuideItem }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const style = VERDICT_STYLES[item.verdict];
  const VerdictIcon = style.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -6.5;
    const rY = ((x - centerX) / centerX) * 6.5;

    setRotateX(rX);
    setRotateY(rY);
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.18,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHovered ? 12 : 0}px)`,
          transition: isHovered
            ? 'transform 0.08s ease-out, box-shadow 0.2s ease'
            : 'transform 0.5s ease-out, box-shadow 0.3s ease',
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? '0 20px 35px -10px rgba(20, 23, 15, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.6)'
            : '0 4px 14px -3px rgba(20, 23, 15, 0.04)',
          background: 'var(--paper)',
          borderColor: style.border,
        }}
        className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border transition-all"
      >
        {/* Dynamic Specular Glare overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.7) 0%, transparent 65%)`,
          }}
        />

        {/* Card Content Top */}
        <div>
          {/* Header Verdict Ribbon */}
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b"
            style={{
              background: `color-mix(in srgb, ${style.bg} 10%, var(--paper))`,
              borderColor: style.border,
            }}
          >
            <div className="flex items-center gap-1.5">
              <VerdictIcon size={14} style={{ color: style.bg }} />
              <span
                className="text-xs font-semibold tracking-wide"
                style={{ color: style.bg, fontFamily: 'var(--font-body)' }}
              >
                {style.label}
              </span>
            </div>
            {item.categorySlug && (
              <span className="text-[10px] uppercase tracking-wider opacity-50 font-medium">
                {item.categorySlug}
              </span>
            )}
          </div>

          <div className="p-4 space-y-3">
            <h4
              className="text-base font-semibold tracking-tight text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {item.name}
            </h4>
            <p className="text-xs leading-relaxed opacity-70" style={{ color: 'var(--ink)' }}>
              {item.reason}
            </p>

            {/* Checklist steps */}
            {item.beforeYouHandIn.length > 0 && (
              <div className="rounded-xl border p-3" style={{ borderColor: 'var(--sand)', background: 'color-mix(in srgb, var(--sand) 25%, var(--paper))' }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider opacity-60 mb-2 flex items-center gap-1" style={{ color: 'var(--moss)' }}>
                  <Sparkles size={11} /> Pre-Disposal Checklist
                </p>
                <ul className="space-y-1.5">
                  {item.beforeYouHandIn.map((step) => (
                    <li key={step} className="flex items-start gap-2 text-xs opacity-75">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--signal)] shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disposal alert */}
            {item.disposalTip && (
              <div
                className="flex items-start gap-2 rounded-xl border p-3 text-xs"
                style={{
                  background: 'color-mix(in srgb, var(--rust) 8%, var(--paper))',
                  borderColor: 'color-mix(in srgb, var(--rust) 25%, transparent)',
                  color: 'var(--rust)',
                }}
              >
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{item.disposalTip}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons footer */}
        <div className="p-4 pt-1 border-t mt-auto" style={{ borderColor: 'var(--sand)' }}>
          {item.categorySlug ? (
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/centers?category=${item.categorySlug}`}
                className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  borderColor: 'var(--signal)',
                  color: 'var(--signal)',
                  background: 'color-mix(in srgb, var(--signal) 10%, transparent)',
                }}
              >
                <MapPin size={12} /> Campus Points
              </Link>
              <Link
                to={`/pickup?category=${item.categorySlug}`}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'var(--copper)',
                  color: 'var(--paper)',
                }}
              >
                <Calendar size={12} /> Book Collection
              </Link>
            </div>
          ) : (
            <p className="text-xs italic opacity-50" style={{ color: 'var(--ink)' }}>
              Standard campus dustbins or specialized vendor recovery.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Interactive Universal Checklist ───────────────────────────────────────────
const CHECKLIST_ITEMS = [
  { n: '01', title: 'Back up your data', detail: 'Photos, coursework, credentials — save to university OneDrive or cloud storage before wipe.' },
  { n: '02', title: 'Sign out of all accounts', detail: 'Google, Apple ID, Microsoft 365, banking — unpair devices to disable activation lock.' },
  { n: '03', title: 'Perform factory reset', detail: 'Encrypt and securely restore factory defaults on laptops, smartphones, tablets, and smart routers.' },
  { n: '04', title: 'Eject SIM and microSD cards', detail: 'Check all trays and ports. Tiny memory cards carry personal files and are frequently forgotten.' },
  { n: '05', title: 'Isolate removable batteries', detail: 'Extract AA, AAA, or coin batteries and store them safely in a separate dry paper pouch.' },
  { n: '06', title: 'Do not crush or puncture casing', detail: 'Preserve physical casing integrity. Crushed lithium-ion cells can enter thermal runaway.' },
  { n: '07', title: 'Insulate loose terminal leads', detail: 'Affix electrical tape over 9V, lithium cell, or battery pack contact points to prevent short circuits.' },
];

function InteractiveChecklist() {
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (n: string) => {
    setCheckedSteps((prev) => ({ ...prev, [n]: !prev[n] }));
  };

  const totalChecked = Object.values(checkedSteps).filter(Boolean).length;
  const progressPercent = Math.round((totalChecked / CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Interactive Progress tracker banner */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 backdrop-blur-md"
        style={{
          background: 'color-mix(in srgb, var(--sand) 40%, var(--paper))',
          borderColor: 'var(--sand)',
        }}
      >
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--moss)]">
            Pre-Collection Verification Tool
          </span>
          <h4
            className="text-lg font-semibold tracking-tight text-[var(--ink)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Verify your gear before drop-off
          </h4>
          <p className="text-xs opacity-60">
            Click each milestone as you prepare your electronics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-sm font-semibold" style={{ color: 'var(--moss)' }}>
              {totalChecked} of {CHECKLIST_ITEMS.length} completed
            </span>
            <div className="w-36 h-2 rounded-full overflow-hidden bg-black/10 mt-1">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--moss)' }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            </div>
          </div>
          {totalChecked === CHECKLIST_ITEMS.length && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--moss)] text-[var(--paper)] shadow-md"
            >
              <Check size={16} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Checklist grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CHECKLIST_ITEMS.map((step) => {
          const isDone = !!checkedSteps[step.n];
          return (
            <motion.div
              key={step.n}
              whileHover={{ y: -2 }}
              onClick={() => toggleStep(step.n)}
              className="cursor-pointer rounded-2xl border p-5 transition-all select-none relative overflow-hidden"
              style={{
                background: isDone
                  ? 'color-mix(in srgb, var(--moss) 8%, var(--paper))'
                  : 'var(--paper)',
                borderColor: isDone ? 'var(--moss)' : 'var(--sand)',
                boxShadow: isDone
                  ? '0 8px 20px -8px rgba(47, 78, 58, 0.2)'
                  : '0 2px 8px -2px rgba(20, 23, 15, 0.04)',
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-colors"
                    style={{
                      background: isDone ? 'var(--moss)' : 'var(--sand)',
                      color: isDone ? 'var(--paper)' : 'var(--ink)',
                    }}
                  >
                    {step.n}
                  </span>
                  <h4 className="text-sm font-semibold tracking-tight text-[var(--ink)]">
                    {step.title}
                  </h4>
                </div>
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-md border transition-colors shrink-0 mt-0.5"
                  style={{
                    borderColor: isDone ? 'var(--moss)' : 'var(--sand)',
                    background: isDone ? 'var(--moss)' : 'transparent',
                    color: '#fff',
                  }}
                >
                  {isDone && <Check size={12} />}
                </div>
              </div>
              <p className="text-xs opacity-65 leading-relaxed pl-9" style={{ color: 'var(--ink)' }}>
                {step.detail}
              </p>
            </motion.div>
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
    <motion.div
      layout
      className={`rounded-2xl border overflow-hidden transition-all ${
        isOpen
          ? 'border-[var(--signal)] shadow-lg shadow-[var(--ink)]/5'
          : 'border-[var(--sand)] hover:border-[var(--signal)]/40 hover:shadow-sm'
      } bg-[var(--paper)]`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left group transition-colors"
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
          style={{
            backgroundColor: isOpen ? `${category.color}25` : `${category.color}12`,
            color: category.color,
          }}
        >
          <Icon size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className="text-base font-semibold text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {category.name}
            </h3>
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border"
              style={{
                backgroundColor: `${category.color}12`,
                color: category.color,
                borderColor: `${category.color}30`,
              }}
            >
              <AlertTriangle size={10} />
              {category.riskLabel}
            </span>
          </div>
          <p className="text-xs opacity-50 mt-0.5 truncate" style={{ color: 'var(--ink)' }}>
            {category.examples.slice(0, 5).join(', ')}…
          </p>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-[var(--ink)]/40"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 space-y-4 border-t border-[var(--sand)] pt-4">
              {/* Examples */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-2">
                  Recognized Items In This Category
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {category.examples.map((ex) => (
                    <span
                      key={ex}
                      className="px-2.5 py-1 text-xs rounded-lg border font-medium"
                      style={{
                        background: 'color-mix(in srgb, var(--sand) 30%, var(--paper))',
                        borderColor: 'var(--sand)',
                        color: 'var(--ink)',
                      }}
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hazard explanation */}
              <div
                className="p-4 rounded-xl border text-xs"
                style={{
                  background: 'color-mix(in srgb, var(--rust) 6%, var(--paper))',
                  borderColor: 'color-mix(in srgb, var(--rust) 20%, transparent)',
                }}
              >
                <p className="font-semibold text-[var(--rust)] mb-1 flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Environmental & Health Risk Profile
                </p>
                <p className="leading-relaxed opacity-80" style={{ color: 'var(--ink)' }}>
                  {category.hazardDetails}
                </p>
              </div>

              {/* Hand-in actions */}
              <div
                className="p-4 rounded-xl border text-xs"
                style={{
                  background: 'color-mix(in srgb, var(--moss) 6%, var(--paper))',
                  borderColor: 'color-mix(in srgb, var(--moss) 20%, transparent)',
                }}
              >
                <p className="font-semibold text-[var(--moss)] mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Safe Preparation Protocol
                </p>
                <p className="leading-relaxed opacity-80" style={{ color: 'var(--ink)' }}>
                  {category.whatToDo}
                </p>
              </div>

              {/* Action CTAs */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Link
                  to={`/centers?category=${category.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    borderColor: 'var(--signal)',
                    color: 'var(--signal)',
                    background: 'color-mix(in srgb, var(--signal) 10%, transparent)',
                  }}
                >
                  <MapPin size={13} /> View Drop-off Points
                </Link>
                <Link
                  to={`/pickup?category=${category.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: 'var(--copper)',
                    color: 'var(--paper)',
                  }}
                >
                  <Calendar size={13} /> Schedule Collection
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Verdict Filter Chips ──────────────────────────────────────────────────────
const VERDICT_FILTERS: { key: GuideVerdict | 'all'; label: string; icon: typeof CheckCircle2 }[] = [
  { key: 'all', label: 'All 36 Items', icon: Sparkles },
  { key: 'E-waste', label: 'E-waste', icon: CheckCircle2 },
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
    <main className="min-h-screen pt-24 pb-20" style={{ background: 'var(--paper)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* ── Section 1: Item Lookup ("Can I bin this?") ──────────────── */}
        <section id="lookup">
          <SectionHeading
            eyebrow="Campus Disposal Guide"
            title="Can I bin this? Instant verification lookup."
            subtitle="Search across 36 common devices, cords, and accessories to verify recycling eligibility and hostel disposal protocols."
          />

          {/* Search + filter chips */}
          <div className="mt-8 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
                style={{ color: 'var(--ink)' }}
              />
              <input
                id="item-search"
                type="text"
                placeholder="Search device: phone, laptop charger, CFL bulb, power bank, vape..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border outline-none transition focus:ring-2 shadow-sm"
                style={{
                  background: 'var(--paper)',
                  borderColor: 'var(--sand)',
                  color: 'var(--ink)',
                }}
              />
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              {VERDICT_FILTERS.map((f) => {
                const Icon = f.icon;
                const active = verdictFilter === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => setVerdictFilter(f.key)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                      active
                        ? 'shadow-sm font-semibold'
                        : 'hover:opacity-80'
                    }`}
                    style={{
                      background: active ? 'var(--ink)' : 'color-mix(in srgb, var(--sand) 40%, var(--paper))',
                      color: active ? 'var(--paper)' : 'var(--ink)',
                      borderColor: active ? 'var(--ink)' : 'var(--sand)',
                    }}
                  >
                    <Icon size={12} />
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-3 text-xs opacity-50" style={{ color: 'var(--ink)' }}>
            Showing {filteredItems.length} of {GUIDE_ITEMS.length} verified campus items
            {search && ` matching "${search}"`}
          </p>

          {/* 3D Item Cards Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <ItemCard key={item.name} item={item} />
              ))}
            </AnimatePresence>
          </div>

          {filteredItems.length === 0 && (
            <div
              className="py-16 text-center rounded-2xl border mt-6"
              style={{ background: 'var(--paper)', borderColor: 'var(--sand)' }}
            >
              <Search size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--ink)' }} />
              <p className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                No catalog matches for "{search}"
              </p>
              <p className="text-xs mt-1 opacity-60">
                Check our detailed category deep dives below, or consult campus environmental team.
              </p>
            </div>
          )}
        </section>

        {/* ── Section 2: Universal 7-Step Checklist ────────────────────── */}
        <section id="checklist">
          <SectionHeading
            eyebrow="Pre-Handover Protocol"
            title="Before you hand anything in — 7 critical steps"
            subtitle="Standard safety and privacy procedures before submitting equipment to campus drop-off points or hostel collectors."
          />

          <div className="mt-8">
            <InteractiveChecklist />
          </div>
        </section>

        {/* ── Section 3: Battery Safety Callout (High visual fidelity) ──── */}
        <section id="battery-safety">
          <div
            className="p-6 sm:p-8 rounded-3xl border-2 space-y-5 shadow-sm relative overflow-hidden"
            style={{
              borderColor: 'color-mix(in srgb, var(--rust) 40%, transparent)',
              background: 'color-mix(in srgb, var(--rust) 6%, var(--paper))',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border"
                style={{
                  background: 'color-mix(in srgb, var(--rust) 15%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--rust) 35%, transparent)',
                  color: 'var(--rust)',
                }}
              >
                <Battery size={24} />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-widest uppercase text-[var(--rust)]">
                  Critical Campus Safety Warning
                </span>
                <h3
                  className="text-2xl font-semibold tracking-tight text-[var(--ink)] mt-0.5"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Swollen or damaged lithium battery protocol
                </h3>
                <p className="text-xs sm:text-sm opacity-75 mt-1 leading-relaxed" style={{ color: 'var(--ink)' }}>
                  Degraded lithium-ion cells generate flammable organic gases internally. Punctured or compressed cells can experience runaway ignition inside hostel storage or disposal bins.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {[
                {
                  icon: Ban,
                  title: 'Cease charging immediately',
                  text: 'Disconnect chargers and power bricks at once. Do not attempt recharging a bloated cell.',
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
                  className="flex items-start gap-3 p-4 rounded-2xl border"
                  style={{
                    background: 'var(--paper)',
                    borderColor: 'color-mix(in srgb, var(--rust) 20%, transparent)',
                  }}
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-xl shrink-0 mt-0.5"
                    style={{
                      background: 'color-mix(in srgb, var(--rust) 12%, transparent)',
                      color: 'var(--rust)',
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold" style={{ color: 'var(--ink)' }}>
                      {title}
                    </h5>
                    <p className="text-xs opacity-65 leading-relaxed mt-0.5" style={{ color: 'var(--ink)' }}>
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 4: Deep Dive Categories ──────────────────────────── */}
        <section id="categories">
          <SectionHeading
            eyebrow="Category Directory"
            title="Learn by category"
            subtitle="Explore regulatory classifications, hazardous constituent metals, and recovery guidelines under CPCB E-Waste Rules."
          />

          <motion.div layout className="mt-8 space-y-3">
            {CATEGORIES.map((cat) => (
              <CategoryAccordion
                key={cat.id}
                category={cat}
                isOpen={openCategory === cat.id}
                onToggle={() => setOpenCategory(openCategory === cat.id ? null : cat.id)}
              />
            ))}
          </motion.div>
        </section>

        {/* ── Citation footnote ────────────────────────────────────────── */}
        <div
          className="rounded-2xl border p-5 text-xs opacity-75"
          style={{ background: 'color-mix(in srgb, var(--sand) 30%, var(--paper))', borderColor: 'var(--sand)' }}
        >
          <p className="leading-relaxed" style={{ color: 'var(--ink)' }}>
            <strong>Regulatory Sources:</strong> Central Pollution Control Board (CPCB) India — E-Waste Management Rules 2022 · United Nations Global E-waste Monitor (GEM 2024) · WHO Chemical Safety Guidelines 2023. Campus points and collection estimates represent demonstration prototype data for Lovely Professional University.
          </p>
        </div>

      </div>
    </main>
  );
}
