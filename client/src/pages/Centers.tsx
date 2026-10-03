import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin, Clock, ExternalLink, Calendar, Navigation, Building2,
  Truck, Recycle, Search, RotateCcw, AlertCircle, Compass,
  Layers
} from 'lucide-react';
import { SectionHeading, Reveal } from '../components/ui';
import { CATEGORIES } from '../data/categories';

// ── Types ─────────────────────────────────────────────────────────────────────
export type CenterType = 'campus-point' | 'recycler' | 'collection-drive';

export interface CenterItem {
  _id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  categories: string[];
  hours: string;
  phone?: string;
  website?: string;
  type: CenterType;
  isSample: boolean;
  distanceKm: number;
}

// ── LPU campus centre coordinates ─────────────────────────────────────────────
// Approx LPU Campus centre: Phagwara, Punjab (31.255, 75.705)
const LPU_CENTER: [number, number] = [31.255, 75.705];

// ── Haversine distance calculator ─────────────────────────────────────────────
function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(distKm: number): string {
  if (distKm < 1) {
    return `${Math.round(distKm * 1000)} m from campus centre`;
  }
  return `${distKm.toFixed(1)} km from campus centre`;
}

// ── Custom DivIcon generator (brand colors, avoids Vite marker asset bugs) ────
function createDivIcon(type: CenterType, isSelected: boolean) {
  const color =
    type === 'campus-point'
      ? '#2F4E3A' // moss / signal
      : type === 'collection-drive'
      ? '#B5652D' // copper
      : '#14170F'; // ink

  const w = isSelected ? 36 : 28;
  const h = isSelected ? 46 : 36;

  const html = `
    <div style="
      width: ${w}px;
      height: ${h}px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      filter: drop-shadow(0 4px 6px rgba(20,23,15,0.35));
      cursor: pointer;
      transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    ">
      <svg width="${w}" height="${h}" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.16344 0 0 7.16344 0 16C0 26 13 38.5 15.3 40.5C15.7 40.85 16.3 40.85 16.7 40.5C19 38.5 32 26 32 16C32 7.16344 24.8366 0 16 0Z" fill="${color}" stroke="#F4F1E9" stroke-width="2.2"/>
        <circle cx="16" cy="15" r="6" fill="#F4F1E9"/>
        <circle cx="16" cy="15" r="3.2" fill="${color}"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-map-pin',
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h + 2],
  });
}

// ── Type badges configuration ─────────────────────────────────────────────────
const TYPE_CONFIG: Record<
  CenterType,
  {
    label: string;
    icon: typeof Building2;
    color: string;
    bg: string;
    border: string;
  }
> = {
  'campus-point': {
    label: 'Campus Drop-off',
    icon: Building2,
    color: 'var(--moss)',
    bg: 'rgba(47, 78, 58, 0.1)',
    border: 'rgba(47, 78, 58, 0.25)',
  },
  'collection-drive': {
    label: 'Collection Drive',
    icon: Truck,
    color: 'var(--copper)',
    bg: 'rgba(181, 101, 45, 0.1)',
    border: 'rgba(181, 101, 45, 0.25)',
  },
  'recycler': {
    label: 'Authorized Recycler',
    icon: Recycle,
    color: 'var(--ink)',
    bg: 'rgba(20, 23, 15, 0.08)',
    border: 'rgba(20, 23, 15, 0.2)',
  },
};

// ── Map controller component for smooth programmatic panning ──────────────────
function MapController({
  target,
  zoom,
}: {
  target: [number, number] | null;
  zoom: number;
}) {
  const map = useMap();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!target || !Number.isFinite(target[0]) || !Number.isFinite(target[1])) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      map.setView(target, zoom);
      return;
    }

    try {
      const size = map.getSize();
      if (size && size.x > 0 && size.y > 0) {
        map.flyTo(target, zoom, { duration: 1.0, easeLinearity: 0.25 });
      } else {
        map.setView(target, zoom);
      }
    } catch {
      map.setView(target, zoom);
    }
  }, [target, zoom, map]);

  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(() => {
      map.invalidateSize();
      if (target && Number.isFinite(target[0]) && Number.isFinite(target[1])) {
        map.setView(target, zoom);
      }
    }, 150);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [map, target, zoom]);

  return null;
}

// ── Main Page Component ───────────────────────────────────────────────────────
export default function Centers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [centers, setCenters] = useState<CenterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<'all' | CenterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapTarget, setMapTarget] = useState<[number, number] | null>(LPU_CENTER);
  const [mapZoom, setMapZoom] = useState(13);

  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  // Category map for pretty pills
  const categoryMap = useMemo(() => {
    const map = new Map<string, { name: string; shortName: string; color: string }>();
    for (const c of CATEGORIES) {
      map.set(c.slug, { name: c.name, shortName: c.shortName, color: c.color });
    }
    return map;
  }, []);

  // Fetch centers from backend with category query
  const fetchCenters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        categoryParam !== 'all'
          ? `/api/centers?category=${encodeURIComponent(categoryParam)}`
          : '/api/centers';
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`Failed to load centers (${res.status})`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const mapped: CenterItem[] = data.data.map((c: any) => ({
          ...c,
          distanceKm: haversineDistanceKm(LPU_CENTER[0], LPU_CENTER[1], c.lat, c.lng),
        }));
        // Sort ascending by distance from LPU campus centre
        mapped.sort((a, b) => a.distanceKm - b.distanceKm);
        setCenters(mapped);
      } else {
        throw new Error(data.error || 'Invalid API response format');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to the centers service.');
    } finally {
      setLoading(false);
    }
  }, [categoryParam]);

  useEffect(() => {
    fetchCenters();
  }, [fetchCenters]);

  // Client-side filtering by type & text search
  const filteredCenters = useMemo(() => {
    return centers.filter((center) => {
      const matchesType = typeFilter === 'all' || center.type === typeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        q === '' ||
        center.name.toLowerCase().includes(q) ||
        center.address.toLowerCase().includes(q) ||
        center.categories.some((cat) => cat.toLowerCase().includes(q));
      return matchesType && matchesQuery;
    });
  }, [centers, typeFilter, searchQuery]);

  // Handle category chip selection & URL synchronization
  const handleCategoryChange = (slug: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', slug);
    }
    setSearchParams(nextParams);
  };

  // Select center from list -> pan map & open popup
  const handleSelectFromList = (center: CenterItem) => {
    setSelectedId(center._id);
    setMapTarget([center.lat, center.lng]);
    setMapZoom(15);
    setTimeout(() => {
      const marker = markerRefs.current[center._id];
      if (marker) {
        marker.openPopup();
      }
    }, 120);
  };

  // Select center from marker -> scroll card into view in sidebar
  const handleMarkerClick = (center: CenterItem) => {
    setSelectedId(center._id);
    setMapTarget([center.lat, center.lng]);
    const cardEl = document.getElementById(`center-card-${center._id}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Reset view to default LPU campus centre
  const handleResetMap = () => {
    setSelectedId(null);
    setMapTarget(LPU_CENTER);
    setMapZoom(13);
  };

  // Reset all active filters
  const handleResetAllFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    handleCategoryChange('all');
    handleResetMap();
  };

  return (
    <main className="pt-24 pb-16 min-h-screen bg-[var(--paper)]">
      <div className="max-w-content mx-auto px-4 md:px-6">

        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="mb-8">
          <SectionHeading
            eyebrow="Drop-off locations"
            title="Collection centers near LPU"
            subtitle="Find e-waste bins across Lovely Professional University campus and authorized recyclers in the Phagwara–Jalandhar corridor."
          />

          {/* Location badge & sample data disclaimer */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--moss)]/10 text-[var(--moss)] border border-[var(--moss)]/20">
              <Compass size={13} />
              Centred at LPU Campus, Phagwara (31.255° N, 75.705° E)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--copper)]/10 text-[var(--copper)] border border-[var(--copper)]/20">
              Sample data
            </span>
            <span className="text-xs text-[var(--ink)]/50">
              All drop-off points, collection dates and recyclers are simulated for demonstration.
            </span>
          </div>
        </div>

        {/* ── Filters Bar ────────────────────────────────────────────── */}
        <Reveal delay={0.05}>
          <div className="p-4 sm:p-5 mb-8 rounded-2xl bg-[var(--sand)]/40 border border-[var(--sand)] space-y-4">

            {/* Row 1: Search + Type Filter */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink)]/40" />
                <input
                  type="text"
                  placeholder="Search by center name, hostel block, or area…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-[var(--paper)] border border-[var(--sand)] rounded-lg text-[var(--ink)] placeholder:text-[var(--ink)]/40 focus:outline-none focus:border-[var(--signal)] focus:ring-1 focus:ring-[var(--signal)] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--ink)]/40 hover:text-[var(--ink)]"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Type filter chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <span className="text-xs font-medium text-[var(--ink)]/50 mr-1 shrink-0 flex items-center gap-1">
                  <Layers size={13} /> Type:
                </span>
                <button
                  onClick={() => setTypeFilter('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all shrink-0 ${
                    typeFilter === 'all'
                      ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)] shadow-xs'
                      : 'bg-[var(--paper)] text-[var(--ink)]/70 border-[var(--sand)] hover:bg-[var(--sand)]/60'
                  }`}
                >
                  All types
                </button>
                {(['campus-point', 'collection-drive', 'recycler'] as CenterType[]).map((type) => {
                  const cfg = TYPE_CONFIG[type];
                  const Icon = cfg.icon;
                  const isSelected = typeFilter === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all shrink-0 ${
                        isSelected
                          ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)] shadow-xs'
                          : 'bg-[var(--paper)] text-[var(--ink)]/70 border-[var(--sand)] hover:bg-[var(--sand)]/60'
                      }`}
                    >
                      <Icon size={12} />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 2: Category chips (reads & writes to ?category=) */}
            <div className="pt-2 border-t border-[var(--sand)] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-medium text-[var(--ink)]/50 shrink-0">
                Category:
              </span>
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all shrink-0 ${
                  categoryParam === 'all'
                    ? 'bg-[var(--moss)] text-[var(--paper)] border-[var(--moss)] shadow-xs'
                    : 'bg-[var(--paper)] text-[var(--ink)]/70 border-[var(--sand)] hover:bg-[var(--sand)]/50'
                }`}
              >
                All items
              </button>
              {CATEGORIES.map((cat) => {
                const isSelected = categoryParam === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border transition-all shrink-0 ${
                      isSelected
                        ? 'bg-[var(--moss)] text-[var(--paper)] border-[var(--moss)] shadow-xs'
                        : 'bg-[var(--paper)] text-[var(--ink)]/70 border-[var(--sand)] hover:bg-[var(--sand)]/50'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: isSelected ? '#fff' : cat.color }}
                    />
                    {cat.shortName}
                  </button>
                );
              })}
            </div>

          </div>
        </Reveal>

        {/* ── Two-Column Layout (Mobile: Map on top via order-1, List below via order-2) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── MAP COLUMN: Order 1 on mobile, Order 2 on desktop ────────── */}
          <div className="order-1 lg:order-2 col-span-1 lg:col-span-5 xl:col-span-5">
            <div className="lg:sticky lg:top-28 rounded-2xl border border-[var(--sand)] bg-[var(--paper)] shadow-md overflow-hidden flex flex-col h-[340px] sm:h-[400px] lg:h-[calc(100vh-8.5rem)] lg:min-h-[580px]">

              {/* Map Header Toolbar */}
              <div className="px-4 sm:px-5 py-3 bg-[var(--sand)]/50 border-b border-[var(--sand)] flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-[var(--ink)] flex items-center gap-2">
                    <Compass size={15} className="text-[var(--moss)]" />
                    Interactive Map
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-[var(--ink)]/50">
                    Click any marker to view details and get directions
                  </p>
                </div>
                <button
                  onClick={handleResetMap}
                  title="Reset to campus view"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--paper)] border border-[var(--sand)] text-[var(--ink)]/70 hover:text-[var(--ink)] hover:bg-[var(--sand)]/60 transition-colors"
                >
                  <RotateCcw size={11} /> Reset
                </button>
              </div>

              {/* Interactive Map Area */}
              <div className="flex-1 w-full relative">
                <MapContainer
                  center={LPU_CENTER}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="h-full w-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapController target={mapTarget} zoom={mapZoom} />

                  {filteredCenters.map((center) => (
                    <Marker
                      key={center._id}
                      position={[center.lat, center.lng]}
                      icon={createDivIcon(center.type, selectedId === center._id)}
                      ref={(ref) => {
                        markerRefs.current[center._id] = ref;
                      }}
                      eventHandlers={{
                        click: () => handleMarkerClick(center),
                      }}
                    >
                      <Popup>
                        <div className="p-3.5 max-w-[280px] space-y-2.5 font-[var(--font-body)]">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                              style={{
                                backgroundColor: TYPE_CONFIG[center.type].bg,
                                color: TYPE_CONFIG[center.type].color,
                              }}
                            >
                              {TYPE_CONFIG[center.type].label}
                            </span>
                            <span className="text-[10px] font-medium text-[var(--copper)] bg-[var(--copper)]/10 px-1.5 py-0.5 rounded">
                              Sample data
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-[var(--ink)] leading-snug">
                            {center.name}
                          </h4>

                          <p className="text-[11px] text-[var(--ink)]/70 flex items-start gap-1">
                            <MapPin size={12} className="shrink-0 mt-0.5 text-[var(--copper)]" />
                            {center.address}
                          </p>

                          <p className="text-[11px] text-[var(--ink)]/60 flex items-center gap-1">
                            <Clock size={12} className="shrink-0 text-[var(--ink)]/40" />
                            {center.hours}
                          </p>

                          <div className="text-[11px] font-semibold text-[var(--moss)] bg-[var(--moss)]/8 px-2 py-1 rounded border border-[var(--moss)]/15">
                            📍 {formatDistance(center.distanceKm)}
                          </div>

                          <div className="pt-2 border-t border-[var(--sand)] flex items-center gap-2">
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-[var(--copper)] hover:underline inline-flex items-center gap-1"
                            >
                              Get directions <ExternalLink size={11} />
                            </a>
                            <Link
                              to={`/pickup?category=${center.categories[0] || ''}`}
                              className="text-xs font-medium text-[var(--moss)] hover:underline ml-auto"
                            >
                              Collection →
                            </Link>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Map Footer Legend */}
              <div className="px-4 py-2.5 bg-[var(--sand)]/40 border-t border-[var(--sand)] flex items-center justify-between text-[11px] text-[var(--ink)]/65">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--moss)]" />
                    Campus Drop-off
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--copper)]" />
                    Collection Drive
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink)]" />
                    Authorized Recycler
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* ── LIST COLUMN: Wide, scrollable, floating glass container (backdrop-blur-xl bg-paper/90 shadow-2xl) ── */}
          <div className="order-2 lg:order-1 col-span-1 lg:col-span-7 xl:col-span-7 rounded-3xl border border-[var(--sand)] backdrop-blur-xl bg-[color-mix(in_srgb,var(--paper)_92%,transparent)] shadow-2xl p-4 sm:p-6 lg:max-h-[calc(100vh-8.5rem)] lg:min-h-[580px] lg:overflow-y-auto space-y-4">

            {/* Result count & active filter summary */}
            <div className="flex items-center justify-between px-1 pb-1 border-b border-[var(--sand)]/60">
              <p className="text-xs font-semibold text-[var(--ink)]/75">
                {loading
                  ? 'Locating collection points…'
                  : `Showing ${filteredCenters.length} campus drop-off ${
                      filteredCenters.length === 1 ? 'point' : 'points'
                    } sorted by distance`}
              </p>
              {(categoryParam !== 'all' || typeFilter !== 'all' || searchQuery) && (
                <button
                  onClick={handleResetAllFilters}
                  className="text-xs text-[var(--copper)] hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
                >
                  <RotateCcw size={12} /> Reset filters
                </button>
              )}
            </div>

            {/* Loading state skeleton */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl border border-[var(--sand)] bg-white/70 animate-pulse space-y-4"
                  >
                    <div className="flex gap-2">
                      <div className="h-5 w-24 bg-[var(--sand)] rounded-md" />
                      <div className="h-5 w-20 bg-[var(--sand)] rounded-md" />
                    </div>
                    <div className="h-6 w-3/4 bg-[var(--sand)] rounded-md" />
                    <div className="h-4 w-1/2 bg-[var(--sand)] rounded-md" />
                    <div className="h-8 w-full bg-[var(--sand)]/50 rounded-lg" />
                  </div>
                ))}
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div className="p-8 rounded-2xl border border-[var(--rust)]/30 bg-[var(--rust)]/5 text-center space-y-3">
                <AlertCircle size={36} className="mx-auto text-[var(--rust)] opacity-80" />
                <h3 className="text-base text-[var(--ink)] font-semibold">Unable to load centers</h3>
                <p className="text-xs text-[var(--ink)]/60 max-w-md mx-auto">{error}</p>
                <button
                  onClick={fetchCenters}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-[var(--copper)] text-[var(--paper)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Retry request
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && filteredCenters.length === 0 && (
              <div className="p-12 rounded-2xl border border-[var(--sand)] bg-white/50 text-center space-y-4">
                <Compass size={40} className="mx-auto text-[var(--ink)]/30" />
                <h3 className="text-base font-semibold text-[var(--ink)]" style={{ fontFamily: 'var(--font-heading)' }}>
                  No drop-off points found
                </h3>
                <p className="text-xs text-[var(--ink)]/60 max-w-sm mx-auto">
                  No collection points match the current filters. Try selecting "All items" or clearing your search term.
                </p>
                <button
                  onClick={handleResetAllFilters}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-[var(--moss)] text-[var(--paper)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            )}

            {/* Centers list: Distinct elevated cards */}
            {!loading && !error && filteredCenters.length > 0 && (
              <div className="space-y-4">
                {filteredCenters.map((center) => {
                  const typeCfg = TYPE_CONFIG[center.type];
                  const TypeIcon = typeCfg.icon;
                  const isSelected = selectedId === center._id;

                  return (
                    <div
                      key={center._id}
                      id={`center-card-${center._id}`}
                      onClick={() => handleSelectFromList(center)}
                      className={`group p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-[var(--moss)] bg-white shadow-xl ring-2 ring-[var(--moss)]/30 scale-[1.01]'
                          : 'border-[var(--sand)]/80 bg-white/90 hover:bg-white hover:border-[var(--moss)]/50 hover:shadow-md'
                      }`}
                    >
                      {/* Top badge row: Type, Sample data, Distance */}
                      <div className="flex flex-wrap items-center gap-2 mb-2.5">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold"
                          style={{
                            backgroundColor: typeCfg.bg,
                            color: typeCfg.color,
                            border: `1px solid ${typeCfg.border}`,
                          }}
                        >
                          <TypeIcon size={12} />
                          {typeCfg.label}
                        </span>

                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--copper)]/10 text-[var(--copper)] border border-[var(--copper)]/20">
                          Sample data
                        </span>

                        <span className="ml-auto text-xs font-semibold text-[var(--moss)] bg-[var(--moss)]/10 px-2.5 py-0.5 rounded-lg border border-[var(--moss)]/20 flex items-center gap-1">
                          <Navigation size={11} />
                          {formatDistance(center.distanceKm)}
                        </span>
                      </div>

                      {/* Prominent Center Name */}
                      <h3
                        className="text-base sm:text-lg font-semibold tracking-tight text-[var(--ink)] group-hover:text-[var(--moss)] transition-colors"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {center.name}
                      </h3>

                      {/* Info Rows: Address and Hours */}
                      <div className="mt-2.5 space-y-1.5 text-xs text-[var(--ink)]/70">
                        <div className="flex items-start gap-2">
                          <MapPin size={14} className="shrink-0 mt-0.5 text-[var(--copper)]" />
                          <span className="leading-relaxed font-medium">{center.address}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock size={13} className="shrink-0 text-[var(--signal)]" />
                          <span>{center.hours}</span>
                        </div>
                      </div>

                      {/* Accepted categories: Horizontal scrolling pills */}
                      <div className="mt-3.5 pt-2.5 border-t border-[var(--sand)]/60">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-bold text-[var(--ink)]/50 uppercase tracking-wider shrink-0">
                            Accepted categories:
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {center.categories.map((catSlug) => {
                            const info = categoryMap.get(catSlug);
                            return (
                              <span
                                key={catSlug}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[var(--sand)]/50 text-[var(--ink)]/80 border border-[var(--sand)] shrink-0"
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: info?.color || 'var(--signal)' }}
                                />
                                {info ? info.shortName : catSlug}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Actions Row */}
                      <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--sand)]/50">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectFromList(center);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--moss)] text-[var(--paper)] transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xs"
                        >
                          <Compass size={13} /> Focus on map
                        </button>

                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white text-[var(--ink)] hover:bg-[var(--sand)]/40 border border-[var(--sand)] transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                          <ExternalLink size={13} /> Get directions
                        </a>

                        <Link
                          to={`/pickup?category=${center.categories[0] || ''}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--copper)] text-[var(--paper)] transition hover:scale-[1.02] active:scale-[0.98] ml-auto shadow-xs"
                        >
                          <Calendar size={13} /> Schedule Pickup
                        </Link>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

        {/* ── Bottom Footnote / Campus Collection Notice ────────────── */}
        <Reveal delay={0.15}>
          <div className="mt-16 p-6 rounded-2xl bg-[var(--sand)]/40 border border-[var(--sand)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-[var(--ink)]">
                Can’t carry large items to a campus collection point?
              </h4>
              <p className="text-xs text-[var(--ink)]/60 max-w-2xl leading-relaxed">
                EcoCircuit runs scheduled collections for hostel rooms and academic departments across LPU. Request a collector visit instead of transporting bulky electronics yourself.
              </p>
            </div>
            <Link
              to="/pickup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-medium bg-[var(--copper)] text-[var(--paper)] hover:bg-[#a05626] transition-all shrink-0 shadow-sm"
            >
              <Truck size={14} /> Request hostel / dept collection
            </Link>
          </div>
        </Reveal>

      </div>
    </main>
  );
}
