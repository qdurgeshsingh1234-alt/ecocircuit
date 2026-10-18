// Serverless-safe client persistence helper for EcoCircuit pickups
// Guarantees real-time state persistence across serverless cold starts & navigation

export interface PickupRecord {
  _id: string;
  trackingId: string;
  categories: string[];
  quantity: string;
  address: string;
  preferredWindow: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  status: 'requested' | 'scheduled' | 'collected';
  estimatedImpactKg: number;
  createdAt: string;
}

const CUSTOM_PICKUPS_KEY = 'ecocircuit_custom_pickups';
const STATUS_OVERRIDES_KEY = 'ecocircuit_status_overrides';

export function getStoredCustomPickups(): PickupRecord[] {
  try {
    const raw = localStorage.getItem(CUSTOM_PICKUPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomPickup(pickup: PickupRecord): void {
  try {
    const existing = getStoredCustomPickups();
    const filtered = existing.filter(
      (p) => p.trackingId !== pickup.trackingId && p._id !== pickup._id
    );
    localStorage.setItem(CUSTOM_PICKUPS_KEY, JSON.stringify([pickup, ...filtered]));
  } catch (err) {
    console.warn('Failed to save custom pickup to localStorage:', err);
  }
}

export function getStoredStatusOverrides(): Record<string, 'requested' | 'scheduled' | 'collected'> {
  try {
    const raw = localStorage.getItem(STATUS_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveStatusOverride(
  idOrTrackingId: string,
  status: 'requested' | 'scheduled' | 'collected'
): void {
  try {
    const existing = getStoredStatusOverrides();
    existing[idOrTrackingId] = status;
    localStorage.setItem(STATUS_OVERRIDES_KEY, JSON.stringify(existing));

    // Also update any matching custom pickup in storage directly
    const custom = getStoredCustomPickups();
    let updated = false;
    const modified = custom.map((p) => {
      if (p._id === idOrTrackingId || p.trackingId === idOrTrackingId) {
        updated = true;
        return { ...p, status };
      }
      return p;
    });
    if (updated) {
      localStorage.setItem(CUSTOM_PICKUPS_KEY, JSON.stringify(modified));
    }
  } catch (err) {
    console.warn('Failed to save status override to localStorage:', err);
  }
}

export function mergePickupsWithLocal(apiPickups: PickupRecord[]): PickupRecord[] {
  const custom = getStoredCustomPickups();
  const overrides = getStoredStatusOverrides();

  const map = new Map<string, PickupRecord>();

  // 1. Add locally created pickups (most recent user requests)
  for (const p of custom) {
    const status = overrides[p._id] || overrides[p.trackingId] || p.status;
    map.set(p.trackingId, { ...p, status });
  }

  // 2. Merge API pickups
  for (const p of apiPickups) {
    const status = overrides[p._id] || overrides[p.trackingId] || p.status;
    if (!map.has(p.trackingId)) {
      map.set(p.trackingId, { ...p, status });
    } else {
      const existing = map.get(p.trackingId)!;
      map.set(p.trackingId, { ...existing, ...p, status });
    }
  }

  // 3. Return array sorted by creation date descending
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
}
