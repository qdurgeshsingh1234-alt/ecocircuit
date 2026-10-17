import { useState, useEffect, useMemo } from 'react';
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
  Filter,
  ShieldAlert,
  ShieldCheck,
  Lock,
  LayoutGrid,
  Kanban,
  Check,
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

// ─── Status Configurations ────────────────────────────────────────────────────
const STATUS_DETAILS: Record<
  PickupStatus,
  {
    step: number;
    label: string;
    icon: typeof Clock;
    bannerBg: string;
    bannerBorder: string;
    badgeBg: string;
    text: string;
    border: string;
  }
> = {
  requested: {
    step: 1,
    label: 'Requested',
    icon: Clock,
    bannerBg: 'bg-[#FFF3E6]',
    bannerBorder: 'border-[#B5652D]/25',
    badgeBg: 'bg-[#B5652D]/15',
    text: 'text-[#B5652D]',
    border: 'border-[#B5652D]/30',
  },
  scheduled: {
    step: 2,
    label: 'Scheduled',
    icon: AlertCircle,
    bannerBg: 'bg-[#EBF3FA]',
    bannerBorder: 'border-[#3B6E8C]/25',
    badgeBg: 'bg-[#3B6E8C]/15',
    text: 'text-[#3B6E8C]',
    border: 'border-[#3B6E8C]/30',
  },
  collected: {
    step: 3,
    label: 'Collected',
    icon: CheckCircle2,
    bannerBg: 'bg-[#E6F4EC]',
    bannerBorder: 'border-[#2F4E3A]/25',
    badgeBg: 'bg-[#2F4E3A]/15',
    text: 'text-[#2F4E3A]',
    border: 'border-[#2F4E3A]/30',
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

// ─── 3D Hardware PIN Authentication Gate ──────────────────────────────────────
const DEMO_PIN = '2026';

function AdminPinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    setError(false);
    if (next.length === 4) {
      if (next === DEMO_PIN) {
        setTimeout(() => onUnlock(), 180);
      } else {
        setError(true);
        setTimeout(() => setPin(''), 550);
      }
    }
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleDigit(e.key);
      else if (e.key === 'Backspace') handleBackspace();
      else if (e.key === 'Escape') handleClear();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div className="py-12 px-4 flex flex-col items-center justify-center min-h-[75vh]">
      <div className="w-full max-w-md card-3d-tactile p-8 bg-[#F4F1E9] relative overflow-hidden">
        {/* 4 Tactile Corner Copper Rivets */}
        <span className="absolute top-3.5 left-3.5 w-2.5 h-2.5 rounded-full bg-[#B5652D]/40 border border-[#14170F]/30" />
        <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-[#B5652D]/40 border border-[#14170F]/30" />
        <span className="absolute bottom-3.5 left-3.5 w-2.5 h-2.5 rounded-full bg-[#B5652D]/40 border border-[#14170F]/30" />
        <span className="absolute bottom-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-[#B5652D]/40 border border-[#14170F]/30" />

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#2F4E3A] text-[#F4F1E9] flex items-center justify-center shadow-[0_4px_0_0_#182B1F] mb-4 border border-[#14170F]/20">
            <ShieldCheck className="w-7 h-7 text-[#E4DCC6]" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#B5652D] font-semibold">
            LPU Campus Collector Terminal
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#14170F] mt-1">
            Operator Authentication
          </h2>
          <p className="text-xs text-[#14170F]/70 mt-1 max-w-xs">
            Enter 4-digit security access code to manage campus e-waste collection requests
          </p>
        </div>

        {/* 4 LED PIN Display Slots */}
        <div className="grid grid-cols-4 gap-3 mb-5 p-3.5 rounded-xl bg-[#14170F] border-2 border-[#2F4E3A]/40 shadow-inner">
          {[0, 1, 2, 3].map((idx) => {
            const filled = idx < pin.length;
            return (
              <div
                key={idx}
                className={`h-12 rounded-lg flex items-center justify-center font-mono text-xl font-bold transition-all duration-200 border ${
                  error
                    ? 'bg-[#9B4A3E]/30 border-[#9B4A3E] text-[#F4F1E9]'
                    : filled
                    ? 'bg-[#2F4E3A]/50 border-[#6B8F71] text-[#F4F1E9] shadow-[0_0_12px_rgba(107,143,113,0.4)]'
                    : 'bg-[#F4F1E9]/5 border-[#F4F1E9]/15 text-[#F4F1E9]/30'
                }`}
              >
                {filled ? '●' : '_'}
              </div>
            );
          })}
        </div>

        {error && (
          <p className="text-center text-xs font-mono text-[#9B4A3E] font-semibold mb-4">
            ⚠ INVALID OPERATOR CODE — TRY 2026
          </p>
        )}

        {/* 3D Mechanical Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="h-12 rounded-xl bg-[#E4DCC6]/70 hover:bg-[#E4DCC6] text-[#14170F] font-mono text-lg font-bold border border-[#14170F]/15 shadow-[0_4px_0_0_#C8BFA8] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-12 rounded-xl bg-[#9B4A3E]/15 hover:bg-[#9B4A3E]/25 text-[#9B4A3E] font-mono text-xs font-bold uppercase tracking-wider border border-[#9B4A3E]/30 shadow-[0_4px_0_0_rgba(155,74,62,0.25)] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            CLR
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-12 rounded-xl bg-[#E4DCC6]/70 hover:bg-[#E4DCC6] text-[#14170F] font-mono text-lg font-bold border border-[#14170F]/15 shadow-[0_4px_0_0_#C8BFA8] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-12 rounded-xl bg-[#E4DCC6]/70 hover:bg-[#E4DCC6] text-[#14170F] font-mono text-xs font-bold uppercase tracking-wider border border-[#14170F]/15 shadow-[0_4px_0_0_#C8BFA8] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            DEL
          </button>
        </div>

        {/* Demo Quick-Unlock Footer */}
        <div className="pt-4 border-t border-[#14170F]/10 flex items-center justify-between gap-2">
          <div className="text-xs text-[#14170F]/70 font-mono">
            Demo PIN: <strong className="text-[#14170F] bg-[#E4DCC6] px-1.5 py-0.5 rounded">2026</strong>
          </div>
          <button
            type="button"
            onClick={() => onUnlock()}
            className="text-xs font-mono font-semibold text-[#B5652D] hover:text-[#14170F] underline underline-offset-4 cursor-pointer"
          >
            Quick Unlock (Demo) →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tactile Dispatch Ticket Card Component ───────────────────────────────────
function DispatchTicketCard({
  item,
  onStatusChange,
  isUpdating,
}: {
  item: PickupRecord;
  onStatusChange: (id: string, trackingId: string, status: PickupStatus) => void;
  isUpdating: boolean;
}) {
  const config = STATUS_DETAILS[item.status];
  const StatusIcon = config.icon;

  return (
    <div className="card-3d-tactile overflow-hidden bg-[#F4F1E9] flex flex-col justify-between">
      {/* ── Top Status Banner Strip ── */}
      <div className={`px-5 py-3 border-b ${config.bannerBg} ${config.bannerBorder} flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-sm font-bold text-[#14170F] bg-[#14170F]/8 px-2.5 py-1 rounded-md border border-[#14170F]/10">
            {item.trackingId}
          </span>
          <span className="text-xs font-mono text-[#14170F]/60 flex items-center gap-1">
            <Calendar size={12} className="text-[#B5652D]" />
            {formatDate(item.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#2F4E3A] bg-[#2F4E3A]/10 px-2.5 py-1 rounded-md border border-[#2F4E3A]/20">
            ⚡ {item.estimatedImpactKg} kg
          </span>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono ${config.badgeBg} ${config.text}`}>
            <StatusIcon size={12} />
            {config.label}
          </span>
        </div>
      </div>

      {/* ── Body Grid (2 Clean Columns) ── */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Location & Window */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#14170F]/50 block">
            Hostel / Pickup Point:
          </span>
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-[#B5652D] shrink-0 mt-0.5" />
            <span className="text-sm font-semibold text-[#14170F] leading-snug">
              {item.address}
            </span>
          </div>
          <div className="pt-1">
            <span className="inline-block text-xs font-medium text-[#14170F]/80 bg-[#E4DCC6]/60 px-2.5 py-1 rounded-lg border border-[#14170F]/10">
              🕒 Window: <strong>{item.preferredWindow}</strong>
            </span>
          </div>
        </div>

        {/* Right Column: Contact & Categories */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#14170F]/50 block">
            Student Contact:
          </span>
          <div className="text-xs space-y-1">
            <p className="font-bold text-sm text-[#14170F] flex items-center gap-1.5">
              <User size={13} className="text-[#2F4E3A]" />
              {item.contactName}
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-mono pt-0.5">
              <a
                href={`mailto:${item.contactEmail}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#14170F]/5 hover:bg-[#14170F]/10 text-[#14170F]"
              >
                <Mail size={11} className="text-[#B5652D]" />
                {item.contactEmail}
              </a>
              <a
                href={`tel:${item.contactPhone}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#14170F]/5 hover:bg-[#14170F]/10 text-[#14170F]"
              >
                <Phone size={11} className="text-[#2F4E3A]" />
                {item.contactPhone}
              </a>
            </div>
          </div>

          <div className="pt-1 flex flex-wrap gap-1">
            {item.categories.map((cat) => (
              <span
                key={cat}
                className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#2F4E3A]/10 text-[#2F4E3A] border border-[#2F4E3A]/20"
              >
                {slugToLabel(cat)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Interactive 3-Step Pipeline Bar ── */}
      <div className="p-4 bg-[#E4DCC6]/25 border-t border-[#14170F]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Visual Progress Track */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className={`px-2 py-0.5 rounded font-bold ${item.status === 'requested' ? 'bg-[#B5652D] text-white' : 'bg-[#14170F]/10 text-[#14170F]'}`}>
            1. Req
          </span>
          <span className="text-[#14170F]/30">━</span>
          <span className={`px-2 py-0.5 rounded font-bold ${item.status === 'scheduled' ? 'bg-[#3B6E8C] text-white' : 'bg-[#14170F]/10 text-[#14170F]'}`}>
            2. Sched
          </span>
          <span className="text-[#14170F]/30">━</span>
          <span className={`px-2 py-0.5 rounded font-bold ${item.status === 'collected' ? 'bg-[#2F4E3A] text-white' : 'bg-[#14170F]/10 text-[#14170F]'}`}>
            3. Done
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          {item.status !== 'scheduled' && (
            <button
              type="button"
              onClick={() => onStatusChange(item._id, item.trackingId, 'scheduled')}
              disabled={isUpdating}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[#3B6E8C]/40 text-[#3B6E8C] bg-[#3B6E8C]/10 hover:bg-[#3B6E8C]/20 transition cursor-pointer disabled:opacity-50"
            >
              Schedule Pickup →
            </button>
          )}
          {item.status !== 'collected' && (
            <button
              type="button"
              onClick={() => onStatusChange(item._id, item.trackingId, 'collected')}
              disabled={isUpdating}
              className="btn-3d-moss px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Check size={12} /> Mark Collected
            </button>
          )}
          {item.status !== 'requested' && (
            <button
              type="button"
              onClick={() => onStatusChange(item._id, item.trackingId, 'requested')}
              disabled={isUpdating}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium border border-[#14170F]/20 text-[#14170F]/70 hover:bg-[#E4DCC6] transition cursor-pointer disabled:opacity-50"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Component ─────────────────────────────────────────────────────
export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('ecocircuit_admin_auth') === 'true';
  });

  const [viewMode, setViewMode] = useState<'tickets' | 'kanban'>('tickets');
  const [pickups, setPickups] = useState<PickupRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PickupStatus>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleUnlock = () => {
    sessionStorage.setItem('ecocircuit_admin_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLock = () => {
    sessionStorage.removeItem('ecocircuit_admin_auth');
    setIsAuthenticated(false);
  };

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
    if (isAuthenticated) {
      fetchPickups();
    }
  }, [isAuthenticated]);

  async function handleStatusChange(id: string, trackingId: string, nextStatus: PickupStatus) {
    if (updatingId) return;
    setUpdatingId(id);

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

      setPickups((prev) =>
        prev.map((item) => (item._id === id ? (json.data as PickupRecord) : item))
      );

      setToastMessage(`Updated ${trackingId} to ${STATUS_DETAILS[nextStatus].label}`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      setPickups(previousPickups);
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  }

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

  const metrics = useMemo(() => {
    const total = pickups.length;
    const requested = pickups.filter((p) => p.status === 'requested').length;
    const scheduled = pickups.filter((p) => p.status === 'scheduled').length;
    const collected = pickups.filter((p) => p.status === 'collected').length;
    const totalKg = pickups.reduce((sum, p) => sum + p.estimatedImpactKg, 0);
    return { total, requested, scheduled, collected, totalKg };
  }, [pickups]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen pt-24 pb-20 interactive-spotlight-bg">
        <AdminPinGate onUnlock={handleUnlock} />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 interactive-spotlight-bg">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-14">
        {/* Demo-Only Administration Banner */}
        <div className="mb-8 rounded-2xl border border-[#B5652D]/30 bg-[#B5652D]/10 p-4 text-xs sm:text-sm font-medium flex items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <ShieldAlert size={20} className="text-[#B5652D] shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-bold text-[#14170F] block sm:inline">
                Demo-Only Administration Interface
              </span>
              <span className="opacity-75 sm:ml-2 block sm:inline text-xs text-[#14170F]">
                (CHE110 Academic Prototype. Advance requests through: Requested → Scheduled → Collected.)
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#B5652D]/20 text-[#B5652D] shrink-0">
            PIN: 2026 Active
          </span>
        </div>

        {/* Error notification banner if any */}
        {error && (
          <div className="mb-6 rounded-xl border border-[#9B4A3E]/30 bg-[#9B4A3E]/10 p-4 text-xs sm:text-sm text-[#9B4A3E] font-medium flex items-center gap-3">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Header with Lock Terminal & View Switcher */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2F4E3A]/30 bg-[#2F4E3A]/10 px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase text-[#2F4E3A]">
                Collector Portal · LPU Campus
              </span>
              <span className="rounded-full border border-[#14170F]/15 px-2 py-0.5 text-xs font-mono text-[#14170F]/60">
                Sample data
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-serif font-bold text-[#14170F] tracking-tight md:text-4xl">
              Hostel Collection Dispatch Board
            </h1>
            <p className="mt-1 text-sm text-[#14170F]/70">
              Coordinate pickups across Lovely Professional University hostel blocks and academic departments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher */}
            <div className="p-1 rounded-xl bg-[#E4DCC6]/60 border border-[#14170F]/15 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMode('tickets')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'tickets'
                    ? 'bg-[#14170F] text-[#F4F1E9] shadow-xs'
                    : 'text-[#14170F]/70 hover:text-[#14170F]'
                }`}
              >
                <LayoutGrid size={13} />
                <span>Tickets Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-[#14170F] text-[#F4F1E9] shadow-xs'
                    : 'text-[#14170F]/70 hover:text-[#14170F]'
                }`}
              >
                <Kanban size={13} />
                <span>Kanban Pipeline</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => fetchPickups(true)}
              disabled={refreshing || loading}
              className="btn-3d-moss px-3.5 py-2 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleLock}
              className="btn-3d-copper px-3.5 py-2 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Lock size={13} />
              <span>Lock Terminal</span>
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
              className="mb-6 flex items-center justify-between rounded-xl border border-[#2F4E3A] bg-[#2F4E3A]/12 px-4 py-3 text-sm shadow-sm"
            >
              <div className="flex items-center gap-2 font-medium text-[#14170F]">
                <CheckCircle2 size={16} className="text-[#2F4E3A]" />
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-xs opacity-60 hover:opacity-100 font-mono"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metric Overview Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="card-3d-tactile p-5 bg-[#F4F1E9]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold opacity-65 text-[#14170F]">
                Total Requests
              </span>
              <Layers size={16} className="opacity-40" />
            </div>
            <p className="mt-2 text-2xl font-serif font-bold text-[#14170F]">
              {metrics.total}
            </p>
          </div>

          <div className="card-3d-tactile p-5 bg-[#F4F1E9]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#B5652D]">
                Requested
              </span>
              <Clock size={16} className="text-[#B5652D]" />
            </div>
            <p className="mt-2 text-2xl font-serif font-bold text-[#B5652D]">
              {metrics.requested}
            </p>
          </div>

          <div className="card-3d-tactile p-5 bg-[#F4F1E9]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#3B6E8C]">
                Scheduled
              </span>
              <AlertCircle size={16} className="text-[#3B6E8C]" />
            </div>
            <p className="mt-2 text-2xl font-serif font-bold text-[#3B6E8C]">
              {metrics.scheduled}
            </p>
          </div>

          <div className="card-3d-tactile p-5 bg-[#F4F1E9]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#2F4E3A]">
                Collected
              </span>
              <CheckCircle2 size={16} className="text-[#2F4E3A]" />
            </div>
            <p className="mt-2 text-2xl font-serif font-bold text-[#2F4E3A]">
              {metrics.collected}
            </p>
          </div>

          <div className="col-span-2 rounded-2xl card-3d-tactile p-5 bg-[#F4F1E9] lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold opacity-65 text-[#14170F]">
                Total E-Waste
              </span>
              <Leaf size={16} className="text-[#2F4E3A]" />
            </div>
            <p className="mt-2 text-2xl font-serif font-bold text-[#14170F]">
              {metrics.totalKg.toFixed(1)}{' '}
              <span className="text-sm font-normal font-sans opacity-60">kg</span>
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="card-3d-tactile mb-8 flex flex-col gap-4 p-5 bg-[#F4F1E9] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-mono font-bold opacity-60 mr-1">
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
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium border transition cursor-pointer ${
                    active
                      ? 'bg-[#14170F] text-[#F4F1E9] border-[#14170F] shadow-xs font-semibold'
                      : 'bg-[#E4DCC6]/60 text-[#14170F] border-[#14170F]/15 hover:bg-[#E4DCC6]'
                  }`}
                >
                  {st.charAt(0).toUpperCase() + st.slice(1)} ({count})
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-40 text-[#14170F]"
            />
            <input
              type="text"
              placeholder="Search tracking ID, block, contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#14170F]/20 bg-[#F4F1E9] py-2 pl-9 pr-3 text-xs outline-none focus:border-[#2F4E3A] focus:ring-1 focus:ring-[#2F4E3A]"
            />
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="card-3d-tactile animate-pulse p-6 bg-[#F4F1E9] space-y-4">
                <div className="h-6 w-1/3 rounded bg-[#E4DCC6]" />
                <div className="h-4 w-2/3 rounded bg-[#E4DCC6]" />
              </div>
            ))}
          </div>
        ) : filteredPickups.length === 0 ? (
          <div className="card-3d-tactile rounded-2xl py-16 text-center bg-[#F4F1E9]">
            <Package size={36} className="mx-auto mb-3 opacity-30 text-[#14170F]" />
            <h3 className="text-lg font-serif font-bold text-[#14170F]">
              No collection requests found
            </h3>
            <p className="mt-1 text-sm opacity-60 text-[#14170F]">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search query or status filter.'
                : 'No pickup requests have been submitted yet.'}
            </p>
          </div>
        ) : viewMode === 'tickets' ? (
          /* ── View 1: Spacious 2-Column Dispatch Tickets Grid ── */
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredPickups.map((item) => (
              <DispatchTicketCard
                key={item._id}
                item={item}
                onStatusChange={handleStatusChange}
                isUpdating={updatingId === item._id}
              />
            ))}
          </div>
        ) : (
          /* ── View 2: 3-Column Kanban Board Pipeline ── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {(['requested', 'scheduled', 'collected'] as PickupStatus[]).map((colStatus) => {
              const colConfig = STATUS_DETAILS[colStatus];
              const colItems = filteredPickups.filter((p) => p.status === colStatus);
              const ColIcon = colConfig.icon;

              return (
                <div
                  key={colStatus}
                  className="rounded-2xl border border-[#14170F]/15 bg-[#E4DCC6]/30 p-4 space-y-4"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#14170F]/10">
                    <div className="flex items-center gap-2">
                      <ColIcon size={14} className={colConfig.text} />
                      <h4 className="font-serif font-bold text-sm text-[#14170F]">
                        {colConfig.label}
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#14170F]/10 text-[#14170F]">
                      {colItems.length}
                    </span>
                  </div>

                  {/* Column Cards */}
                  <div className="space-y-4">
                    {colItems.map((item) => (
                      <DispatchTicketCard
                        key={item._id}
                        item={item}
                        onStatusChange={handleStatusChange}
                        isUpdating={updatingId === item._id}
                      />
                    ))}
                    {colItems.length === 0 && (
                      <div className="py-8 text-center text-xs font-mono text-[#14170F]/40 border-2 border-dashed border-[#14170F]/10 rounded-xl">
                        No requests in {colConfig.label}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
