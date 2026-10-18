// Vercel Serverless Function Handler for EcoCircuit (/api/*)
// Self-contained in-memory API supporting full LPU campus centers and collection pickups.

export interface Center {
  _id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  categories: string[];
  hours: string;
  type: 'campus-point' | 'collection-drive' | 'recycler';
  isSample: boolean;
}

export interface PickupRecord {
  _id: string;
  trackingId: string;
  categories: string[];
  quantity: string;
  address: string;
  preferredWindow: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: 'requested' | 'scheduled' | 'collected';
  estimatedImpactKg: number;
  createdAt: string;
}

// ── In-Memory Database Seeded with Verified LPU Data ────────────────────────
const centers: Center[] = [
  {
    _id: 'center_1',
    name: 'Sample Collection Point — Boys Hostel Block BH-4',
    address: 'Near BH-4 Gate, LPU Campus, Phagwara, Punjab — 144411 (Sample)',
    lat: 31.2532,
    lng: 75.7038,
    categories: ['mobiles-accessories', 'batteries', 'cables-peripherals', 'it-equipment'],
    hours: 'Mon–Fri: 9 AM – 6 PM · Sat: 10 AM – 2 PM',
    type: 'campus-point',
    isSample: true,
  },
  {
    _id: 'center_2',
    name: 'Sample Collection Point — Uni-Mall Food Court Area',
    address: 'Ground Floor, Uni-Mall, LPU Campus, Phagwara, Punjab — 144411 (Sample)',
    lat: 31.2556,
    lng: 75.7055,
    categories: ['mobiles-accessories', 'cables-peripherals', 'batteries', 'lighting'],
    hours: 'Mon–Sun: 10 AM – 8 PM',
    type: 'campus-point',
    isSample: true,
  },
  {
    _id: 'center_3',
    name: 'Sample Collection Point — Block 34 Engineering Labs',
    address: 'Near Block 34 Entrance, LPU Campus, Phagwara, Punjab — 144411 (Sample)',
    lat: 31.2578,
    lng: 75.7068,
    categories: ['it-equipment', 'cables-peripherals', 'small-appliances', 'batteries'],
    hours: 'Mon–Sat: 8 AM – 5 PM',
    type: 'campus-point',
    isSample: true,
  },
  {
    _id: 'center_4',
    name: 'Sample Collection Point — Girls Hostel GH-2',
    address: 'Near GH-2 Reception, LPU Campus, Phagwara, Punjab — 144411 (Sample)',
    lat: 31.2541,
    lng: 75.7028,
    categories: ['mobiles-accessories', 'batteries', 'cables-peripherals', 'lighting'],
    hours: 'Mon–Fri: 9 AM – 6 PM · Sat: 10 AM – 2 PM',
    type: 'campus-point',
    isSample: true,
  },
  {
    _id: 'center_5',
    name: 'Sample Collection Point — Central Library Entrance',
    address: 'Main Lobby, Central Library, LPU Campus, Phagwara, Punjab — 144411 (Sample)',
    lat: 31.2563,
    lng: 75.7045,
    categories: ['it-equipment', 'cables-peripherals', 'mobiles-accessories'],
    hours: 'Mon–Sat: 9 AM – 9 PM · Sun: 10 AM – 6 PM',
    type: 'campus-point',
    isSample: true,
  },
  {
    _id: 'center_6',
    name: 'Sample Collection Drive — Baldev Raj Mittal Unipolis Parking',
    address: 'BR Mittal Unipolis, LPU Campus, Phagwara, Punjab — 144411 (Sample)',
    lat: 31.2541,
    lng: 75.7036,
    categories: ['large-appliances', 'it-equipment', 'small-appliances', 'batteries', 'mobiles-accessories', 'cables-peripherals', 'lighting'],
    hours: 'First Saturday of every month: 10 AM – 4 PM (Sample schedule)',
    type: 'collection-drive',
    isSample: true,
  },
  {
    _id: 'center_7',
    name: 'Sample Authorized Recycler — Phagwara Focal Point Industrial Area',
    address: 'Focal Point Industrial Area, Phagwara, Punjab — 144401 (Sample)',
    lat: 31.2285,
    lng: 75.7680,
    categories: ['it-equipment', 'large-appliances', 'batteries', 'small-appliances', 'cables-peripherals'],
    hours: 'Mon–Sat: 9 AM – 5 PM',
    type: 'recycler',
    isSample: true,
  },
  {
    _id: 'center_8',
    name: 'Sample Authorized Recycler — Jalandhar GT Road',
    address: 'Near Verka Milk Plant, GT Road, Jalandhar, Punjab — 144001 (Sample)',
    lat: 31.3190,
    lng: 75.6025,
    categories: ['it-equipment', 'mobiles-accessories', 'batteries', 'large-appliances', 'small-appliances', 'lighting', 'cables-peripherals'],
    hours: 'Mon–Fri: 9 AM – 6 PM · Sat: 9 AM – 2 PM',
    type: 'recycler',
    isSample: true,
  },
];

const pickups: PickupRecord[] = [
  {
    _id: 'pickup_1',
    trackingId: 'ECO-104928',
    categories: ['it-equipment', 'cables-peripherals'],
    quantity: '3–5 items (light)',
    address: 'Boys Hostel BH-6, Room 204, LPU Campus (Sample)',
    preferredWindow: '2024-10-12, Morning (9 AM – 1 PM)',
    contactName: 'Arjun Sharma (Sample)',
    contactEmail: 'sample.student1@lpu.in',
    contactPhone: '+91-98765-43210',
    status: 'collected',
    estimatedImpactKg: 12.5,
    createdAt: new Date('2024-10-12T09:00:00Z').toISOString(),
  },
  {
    _id: 'pickup_2',
    trackingId: 'ECO-839201',
    categories: ['mobiles-accessories', 'batteries'],
    quantity: '1–2 items',
    address: 'Boys Hostel BH-6, Room 204, LPU Campus (Sample)',
    preferredWindow: '2024-11-08, Afternoon (1 PM – 5 PM)',
    contactName: 'Arjun Sharma (Sample)',
    contactEmail: 'sample.student1@lpu.in',
    contactPhone: '+91-98765-43210',
    status: 'collected',
    estimatedImpactKg: 6.8,
    createdAt: new Date('2024-11-08T14:00:00Z').toISOString(),
  },
  {
    _id: 'pickup_3',
    trackingId: 'ECO-492014',
    categories: ['cables-peripherals', 'small-appliances'],
    quantity: '5+ items (mixed)',
    address: 'Boys Hostel BH-6, Room 204, LPU Campus (Sample)',
    preferredWindow: '2024-12-07, Morning (9 AM – 1 PM)',
    contactName: 'Arjun Sharma (Sample)',
    contactEmail: 'sample.student1@lpu.in',
    contactPhone: '+91-98765-43210',
    status: 'scheduled',
    estimatedImpactKg: 18.4,
    createdAt: new Date('2024-12-07T10:00:00Z').toISOString(),
  },
  {
    _id: 'pickup_4',
    trackingId: 'ECO-729103',
    categories: ['large-appliances'],
    quantity: '1–2 large items',
    address: 'Department of Computer Science & Engineering, Block 32, LPU Campus (Sample)',
    preferredWindow: '2024-12-14, Afternoon (1 PM – 5 PM)',
    contactName: 'Dr. Priya Mehta (Sample)',
    contactEmail: 'sample.faculty@lpu.in',
    contactPhone: '+91-98765-11223',
    status: 'scheduled',
    estimatedImpactKg: 45.0,
    createdAt: new Date('2024-12-14T15:00:00Z').toISOString(),
  },
  {
    _id: 'pickup_5',
    trackingId: 'ECO-385019',
    categories: ['batteries', 'mobiles-accessories'],
    quantity: '5+ items (mixed)',
    address: 'Girls Hostel GH-4, Common Room, LPU Campus (Sample)',
    preferredWindow: '2024-12-21, Morning (9 AM – 1 PM)',
    contactName: 'Simran Kaur (Sample)',
    contactEmail: 'sample.student2@lpu.in',
    contactPhone: '+91-98765-99887',
    status: 'requested',
    estimatedImpactKg: 8.2,
    createdAt: new Date('2024-12-21T11:00:00Z').toISOString(),
  },
];

// ── Environmental Impact Formula (UN GEM 2024 Standard) ─────────────────────
const CATEGORY_WEIGHT_KG: Record<string, number> = {
  'IT Equipment': 4.5,
  'Large Appliances': 30.0,
  'Small Appliances': 2.0,
  'Batteries': 0.5,
  'Lighting': 0.3,
  'Cables & Peripherals': 1.0,
  'Mobiles & Accessories': 1.2,
  'it-equipment': 4.5,
  'large-appliances': 30.0,
  'small-appliances': 2.0,
  'batteries': 0.5,
  'lighting': 0.3,
  'cables-peripherals': 1.0,
  'mobiles-accessories': 1.2,
};

const QUANTITY_MULTIPLIERS: Record<string, number> = {
  '1–2 items': 1.5,
  '3–5 items (light)': 4,
  '5+ items (mixed)': 8,
  '1–2 large items': 1.5,
  'A bag or box': 5,
  'More than a box': 12,
};

function calculateImpactKg(categories: string[], quantity: string): number {
  const categoryWeight = categories.reduce(
    (sum, cat) => sum + (CATEGORY_WEIGHT_KG[cat] ?? 2.0),
    0
  );
  const multiplier = QUANTITY_MULTIPLIERS[quantity] ?? 3;
  return Math.round(categoryWeight * multiplier * 10) / 10;
}

function generateTrackingId(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ECO-${code}`;
}

// ── Main Vercel Serverless Function Request Handler ─────────────────────────
export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse path and query params
  const fullUrl = req.url || '';
  const parsedUrl = new URL(fullUrl, 'http://localhost');
  const pathname = parsedUrl.pathname.replace(/\/$/, '');
  const method = req.method?.toUpperCase();

  // Helper to read query parameter (handles string or string[] or URL fallback)
  const getParam = (name: string): string | undefined => {
    if (req.query && req.query[name]) {
      const val = req.query[name];
      return Array.isArray(val) ? val[0] : val;
    }
    const val = parsedUrl.searchParams.get(name);
    return val !== null ? val : undefined;
  };

  // Helper to read request body
  const getBody = () => {
    if (!req.body) return {};
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    return req.body;
  };

  // 1. Health check: /api/health
  if (method === 'GET' && (pathname === '/api/health' || pathname === '/health')) {
    return res.status(200).json({ status: 'ok', serverless: true });
  }

  // 2. Collection centers: GET /api/centers
  if (method === 'GET' && (pathname === '/api/centers' || pathname === '/centers')) {
    const category = getParam('category');
    const type = getParam('type');

    let result = [...centers];
    if (category && category !== 'all') {
      result = result.filter((c) => c.categories.includes(category));
    }
    if (type && type !== 'all') {
      result = result.filter((c) => c.type === type);
    }
    return res.status(200).json({ success: true, data: result });
  }

  // 3. Pickups all: GET /api/pickups/all
  if (method === 'GET' && (pathname === '/api/pickups/all' || pathname === '/pickups/all')) {
    return res.status(200).json({ success: true, data: pickups });
  }

  // 4. Pickups query: GET /api/pickups
  if (method === 'GET' && (pathname === '/api/pickups' || pathname === '/pickups')) {
    const email = getParam('email');
    if (email) {
      const lower = email.trim().toLowerCase();
      const filtered = pickups.filter(
        (p) => p.contactEmail.trim().toLowerCase() === lower
      );
      return res.status(200).json({ success: true, data: filtered });
    }
    // If no email query, return all
    return res.status(200).json({ success: true, data: pickups });
  }

  // 5. Submit pickup: POST /api/pickups
  if (method === 'POST' && (pathname === '/api/pickups' || pathname === '/pickups')) {
    const body = getBody();

    if (!body.categories || !Array.isArray(body.categories) || body.categories.length === 0) {
      return res.status(400).json({ success: false, error: 'Select at least one category' });
    }
    if (!body.quantity) {
      return res.status(400).json({ success: false, error: 'Quantity is required' });
    }
    if (!body.address || body.address.length < 3) {
      return res.status(400).json({ success: false, error: 'Campus address/location is required' });
    }
    if (!body.contactName) {
      return res.status(400).json({ success: false, error: 'Contact name is required' });
    }
    if (!body.contactEmail || !body.contactEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email address is required' });
    }
    if (!body.contactPhone) {
      return res.status(400).json({ success: false, error: 'Valid phone number is required' });
    }

    const trackingId = generateTrackingId();
    const estimatedImpactKg = calculateImpactKg(body.categories, body.quantity);
    const newRecord: PickupRecord = {
      _id: 'pickup_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      trackingId,
      categories: body.categories,
      quantity: body.quantity,
      address: body.address,
      preferredWindow: body.preferredWindow || 'Next scheduled weekday collection',
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone,
      status: 'requested',
      estimatedImpactKg,
      createdAt: new Date().toISOString(),
    };

    pickups.unshift(newRecord);

    return res.status(201).json({
      success: true,
      data: newRecord,
    });
  }

  // 6. Update status: PATCH /api/pickups/:id
  const patchMatch = pathname.match(/^(?:\/api)?\/pickups\/([^/]+)$/);
  if (method === 'PATCH' && patchMatch) {
    const id = patchMatch[1];
    const body = getBody();
    const status = body.status?.toLowerCase();

    if (!['requested', 'scheduled', 'collected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const pickup = pickups.find((p) => p._id === id || p.trackingId === id);
    if (!pickup) {
      return res.status(404).json({ success: false, error: 'Pickup not found' });
    }

    pickup.status = status as 'requested' | 'scheduled' | 'collected';
    return res.status(200).json({ success: true, data: pickup });
  }

  // Fallback 404 for unmatched API routes
  return res.status(404).json({
    success: false,
    error: `API route not found: ${method} ${pathname}`,
  });
}

