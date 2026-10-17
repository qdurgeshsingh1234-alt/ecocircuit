import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Clock,
  ExternalLink,
  Calendar,
  Navigation,
  Building2,
  Truck,
  Recycle,
  Search,
  RotateCcw,
  AlertCircle,
  Compass,
  Layers,
} from 'lucide-react';
import { SectionHeading } from '../components/ui';
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

// ── Custom DivIcon generator ──────────────────────────────────────────────────
function createDivIcon(type: CenterType, isSelected: boolean) {
  const color =
    type === 'campus-point'
      ? '#2F4E3A'
      : type === 'collection-drive'
      ? '#B5652D'
      : '#14170F';

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
      filter: drop-shadow(0 4px 8px rgba(20,23,15,0.4));
      cursor: pointer;
      transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
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
    color: '#2F4E3A',
    bg: 'rgba(47, 78, 58, 0.12)',
    border: 'rgba(47, 78, 58, 0.3)',
  },
  'collection-drive': {
    label: 'Collection Drive',
    icon: Truck,
    color: '#B5652D',
    bg: 'rgba(181, 101, 45, 0.12)',
    border: 'rgba(181, 101, 45, 0.3)',
  },
  'recycler': {
    label: 'Authorized Recycler',
    icon: Recycle,
    color: '#14170F',
    bg: 'rgba(20, 23, 15, 0.08)',
    border: 'rgba(20, 23, 15, 0.25)',
  },
};

// ── Map controller component ──────────────────────────────────────────────────
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

// ── Main Centers Page Component ───────────────────────────────────────────────
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

  const categoryMap = useMemo(() => {
    const map = new Map<string, { name: string; shortName: string; color: string }>();
    for (const c of CATEGORIES) {
      map.set(c.slug, { name: c.name, shortName: c.shortName, color: c.color });
    }
    return map;
  }, []);

  const fetchCenters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        categoryParam !== 'all'
          ? `/api/centers?category=${encodeURIComponent(categoryParam)}`
          : '/api/centers';
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`Failed to load centers (${res.status})`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const mapped: CenterItem[] = data.data.map((c: any) => ({
          ...c,
          distanceKm: haversineDistanceKm(LPU_CENTER[0], LPU_CENTER[1], c.lat, c.lng),
        }));
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

  const selectedCenter = useMemo(() => {
    return centers.find((c) => c._id === selectedId) || null;
  }, [centers, selectedId]);

  const handleCategoryChange = (slug: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (slug === 'all') nextParams.delete('category');
    else nextParams.set('category', slug);
    setSearchParams(nextParams);
  };

  const handleSelectFromList = (center: CenterItem) => {
    setSelectedId(center._id);
    setMapTarget([center.lat, center.lng]);
    setMapZoom(15);
    setTimeout(() => {
      const marker = markerRefs.current[center._id];
      if (marker) marker.openPopup();
    }, 120);
  };

  const handleMarkerClick = (center: CenterItem) => {
    setSelectedId(center._id);
    setMapTarget([center.lat, center.lng]);
    const cardEl = document.getElementById(`center-card-${center._id}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleResetMap = () => {
    setSelectedId(null);
    setMapTarget(LPU_CENTER);
    setMapZoom(13);
  };

  const handleResetAllFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    handleCategoryChange('all');
    handleResetMap();
  };

  return (
    <main className="min-h-screen pt-24 pb-20 bg-circuit-soil">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 space-y-10">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div>
          <SectionHeading
            eyebrow="Campus Drop-off Network"
            title="Collection points across LPU campus"
            subtitle="Locate official e-waste bins across Lovely Professional University hostel blocks, student centers, and authorized recyclers in Phagwara."
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2F4E3A]/10 text-[#2F4E3A] border border-[#2F4E3A]/25">
              <Compass size={13} className="text-[#B5652D]" />
              Centred at LPU Campus, Phagwara (31.255° N, 75.705° E)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-[#B5652D]/12 text-[#B5652D] border border-[#B5652D]/25">
              Sample data
            </span>
            <span className="text-xs text-[#14170F]/50">
              All drop-off points, operating schedules, and recyclers are simulated for demonstration.
            </span>
          </div>
        </div>

        {/* ── Streamlined Tactile Filter Dock ──────────────────────────── */}
        <div className="card-3d-tactile p-6 bg-[#F4F1E9] space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14170F]/45 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by center name, hostel block, or facility…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#14170F]/20 bg-[#F4F1E9] text-[#14170F] placeholder:text-[#14170F]/40 outline-none focus:border-[#2F4E3A] focus:ring-1 focus:ring-[#2F4E3A] shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#14170F]/50 hover:text-[#14170F]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Center Type Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
              <span className="text-xs font-mono font-bold text-[#14170F]/60 mr-1 shrink-0 flex items-center gap-1">
                <Layers size={13} /> Type:
              </span>
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all cursor-pointer shrink-0 ${
                  typeFilter === 'all'
                    ? 'bg-[#14170F] text-[#F4F1E9] border-[#14170F] shadow-xs font-semibold'
                    : 'bg-[#E4DCC6]/60 text-[#14170F] border-[#14170F]/15 hover:bg-[#E4DCC6]'
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
                    type="button"
                    onClick={() => setTypeFilter(type)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#14170F] text-[#F4F1E9] border-[#14170F] shadow-xs font-semibold'
                        : 'bg-[#E4DCC6]/60 text-[#14170F] border-[#14170F]/15 hover:bg-[#E4DCC6]'
                    }`}
                  >
                    <Icon size={12} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="pt-3 border-t border-[#14170F]/10 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-mono font-bold text-[#14170F]/60 shrink-0">
              Accepted Category:
            </span>
            <button
              type="button"
              onClick={() => handleCategoryChange('all')}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer shrink-0 ${
                categoryParam === 'all'
                  ? 'bg-[#2F4E3A] text-[#F4F1E9] border-[#2F4E3A] shadow-xs font-semibold'
                  : 'bg-[#E4DCC6]/60 text-[#14170F] border-[#14170F]/15 hover:bg-[#E4DCC6]'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => {
              const isSelected = categoryParam === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#2F4E3A] text-[#F4F1E9] border-[#2F4E3A] shadow-xs font-semibold'
                      : 'bg-[#E4DCC6]/60 text-[#14170F] border-[#14170F]/15 hover:bg-[#E4DCC6]'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: isSelected ? '#F4F1E9' : cat.color }}
                  />
                  {cat.shortName}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── True 12-Column Split-Screen Command Center ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 Cols): Vertical Stack of Center Cards */}
          <div className="order-2 lg:order-1 col-span-1 lg:col-span-5 space-y-4">
            {/* Summary Row */}
            <div className="flex items-center justify-between px-1 pb-1 border-b border-[#14170F]/10">
              <span className="text-xs font-mono text-[#14170F]/80">
                {loading
                  ? 'Locating collection points…'
                  : `Showing ${filteredCenters.length} drop-off points sorted by distance`}
              </span>
              {(categoryParam !== 'all' || typeFilter !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={handleResetAllFilters}
                  className="text-xs text-[#B5652D] hover:underline inline-flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RotateCcw size={11} /> Reset filters
                </button>
              )}
            </div>

            {/* Loading skeletons */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card-3d-tactile p-6 bg-[#F4F1E9] animate-pulse space-y-3">
                    <div className="h-5 w-24 bg-[#E4DCC6] rounded" />
                    <div className="h-6 w-3/4 bg-[#E4DCC6] rounded" />
                    <div className="h-4 w-1/2 bg-[#E4DCC6] rounded" />
                  </div>
                ))}
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div className="card-3d-tactile p-8 bg-[#F4F1E9] border-[#9B4A3E]/30 text-center space-y-3">
                <AlertCircle size={36} className="mx-auto text-[#9B4A3E]" />
                <h3 className="text-base text-[#14170F] font-bold">Unable to load centers</h3>
                <p className="text-xs text-[#14170F]/70 max-w-md mx-auto">{error}</p>
                <button
                  type="button"
                  onClick={fetchCenters}
                  className="btn-3d-copper px-4 py-2 text-xs font-semibold rounded-xl"
                >
                  Retry request
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && filteredCenters.length === 0 && (
              <div className="card-3d-tactile p-12 bg-[#F4F1E9] text-center space-y-4">
                <Compass size={40} className="mx-auto text-[#14170F]/30" />
                <h3 className="text-base font-serif font-bold text-[#14170F]">
                  No drop-off points match your filters
                </h3>
                <p className="text-xs text-[#14170F]/60 max-w-sm mx-auto">
                  Try clearing your search query or switching to "All Categories".
                </p>
                <button
                  type="button"
                  onClick={handleResetAllFilters}
                  className="btn-3d-moss px-4 py-2 text-xs font-semibold rounded-xl"
                >
                  Reset all filters
                </button>
              </div>
            )}

            {/* Cards List */}
            {!loading && !error && filteredCenters.length > 0 && (
              <div className="space-y-4 max-h-[820px] overflow-y-auto pr-1">
                {filteredCenters.map((center) => {
                  const typeCfg = TYPE_CONFIG[center.type];
                  const TypeIcon = typeCfg.icon;
                  const isSelected = selectedId === center._id;

                  return (
                    <div
                      key={center._id}
                      id={`center-card-${center._id}`}
                      onClick={() => handleSelectFromList(center)}
                      className={`card-3d-tactile p-6 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-l-4 border-l-[#B5652D] bg-[#E4DCC6]/35 shadow-md'
                          : 'hover:border-[#2F4E3A]/40'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
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

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B5652D]/12 text-[#B5652D] border border-[#B5652D]/20">
                          Sample data
                        </span>

                        <span className="ml-auto text-xs font-mono font-semibold text-[#2F4E3A] bg-[#2F4E3A]/10 px-2.5 py-0.5 rounded-lg border border-[#2F4E3A]/20 flex items-center gap-1">
                          <Navigation size={11} className="text-[#B5652D]" />
                          {formatDistance(center.distanceKm)}
                        </span>
                      </div>

                      {/* Center Name */}
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#14170F] group-hover:text-[#2F4E3A] transition-colors">
                        {center.name}
                      </h3>

                      {/* Address & Hours */}
                      <div className="mt-2.5 space-y-1.5 text-xs text-[#14170F]/75">
                        <div className="flex items-start gap-2">
                          <MapPin size={14} className="shrink-0 mt-0.5 text-[#B5652D]" />
                          <span className="leading-relaxed font-medium">{center.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={13} className="shrink-0 text-[#6B8F71]" />
                          <span>{center.hours}</span>
                        </div>
                      </div>

                      {/* Accepted Categories */}
                      <div className="mt-3.5 pt-2.5 border-t border-[#14170F]/10">
                        <span className="text-[10px] font-mono font-bold text-[#14170F]/50 uppercase tracking-wider block mb-1.5">
                          Accepted Categories:
                        </span>
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                          {center.categories.map((catSlug) => {
                            const info = categoryMap.get(catSlug);
                            return (
                              <span
                                key={catSlug}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E4DCC6]/60 text-[#14170F] border border-[#14170F]/10 shrink-0"
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: info?.color || '#6B8F71' }}
                                />
                                {info ? info.shortName : catSlug}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-[#14170F]/10">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectFromList(center);
                          }}
                          className="btn-3d-moss px-3 py-1.5 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Compass size={12} /> Focus on Map
                        </button>

                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 text-xs font-medium rounded-xl border border-[#14170F]/15 bg-[#F4F1E9] hover:bg-[#E4DCC6] text-[#14170F] transition inline-flex items-center gap-1"
                        >
                          <ExternalLink size={12} /> Directions
                        </a>

                        <Link
                          to={`/pickup?category=${center.categories[0] || ''}`}
                          onClick={(e) => e.stopPropagation()}
                          className="btn-3d-copper px-3 py-1.5 text-xs font-semibold rounded-xl inline-flex items-center gap-1 ml-auto"
                        >
                          <Calendar size={12} /> Collection
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column (7 Cols): Commanding Tall Sticky Map */}
          <div className="order-1 lg:order-2 col-span-1 lg:col-span-7 lg:sticky lg:top-24">
            <div className="h-[520px] lg:h-[760px] rounded-2xl overflow-hidden border-2 border-[#14170F]/15 shadow-[0_8px_0_0_#E4DCC6,0_20px_40px_rgba(20,23,15,0.12)] bg-[#F4F1E9] flex flex-col relative">
              {/* Floating Telemetry HUD Bar */}
              <div className="px-5 py-3.5 bg-[#E4DCC6]/60 border-b border-[#14170F]/15 flex items-center justify-between shrink-0 font-mono text-xs z-10">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[#2F4E3A] font-semibold">
                    <Compass size={14} className="text-[#B5652D]" />
                    {selectedCenter
                      ? `${selectedCenter.lat.toFixed(3)}° N, ${selectedCenter.lng.toFixed(3)}° E`
                      : '31.255° N, 75.705° E (LPU Campus)'}
                  </span>
                  <span className="hidden sm:inline text-[#14170F]/30">|</span>
                  <span className="text-[#14170F]/70 hidden sm:inline">
                    Showing <strong>{filteredCenters.length}</strong> of {centers.length} Points
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResetMap}
                  className="px-2.5 py-1 rounded-lg border border-[#14170F]/15 bg-[#F4F1E9] hover:bg-[#E4DCC6] text-[#14170F] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition active:scale-95"
                >
                  <RotateCcw size={11} /> Reset View
                </button>
              </div>

              {/* Map Canvas */}
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
                        <div className="p-4 max-w-[280px] space-y-2.5 font-[var(--font-body)]">
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
                            <span className="text-[10px] font-mono text-[#B5652D] bg-[#B5652D]/10 px-1.5 py-0.5 rounded">
                              Sample
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-[#14170F] leading-snug">
                            {center.name}
                          </h4>

                          <p className="text-xs text-[#14170F]/70 flex items-start gap-1">
                            <MapPin size={13} className="shrink-0 mt-0.5 text-[#B5652D]" />
                            {center.address}
                          </p>

                          <p className="text-xs text-[#14170F]/60 flex items-center gap-1">
                            <Clock size={12} className="shrink-0 text-[#6B8F71]" />
                            {center.hours}
                          </p>

                          <div className="text-xs font-semibold text-[#2F4E3A] bg-[#2F4E3A]/8 px-2 py-1 rounded border border-[#2F4E3A]/15">
                            📍 {formatDistance(center.distanceKm)}
                          </div>

                          <div className="pt-2 border-t border-[#14170F]/10 flex items-center justify-between gap-2">
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-[#B5652D] hover:underline inline-flex items-center gap-1"
                            >
                              Directions <ExternalLink size={11} />
                            </a>
                            <Link
                              to={`/pickup?category=${center.categories[0] || ''}`}
                              className="text-xs font-medium text-[#2F4E3A] hover:underline"
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
              <div className="px-5 py-3 bg-[#E4DCC6]/40 border-t border-[#14170F]/15 flex items-center justify-between text-xs text-[#14170F]/70 font-mono">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2F4E3A]" />
                    Campus Drop-off
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B5652D]" />
                    Collection Drive
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#14170F]" />
                    Authorized Recycler
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Footnote / Campus Collection Notice ────────────── */}
        <div className="p-6 rounded-2xl bg-[#E4DCC6]/40 border border-[#14170F]/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-serif font-bold text-[#14170F]">
              Can’t carry large items to a campus collection point?
            </h4>
            <p className="text-xs text-[#14170F]/70 max-w-2xl leading-relaxed">
              EcoCircuit operates scheduled collector visits for hostel rooms and academic departments across LPU. Request a collector visit instead of transporting bulky electronics yourself.
            </p>
          </div>
          <Link
            to="/pickup"
            className="btn-3d-copper px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 shrink-0"
          >
            <Truck size={14} /> Request hostel / dept collection
          </Link>
        </div>
      </div>
    </main>
  );
}
