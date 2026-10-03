import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Mail, Leaf, Wind, Package, Clock, CheckCircle2, AlertCircle, ChevronRight, LogOut, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PickupRecord {
  _id: string;
  trackingId: string;
  categories: string[];
  quantity: string;
  address: string;
  preferredWindow: string;
  contactName: string;
  contactEmail: string;
  status: 'requested' | 'scheduled' | 'collected';
  estimatedImpactKg: number;
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatChartDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const statusConfig = {
  requested: {
    label: 'Requested',
    icon: Clock,
    bg: 'bg-[var(--copper)]/10',
    text: 'text-[var(--copper)]',
    border: 'border-[var(--copper)]/30',
  },
  scheduled: {
    label: 'Scheduled',
    icon: AlertCircle,
    bg: 'bg-[var(--signal)]/10',
    text: 'text-[var(--signal)]',
    border: 'border-[var(--signal)]/30',
  },
  collected: {
    label: 'Collected',
    icon: CheckCircle2,
    bg: 'bg-[var(--moss)]/10',
    text: 'text-[var(--moss)]',
    border: 'border-[var(--moss)]/30',
  },
};

function slugToLabel(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

interface TooltipPayload {
  value: number;
  payload: PickupRecord;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div
      className="rounded-xl border px-4 py-3 text-sm shadow-lg"
      style={{
        background: 'var(--paper)',
        borderColor: 'var(--sand)',
        color: 'var(--ink)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <p className="font-medium" style={{ color: 'var(--moss)' }}>
        {d.value} kg diverted
      </p>
      <p className="mt-0.5 opacity-60">{formatChartDate(d.payload.createdAt)}</p>
      <p className="mt-0.5 opacity-60 text-xs">{d.payload.trackingId}</p>
    </div>
  );
}

// ─── Email Login Screen ───────────────────────────────────────────────────────

function EmailLoginScreen({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    onSubmit(trimmed);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex min-h-[70vh] items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
        {/* Icon */}
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: 'var(--moss)', color: 'var(--paper)' }}
        >
          <Leaf size={28} />
        </div>

        <h1
          className="mb-2 text-center text-3xl font-semibold leading-tight"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
        >
          Your impact dashboard
        </h1>
        <p className="mb-8 text-center text-sm" style={{ color: 'var(--ink)', opacity: 0.55 }}>
          Enter the email you used when scheduling a pickup to see your history and environmental
          impact.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: 'var(--ink)' }}
            >
              Email address
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40"
                style={{ color: 'var(--ink)' }}
              />
              <input
                ref={inputRef}
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="you@lpu.in"
                className="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-2"
                style={{
                  background: 'var(--paper)',
                  borderColor: error ? 'var(--rust)' : 'var(--sand)',
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-body)',
                  boxShadow: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--moss)';
                  e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--moss) 20%, transparent)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = error ? 'var(--rust)' : 'var(--sand)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            {error && (
              <p className="mt-1.5 text-xs" style={{ color: 'var(--rust)' }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'var(--moss)',
              color: 'var(--paper)',
              fontFamily: 'var(--font-body)',
            }}
          >
            View my impact <ChevronRight size={16} />
          </button>
        </form>

        {/* Hint */}
        <div
          className="mt-6 rounded-xl border px-4 py-3 text-xs"
          style={{
            borderColor: 'var(--sand)',
            color: 'var(--ink)',
            opacity: 0.65,
          }}
        >
          <span className="font-medium">Try it out:</span> Use{' '}
          <button
            type="button"
            className="underline underline-offset-2 hover:opacity-100"
            onClick={() => setEmail('sample.student1@lpu.in')}
          >
            sample.student1@lpu.in
          </button>{' '}
          or{' '}
          <button
            type="button"
            className="underline underline-offset-2 hover:opacity-100"
            onClick={() => setEmail('sample.faculty@lpu.in')}
          >
            sample.faculty@lpu.in
          </button>{' '}
          to see sample data.
        </div>
      </div>
    </motion.div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className ?? ''}`}
      style={{ background: 'var(--sand)', opacity: 0.55 }}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
      </div>
      <Skeleton className="h-48 rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-40 rounded" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ email, onReset }: { email: string; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-16 text-center"
    >
      <div
        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{ background: 'var(--sand)' }}
      >
        <Package size={24} style={{ color: 'var(--ink)', opacity: 0.5 }} />
      </div>
      <h3
        className="mb-2 text-lg font-semibold"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
      >
        No pickups found
      </h3>
      <p className="mb-1 text-sm" style={{ color: 'var(--ink)', opacity: 0.55 }}>
        No requests found for <strong>{email}</strong>.
      </p>
      <p className="mb-6 text-sm" style={{ color: 'var(--ink)', opacity: 0.45 }}>
        Have you scheduled a pickup yet?
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/pickup"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'var(--moss)', color: 'var(--paper)' }}
        >
          Schedule a pickup <ChevronRight size={15} />
        </Link>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition hover:scale-[1.02] active:scale-[0.98]"
          style={{ borderColor: 'var(--sand)', color: 'var(--ink)' }}
        >
          Try a different email
        </button>
      </div>
    </motion.div>
  );
}

// ─── Impact Metric Card ───────────────────────────────────────────────────────

function MetricCard({
  icon: Icon,
  value,
  unit,
  label,
  accent,
}: {
  icon: React.ElementType;
  value: string;
  unit: string;
  label: string;
  accent: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border p-6"
      style={{ background: 'var(--paper)', borderColor: 'var(--sand)' }}
    >
      <div
        className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ background: accent, opacity: 0.12 }}
      />
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `color-mix(in srgb, ${accent} 12%, transparent)` }}
        >
          <Icon size={20} style={{ color: accent }} />
        </div>
        <div>
          <p
            className="text-3xl font-semibold leading-none"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
          >
            {value}
            <span className="ml-1 text-base font-normal opacity-60">{unit}</span>
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink)', opacity: 0.55 }}>
            {label}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Pickup History Card ──────────────────────────────────────────────────────

function PickupCard({ pickup, index }: { pickup: PickupRecord; index: number }) {
  const sc = statusConfig[pickup.status];
  const StatusIcon = sc.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="rounded-2xl border p-5 transition hover:shadow-sm"
      style={{ background: 'var(--paper)', borderColor: 'var(--sand)' }}
    >
      {/* Header row */}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p
            className="text-xs font-medium opacity-50"
            style={{ color: 'var(--ink)', fontFamily: 'var(--font-body)' }}
          >
            Tracking ID
          </p>
          <p
            className="font-semibold tracking-wide"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '1rem' }}
          >
            {pickup.trackingId}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${sc.bg} ${sc.text} ${sc.border}`}
        >
          <StatusIcon size={12} />
          {sc.label}
        </span>
      </div>

      {/* Categories */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {pickup.categories.map((cat) => (
          <span
            key={cat}
            className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              background: 'color-mix(in srgb, var(--signal) 12%, transparent)',
              color: 'var(--ink)',
            }}
          >
            {slugToLabel(cat)}
          </span>
        ))}
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--ink)', opacity: 0.55 }}>
        <span className="flex items-center gap-1">
          <Package size={11} /> {pickup.quantity}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={11} /> {formatDate(pickup.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <Leaf size={11} />
          <strong style={{ color: 'var(--moss)', opacity: 1 }}>{pickup.estimatedImpactKg} kg</strong> diverted
        </span>
      </div>

      {/* Location */}
      <p className="mt-2 truncate text-xs opacity-40" style={{ color: 'var(--ink)' }}>
        {pickup.address}
      </p>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

function DashboardView({ email, pickups, onLogout }: { email: string; pickups: PickupRecord[]; onLogout: () => void }) {
  const totalKg = pickups.reduce((s, p) => s + p.estimatedImpactKg, 0);
  const totalCO2 = Math.round(totalKg * 1.5 * 10) / 10;

  const chartData = [...pickups]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((p) => ({
      ...p,
      date: formatChartDate(p.createdAt),
      kg: p.estimatedImpactKg,
    }));

  const barColors = ['var(--moss)', 'var(--copper)', 'var(--signal)', 'var(--rust)'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Top bar */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--moss)' }}>
            Your impact
          </p>
          <h1
            className="text-3xl font-semibold leading-tight"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
          >
            Personal dashboard
          </h1>
          <p className="mt-1 text-sm opacity-50" style={{ color: 'var(--ink)' }}>
            {email}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm transition hover:scale-[1.02] active:scale-[0.98]"
          style={{ borderColor: 'var(--sand)', color: 'var(--ink)', opacity: 0.65 }}
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>

      {/* Sample data notice */}
      <div
        className="mb-6 flex items-start gap-2 rounded-xl border px-4 py-3 text-xs"
        style={{ borderColor: 'var(--sand)', color: 'var(--ink)', opacity: 0.6 }}
      >
        <Info size={13} className="mt-0.5 shrink-0" />
        <span>
          Impact estimates are calculated from category weights and quantity ranges.{' '}
          <strong>Sample data</strong> — not verified measurements.
        </span>
      </div>

      {/* Metric Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard
          icon={Leaf}
          value={totalKg.toFixed(1)}
          unit="kg"
          label="Total diverted from landfill"
          accent="var(--moss)"
        />
        <MetricCard
          icon={Wind}
          value={totalCO2.toFixed(1)}
          unit="kg CO₂e"
          label="Estimated emissions avoided"
          accent="var(--copper)"
        />
      </div>

      {/* Chart */}
      {pickups.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 rounded-2xl border p-5"
          style={{ background: 'var(--paper)', borderColor: 'var(--sand)' }}
        >
          <p
            className="mb-4 font-semibold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '1rem' }}
          >
            Impact per request
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--sand)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: 'var(--ink)', opacity: 0.45, fontSize: 11, fontFamily: 'var(--font-body)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                unit=" kg"
                tick={{ fill: 'var(--ink)', opacity: 0.45, fontSize: 11, fontFamily: 'var(--font-body)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'color-mix(in srgb, var(--moss) 8%, transparent)' }} />
              <Bar dataKey="kg" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={barColors[i % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Pickup History */}
      <div>
        <p
          className="mb-4 font-semibold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '1.05rem' }}
        >
          Pickup history{' '}
          <span className="ml-1 text-sm font-normal opacity-40">({pickups.length})</span>
        </p>
        <div className="space-y-3">
          {pickups.map((p, i) => (
            <PickupCard key={p._id} pickup={p} index={i} />
          ))}
        </div>
      </div>

      {/* Schedule another */}
      <div className="mt-10 text-center">
        <Link
          to="/pickup"
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'var(--moss)', color: 'var(--paper)' }}
        >
          Schedule another pickup <ChevronRight size={15} />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const [pickups, setPickups] = useState<PickupRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailSubmit(submittedEmail: string) {
    setEmail(submittedEmail);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pickups?email=${encodeURIComponent(submittedEmail)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to load data');
      setPickups(json.data as PickupRecord[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setEmail(null);
    setPickups([]);
    setError(null);
  }

  return (
    <main className="min-h-screen pt-24 pb-20" style={{ background: 'var(--paper)' }}>
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <AnimatePresence mode="wait">
          {!email ? (
            <EmailLoginScreen key="login" onSubmit={handleEmailSubmit} />
          ) : loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-4"
            >
              <DashboardSkeleton />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="py-16 text-center"
            >
              <p className="mb-4 text-sm" style={{ color: 'var(--rust)' }}>
                {error}
              </p>
              <button
                onClick={handleLogout}
                className="rounded-xl border px-5 py-2.5 text-sm transition hover:scale-[1.02]"
                style={{ borderColor: 'var(--sand)', color: 'var(--ink)' }}
              >
                Go back
              </button>
            </motion.div>
          ) : pickups.length === 0 ? (
            <EmptyState key="empty" email={email} onReset={handleLogout} />
          ) : (
            <DashboardView key="dashboard" email={email} pickups={pickups} onLogout={handleLogout} />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
