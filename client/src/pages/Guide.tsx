import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, AlertTriangle, CheckCircle2, MapPin, Calendar,
  ChevronDown, Info, Battery, Zap,
  Monitor, Cpu, Lightbulb, Cable, Refrigerator,
} from 'lucide-react';
import { SectionHeading, Reveal } from '../components/ui';
import { CATEGORIES, type CategoryInfo } from '../data/categories';
import { GUIDE_ITEMS, type GuideItem, type GuideVerdict } from '../data/guideItems';

// ── Icon map for category accordions ────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  Monitor, Battery, Cpu, Lightbulb, Cable, Refrigerator,
};

// ── Verdict colour palette ────────────────────────────────────────────────────
const VERDICT_STYLES: Record<GuideVerdict, { bg: string; border: string; text: string; dot: string }> = {
  'E-waste':               { bg: 'var(--signal)',  border: 'rgba(107,143,113,0.3)',  text: '#fff', dot: 'var(--signal)' },
  'Special handling':      { bg: 'var(--rust)',    border: 'rgba(155,74,62,0.3)',    text: '#fff', dot: 'var(--rust)' },
  'Not e-waste':           { bg: '#6B7280',        border: 'rgba(107,114,128,0.3)',  text: '#fff', dot: '#6B7280' },
  'Repair or reuse first': { bg: 'var(--copper)',  border: 'rgba(181,101,45,0.3)',  text: '#fff', dot: 'var(--copper)' },
};

// ── Item result card ─────────────────────────────────────────────────────────
function ItemCard({ item }: { item: GuideItem }) {
  const style = VERDICT_STYLES[item.verdict];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border overflow-hidden bg-[var(--paper)]"
      style={{ borderColor: style.border }}
    >
      {/* Verdict banner */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ backgroundColor: style.bg }}
      >
        {item.verdict === 'E-waste' && <CheckCircle2 size={14} color="#fff" />}
        {item.verdict === 'Special handling' && <AlertTriangle size={14} color="#fff" />}
        {item.verdict === 'Not e-waste' && <Info size={14} color="#fff" />}
        {item.verdict === 'Repair or reuse first' && <Zap size={14} color="#fff" />}
        <span className="text-xs font-semibold tracking-wide" style={{ color: '#fff' }}>
          {item.verdict}
        </span>
      </div>

      <div className="p-4 space-y-3">
        <h4 className="text-sm font-semibold text-[var(--ink)]">{item.name}</h4>
        <p className="text-xs text-[var(--ink)]/65 leading-relaxed">{item.reason}</p>

        {item.beforeYouHandIn.length > 0 && (
          <div>
            <p className="text-xs font-medium text-[var(--ink)]/50 uppercase tracking-wider mb-1.5">
              Before you hand it in
            </p>
            <ul className="space-y-1">
              {item.beforeYouHandIn.map((step) => (
                <li key={step} className="flex items-start gap-2 text-xs text-[var(--ink)]/65">
                  <span className="mt-1 w-1 h-1 rounded-full bg-[var(--signal)] shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.disposalTip && (
          <div className="p-3 rounded-lg bg-[var(--rust)]/8 border border-[var(--rust)]/20">
            <p className="text-xs text-[var(--rust)] leading-relaxed">
              <strong>⚠ </strong>{item.disposalTip}
            </p>
          </div>
        )}

        {/* Action buttons */}
        {item.categorySlug ? (
          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              to={`/centers?category=${item.categorySlug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--signal)]/12 text-[var(--signal)] border border-[var(--signal)]/25 hover:bg-[var(--signal)]/20 transition-colors"
            >
              <MapPin size={12} /> Find a drop-off
            </Link>
            <Link
              to={`/pickup?category=${item.categorySlug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--copper)]/12 text-[var(--copper)] border border-[var(--copper)]/25 hover:bg-[var(--copper)]/20 transition-colors"
            >
              <Calendar size={12} /> Request collection
            </Link>
          </div>
        ) : (
          <p className="text-xs text-[var(--ink)]/40 italic">Not accepted in e-waste bins — see disposal tip above.</p>
        )}
      </div>
    </motion.div>
  );
}

// ── "Before you hand anything in" checklist ──────────────────────────────────
const CHECKLIST = [
  { n: '01', title: 'Back up your data', detail: 'Photos, contacts, documents — copy to cloud or another device before resetting.' },
  { n: '02', title: 'Sign out of accounts', detail: 'Google, Apple, Samsung, Microsoft — sign out so the next user or recycler cannot access them.' },
  { n: '03', title: 'Factory reset', detail: 'A factory reset wipes personal data from the device. Do this for phones, tablets, laptops, smart TVs, and routers.' },
  { n: '04', title: 'Remove SIM and SD cards', detail: 'These tiny cards hold a lot of personal data and are easy to miss.' },
  { n: '05', title: 'Remove removable batteries', detail: 'If the battery is removable (AA, coin cell), take it out and add it to the battery collection separately.' },
  { n: '06', title: 'Do not open or crush devices', detail: 'Opening a device voids its safe-handling properties. Crushed lithium batteries can ignite.' },
  { n: '07', title: 'Tape loose battery terminals', detail: 'Loose batteries (AA, AAA, coin cells) can short-circuit in transit. Put a strip of electrical tape over the terminals.' },
];

// ── Category accordion ────────────────────────────────────────────────────────
function CategoryAccordion({
  category, isOpen, onToggle,
}: {
  category: CategoryInfo;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = ICON_MAP[category.icon] ?? Cpu;
  return (
    <motion.div
      layout
      className={`rounded-xl border overflow-hidden transition-shadow duration-200 ${
        isOpen
          ? 'border-[var(--signal)]/40 shadow-lg shadow-[var(--ink)]/5'
          : 'border-[var(--sand)] hover:border-[var(--signal)]/30 hover:shadow-md'
      } bg-[var(--paper)]`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left group"
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200"
          style={{
            backgroundColor: isOpen ? category.color + '25' : category.color + '12',
            color: category.color,
          }}
        >
          <Icon size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[var(--ink)] text-base">{category.name}</h3>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border"
              style={{
                backgroundColor: category.color + '12',
                color: category.color,
                borderColor: category.color + '30',
              }}
            >
              <AlertTriangle size={9} />{category.riskLabel}
            </span>
          </div>
          <p className="text-xs text-[var(--ink)]/45 mt-0.5">
            {category.examples.slice(0, 4).join(', ')}…
          </p>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-[var(--ink)]/30"
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
                <p className="text-xs font-medium text-[var(--ink)]/50 uppercase tracking-wider mb-2">
                  What's in this category
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {category.examples.map((ex) => (
                    <span key={ex} className="px-2.5 py-1 text-xs bg-[var(--sand)] text-[var(--ink)]/70 rounded-md">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>

              {/* Why it matters */}
              <div className="p-4 rounded-lg bg-[var(--rust)]/6 border border-[var(--rust)]/15">
                <p className="text-xs font-medium text-[var(--rust)] mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle size={12} /> Why landfill disposal is harmful
                </p>
                <p className="text-sm text-[var(--ink)]/65 leading-relaxed">{category.hazardDetails}</p>
              </div>

              {/* What to do */}
              <div className="p-4 rounded-lg bg-[var(--signal)]/8 border border-[var(--signal)]/20">
                <p className="text-xs font-medium text-[var(--signal)] mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 size={12} /> What to do before handing in
                </p>
                <p className="text-sm text-[var(--ink)]/65 leading-relaxed">{category.whatToDo}</p>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/centers?category=${category.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[var(--signal)]/12 text-[var(--signal)] border border-[var(--signal)]/25 hover:bg-[var(--signal)]/20 transition-colors"
                >
                  <MapPin size={13} /> Find drop-off points for {category.shortName}
                </Link>
                <Link
                  to={`/pickup?category=${category.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[var(--copper)]/12 text-[var(--copper)] border border-[var(--copper)]/25 hover:bg-[var(--copper)]/20 transition-colors"
                >
                  <Calendar size={13} /> Request collection
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const VERDICT_FILTERS: { key: GuideVerdict | 'all'; label: string }[] = [
  { key: 'all', label: 'All items' },
  { key: 'E-waste', label: 'E-waste ✓' },
  { key: 'Special handling', label: 'Special handling ⚠' },
  { key: 'Not e-waste', label: 'Not e-waste ✗' },
  { key: 'Repair or reuse first', label: 'Repair first 🔧' },
];

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
    <main className="pt-24 section-pad bg-[var(--paper)]">
      <div className="max-w-content mx-auto px-4 md:px-6 space-y-16">

        {/* ── Section 1: Can I bin this? ────────────────────────────────── */}
        <section>
          <SectionHeading
            eyebrow="Quick check"
            title="Can I bin this? Check before you dispose."
            subtitle="Search any device or item to see whether it's e-waste, needs special handling, or is fine for the regular bin."
          />

          {/* Search + verdict filter */}
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink)]/35" />
                <input
                  id="item-search"
                  type="text"
                  placeholder="Search: phone, charger, CFL, power bank, extension cord…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-[var(--sand)] border border-[var(--sand)] rounded-lg text-[var(--ink)] placeholder:text-[var(--ink)]/35 focus:outline-none focus:border-[var(--signal)] focus:ring-2 focus:ring-[var(--signal)]/20 transition-all"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {VERDICT_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setVerdictFilter(f.key)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-150 ${
                      verdictFilter === f.key
                        ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                        : 'bg-transparent text-[var(--ink)]/60 border-[var(--sand)] hover:bg-[var(--sand)]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-3 text-xs text-[var(--ink)]/40">
              Showing {filteredItems.length} of {GUIDE_ITEMS.length} items
              {search && ` matching "${search}"`}
            </p>
          </Reveal>

          {/* Results grid */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <ItemCard key={item.name} item={item} />
              ))}
            </AnimatePresence>
            {filteredItems.length === 0 && (
              <div className="col-span-2 py-16 text-center text-[var(--ink)]/40">
                <Search size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">No items found for "{search}"</p>
                <p className="text-xs mt-1">Try a different name, or browse the categories below.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Section 2: Before you hand anything in ───────────────────── */}
        <section>
          <Reveal>
            <SectionHeading
              eyebrow="Universal checklist"
              title="Before you hand anything in — 7 critical steps"
              subtitle="These steps apply to every electronic item you hand to a collector or drop at a center."
            />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHECKLIST.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.06}>
                <div className="h-full p-5 rounded-xl border border-[var(--sand)] bg-[var(--sand)] space-y-2">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
                    >
                      {step.n}
                    </span>
                    <h4 className="text-sm font-semibold text-[var(--ink)]">{step.title}</h4>
                  </div>
                  <p className="text-xs text-[var(--ink)]/60 leading-relaxed pl-11">{step.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Section 3: Battery safety callout ────────────────────────── */}
        <section>
          <Reveal>
            <div className="p-6 rounded-2xl border-2 border-[var(--rust)]/40 bg-[var(--rust)]/5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[var(--rust)]/15">
                  <Battery size={20} style={{ color: 'var(--rust)' }} />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-widest uppercase text-[var(--rust)]">Battery safety</p>
                  <h3 className="text-[var(--ink)] mt-0.5">Swollen or damaged lithium batteries</h3>
                </div>
              </div>
              <p className="text-sm text-[var(--ink)]/70 leading-relaxed">
                Lithium batteries swell when the cells degrade internally, releasing flammable gas. A swollen battery can ignite or explode if punctured, crushed, or exposed to heat.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: '⛔', rule: 'Stop using it immediately. Do not charge a swollen battery.' },
                  { icon: '🚫', rule: 'Do not puncture, bend, or compress the battery in any way.' },
                  { icon: '🏜️', rule: 'Store it in a cool, dry place — away from paper, fabric, and anything flammable.' },
                  { icon: '📢', rule: 'Tell the collector it is a damaged or swollen battery before handing it over.' },
                ].map(({ icon, rule }) => (
                  <div key={rule} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--paper)] border border-[var(--rust)]/20">
                    <span className="text-lg shrink-0 mt-0.5">{icon}</span>
                    <p className="text-xs text-[var(--ink)]/70 leading-relaxed">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Section 4: Learn by category ─────────────────────────────── */}
        <section>
          <Reveal>
            <SectionHeading
              eyebrow="Deep dive"
              title="Learn by category"
              subtitle="Expand any category to see what goes in, why it's hazardous, what to do before handing it in, and where to take it."
            />
          </Reveal>
          <motion.div layout className="mt-6 space-y-3">
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

        {/* ── Sources footnote ──────────────────────────────────────────── */}
        <Reveal>
          <div className="p-5 bg-[var(--sand)] rounded-xl border border-[var(--sand)]">
            <p className="text-xs text-[var(--ink)]/50 leading-relaxed">
              <strong className="text-[var(--ink)]/70">Sources:</strong>{' '}
              Global E-waste Monitor 2024 (UNU/UNITAR/ITU) · WHO Environmental Health Guidelines 2023 · Basel Action Network · CPCB India — E-waste Management Rules 2022 · UNITAR, 2024.{' '}
              <span className="text-[var(--copper)]">
                Collection center data, impact numbers, and collection schedules shown on this site are sample data for demonstration purposes.
              </span>
            </p>
          </div>
        </Reveal>

      </div>
    </main>
  );
}
