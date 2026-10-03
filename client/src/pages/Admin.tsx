import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  RefreshCw,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Leaf,
  Layers,
  ArrowRight,
  Filter,
  Lock,
  ShieldCheck,
  Delete,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type PickupStatus = 'requested' | 'scheduled' | 'collected';

interface PickupRecord {
  _id: string;
  trackingId: string;
  categories: string[];
  quantity: string;
  address: string;
  preferredWindow: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: PickupStatus;
  estimatedImpactKg: number;
  createdAt: string;
}

// ─── Helpers & Configurations ─────────────────────────────────────────────────

const STATUS_DETAILS: Record<
  PickupStatus,
  {
    label: string;
    icon: typeof Clock;
    bg: string;
    text: string;
    border: string;
    description: string;
  }
> = {
  requested: {
    label: 'Requested',
    icon: Clock,
    bg: 'bg-[var(--copper)]/10',
    text: 'text-[var(--copper)]',
    border: 'border-[var(--copper)]/30',
    description: 'Awaiting collector schedule',
  },
  scheduled: {
    label: 'Scheduled',
    icon: AlertCircle,
    bg: 'bg-[var(--signal)]/15',
    text: 'text-[var(--signal)]',
    border: 'border-[var(--signal)]/30',
    description: 'Pickup window confirmed',
  },
  collected: {
    label: 'Collected',
    icon: CheckCircle2,
    bg: 'bg-[var(--moss)]/15',
    text: 'text-[var(--moss)]',
    border: 'border-[var(--moss)]/30',
    description: 'Received & routed to recycling',
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function slugToLabel(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ─── Status Badge Component ───────────────────────────────────────────────────

function StatusBadge({ status }: { status: PickupStatus }) {
  const config = STATUS_DETAILS[status];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text} ${config.border}`}
    >
      <Icon size={12} className="shrink-0" />
      {config.label}
    </span>
  );
}

// ─── Glassmorphism PIN Gate ──────────────────────────────────────────────────

const DEMO_PIN = '2026';

function AdminPinGate({ onAuthorize }: { onAuthorize: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    hiddenInputRef.current?.focus();
  }, []);

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const next = pin + digit;
      setPin(next);
      setError(false);
      if (next.length === 4) {
        if (next === DEMO_PIN) {
          onAuthorize();
        } else {
          setError(true);
          setIsShaking(true);
          setTimeout(() => {
            setIsShaking(false);
            setPin('');
          }, 650);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key >= '0' && e.key <= '9') {
      handleDigit(e.key);
    } else if (e.key === 'Backspace') {
      handleBackspace();
    }
  };

  return (
    <div className="relative min-h-[75vh] flex items-center justify-center px-4 py-12">
      {/* Ambient background glows for authentic glass refraction */}
      <div
        className="pointer-events-none absolute -top-10 left-1/4 h-72 w-72 rounded-full opacity-25 blur-3xl"
        style={{ background: 'var(--moss)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-10 right-1/4 h-72 w-72 rounded-full opacity-25 blur-3xl"
        style={{ background: 'var(--copper)' }}
      />

      {/* Hidden real input for mobile virtual keyboards */}
      <input
        ref={hiddenInputRef}
        type="tel"
        pattern="[0-9]*"
        maxLength={4}
        value={pin}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, '');
          if (val.length <= 4) {
            setPin(val);
            if (val.length === 4) {
              if (val === DEMO_PIN) onAuthorize();
              else {
                setError(true);
                setIsShaking(true);
                setTimeout(() => {
                  setIsShaking(false);
                  setPin('');
                }, 650);
              }
            }
          }
        }}
        className="sr-only"
        tabIndex={0}
      />

      {/* Frosted Glass Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          x: isShaking ? [-12, 12, -8, 8, -4, 4, 0] : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 28,
        }}
        onClick={() => hiddenInputRef.current?.focus()}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="relative z-10 w-full max-w-sm rounded-3xl p-8 shadow-2xl backdrop-blur-xl outline-none"
        style={{
          background: 'color-mix(in srgb, var(--paper) 75%, rgba(255, 255, 255, 0.45))',
          border: '1px solid rgba(255, 255, 255, 0.65)',
          boxShadow: '0 24px 60px -12px rgba(20, 23, 15, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        }}
      >
        {/* Lock Icon */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border"
          style={{
            background: 'color-mix(in srgb, var(--moss) 12%, transparent)',
            borderColor: 'color-mix(in srgb, var(--moss) 30%, transparent)',
            color: 'var(--moss)',
          }}
        >
          {error ? <Lock size={26} className="text-[var(--rust)]" /> : <ShieldCheck size={26} />}
        </div>

        <div className="text-center">
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider mb-1"
            style={{
              background: 'color-mix(in srgb, var(--signal) 15%, transparent)',
              color: 'var(--moss)',
            }}
          >
            LPU Collector Portal
          </span>
          <h2
            className="text-2xl font-semibold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
          >
            Team Verification
          </h2>
          <p className="mt-1 text-xs opacity-60 leading-relaxed" style={{ color: 'var(--ink)' }}>
            Enter your 4-digit campus dispatch PIN to access collection orders.
          </p>
        </div>

        {/* 4 PIN Indicators */}
        <div className="my-6 flex justify-center gap-3.5">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <motion.div
                key={index}
                animate={{
                  scale: isFilled ? [1, 1.2, 1] : 1,
                  borderColor: error ? 'var(--rust)' : isFilled ? 'var(--moss)' : 'var(--sand)',
                }}
                transition={{ duration: 0.2 }}
                className="flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-colors"
                style={{
                  background: isFilled
                    ? 'color-mix(in srgb, var(--moss) 18%, transparent)'
                    : 'rgba(255, 255, 255, 0.4)',
                }}
              >
                {isFilled && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-3 w-3 rounded-full"
                    style={{ background: error ? 'var(--rust)' : 'var(--moss)' }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Error message */}
        {error && (
          <p className="mb-4 text-center text-xs font-medium" style={{ color: 'var(--rust)' }}>
            Incorrect PIN. Please re-enter.
          </p>
        )}

        {/* Tactile Keypad */}
        <div className="grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <motion.button
              key={digit}
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => handleDigit(digit)}
              className="flex h-11 items-center justify-center rounded-xl text-base font-semibold transition shadow-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.65)',
                color: 'var(--ink)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {digit}
            </motion.button>
          ))}
          <div />
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => handleDigit('0')}
            className="flex h-11 items-center justify-center rounded-xl text-base font-semibold transition shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.65)',
              color: 'var(--ink)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              fontFamily: 'var(--font-body)',
            }}
          >
            0
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={handleBackspace}
            aria-label="Backspace"
            className="flex h-11 items-center justify-center rounded-xl transition shadow-sm opacity-70 hover:opacity-100"
            style={{
              background: 'rgba(255, 255, 255, 0.65)',
              color: 'var(--ink)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
            }}
          >
            <Delete size={18} />
          </motion.button>
        </div>

        {/* Quick Demo Autofill */}
        <div className="mt-5 pt-4 border-t text-center" style={{ borderColor: 'rgba(20, 23, 15, 0.08)' }}>
          <button
            type="button"
            onClick={() => {
              setPin('2026');
              setTimeout(() => onAuthorize(), 150);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition hover:scale-[1.03]"
            style={{
              background: 'color-mix(in srgb, var(--sand) 50%, white)',
              borderColor: 'var(--sand)',
              color: 'var(--ink)',
              opacity: 0.8,
            }}
          >
            <span>Demo PIN: <strong>2026</strong> (Click to unlock)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Admin Component ─────────────────────────────────────────────────────

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pickups, setPickups] = useState<PickupRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PickupStatus>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch all pickups
  async function fetchPickups(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/pickups/all');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to load pickups');
      setPickups(json.data as PickupRecord[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching collection requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchPickups();
  }, []);

  // Update status with optimistic UI update
  async function handleStatusChange(id: string, trackingId: string, nextStatus: PickupStatus) {
    if (updatingId) return;
    setUpdatingId(id);

    // Optimistic update
    const previousPickups = [...pickups];
    setPickups((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status: nextStatus } : item))
    );

    try {
      const res = await fetch(`/api/pickups/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to update status');

      // Update confirmed from server
      setPickups((prev) =>
        prev.map((item) => (item._id === id ? (json.data as PickupRecord) : item))
      );

      // Flash toast message
      setToastMessage(`Updated ${trackingId} to ${STATUS_DETAILS[nextStatus].label}`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      // Revert optimistic update
      setPickups(previousPickups);
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  }

  // Filtered and searched data
  const filteredPickups = useMemo(() => {
    return pickups.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.trackingId.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        item.contactName.toLowerCase().includes(q) ||
        item.contactEmail.toLowerCase().includes(q) ||
        item.contactPhone.toLowerCase().includes(q) ||
        item.categories.some((cat) => cat.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [pickups, statusFilter, searchQuery]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    const total = pickups.length;
    const requested = pickups.filter((p) => p.status === 'requested').length;
    const scheduled = pickups.filter((p) => p.status === 'scheduled').length;
    const collected = pickups.filter((p) => p.status === 'collected').length;
    const totalKg = pickups.reduce((sum, p) => sum + p.estimatedImpactKg, 0);
    return { total, requested, scheduled, collected, totalKg };
  }, [pickups]);

  return (
    <main className="min-h-screen pt-24 pb-20" style={{ background: 'var(--paper)' }}>
      {!isAuthenticated ? (
        <AdminPinGate onAuthorize={() => setIsAuthenticated(true)} />
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase"
                  style={{
                    background: 'color-mix(in srgb, var(--moss) 10%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--moss) 30%, transparent)',
                    color: 'var(--moss)',
                  }}
                >
                  Collector Portal · LPU Campus
                </span>
                <span
                  className="rounded-full border px-2 py-0.5 text-xs font-medium"
                  style={{
                    borderColor: 'var(--sand)',
                    color: 'var(--ink)',
                    opacity: 0.6,
                  }}
                >
                  Sample data
                </span>
              </div>
              <h1
                className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
              >
                Manage collection requests
              </h1>
              <p className="mt-1 text-sm md:text-base opacity-60" style={{ color: 'var(--ink)' }}>
                Coordinate pickups across Lovely Professional University hostel blocks and academic
                departments.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchPickups(true)}
                disabled={refreshing || loading}
                className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                style={{
                  borderColor: 'var(--sand)',
                  background: 'var(--paper)',
                  color: 'var(--ink)',
                }}
              >
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  borderColor: 'var(--sand)',
                  background: 'var(--paper)',
                  color: 'var(--ink)',
                  opacity: 0.75,
                }}
              >
                <Lock size={14} />
                <span>Lock</span>
              </button>
            </div>
          </div>

        {/* Toast alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-center justify-between rounded-xl border px-4 py-3 text-sm shadow-sm"
              style={{
                background: 'color-mix(in srgb, var(--moss) 12%, var(--paper))',
                borderColor: 'var(--moss)',
                color: 'var(--ink)',
              }}
            >
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 size={16} style={{ color: 'var(--moss)' }} />
                <span>{toastMessage}</span>
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="text-xs opacity-60 hover:opacity-100"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metric Overview Cards */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div
            className="rounded-2xl border p-4"
            style={{ background: 'var(--paper)', borderColor: 'var(--sand)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-60" style={{ color: 'var(--ink)' }}>
                Total Requests
              </span>
              <Layers size={16} className="opacity-40" />
            </div>
            <p
              className="mt-2 text-2xl font-semibold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
            >
              {metrics.total}
            </p>
          </div>

          <div
            className="rounded-2xl border p-4"
            style={{ background: 'var(--paper)', borderColor: 'var(--sand)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-60" style={{ color: 'var(--ink)' }}>
                Requested
              </span>
              <Clock size={16} style={{ color: 'var(--copper)' }} />
            </div>
            <p
              className="mt-2 text-2xl font-semibold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--copper)' }}
            >
              {metrics.requested}
            </p>
          </div>

          <div
            className="rounded-2xl border p-4"
            style={{ background: 'var(--paper)', borderColor: 'var(--sand)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-60" style={{ color: 'var(--ink)' }}>
                Scheduled
              </span>
              <AlertCircle size={16} style={{ color: 'var(--signal)' }} />
            </div>
            <p
              className="mt-2 text-2xl font-semibold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--signal)' }}
            >
              {metrics.scheduled}
            </p>
          </div>

          <div
            className="rounded-2xl border p-4"
            style={{ background: 'var(--paper)', borderColor: 'var(--sand)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-60" style={{ color: 'var(--ink)' }}>
                Collected
              </span>
              <CheckCircle2 size={16} style={{ color: 'var(--moss)' }} />
            </div>
            <p
              className="mt-2 text-2xl font-semibold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--moss)' }}
            >
              {metrics.collected}
            </p>
          </div>

          <div
            className="col-span-2 rounded-2xl border p-4 lg:col-span-1"
            style={{ background: 'var(--paper)', borderColor: 'var(--sand)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-60" style={{ color: 'var(--ink)' }}>
                Total E-Waste
              </span>
              <Leaf size={16} style={{ color: 'var(--moss)' }} />
            </div>
            <p
              className="mt-2 text-2xl font-semibold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
            >
              {metrics.totalKg.toFixed(1)}{' '}
              <span className="text-sm font-normal opacity-60">kg</span>
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div
          className="mb-6 flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between"
          style={{ background: 'var(--paper)', borderColor: 'var(--sand)' }}
        >
          {/* Status filter chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-medium opacity-50 mr-1">
              <Filter size={12} /> Status:
            </span>
            {(['all', 'requested', 'scheduled', 'collected'] as const).map((st) => {
              const active = statusFilter === st;
              const count =
                st === 'all'
                  ? pickups.length
                  : pickups.filter((p) => p.status === st).length;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                    active ? 'shadow-sm' : 'hover:opacity-80'
                  }`}
                  style={{
                    background: active ? 'var(--ink)' : 'var(--sand)',
                    color: active ? 'var(--paper)' : 'var(--ink)',
                  }}
                >
                  {st.charAt(0).toUpperCase() + st.slice(1)} ({count})
                </button>
              );
            })}
          </div>

          {/* Search input */}
          <div className="relative w-full md:w-72">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
              style={{ color: 'var(--ink)' }}
            />
            <input
              type="text"
              placeholder="Search ID, block, contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border py-2 pl-9 pr-3 text-xs outline-none transition focus:ring-2"
              style={{
                background: 'var(--paper)',
                borderColor: 'var(--sand)',
                color: 'var(--ink)',
              }}
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="mb-6 rounded-xl border p-4 text-sm"
            style={{
              background: 'color-mix(in srgb, var(--rust) 10%, var(--paper))',
              borderColor: 'var(--rust)',
              color: 'var(--rust)',
            }}
          >
            <p className="font-medium">Failed to load or update requests</p>
            <p className="mt-1 text-xs opacity-80">{error}</p>
            <button
              onClick={() => fetchPickups()}
              className="mt-3 rounded-lg border px-3 py-1 text-xs font-medium"
              style={{ borderColor: 'var(--rust)' }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="animate-pulse rounded-2xl border p-6"
                style={{ background: 'var(--sand)', opacity: 0.4 }}
              >
                <div className="h-6 w-1/3 rounded bg-current opacity-20 mb-3" />
                <div className="h-4 w-2/3 rounded bg-current opacity-15" />
              </div>
            ))}
          </div>
        ) : filteredPickups.length === 0 ? (
          /* Empty State */
          <div
            className="rounded-2xl border py-16 text-center"
            style={{ background: 'var(--paper)', borderColor: 'var(--sand)' }}
          >
            <Package size={36} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--ink)' }} />
            <h3
              className="text-lg font-semibold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
            >
              No collection requests found
            </h3>
            <p className="mt-1 text-sm opacity-50" style={{ color: 'var(--ink)' }}>
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search query or status filter.'
                : 'No pickup requests have been submitted yet.'}
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="mt-4 rounded-xl border px-4 py-2 text-xs font-medium"
                style={{ borderColor: 'var(--sand)', color: 'var(--ink)' }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View (visible on lg screens) */}
            <div
              className="hidden overflow-hidden rounded-2xl border lg:block shadow-sm"
              style={{ background: 'var(--paper)', borderColor: 'var(--sand)' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr
                      className="border-b text-xs font-semibold uppercase tracking-wider"
                      style={{
                        borderColor: 'var(--sand)',
                        background: 'color-mix(in srgb, var(--sand) 35%, var(--paper))',
                        color: 'var(--ink)',
                        opacity: 0.75,
                      }}
                    >
                      <th className="py-3.5 pl-6 pr-4">Tracking ID & Date</th>
                      <th className="px-4 py-3.5">Campus Location</th>
                      <th className="px-4 py-3.5">Items & Impact</th>
                      <th className="px-4 py-3.5">Contact Person</th>
                      <th className="px-4 py-3.5">Preferred Window</th>
                      <th className="py-3.5 pl-4 pr-6">Status & Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--sand)' }}>
                    {filteredPickups.map((item) => {
                      const isUpdating = updatingId === item._id;

                      return (
                        <tr
                          key={item._id}
                          className="transition hover:bg-black/[0.015]"
                          style={{ borderColor: 'var(--sand)' }}
                        >
                          {/* Tracking ID & Date */}
                          <td className="py-4 pl-6 pr-4 align-top">
                            <span
                              className="font-semibold tracking-wide block"
                              style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
                            >
                              {item.trackingId}
                            </span>
                            <span className="text-xs opacity-50 flex items-center gap-1 mt-1">
                              <Calendar size={11} />
                              {formatDate(item.createdAt)}
                            </span>
                          </td>

                          {/* Campus Location */}
                          <td className="px-4 py-4 align-top max-w-xs">
                            <div className="flex items-start gap-1.5">
                              <MapPin size={14} className="shrink-0 mt-0.5 opacity-60 text-[var(--copper)]" />
                              <span className="text-xs font-medium leading-relaxed" style={{ color: 'var(--ink)' }}>
                                {item.address}
                              </span>
                            </div>
                          </td>

                          {/* Items & Impact */}
                          <td className="px-4 py-4 align-top max-w-xs">
                            <div className="flex flex-wrap gap-1 mb-1.5">
                              {item.categories.map((cat) => (
                                <span
                                  key={cat}
                                  className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                                  style={{
                                    background: 'color-mix(in srgb, var(--signal) 14%, transparent)',
                                    color: 'var(--ink)',
                                  }}
                                >
                                  {slugToLabel(cat)}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 text-xs opacity-60">
                              <span>{item.quantity}</span>
                              <span>·</span>
                              <span className="font-semibold" style={{ color: 'var(--moss)', opacity: 1 }}>
                                {item.estimatedImpactKg} kg
                              </span>
                            </div>
                          </td>

                          {/* Contact Person */}
                          <td className="px-4 py-4 align-top">
                            <div className="space-y-0.5 text-xs">
                              <p className="font-medium flex items-center gap-1.5" style={{ color: 'var(--ink)' }}>
                                <User size={12} className="opacity-50" />
                                {item.contactName}
                              </p>
                              <p className="opacity-60 flex items-center gap-1.5">
                                <Mail size={12} className="opacity-40" />
                                <a href={`mailto:${item.contactEmail}`} className="hover:underline">
                                  {item.contactEmail}
                                </a>
                              </p>
                              <p className="opacity-60 flex items-center gap-1.5">
                                <Phone size={12} className="opacity-40" />
                                <a href={`tel:${item.contactPhone}`} className="hover:underline">
                                  {item.contactPhone}
                                </a>
                              </p>
                            </div>
                          </td>

                          {/* Preferred Window */}
                          <td className="px-4 py-4 align-top">
                            <span className="text-xs font-medium block" style={{ color: 'var(--ink)', opacity: 0.8 }}>
                              {item.preferredWindow}
                            </span>
                          </td>

                          {/* Status & Actions */}
                          <td className="py-4 pl-4 pr-6 align-top">
                            <div className="space-y-2">
                              <div>
                                <StatusBadge status={item.status} />
                              </div>

                              {/* Action selector buttons */}
                              <div className="flex items-center gap-1.5 pt-1">
                                {item.status !== 'scheduled' && (
                                  <button
                                    onClick={() => handleStatusChange(item._id, item.trackingId, 'scheduled')}
                                    disabled={isUpdating}
                                    title="Mark Scheduled"
                                    className="rounded-lg border px-2 py-1 text-[11px] font-medium transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                    style={{
                                      borderColor: 'var(--signal)',
                                      color: 'var(--signal)',
                                      background: 'color-mix(in srgb, var(--signal) 8%, transparent)',
                                    }}
                                  >
                                    Schedule
                                  </button>
                                )}
                                {item.status !== 'collected' && (
                                  <button
                                    onClick={() => handleStatusChange(item._id, item.trackingId, 'collected')}
                                    disabled={isUpdating}
                                    title="Mark Collected"
                                    className="rounded-lg border px-2 py-1 text-[11px] font-medium transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                    style={{
                                      borderColor: 'var(--moss)',
                                      color: 'var(--moss)',
                                      background: 'color-mix(in srgb, var(--moss) 8%, transparent)',
                                    }}
                                  >
                                    Collect
                                  </button>
                                )}
                                {item.status !== 'requested' && (
                                  <button
                                    onClick={() => handleStatusChange(item._id, item.trackingId, 'requested')}
                                    disabled={isUpdating}
                                    title="Revert to Requested"
                                    className="rounded-lg border px-2 py-1 text-[11px] font-medium transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                    style={{
                                      borderColor: 'var(--sand)',
                                      color: 'var(--ink)',
                                      opacity: 0.65,
                                    }}
                                  >
                                    Reset
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile / Tablet Card View (visible below lg screen) */}
            <div className="space-y-4 lg:hidden">
              {filteredPickups.map((item) => {
                const isUpdating = updatingId === item._id;

                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border p-5 shadow-sm"
                    style={{ background: 'var(--paper)', borderColor: 'var(--sand)' }}
                  >
                    {/* Top Row: Tracking ID and Status */}
                    <div className="flex items-start justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--sand)' }}>
                      <div>
                        <span className="text-[11px] uppercase tracking-wider opacity-50 block">Tracking ID</span>
                        <span
                          className="text-base font-semibold"
                          style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
                        >
                          {item.trackingId}
                        </span>
                        <span className="text-xs opacity-50 block mt-0.5">{formatDate(item.createdAt)}</span>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    {/* Location */}
                    <div className="mt-3 flex items-start gap-2">
                      <MapPin size={15} className="shrink-0 mt-0.5 text-[var(--copper)]" />
                      <div>
                        <span className="text-xs font-medium block" style={{ color: 'var(--ink)' }}>
                          {item.address}
                        </span>
                        <span className="text-xs opacity-60 block mt-0.5">
                          Window: {item.preferredWindow}
                        </span>
                      </div>
                    </div>

                    {/* Items & Impact */}
                    <div className="mt-3 rounded-xl border p-3" style={{ borderColor: 'var(--sand)', background: 'color-mix(in srgb, var(--sand) 15%, var(--paper))' }}>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.categories.map((cat) => (
                          <span
                            key={cat}
                            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                            style={{
                              background: 'color-mix(in srgb, var(--signal) 15%, transparent)',
                              color: 'var(--ink)',
                            }}
                          >
                            {slugToLabel(cat)}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="opacity-60">{item.quantity}</span>
                        <span className="font-semibold" style={{ color: 'var(--moss)' }}>
                          {item.estimatedImpactKg} kg diverted
                        </span>
                      </div>
                    </div>

                    {/* Contact Person */}
                    <div className="mt-3 space-y-1 text-xs">
                      <p className="font-medium flex items-center gap-1.5" style={{ color: 'var(--ink)' }}>
                        <User size={12} className="opacity-50" />
                        {item.contactName}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 opacity-70">
                        <a href={`mailto:${item.contactEmail}`} className="flex items-center gap-1 hover:underline">
                          <Mail size={11} /> {item.contactEmail}
                        </a>
                        <a href={`tel:${item.contactPhone}`} className="flex items-center gap-1 hover:underline">
                          <Phone size={11} /> {item.contactPhone}
                        </a>
                      </div>
                    </div>

                    {/* Action buttons on mobile */}
                    <div className="mt-4 pt-3 border-t flex items-center gap-2" style={{ borderColor: 'var(--sand)' }}>
                      <span className="text-xs opacity-50 mr-1 flex items-center gap-0.5">
                        <ArrowRight size={12} /> Set:
                      </span>
                      {item.status !== 'scheduled' && (
                        <button
                          onClick={() => handleStatusChange(item._id, item.trackingId, 'scheduled')}
                          disabled={isUpdating}
                          className="flex-1 rounded-xl border py-2 text-xs font-medium transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                          style={{
                            borderColor: 'var(--signal)',
                            color: 'var(--signal)',
                            background: 'color-mix(in srgb, var(--signal) 8%, transparent)',
                          }}
                        >
                          Mark Scheduled
                        </button>
                      )}
                      {item.status !== 'collected' && (
                        <button
                          onClick={() => handleStatusChange(item._id, item.trackingId, 'collected')}
                          disabled={isUpdating}
                          className="flex-1 rounded-xl border py-2 text-xs font-medium transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                          style={{
                            borderColor: 'var(--moss)',
                            color: 'var(--moss)',
                            background: 'color-mix(in srgb, var(--moss) 8%, transparent)',
                          }}
                        >
                          Mark Collected
                        </button>
                      )}
                      {item.status !== 'requested' && (
                        <button
                          onClick={() => handleStatusChange(item._id, item.trackingId, 'requested')}
                          disabled={isUpdating}
                          className="rounded-xl border px-3 py-2 text-xs font-medium transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                          style={{
                            borderColor: 'var(--sand)',
                            color: 'var(--ink)',
                            opacity: 0.7,
                          }}
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
      )}
    </main>
  );
}
