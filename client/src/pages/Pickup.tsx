import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2, ArrowRight, ArrowLeft,
  AlertTriangle, Copy, Check, Truck,
  ShieldCheck,
  Monitor, Smartphone, Battery, Refrigerator, Cpu, Lightbulb, Cable,
  Sparkles, QrCode
} from 'lucide-react';

// ── Category Configuration with Accurate Hazard Badges ────────────────────────
interface CategoryConfig {
  slug: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  theme: string;
  hazardBadge: { text: string; bg: string; textCol: string; border: string };
  examples: string;
  avgMass: string;
  co2Factor: string;
  baseWeightKg: number;
}

const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    slug: 'batteries',
    name: 'Batteries & Power Banks',
    icon: Battery,
    theme: 'theme-card-hazard',
    hazardBadge: {
      text: '🔥 High Lithium Hazard',
      bg: 'rgba(155, 74, 62, 0.15)',
      textCol: '#9B4A3E',
      border: 'rgba(155, 74, 62, 0.3)',
    },
    examples: 'Power banks, laptop battery packs, lithium coin cells, rechargeable AA/AAA cells',
    avgMass: '~0.50 kg',
    co2Factor: '1.44 kg CO₂e/kg',
    baseWeightKg: 0.5,
  },
  {
    slug: 'lighting',
    name: 'Lighting & Bulbs',
    icon: Lightbulb,
    theme: 'theme-card-hazard',
    hazardBadge: {
      text: '⚠️ Mercury Vapor Risk',
      bg: 'rgba(155, 74, 62, 0.15)',
      textCol: '#9B4A3E',
      border: 'rgba(155, 74, 62, 0.3)',
    },
    examples: 'CFL spiral bulbs, fluorescent tube lights, LED retrofit lamps, halogen fixtures',
    avgMass: '~0.30 kg',
    co2Factor: '1.44 kg CO₂e/kg',
    baseWeightKg: 0.3,
  },
  {
    slug: 'it-equipment',
    name: 'IT Equipment',
    icon: Monitor,
    theme: 'theme-card-emerald',
    hazardBadge: {
      text: '🔒 Data & Lead Solder',
      bg: 'rgba(47, 78, 58, 0.15)',
      textCol: '#2F4E3A',
      border: 'rgba(47, 78, 58, 0.3)',
    },
    examples: 'Laptops, desktop motherboards, LCD monitors, routers, external HDDs, UPS units',
    avgMass: '~4.50 kg',
    co2Factor: '1.44 kg CO₂e/kg',
    baseWeightKg: 4.5,
  },
  {
    slug: 'mobiles-accessories',
    name: 'Mobiles & Accessories',
    icon: Smartphone,
    theme: 'theme-card-emerald',
    hazardBadge: {
      text: '💎 Precious Metals & Li-Ion',
      bg: 'rgba(47, 78, 58, 0.15)',
      textCol: '#2F4E3A',
      border: 'rgba(47, 78, 58, 0.3)',
    },
    examples: 'Smartphones, tablets, wireless earbuds, bluetooth speakers, chargers, phone cases',
    avgMass: '~0.25 kg',
    co2Factor: '1.44 kg CO₂e/kg',
    baseWeightKg: 0.25,
  },
  {
    slug: 'large-appliances',
    name: 'Large Appliances',
    icon: Refrigerator,
    theme: 'theme-card-copper',
    hazardBadge: {
      text: '❄️ Heavy / Refrigerant',
      bg: 'rgba(181, 101, 45, 0.15)',
      textCol: '#B5652D',
      border: 'rgba(181, 101, 45, 0.3)',
    },
    examples: 'Hostel room mini-fridges, microwave ovens, washing units, common-room TVs',
    avgMass: '~25.0 kg',
    co2Factor: '1.44 kg CO₂e/kg',
    baseWeightKg: 25.0,
  },
  {
    slug: 'small-appliances',
    name: 'Small Appliances',
    icon: Cpu,
    theme: 'theme-card-copper',
    hazardBadge: {
      text: '♻️ Mixed Polymer & Copper',
      bg: 'rgba(181, 101, 45, 0.15)',
      textCol: '#B5652D',
      border: 'rgba(181, 101, 45, 0.3)',
    },
    examples: 'Electric kettles, clothes irons, trimmers, table fans, hair dryers, smart plugs',
    avgMass: '~1.80 kg',
    co2Factor: '1.44 kg CO₂e/kg',
    baseWeightKg: 1.8,
  },
  {
    slug: 'cables-peripherals',
    name: 'Cables & Peripherals',
    icon: Cable,
    theme: 'theme-card-slate',
    hazardBadge: {
      text: '⚡ High Copper Yield',
      bg: 'rgba(59, 110, 140, 0.15)',
      textCol: '#3B6E8C',
      border: 'rgba(59, 110, 140, 0.3)',
    },
    examples: 'Laptop power bricks, HDMI/VGA cables, USB hubs, keyboards, optical mice, cords',
    avgMass: '~0.80 kg',
    co2Factor: '1.44 kg CO₂e/kg',
    baseWeightKg: 0.8,
  },
];

// ── Interactive Quantity Options ──────────────────────────────────────────────
interface QuantityTier {
  id: string;
  label: string;
  sub: string;
  multiplier: number;
  barPercent: number;
}

const QUANTITY_TIERS: QuantityTier[] = [
  { id: '1–2 items', label: '1–2 items (~1.5 kg)', sub: 'Single dead device or charger set', multiplier: 1.5, barPercent: 20 },
  { id: '3–5 items (light)', label: '3–5 items (~4.8 kg)', sub: 'Standard semester drawer cleanout', multiplier: 4.0, barPercent: 45 },
  { id: '6–10 items', label: '6–10 items (~9.5 kg)', sub: 'Shared hostel room collection box', multiplier: 8.0, barPercent: 75 },
  { id: 'Bulk / Department Lab', label: 'Bulk / Lab Cleanout (15+ kg)', sub: 'Department lab upgrade or floor drive', multiplier: 15.0, barPercent: 100 },
];

// ── Campus Zone Helpers ───────────────────────────────────────────────────────
const CAMPUS_ZONES = [
  { name: 'Boys Hostels BH-1–BH-8', preset: 'Boys Hostel BH-4' },
  { name: 'Girls Hostels GH-1–GH-6', preset: 'Girls Hostel GH-2' },
  { name: 'Academic Blocks 25–38', preset: 'Block 32 — Computer Science Labs' },
  { name: 'Uni-Mall & Food Court', preset: 'Uni-Mall Ground Floor Atrium' },
  { name: 'Faculty Residences', preset: 'Faculty Quarters — Sector 3' },
];

const TIME_WINDOWS = [
  { id: 'Morning Slot: 9 AM – 1 PM', label: 'Morning Slot (9:00 AM – 1:00 PM)', desc: 'Preferred for hostel rooms before afternoon classes' },
  { id: 'Afternoon Slot: 1 PM – 5 PM', label: 'Afternoon Slot (1:00 PM – 5:00 PM)', desc: 'Optimal for academic blocks & project labs' },
  { id: 'Saturday Campus Drive: 10 AM – 4 PM', label: 'Saturday Campus Drive (10:00 AM – 4:00 PM)', desc: 'Weekend consolidated hostel collection circuit' },
];

const STEPS = [
  { id: 1, name: 'Categories', label: 'E-Waste Types' },
  { id: 2, name: 'Quantity', label: 'Mass & Condition' },
  { id: 3, name: 'Location', label: 'LPU Zone & Slot' },
  { id: 4, name: 'Contact', label: 'Student Info' },
  { id: 5, name: 'Review', label: 'Manifest & Submit' },
];

export default function Pickup() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('category');

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (initialCat && CATEGORY_CONFIGS.some((c) => c.slug === initialCat)) {
      return [initialCat];
    }
    return ['mobiles-accessories'];
  });
  const [quantity, setQuantity] = useState('3–5 items (light)');
  const [itemCondition, setItemCondition] = useState<'working' | 'broken' | 'swollen'>('broken');
  const [campusPreset, setCampusPreset] = useState('Boys Hostel BH-4');
  const [specificLocation, setSpecificLocation] = useState('Room 312');
  const [preferredWindow, setPreferredWindow] = useState(TIME_WINDOWS[0].id);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    trackingId: string;
    estimatedImpactKg: number;
    status: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialCat && CATEGORY_CONFIGS.some((c) => c.slug === initialCat)) {
      setSelectedCategories((prev) => (prev.includes(initialCat) ? prev : [...prev, initialCat]));
    }
  }, [initialCat]);

  // Telemetry Calculations (GEM 2024 Formulas)
  const telemetry = useMemo(() => {
    const totalBase = selectedCategories.reduce((sum, catSlug) => {
      const cfg = CATEGORY_CONFIGS.find((c) => c.slug === catSlug);
      return sum + (cfg?.baseWeightKg ?? 1.5);
    }, 0);
    const tier = QUANTITY_TIERS.find((q) => q.id === quantity) ?? QUANTITY_TIERS[1];
    const massKg = Math.max(0.8, Math.round(totalBase * (tier.multiplier / 2.5) * 10) / 10);
    const co2eKg = Math.round(massKg * 1.44 * 10) / 10;
    const toxicGrams = Math.round(massKg * 7.0 * 10) / 10;
    return { massKg, co2eKg, toxicGrams, tier };
  }, [selectedCategories, quantity]);

  const fullAddress = useMemo(() => {
    const room = specificLocation.trim() ? `, ${specificLocation.trim()}` : '';
    return `${campusPreset}${room}, LPU Campus, Phagwara, Punjab`;
  }, [campusPreset, specificLocation]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(slug)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter((s) => s !== slug);
      }
      return [...prev, slug];
    });
  };

  const handleFillDemo = () => {
    setContactName('Arjun Sharma');
    setContactEmail('arjun.sharma@lpu.in');
    setContactPhone('9876543210');
    setNotes('Hostel drawer cleanout, items bundled neatly.');
    setErrors({});
  };

  const validateCurrentStep = (step: number) => {
    const errs: Record<string, string> = {};
    if (step === 1 && selectedCategories.length === 0) {
      errs.categories = 'Please select at least one e-waste category.';
    }
    if (step === 3 && !campusPreset) {
      errs.location = 'Please select your campus building or block.';
    }
    if (step === 4) {
      if (!contactName.trim()) errs.name = 'Full student name is required.';
      if (!contactEmail.trim() || !contactEmail.includes('@')) {
        errs.email = 'Valid university or personal email is required.';
      }
      if (!contactPhone.trim() || contactPhone.trim().length < 10) {
        errs.phone = 'Valid 10-digit mobile number is required.';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep(4)) {
      setCurrentStep(4);
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    const conditionText =
      itemCondition === 'swollen'
        ? ' [ALERT: Contains swollen/damaged battery]'
        : itemCondition === 'working'
        ? ' [Item working/reusable]'
        : '';

    const payload = {
      categories: selectedCategories,
      quantity,
      address: fullAddress,
      preferredWindow,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      contactPhone: contactPhone.trim(),
      notes: notes.trim() + conditionText,
    };

    try {
      const res = await fetch('/api/pickups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit pickup request.');
      }

      setSubmittedData({
        trackingId: json.data.trackingId,
        estimatedImpactKg: json.data.estimatedImpactKg ?? telemetry.massKg,
        status: json.data.status || 'requested',
      });
      setCurrentStep(6);
      window.scrollTo({ top: 80, behavior: 'smooth' });
    } catch (err) {
      setSubmissionError(err instanceof Error ? err.message : 'Submission failed. Please check network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTracking = () => {
    if (!submittedData?.trackingId) return;
    navigator.clipboard.writeText(submittedData.trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="min-h-screen pt-28 pb-20 relative z-10 bg-transparent">
      <div className="mx-auto max-w-[1380px] px-6 sm:px-10">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2F4E3A]/30 bg-[#2F4E3A]/10 px-3 py-0.5 text-xs font-semibold tracking-wide uppercase text-[#2F4E3A]">
              <Truck size={13} className="text-[#B5652D]" />
              Hostel Collection Dispatch · LPU Campus
            </span>
            <span className="rounded-full border border-[#14170F]/15 px-2.5 py-0.5 text-xs font-mono text-[#14170F]/60">
              Sample data
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#14170F] tracking-tight">
            Schedule E-Waste Campus Pickup
          </h1>
          <p className="mt-1 text-sm text-[#14170F]/70 max-w-2xl">
            A collector visits your hostel block or academic department on scheduled days. Follow CPCB 2022 safety protocols and track your live circular impact.
          </p>
        </div>

        {/* 12-Column Split Command Center */}
        {currentStep === 6 && submittedData ? (
          /* ── Step 6: 3D Perforated E-Waste Boarding Pass ── */
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="rounded-3xl border-2 border-[#2F4E3A] bg-[#F4F1E9] p-8 shadow-2xl relative overflow-hidden card-3d-tactile">
              {/* Top Perforation / Tear Strip Graphic */}
              <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#2F4E3A] via-[#B5652D] to-[#2F4E3A]" />
              
              <div className="flex items-center justify-between pb-6 border-b border-[#14170F]/15">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2F4E3A]">
                    Official Campus Dispatch Manifest
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#14170F]">Collection Ticket Confirmed</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#2F4E3A]/15 text-[#2F4E3A] flex items-center justify-center">
                  <CheckCircle2 size={28} />
                </div>
              </div>

              {/* Monospace Tracking Code Box */}
              <div className="my-6 p-6 rounded-2xl bg-[#14170F] text-[#F4F1E9] flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#B5652D]/40 shadow-inner">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#B5652D]">
                    Tracking Identifier
                  </span>
                  <p className="text-3xl font-mono font-bold tracking-wider text-[#F4F1E9]">
                    {submittedData.trackingId}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyTracking}
                  className="btn-3d-copper px-4 py-2.5 rounded-xl text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy ID'}</span>
                </button>
              </div>

              {/* Manifest Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pb-6 border-b border-[#14170F]/15">
                <div>
                  <span className="opacity-60 block">Pickup Location:</span>
                  <span className="font-bold text-sm text-[#14170F] font-sans">{fullAddress}</span>
                </div>
                <div>
                  <span className="opacity-60 block">Scheduled Window:</span>
                  <span className="font-bold text-[#14170F]">{preferredWindow}</span>
                </div>
                <div>
                  <span className="opacity-60 block">Registered Student:</span>
                  <span className="font-bold text-[#14170F]">{contactName} ({contactPhone})</span>
                </div>
                <div>
                  <span className="opacity-60 block">Estimated Diverted Mass:</span>
                  <span className="font-bold text-[#2F4E3A]">⚡ {submittedData.estimatedImpactKg} kg (~{Math.round(submittedData.estimatedImpactKg * 1.44)} kg CO₂e)</span>
                </div>
              </div>

              {/* Perforation notches */}
              <div className="relative my-4 flex items-center justify-between">
                <div className="w-5 h-5 rounded-full bg-[#EFECE2] -ml-11 border-r border-[#14170F]/15" />
                <div className="flex-1 border-t-2 border-dashed border-[#14170F]/20 mx-2" />
                <div className="w-5 h-5 rounded-full bg-[#EFECE2] -mr-11 border-l border-[#14170F]/15" />
              </div>

              {/* QR Verification Placeholder */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white border border-[#14170F]/15">
                    <QrCode size={40} className="text-[#14170F]" />
                  </div>
                  <div className="text-[11px] text-[#14170F]/70">
                    <p className="font-bold text-[#14170F]">Physical Handover Verification</p>
                    <p>Show this boarding pass to the campus driver when collection arrives.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Link to="/dashboard" className="btn-3d-moss px-5 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2">
                <ShieldCheck size={16} /> Track in Impact Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmittedData(null);
                  setCurrentStep(1);
                }}
                className="px-5 py-3 rounded-xl text-xs font-mono font-bold border border-[#14170F]/20 hover:bg-[#E4DCC6] transition"
              >
                Book Another Pickup
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ── Left 8 Columns: Interactive 5-Step Configurator Deck ── */}
            <div className="lg:col-span-8 space-y-6">
              {/* Upgraded 3D Step Progress Bar */}
              <div className="bg-[#14170F] text-[#F4F1E9] p-4 rounded-2xl shadow-xl flex items-center justify-between gap-2 border border-[#B5652D]/30">
                {STEPS.map((step) => {
                  const isDone = currentStep > step.id;
                  const isActive = currentStep === step.id;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      disabled={step.id > currentStep}
                      onClick={() => isDone && setCurrentStep(step.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-1 rounded-xl transition cursor-pointer ${
                        isActive
                          ? 'bg-[#B5652D] text-white shadow-[0_0_12px_rgba(181,101,45,0.6)]'
                          : isDone
                          ? 'bg-[#2F4E3A]/60 text-[#6B8F71] hover:bg-[#2F4E3A]'
                          : 'opacity-40 cursor-not-allowed text-[#F4F1E9]/60'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border border-current">
                        {isDone ? '✓' : step.id}
                      </span>
                      <span className="hidden sm:inline text-xs font-mono font-semibold tracking-wide">
                        {step.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Form Step Body */}
              <div className="rounded-2xl border border-[#14170F]/15 bg-[#F4F1E9] p-6 sm:p-8 card-3d-tactile">
                {/* ── Step 1: Category Selection ── */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#14170F]">
                        Select E-Waste Categories
                      </h3>
                      <p className="text-xs text-[#14170F]/70 mt-1">
                        Choose all device groups you need collected. Each category has regulatory handling requirements under CPCB Rules 2022.
                      </p>
                      {errors.categories && (
                        <p className="text-xs font-mono text-[#9B4A3E] font-semibold mt-2 flex items-center gap-1">
                          <AlertTriangle size={14} /> {errors.categories}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {CATEGORY_CONFIGS.map((cat) => {
                        const IconComp = cat.icon;
                        const isSelected = selectedCategories.includes(cat.slug);

                        return (
                          <div
                            key={cat.slug}
                            onClick={() => toggleCategory(cat.slug)}
                            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${cat.theme} ${
                              isSelected
                                ? 'ring-2 ring-[#B5652D] shadow-md -translate-y-1'
                                : 'opacity-85 hover:opacity-100 hover:border-[#14170F]/30'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#14170F]/8 text-[#14170F]">
                                  <IconComp size={18} />
                                </div>
                                <div>
                                  <h4 className="font-serif font-bold text-sm text-[#14170F] leading-tight">
                                    {cat.name}
                                  </h4>
                                  <span className="text-[10px] font-mono text-[#14170F]/60">
                                    Avg: {cat.avgMass}
                                  </span>
                                </div>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-[#B5652D] border-[#B5652D] text-white' : 'border-[#14170F]/30'
                                }`}
                              >
                                {isSelected && <Check size={12} />}
                              </div>
                            </div>

                            {/* Accurate Real Hazard Badge */}
                            <div className="my-2">
                              <span
                                className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                                style={{
                                  backgroundColor: cat.hazardBadge.bg,
                                  color: cat.hazardBadge.textCol,
                                  border: `1px solid ${cat.hazardBadge.border}`,
                                }}
                              >
                                {cat.hazardBadge.text}
                              </span>
                            </div>

                            {/* Full Untruncated Examples */}
                            <p className="text-xs text-[#14170F]/80 leading-relaxed">
                              {cat.examples}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Step 2: Quantity & Condition ── */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#14170F]">
                        Estimated Quantity & Hardware State
                      </h3>
                      <p className="text-xs text-[#14170F]/70 mt-1">
                        Select the volume tier so our campus collection tricycle allocates sufficient bin space.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {QUANTITY_TIERS.map((tier) => {
                        const isSelected = quantity === tier.id;
                        return (
                          <div
                            key={tier.id}
                            onClick={() => setQuantity(tier.id)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#B5652D] bg-[#B5652D]/8 ring-2 ring-[#B5652D] shadow-sm -translate-y-0.5'
                                : 'border-[#14170F]/15 bg-white hover:border-[#14170F]/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-serif font-bold text-sm text-[#14170F]">
                                {tier.label}
                              </span>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected ? 'bg-[#B5652D] border-[#B5652D] text-white' : 'border-[#14170F]/30'
                                }`}
                              >
                                {isSelected && <Check size={10} />}
                              </div>
                            </div>
                            <p className="text-xs text-[#14170F]/70 mb-3">{tier.sub}</p>
                            {/* Visual Weight Bar */}
                            <div className="h-1.5 w-full bg-[#14170F]/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#2F4E3A] to-[#B5652D]"
                                style={{ width: `${tier.barPercent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Condition Selector */}
                    <div className="pt-4 border-t border-[#14170F]/10 space-y-3">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#14170F]/70 block">
                        Hardware Condition Assessment:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setItemCondition('working')}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                            itemCondition === 'working'
                              ? 'border-[#2F4E3A] bg-[#2F4E3A]/10 text-[#2F4E3A] ring-1 ring-[#2F4E3A]'
                              : 'border-[#14170F]/15 bg-white hover:bg-[#E4DCC6]/40'
                          }`}
                        >
                          <span className="text-xs font-bold block">✓ Working / Reusable</span>
                          <span className="text-[10px] text-[#14170F]/60">Eligible for refurbished student donation</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setItemCondition('broken')}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                            itemCondition === 'broken'
                              ? 'border-[#B5652D] bg-[#B5652D]/10 text-[#B5652D] ring-1 ring-[#B5652D]'
                              : 'border-[#14170F]/15 bg-white hover:bg-[#E4DCC6]/40'
                          }`}
                        >
                          <span className="text-xs font-bold block">⚙ Broken / Parts</span>
                          <span className="text-[10px] text-[#14170F]/60">Board metal extraction & circular yield</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setItemCondition('swollen')}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                            itemCondition === 'swollen'
                              ? 'border-[#9B4A3E] bg-[#9B4A3E]/10 text-[#9B4A3E] ring-1 ring-[#9B4A3E]'
                              : 'border-[#14170F]/15 bg-white hover:bg-[#E4DCC6]/40'
                          }`}
                        >
                          <span className="text-xs font-bold block">🔥 Swollen Battery</span>
                          <span className="text-[10px] text-[#9B4A3E]">Requires fire-retardant pouch pickup</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Step 3: LPU Campus Location & Time Slot ── */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#14170F]">
                        Campus Block & Time Slot
                      </h3>
                      <p className="text-xs text-[#14170F]/70 mt-1">
                        Select an LPU campus zone helper to pre-fill your location, then specify your room or lab.
                      </p>
                    </div>

                    {/* Quick-Select Campus Zone Pills */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B5652D]">
                        Quick Campus Zone Helpers:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {CAMPUS_ZONES.map((zone) => (
                          <button
                            key={zone.name}
                            type="button"
                            onClick={() => setCampusPreset(zone.preset)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition cursor-pointer ${
                              campusPreset.includes(zone.preset.split(' ')[0])
                                ? 'bg-[#14170F] text-[#F4F1E9] border-[#14170F]'
                                : 'bg-[#E4DCC6]/60 text-[#14170F] border-[#14170F]/15 hover:bg-[#E4DCC6]'
                            }`}
                          >
                            {zone.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="text-xs font-mono font-bold text-[#14170F] block mb-1">
                          Building / Hostel:
                        </label>
                        <input
                          type="text"
                          value={campusPreset}
                          onChange={(e) => setCampusPreset(e.target.value)}
                          placeholder="e.g. Boys Hostel BH-4"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#14170F]/20 bg-white text-sm outline-none focus:border-[#2F4E3A]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono font-bold text-[#14170F] block mb-1">
                          Room / Lab / Wing:
                        </label>
                        <input
                          type="text"
                          value={specificLocation}
                          onChange={(e) => setSpecificLocation(e.target.value)}
                          placeholder="e.g. Room 312, 3rd Floor"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#14170F]/20 bg-white text-sm outline-none focus:border-[#2F4E3A]"
                        />
                      </div>
                    </div>

                    {/* Time Window Cards */}
                    <div className="pt-4 border-t border-[#14170F]/10 space-y-3">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#14170F]/70 block">
                        Select Collection Window:
                      </span>
                      <div className="space-y-2">
                        {TIME_WINDOWS.map((win) => {
                          const isSelected = preferredWindow === win.id;
                          return (
                            <div
                              key={win.id}
                              onClick={() => setPreferredWindow(win.id)}
                              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                                isSelected
                                  ? 'border-[#2F4E3A] bg-[#2F4E3A]/8 ring-1 ring-[#2F4E3A]'
                                  : 'border-[#14170F]/15 bg-white hover:border-[#14170F]/30'
                              }`}
                            >
                              <div>
                                <span className="font-serif font-bold text-sm text-[#14170F] block">
                                  {win.label}
                                </span>
                                <span className="text-xs text-[#14170F]/65">{win.desc}</span>
                              </div>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-[#2F4E3A] border-[#2F4E3A] text-white' : 'border-[#14170F]/30'
                                }`}
                              >
                                {isSelected && <Check size={10} />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Step 4: Contact Information ── */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h3 className="text-xl font-serif font-bold text-[#14170F]">
                          Student Contact Verification
                        </h3>
                        <p className="text-xs text-[#14170F]/70 mt-1">
                          The collector will call or SMS upon arrival outside your hostel gate.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleFillDemo}
                        className="btn-3d-copper px-3 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Sparkles size={13} />
                        <span>Fill Demo Student (Arjun Sharma)</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-mono font-bold text-[#14170F] block mb-1">
                          Full Name:
                        </label>
                        <input
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Arjun Sharma"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#14170F]/20 bg-white text-sm outline-none focus:border-[#2F4E3A]"
                        />
                        {errors.name && <p className="text-xs font-mono text-[#9B4A3E] mt-1">{errors.name}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono font-bold text-[#14170F] block mb-1">
                            LPU Email Address:
                          </label>
                          <input
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="arjun.sharma@lpu.in"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#14170F]/20 bg-white text-sm outline-none focus:border-[#2F4E3A]"
                          />
                          {errors.email && <p className="text-xs font-mono text-[#9B4A3E] mt-1">{errors.email}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-mono font-bold text-[#14170F] block mb-1">
                            Mobile Phone (10 digits):
                          </label>
                          <input
                            type="tel"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="9876543210"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#14170F]/20 bg-white text-sm outline-none focus:border-[#2F4E3A]"
                          />
                          {errors.phone && <p className="text-xs font-mono text-[#9B4A3E] mt-1">{errors.phone}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold text-[#14170F] block mb-1">
                          Special Instructions / Specific Gate Note:
                        </label>
                        <textarea
                          rows={2}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="e.g. Call when outside Gate 2, items packed in cardboard box."
                          className="w-full px-3.5 py-2 rounded-xl border border-[#14170F]/20 bg-white text-sm outline-none focus:border-[#2F4E3A]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Step 5: Review & Submit ── */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#14170F]">
                        Review Collection Manifest
                      </h3>
                      <p className="text-xs text-[#14170F]/70 mt-1">
                        Please confirm your dispatch details before generating your campus tracking boarding pass.
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white border border-[#14170F]/15 space-y-3 text-xs font-mono">
                      <div className="flex justify-between py-1 border-b border-[#14170F]/10">
                        <span className="opacity-60">Categories:</span>
                        <span className="font-bold text-[#14170F] font-sans">
                          {selectedCategories.map((s) => CATEGORY_CONFIGS.find((c) => c.slug === s)?.name).join(', ')}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#14170F]/10">
                        <span className="opacity-60">Quantity Tier:</span>
                        <span className="font-bold text-[#14170F]">{quantity}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#14170F]/10">
                        <span className="opacity-60">Campus Location:</span>
                        <span className="font-bold text-[#14170F] font-sans">{fullAddress}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#14170F]/10">
                        <span className="opacity-60">Collection Window:</span>
                        <span className="font-bold text-[#14170F]">{preferredWindow}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="opacity-60">Contact:</span>
                        <span className="font-bold text-[#14170F]">{contactName} ({contactEmail} • {contactPhone})</span>
                      </div>
                    </div>

                    {submissionError && (
                      <div className="p-4 rounded-xl border border-[#9B4A3E]/30 bg-[#9B4A3E]/10 text-xs font-mono text-[#9B4A3E] flex items-center gap-2">
                        <AlertTriangle size={16} /> {submissionError}
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 pt-6 border-t border-[#14170F]/10 flex items-center justify-between">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-4 py-2.5 rounded-xl text-xs font-mono font-semibold border border-[#14170F]/20 text-[#14170F] hover:bg-[#E4DCC6] transition cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <ArrowLeft size={13} /> Back
                    </button>
                  ) : (
                    <span />
                  )}

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-3d-moss px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue to {STEPS[currentStep].name}</span>
                      <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="btn-3d-copper px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span>{isSubmitting ? 'Confirming Dispatch...' : 'Generate Dispatch Boarding Pass'}</span>
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── Right 4 Columns: Live Impact Telemetry & Manifest Receipt ── */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              <div className="rounded-2xl p-6 bg-[#14170F] text-[#F4F1E9] border-2 border-[#B5652D]/50 shadow-[0_12px_0_0_#2F4E3A,0_25px_50px_rgba(20,23,15,0.25)] space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#F4F1E9]/15">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6B8F71] animate-ping" />
                    <span className="text-xs font-mono font-bold tracking-widest text-[#B5652D] uppercase">
                      LIVE IMPACT TELEMETRY // UN GEM 2024
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#F4F1E9]/50">LPU v2.6</span>
                </div>

                {/* 3 Live Animated Gauges */}
                <div className="space-y-4">
                  {/* Gauge 1: Estimated Mass */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#F4F1E9]/70">Diverted E-Waste Mass:</span>
                      <span className="font-bold text-lg text-[#F4F1E9]">
                        {telemetry.massKg.toFixed(2)} kg
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#F4F1E9]/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#2F4E3A] via-[#6B8F71] to-[#B5652D] transition-all duration-300"
                        style={{ width: `${Math.min(100, (telemetry.massKg / 20) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Gauge 2: CO2e Emissions Avoided */}
                  <div className="p-3 rounded-xl bg-[#F4F1E9]/5 border border-[#F4F1E9]/10 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-[#6B8F71] uppercase tracking-wider block">
                        CO₂e Emissions Avoided
                      </span>
                      <span className="text-xl font-serif font-bold text-[#F4F1E9]">
                        {telemetry.co2eKg.toFixed(2)} kg
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#F4F1E9]/50 text-right">
                      1.44 kg CO₂e<br />per kg e-waste
                    </span>
                  </div>

                  {/* Gauge 3: Toxic Heavy Metals Diverted */}
                  <div className="p-3 rounded-xl bg-[#F4F1E9]/5 border border-[#F4F1E9]/10 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-[#B5652D] uppercase tracking-wider block">
                        Toxic Metals Diverted
                      </span>
                      <span className="text-xl font-serif font-bold text-[#F4F1E9]">
                        {telemetry.toxicGrams.toFixed(1)} g
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#F4F1E9]/50 text-right">
                      Lead, Mercury &amp;<br />Cadmium kept safe
                    </span>
                  </div>
                </div>

                {/* Live Dispatch Manifest Summary */}
                <div className="pt-4 border-t border-[#F4F1E9]/15 space-y-3">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#F4F1E9]/60 block">
                    Current Manifest Configuration:
                  </span>

                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-[#F4F1E9]/80">
                      <span>Categories:</span>
                      <span className="font-bold text-[#B5652D]">{selectedCategories.length} selected</span>
                    </div>
                    <div className="flex justify-between text-[#F4F1E9]/80">
                      <span>Location:</span>
                      <span className="font-bold truncate max-w-[170px] text-right">{campusPreset}</span>
                    </div>
                    <div className="flex justify-between text-[#F4F1E9]/80">
                      <span>Window:</span>
                      <span className="font-bold truncate max-w-[170px] text-right">{preferredWindow.split('—')[0]}</span>
                    </div>
                  </div>

                  {/* Readiness Meter */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-[#6B8F71]">Readiness Status</span>
                      <span className="font-bold">Step {currentStep} of 5</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#F4F1E9]/15 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#6B8F71] transition-all duration-300"
                        style={{ width: `${(currentStep / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
