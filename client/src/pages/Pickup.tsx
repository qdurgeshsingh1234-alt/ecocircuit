import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, ArrowRight, ArrowLeft, Calendar, Clock, MapPin,
  User, Mail, Phone, AlertTriangle, Copy, Check, Truck,
  ShieldCheck, Scale, Building2,
  Monitor, Smartphone, Battery, Refrigerator, Cpu, Lightbulb, Cable
} from 'lucide-react';
import { SectionHeading, Reveal } from '../components/ui';
import { CATEGORIES } from '../data/categories';

// ── Category Icon Map ─────────────────────────────────────────────────────────
const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'it-equipment': Monitor,
  'mobiles-accessories': Smartphone,
  'batteries': Battery,
  'large-appliances': Refrigerator,
  'small-appliances': Cpu,
  'lighting': Lightbulb,
  'cables-peripherals': Cable,
};

// ── Quantity options with descriptions and weight multipliers ────────────────
const QUANTITY_OPTIONS = [
  {
    id: '1–2 items',
    title: '1–2 small items',
    description: 'E.g. an old smartphone and charger, or a dead pair of earphones.',
    icon: '📱',
    multiplier: 1.5,
  },
  {
    id: '3–5 items (light)',
    title: '3–5 light items',
    description: 'E.g. tangled cables, old adapters, headphones, power bank.',
    icon: '🔋',
    multiplier: 4.0,
  },
  {
    id: '5+ items (mixed)',
    title: '5+ items (hostel cleanout)',
    description: 'E.g. semester-end drawer cleanout with laptops, cables, peripherals.',
    icon: '📦',
    multiplier: 8.0,
  },
  {
    id: '1–2 large items',
    title: '1–2 large items',
    description: 'E.g. a broken desktop monitor, mini fridge, or desktop tower.',
    icon: '🖥️',
    multiplier: 1.5,
  },
  {
    id: 'A bag or box',
    title: 'A full box or bag',
    description: 'E.g. department box of obsolete office electronics or cables.',
    icon: '📁',
    multiplier: 5.0,
  },
  {
    id: 'More than a box',
    title: 'Multiple boxes / lab cleanout',
    description: 'E.g. departmental lab upgrade or bulk hostel collection.',
    icon: '🚛',
    multiplier: 12.0,
  },
];

// ── LPU Campus Locations presets ──────────────────────────────────────────────
const LPU_LOCATION_PRESETS = [
  'Boys Hostel BH-1',
  'Boys Hostel BH-2',
  'Boys Hostel BH-3',
  'Boys Hostel BH-4',
  'Boys Hostel BH-5',
  'Boys Hostel BH-6',
  'Boys Hostel BH-7',
  'Boys Hostel BH-8',
  'Girls Hostel GH-1',
  'Girls Hostel GH-2',
  'Girls Hostel GH-3',
  'Girls Hostel GH-4',
  'Girls Hostel GH-5',
  'Girls Hostel GH-6',
  'Block 32 — Computer Science & Engineering',
  'Block 34 — Mechanical & Civil Labs',
  'Block 36 — Biotechnology & Sciences',
  'Block 38 — Electronics & Electrical Labs',
  'Block 55 — Mittal School of Business',
  'Central Library Lobby',
  'Uni-Mall Ground Floor',
  'Faculty Quarters / Staff Residences',
  'Other Campus Location',
];

// ── Scheduled Collection Windows ──────────────────────────────────────────────
const SCHEDULED_WINDOWS = [
  'Upcoming Saturday — Morning (9:00 AM – 1:00 PM)',
  'Upcoming Saturday — Afternoon (1:00 PM – 5:00 PM)',
  'Upcoming Wednesday — Afternoon (1:00 PM – 5:00 PM)',
  'Next Saturday — Morning (9:00 AM – 1:00 PM)',
  'Next Saturday — Afternoon (1:00 PM – 5:00 PM)',
];

// ── Form Step IDs ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, name: 'Categories', label: 'E-Waste Items' },
  { id: 2, name: 'Quantity', label: 'Weight & Size' },
  { id: 3, name: 'Location', label: 'Campus Block & Time' },
  { id: 4, name: 'Contact', label: 'Contact Info' },
  { id: 5, name: 'Review', label: 'Review & Submit' },
];

export default function Pickup() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');

  // Step state (1 to 5, or 6 for success)
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (initialCategory && CATEGORIES.some((c) => c.slug === initialCategory)) {
      return [initialCategory];
    }
    return ['mobiles-accessories'];
  });
  const [quantity, setQuantity] = useState('3–5 items (light)');
  const [campusPreset, setCampusPreset] = useState('Boys Hostel BH-4');
  const [specificLocation, setSpecificLocation] = useState('');
  const [preferredWindow, setPreferredWindow] = useState(SCHEDULED_WINDOWS[0]);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [hasDamagedBattery, setHasDamagedBattery] = useState(false);
  const [notes, setNotes] = useState('');

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    trackingId: string;
    estimatedImpactKg: number;
    status: string;
  } | null>(null);

  // Copy tracking ID feedback
  const [copied, setCopied] = useState(false);

  // Update selected categories if query param changes
  useEffect(() => {
    if (initialCategory && CATEGORIES.some((c) => c.slug === initialCategory)) {
      setSelectedCategories((prev) =>
        prev.includes(initialCategory) ? prev : [...prev, initialCategory]
      );
    }
  }, [initialCategory]);

  // Compute estimated weight and CO2 impact in real-time
  const estimatedImpact = useMemo(() => {
    const baseWeights: Record<string, number> = {
      'it-equipment': 4.5,
      'mobiles-accessories': 1.2,
      'batteries': 0.5,
      'large-appliances': 30.0,
      'small-appliances': 2.0,
      'lighting': 0.3,
      'cables-peripherals': 1.0,
    };
    const totalBaseWeight = selectedCategories.reduce(
      (sum, cat) => sum + (baseWeights[cat] ?? 2.0),
      0
    );
    const selectedOption = QUANTITY_OPTIONS.find((q) => q.id === quantity);
    const mult = selectedOption?.multiplier ?? 4.0;
    const kg = Math.round(totalBaseWeight * mult * 10) / 10;
    const co2Kg = Math.round(kg * 1.5 * 10) / 10;
    return { kg, co2Kg };
  }, [selectedCategories, quantity]);

  // Combined full address
  const fullAddress = useMemo(() => {
    const details = specificLocation.trim() ? `, ${specificLocation.trim()}` : '';
    return `${campusPreset}${details}, LPU Campus, Phagwara, Punjab`;
  }, [campusPreset, specificLocation]);

  // Toggle category in multi-select
  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(slug)) {
        if (prev.length === 1) return prev; // keep at least 1 selected
        return prev.filter((s) => s !== slug);
      } else {
        return [...prev, slug];
      }
    });
  };

  // Step navigation validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (selectedCategories.length === 0) {
        newErrors.categories = 'Please select at least one e-waste category.';
      }
    } else if (step === 2) {
      if (!quantity) {
        newErrors.quantity = 'Please select an estimated quantity.';
      }
    } else if (step === 3) {
      if (!campusPreset) {
        newErrors.location = 'Please select a campus hostel or department.';
      }
      if (!preferredWindow) {
        newErrors.window = 'Please choose a collection time window.';
      }
    } else if (step === 4) {
      if (!contactName.trim() || contactName.trim().length < 2) {
        newErrors.contactName = 'Please enter your full name (at least 2 characters).';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!contactEmail.trim() || !emailRegex.test(contactEmail.trim())) {
        newErrors.contactEmail = 'Please enter a valid email address (e.g. name@lpu.in).';
      }
      const cleanPhone = contactPhone.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 7) {
        newErrors.contactPhone = 'Please enter a valid phone number (at least 7 digits).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Final submission to POST /api/pickups
  const handleSubmit = async () => {
    if (!validateStep(4)) {
      setCurrentStep(4);
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    const payload = {
      categories: selectedCategories,
      quantity,
      address: fullAddress,
      preferredWindow,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      contactPhone: contactPhone.trim(),
      notes: notes.trim() + (hasDamagedBattery ? ' [ALERT: Contains swollen/damaged battery]' : ''),
    };

    try {
      const response = await fetch('/api/pickups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to submit pickup request.');
      }

      setSubmittedData({
        trackingId: resData.data.trackingId,
        estimatedImpactKg: resData.data.estimatedImpactKg,
        status: resData.data.status || 'requested',
      });
      setCurrentStep(6); // 6 indicates success screen
      window.scrollTo({ top: 80, behavior: 'smooth' });
    } catch (err: any) {
      setSubmissionError(err.message || 'Network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy tracking ID helper
  const handleCopyId = () => {
    if (submittedData?.trackingId) {
      navigator.clipboard.writeText(submittedData.trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[var(--paper)]">
      <div className="max-w-3xl mx-auto px-4 md:px-6">

        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="mb-8 text-center sm:text-left">
          <SectionHeading
            eyebrow="Hostel & Department Collection"
            title="Request a campus e-waste collection"
            subtitle="Our campus collector visits LPU hostel blocks and academic departments on scheduled collection days. No street addresses required."
          />
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--copper)]/10 text-[var(--copper)] border border-[var(--copper)]/20">
              Sample data
            </span>
            <span className="text-xs text-[var(--ink)]/50">
              Prototype system for Lovely Professional University campus demonstration.
            </span>
          </div>
        </div>

        {/* ── Progress Indicators Bar (Steps 1 to 5) ───────────────────── */}
        {currentStep <= 5 && (
          <Reveal delay={0.05}>
            <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-[var(--sand)]/30 border border-[var(--sand)]">
              <div className="relative flex items-center justify-between">
                {/* Connecting background line */}
                <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-[var(--sand)] -z-0" />
                {/* Connecting active filled line */}
                <div
                  className="absolute top-1/2 left-4 -translate-y-1/2 h-0.5 bg-[var(--moss)] -z-0 transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 92}%` }}
                />

                {STEPS.map((s) => {
                  const isCompleted = s.id < currentStep;
                  const isCurrent = s.id === currentStep;

                  return (
                    <div
                      key={s.id}
                      className="relative z-10 flex flex-col items-center group cursor-default"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                          isCompleted
                            ? 'bg-[var(--moss)] text-[var(--paper)] shadow-xs'
                            : isCurrent
                            ? 'bg-[var(--copper)] text-[var(--paper)] ring-4 ring-[var(--copper)]/20 scale-105'
                            : 'bg-[var(--sand)] text-[var(--ink)]/50'
                        }`}
                      >
                        {isCompleted ? <Check size={14} strokeWidth={2.5} /> : s.id}
                      </div>
                      <span
                        className={`mt-1.5 text-[11px] font-medium hidden sm:block ${
                          isCurrent
                            ? 'text-[var(--ink)] font-semibold'
                            : isCompleted
                            ? 'text-[var(--moss)]'
                            : 'text-[var(--ink)]/40'
                        }`}
                      >
                        {s.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        )}

        {/* ── Multi-Step Form Container ───────────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* ─────────────────────────────────────────────────────────── */}
          {/* STEP 1: Categories Multi-Select                             */}
          {/* ─────────────────────────────────────────────────────────── */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="p-6 sm:p-8 rounded-2xl bg-[var(--paper)] border border-[var(--sand)] shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--ink)]">
                    Step 1: What items are you handing in?
                  </h3>
                  <p className="mt-1 text-xs text-[var(--ink)]/60">
                    Select all e-waste categories that apply to your collection. You can choose multiple.
                  </p>
                </div>

                {errors.categories && (
                  <div className="p-3 rounded-lg bg-[var(--rust)]/10 border border-[var(--rust)]/25 text-xs text-[var(--rust)] flex items-center gap-2">
                    <AlertTriangle size={14} />
                    <span>{errors.categories}</span>
                  </div>
                )}

                {/* Category Selection Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.slug);
                    const IconComp = CATEGORY_ICON_MAP[cat.slug] || Cpu;

                    return (
                      <div
                        key={cat.slug}
                        onClick={() => toggleCategory(cat.slug)}
                        className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex items-start gap-3.5 select-none ${
                          isSelected
                            ? 'border-[var(--moss)] bg-[var(--moss)]/8 shadow-xs ring-1 ring-[var(--moss)]/30'
                            : 'border-[var(--sand)] bg-[var(--sand)]/20 hover:border-[var(--moss)]/30 hover:bg-[var(--sand)]/40'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 border transition-all ${
                            isSelected
                              ? 'bg-[var(--moss)] border-[var(--moss)] text-[var(--paper)]'
                              : 'border-[var(--sand)] bg-[var(--paper)]'
                          }`}
                        >
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <IconComp
                              size={16}
                              className={isSelected ? 'text-[var(--moss)]' : 'text-[var(--ink)]/60'}
                            />
                            <h4 className="text-sm font-semibold text-[var(--ink)]">
                              {cat.name}
                            </h4>
                          </div>
                          <p className="mt-1 text-[11px] text-[var(--ink)]/55 leading-relaxed line-clamp-2">
                            {cat.examples.slice(0, 4).join(', ')}…
                          </p>
                          <span
                            className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: cat.color + '15',
                              color: cat.color,
                            }}
                          >
                            {cat.riskLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-[var(--ink)]/50 border-t border-[var(--sand)]">
                  <span>Selected: {selectedCategories.length} categories</span>
                  <span>Minimum 1 category required</span>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between">
                <Link
                  to="/centers"
                  className="text-xs text-[var(--ink)]/60 hover:text-[var(--ink)] underline inline-flex items-center gap-1"
                >
                  Looking for campus drop-off bins instead?
                </Link>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-[var(--copper)] text-[var(--paper)] hover:bg-[#a05626] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm ml-auto"
                >
                  Continue to Quantity <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────── */}
          {/* STEP 2: Quantity & Estimated Impact Preview                 */}
          {/* ─────────────────────────────────────────────────────────── */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="p-6 sm:p-8 rounded-2xl bg-[var(--paper)] border border-[var(--sand)] shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--ink)]">
                    Step 2: Approximate volume & weight
                  </h3>
                  <p className="mt-1 text-xs text-[var(--ink)]/60">
                    Help our collection team bring suitable containers or trolleys to your hostel block or department.
                  </p>
                </div>

                {errors.quantity && (
                  <div className="p-3 rounded-lg bg-[var(--rust)]/10 border border-[var(--rust)]/25 text-xs text-[var(--rust)] flex items-center gap-2">
                    <AlertTriangle size={14} />
                    <span>{errors.quantity}</span>
                  </div>
                )}

                {/* Quantity selection radio cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {QUANTITY_OPTIONS.map((opt) => {
                    const isSelected = quantity === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setQuantity(opt.id)}
                        className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex items-start gap-3 select-none ${
                          isSelected
                            ? 'border-[var(--copper)] bg-[var(--copper)]/8 shadow-xs ring-1 ring-[var(--copper)]/30'
                            : 'border-[var(--sand)] bg-[var(--sand)]/20 hover:border-[var(--copper)]/30 hover:bg-[var(--sand)]/40'
                        }`}
                      >
                        <span className="text-2xl shrink-0 mt-0.5">{opt.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-[var(--ink)]">
                            {opt.title}
                          </h4>
                          <p className="mt-1 text-[11px] text-[var(--ink)]/60 leading-relaxed">
                            {opt.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Live Impact Preview Callout */}
                <div className="p-4 rounded-xl bg-[var(--moss)]/8 border border-[var(--moss)]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--moss)]/15 flex items-center justify-center shrink-0 text-[var(--moss)]">
                      <Scale size={20} />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-[var(--moss)]">
                        Estimated Impact Preview (Sample data)
                      </p>
                      <p className="text-xs text-[var(--ink)]/70">
                        Based on {selectedCategories.length} selected categories and {quantity}.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right shrink-0">
                    <div>
                      <p className="text-base font-bold text-[var(--moss)]">
                        ~{estimatedImpact.kg} kg
                      </p>
                      <p className="text-[10px] text-[var(--ink)]/50">E-waste Diverted</p>
                    </div>
                    <div className="h-6 w-px bg-[var(--sand)]" />
                    <div>
                      <p className="text-base font-bold text-[var(--copper)]">
                        ~{estimatedImpact.co2Kg} kg
                      </p>
                      <p className="text-[10px] text-[var(--ink)]/50">CO₂e Prevented</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-[var(--sand)]/60 text-[var(--ink)] hover:bg-[var(--sand)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-[var(--copper)] text-[var(--paper)] hover:bg-[#a05626] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm ml-auto"
                >
                  Continue to Schedule <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────── */}
          {/* STEP 3: Campus Location & Collection Window                 */}
          {/* ─────────────────────────────────────────────────────────── */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="p-6 sm:p-8 rounded-2xl bg-[var(--paper)] border border-[var(--sand)] shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--ink)]">
                    Step 3: Campus location & preferred time
                  </h3>
                  <p className="mt-1 text-xs text-[var(--ink)]/60">
                    The collector will visit your hostel block reception, common room, or department lab on the selected date.
                  </p>
                </div>

                {/* Campus Location Preset Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5">
                    <Building2 size={14} className="text-[var(--moss)]" />
                    Hostel Block / Department / Campus Facility
                  </label>
                  <select
                    value={campusPreset}
                    onChange={(e) => setCampusPreset(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-[var(--paper)] border border-[var(--sand)] rounded-xl text-[var(--ink)] focus:outline-none focus:border-[var(--moss)] focus:ring-1 focus:ring-[var(--moss)] transition-all"
                  >
                    {LPU_LOCATION_PRESETS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specific Room / Floor Details */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5">
                    <MapPin size={14} className="text-[var(--copper)]" />
                    Specific Room Number, Floor, or Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. Room 312, 3rd Floor, or Central Reception Desk"
                    value={specificLocation}
                    onChange={(e) => setSpecificLocation(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-[var(--paper)] border border-[var(--sand)] rounded-xl text-[var(--ink)] placeholder:text-[var(--ink)]/40 focus:outline-none focus:border-[var(--moss)] focus:ring-1 focus:ring-[var(--moss)] transition-all"
                  />
                  <p className="text-[11px] text-[var(--ink)]/50">
                    Preview: <span className="font-medium text-[var(--ink)]">{fullAddress}</span>
                  </p>
                </div>

                {/* Scheduled Time Window */}
                <div className="space-y-2 pt-2 border-t border-[var(--sand)]">
                  <label className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5">
                    <Calendar size={14} className="text-[var(--moss)]" />
                    Scheduled Campus Collection Day & Time Window
                  </label>
                  <div className="space-y-2">
                    {SCHEDULED_WINDOWS.map((win) => {
                      const isSelected = preferredWindow === win;
                      return (
                        <div
                          key={win}
                          onClick={() => setPreferredWindow(win)}
                          className={`p-3 rounded-xl border text-xs font-medium cursor-pointer flex items-center justify-between transition-all select-none ${
                            isSelected
                              ? 'border-[var(--moss)] bg-[var(--moss)]/10 text-[var(--moss)] font-semibold'
                              : 'border-[var(--sand)] bg-[var(--sand)]/20 text-[var(--ink)]/75 hover:bg-[var(--sand)]/40'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Clock size={14} className={isSelected ? 'text-[var(--moss)]' : 'text-[var(--ink)]/40'} />
                            {win}
                          </span>
                          {isSelected && <Check size={14} strokeWidth={2.5} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-[var(--sand)]/60 text-[var(--ink)] hover:bg-[var(--sand)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-[var(--copper)] text-[var(--paper)] hover:bg-[#a05626] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm ml-auto"
                >
                  Continue to Contact <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────── */}
          {/* STEP 4: Contact Information                                 */}
          {/* ─────────────────────────────────────────────────────────── */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="p-6 sm:p-8 rounded-2xl bg-[var(--paper)] border border-[var(--sand)] shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--ink)]">
                    Step 4: Contact details
                  </h3>
                  <p className="mt-1 text-xs text-[var(--ink)]/60">
                    The campus collector will call or SMS upon arriving at your hostel block or department lobby.
                  </p>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5">
                    <User size={14} className="text-[var(--moss)]" />
                    Full Name <span className="text-[var(--rust)]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. Arjun Sharma / Dr. Priya Mehta"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className={`w-full px-4 py-2.5 text-sm bg-[var(--paper)] border rounded-xl text-[var(--ink)] focus:outline-none transition-all ${
                      errors.contactName
                        ? 'border-[var(--rust)] focus:ring-1 focus:ring-[var(--rust)]'
                        : 'border-[var(--sand)] focus:border-[var(--moss)] focus:ring-1 focus:ring-[var(--moss)]'
                    }`}
                  />
                  {errors.contactName && (
                    <p className="text-[11px] text-[var(--rust)]">{errors.contactName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5">
                    <Mail size={14} className="text-[var(--copper)]" />
                    Email Address <span className="text-[var(--rust)]">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="E.g. student.123@lpu.in"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className={`w-full px-4 py-2.5 text-sm bg-[var(--paper)] border rounded-xl text-[var(--ink)] focus:outline-none transition-all ${
                      errors.contactEmail
                        ? 'border-[var(--rust)] focus:ring-1 focus:ring-[var(--rust)]'
                        : 'border-[var(--sand)] focus:border-[var(--moss)] focus:ring-1 focus:ring-[var(--moss)]'
                    }`}
                  />
                  {errors.contactEmail && (
                    <p className="text-[11px] text-[var(--rust)]">{errors.contactEmail}</p>
                  )}
                  <p className="text-[11px] text-[var(--ink)]/45">
                    A collection confirmation and tracking code will be sent here.
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5">
                    <Phone size={14} className="text-[var(--moss)]" />
                    Mobile Phone Number <span className="text-[var(--rust)]">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="E.g. +91 98765 43210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className={`w-full px-4 py-2.5 text-sm bg-[var(--paper)] border rounded-xl text-[var(--ink)] focus:outline-none transition-all ${
                      errors.contactPhone
                        ? 'border-[var(--rust)] focus:ring-1 focus:ring-[var(--rust)]'
                        : 'border-[var(--sand)] focus:border-[var(--moss)] focus:ring-1 focus:ring-[var(--moss)]'
                    }`}
                  />
                  {errors.contactPhone && (
                    <p className="text-[11px] text-[var(--rust)]">{errors.contactPhone}</p>
                  )}
                </div>

                {/* Swollen / Damaged Battery Safety Checkbox */}
                <div className="pt-2 border-t border-[var(--sand)]">
                  <label
                    onClick={() => setHasDamagedBattery(!hasDamagedBattery)}
                    className="p-3.5 rounded-xl border border-[var(--rust)]/30 bg-[var(--rust)]/5 flex items-start gap-3 cursor-pointer select-none"
                  >
                    <div
                      className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-all ${
                        hasDamagedBattery
                          ? 'bg-[var(--rust)] border-[var(--rust)] text-[var(--paper)]'
                          : 'border-[var(--rust)]/40 bg-[var(--paper)]'
                      }`}
                    >
                      {hasDamagedBattery && <Check size={12} strokeWidth={3} />}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5">
                        <AlertTriangle size={13} className="text-[var(--rust)]" />
                        Any swollen, bulging, or damaged lithium batteries?
                      </h4>
                      <p className="mt-0.5 text-[11px] text-[var(--ink)]/65 leading-relaxed">
                        Check this box if any items have bloated batteries. Our collector will bring an insulated fireproof transport bag for safe handling.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Optional handover notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--ink)]">
                    Additional Handover Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="E.g. Leave with security guard at BH-4 gate if unavailable."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 text-sm bg-[var(--paper)] border border-[var(--sand)] rounded-xl text-[var(--ink)] placeholder:text-[var(--ink)]/40 focus:outline-none focus:border-[var(--moss)] focus:ring-1 focus:ring-[var(--moss)] transition-all"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-[var(--sand)]/60 text-[var(--ink)] hover:bg-[var(--sand)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-[var(--copper)] text-[var(--paper)] hover:bg-[#a05626] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm ml-auto"
                >
                  Review Request <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────── */}
          {/* STEP 5: Review & Submit                                     */}
          {/* ─────────────────────────────────────────────────────────── */}
          {currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="p-6 sm:p-8 rounded-2xl bg-[var(--paper)] border border-[var(--sand)] shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--ink)]">
                      Step 5: Review your collection request
                    </h3>
                    <p className="mt-1 text-xs text-[var(--ink)]/60">
                      Please verify the details below before submitting.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--copper)]/10 text-[var(--copper)] border border-[var(--copper)]/20 shrink-0">
                    Sample data
                  </span>
                </div>

                {submissionError && (
                  <div className="p-4 rounded-xl bg-[var(--rust)]/10 border border-[var(--rust)]/30 text-xs text-[var(--rust)] flex items-start gap-2.5">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Submission failed</p>
                      <p className="mt-0.5">{submissionError}</p>
                    </div>
                  </div>
                )}

                {/* Review Grid */}
                <div className="divide-y divide-[var(--sand)]">

                  {/* Section 1: Categories */}
                  <div className="py-3.5 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--ink)]/50">
                        E-Waste Categories
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selectedCategories.map((slug) => {
                          const cat = CATEGORIES.find((c) => c.slug === slug);
                          return (
                            <span
                              key={slug}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--sand)]/60 text-[var(--ink)]/80"
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: cat?.color || 'var(--signal)' }}
                              />
                              {cat?.name || slug}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-[var(--copper)] hover:underline shrink-0"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Section 2: Quantity & Estimated Impact */}
                  <div className="py-3.5 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--ink)]/50">
                        Quantity & Estimated Diversion
                      </p>
                      <p className="text-sm font-semibold text-[var(--ink)]">{quantity}</p>
                      <p className="text-xs text-[var(--moss)] font-medium">
                        ~{estimatedImpact.kg} kg e-waste diverted · ~{estimatedImpact.co2Kg} kg CO₂e prevented
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs text-[var(--copper)] hover:underline shrink-0"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Section 3: Campus Location & Scheduled Window */}
                  <div className="py-3.5 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--ink)]/50">
                        Collection Location & Window
                      </p>
                      <p className="text-sm font-semibold text-[var(--ink)] flex items-center gap-1.5">
                        <MapPin size={13} className="text-[var(--copper)] shrink-0" />
                        {fullAddress}
                      </p>
                      <p className="text-xs text-[var(--ink)]/60 flex items-center gap-1.5">
                        <Clock size={13} className="text-[var(--moss)] shrink-0" />
                        {preferredWindow}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs text-[var(--copper)] hover:underline shrink-0"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Section 4: Contact */}
                  <div className="py-3.5 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--ink)]/50">
                        Contact Person
                      </p>
                      <p className="text-sm font-semibold text-[var(--ink)]">{contactName}</p>
                      <p className="text-xs text-[var(--ink)]/65">
                        {contactEmail} · {contactPhone}
                      </p>
                      {hasDamagedBattery && (
                        <p className="text-xs font-semibold text-[var(--rust)] flex items-center gap-1 mt-1">
                          <AlertTriangle size={12} /> Includes swollen / damaged battery alert
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="text-xs text-[var(--copper)] hover:underline shrink-0"
                    >
                      Edit
                    </button>
                  </div>

                </div>

                {/* Protocol safety notice */}
                <div className="p-4 rounded-xl bg-[var(--sand)]/40 border border-[var(--sand)] space-y-1">
                  <h4 className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[var(--moss)]" />
                    Handover Preparation Checklist Reminder
                  </h4>
                  <p className="text-[11px] text-[var(--ink)]/60 leading-relaxed">
                    Remember to factory-reset phones and laptops, remove SIM/SD cards, and tape loose battery terminals before handover.
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-[var(--sand)]/60 text-[var(--ink)] hover:bg-[var(--sand)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold bg-[var(--moss)] text-[var(--paper)] hover:bg-[#253e2e] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md ml-auto disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting Request…
                    </>
                  ) : (
                    <>
                      <Truck size={16} /> Confirm & Request Collection
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────── */}
          {/* STEP 6: Success Confirmation Screen                         */}
          {/* ─────────────────────────────────────────────────────────── */}
          {currentStep === 6 && submittedData && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-6"
            >
              <div className="p-8 sm:p-10 rounded-2xl bg-[var(--paper)] border border-[var(--sand)] shadow-md text-center space-y-6">

                {/* Animated Green Badge */}
                <div className="w-16 h-16 rounded-full bg-[var(--moss)]/15 text-[var(--moss)] flex items-center justify-center mx-auto ring-8 ring-[var(--moss)]/10">
                  <CheckCircle2 size={36} />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--copper)]/10 text-[var(--copper)] border border-[var(--copper)]/20 mb-1">
                    Sample data
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--ink)]">
                    Collection Request Scheduled!
                  </h2>
                  <p className="text-sm text-[var(--ink)]/65 max-w-lg mx-auto">
                    Your campus pickup request has been recorded. Our collection team visiting {campusPreset} has received your details.
                  </p>
                </div>

                {/* Tracking ID Callout */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[var(--sand)]/40 border border-[var(--sand)] max-w-md mx-auto space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink)]/50">
                    Your Tracking Reference
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xl sm:text-2xl font-mono font-bold text-[var(--ink)] tracking-wider">
                      {submittedData.trackingId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="p-1.5 rounded-lg bg-[var(--paper)] hover:bg-[var(--sand)] text-[var(--ink)]/70 hover:text-[var(--ink)] transition-colors border border-[var(--sand)]"
                      title="Copy Tracking ID"
                    >
                      {copied ? <Check size={16} className="text-[var(--moss)]" /> : <Copy size={16} />}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-[11px] text-[var(--moss)] font-medium">Copied to clipboard!</p>
                  )}
                </div>

                {/* Impact Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
                  <div className="p-4 rounded-xl bg-[var(--moss)]/8 border border-[var(--moss)]/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--moss)]">
                      <Scale size={14} /> E-Waste Diversion
                    </div>
                    <p className="text-xl font-bold text-[var(--ink)]">
                      ~{submittedData.estimatedImpactKg} kg
                    </p>
                    <p className="text-[11px] text-[var(--ink)]/55">
                      Diverted from Phagwara/Jalandhar local landfills
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--copper)]/8 border border-[var(--copper)]/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--copper)]">
                      <ShieldCheck size={14} /> Carbon Offset
                    </div>
                    <p className="text-xl font-bold text-[var(--ink)]">
                      ~{Math.round(submittedData.estimatedImpactKg * 1.5 * 10) / 10} kg CO₂e
                    </p>
                    <p className="text-[11px] text-[var(--ink)]/55">
                      Raw mineral extraction emissions avoided
                    </p>
                  </div>
                </div>

                {/* Handover Details Summary */}
                <div className="p-4 rounded-xl bg-[var(--sand)]/20 border border-[var(--sand)] max-w-lg mx-auto text-left space-y-2 text-xs">
                  <p className="font-semibold text-[var(--ink)] flex items-center gap-1.5">
                    <MapPin size={13} className="text-[var(--copper)]" />
                    Pickup Location: <span className="font-normal text-[var(--ink)]/75">{fullAddress}</span>
                  </p>
                  <p className="font-semibold text-[var(--ink)] flex items-center gap-1.5">
                    <Clock size={13} className="text-[var(--moss)]" />
                    Scheduled Window: <span className="font-normal text-[var(--ink)]/75">{preferredWindow}</span>
                  </p>
                  <p className="font-semibold text-[var(--ink)] flex items-center gap-1.5">
                    <User size={13} className="text-[var(--ink)]/50" />
                    Contact: <span className="font-normal text-[var(--ink)]/75">{contactName} ({contactPhone})</span>
                  </p>
                </div>

                {/* Next Steps Timeline */}
                <div className="p-5 rounded-xl bg-[var(--sand)]/40 border border-[var(--sand)] max-w-lg mx-auto text-left space-y-3">
                  <h4 className="text-xs font-semibold text-[var(--ink)] uppercase tracking-wider">
                    What happens next?
                  </h4>
                  <div className="space-y-2.5 text-xs text-[var(--ink)]/70">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[var(--moss)] text-[var(--paper)] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        1
                      </span>
                      <p>
                        Keep your items boxed or bagged near your room or lobby before the scheduled window.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[var(--moss)] text-[var(--paper)] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        2
                      </span>
                      <p>
                        Our collector will call <strong>{contactPhone}</strong> upon arriving at {campusPreset}.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[var(--moss)] text-[var(--paper)] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        3
                      </span>
                      <p>
                        Items are weighed and transported to an authorized recycler in the Phagwara/Jalandhar cluster.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1);
                      setSubmittedData(null);
                      setSpecificLocation('');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-[var(--sand)]/70 text-[var(--ink)] hover:bg-[var(--sand)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Schedule Another Collection
                  </button>
                  <Link
                    to="/centers"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-medium bg-[var(--moss)] text-[var(--paper)] hover:bg-[#253e2e] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                  >
                    <MapPin size={13} /> View Campus Drop-off Centers
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-[var(--copper)]/10 text-[var(--copper)] hover:bg-[var(--copper)]/20 border border-[var(--copper)]/25 transition-all"
                  >
                    Back to Home
                  </Link>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </main>
  );
}
