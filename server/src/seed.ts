import { Center } from './models/Center';
import { Pickup } from './models/Pickup';

// ── Sample collection centers — LPU campus and Phagwara/Jalandhar area ──────
// Coordinates: LPU campus centre ≈ 31.255, 75.705 (Phagwara, Punjab)
// All entries are sample data for demonstration only. isSample: true.
const centerData = [
  // ── On-campus drop-off points ──────────────────────────────────────────────
  {
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
    name: 'Sample Collection Point — Central Library Entrance',
    address: 'Main Lobby, Central Library, LPU Campus, Phagwara, Punjab — 144411 (Sample)',
    lat: 31.2563,
    lng: 75.7045,
    categories: ['it-equipment', 'cables-peripherals', 'mobiles-accessories'],
    hours: 'Mon–Sat: 9 AM – 9 PM · Sun: 10 AM – 6 PM',
    type: 'campus-point',
    isSample: true,
  },
  // ── Collection drive ───────────────────────────────────────────────────────
  {
    name: 'Sample Collection Drive — Baldev Raj Mittal Unipolis Parking',
    address: 'BR Mittal Unipolis, LPU Campus, Phagwara, Punjab — 144411 (Sample)',
    lat: 31.2541,
    lng: 75.7036,
    categories: ['large-appliances', 'it-equipment', 'small-appliances', 'batteries', 'mobiles-accessories', 'cables-peripherals', 'lighting'],
    hours: 'First Saturday of every month: 10 AM – 4 PM (Sample schedule)',
    type: 'collection-drive',
    isSample: true,
  },
  // ── Authorized recyclers in Phagwara / Jalandhar area ─────────────────────
  {
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

// ── Sample pickup requests ────────────────────────────────────────────────────
// Using hostel block / department locations — no street addresses.
const pickupData = [
  {
    trackingId: 'ECO-2024-001',
    categories: ['it-equipment', 'cables-peripherals'],
    quantity: '3–5 items (light)',
    address: 'Boys Hostel BH-6, Room 204, LPU Campus (Sample)',
    preferredWindow: '2024-12-07, Morning (9 AM – 1 PM)',
    contactName: 'Arjun Sharma (Sample)',
    contactEmail: 'sample.student1@lpu.in',
    contactPhone: '+91-XXXXX-XXXXX',
    status: 'collected' as const,
    estimatedImpactKg: 12.5,
  },
  {
    trackingId: 'ECO-2024-002',
    categories: ['large-appliances'],
    quantity: '1–2 large items',
    address: 'Department of Computer Science & Engineering, Block 32, LPU Campus (Sample)',
    preferredWindow: '2024-12-14, Afternoon (1 PM – 5 PM)',
    contactName: 'Dr. Priya Mehta (Sample)',
    contactEmail: 'sample.faculty@lpu.in',
    contactPhone: '+91-XXXXX-XXXXX',
    status: 'scheduled' as const,
    estimatedImpactKg: 45.0,
  },
  {
    trackingId: 'ECO-2024-003',
    categories: ['batteries', 'mobiles-accessories'],
    quantity: '5+ items (mixed)',
    address: 'Girls Hostel GH-4, Common Room, LPU Campus (Sample)',
    preferredWindow: '2024-12-21, Morning (9 AM – 1 PM)',
    contactName: 'Simran Kaur (Sample)',
    contactEmail: 'sample.student2@lpu.in',
    contactPhone: '+91-XXXXX-XXXXX',
    status: 'requested' as const,
    estimatedImpactKg: 8.2,
  },
];

export async function seedDatabase(): Promise<void> {
  // Always refresh centers so schema changes (type, isSample) take effect.
  await Center.deleteMany({});
  await Center.insertMany(centerData);
  console.log(`   → Seeded ${centerData.length} collection centers`);

  const pickupCount = await Pickup.countDocuments();
  if (pickupCount === 0) {
    await Pickup.insertMany(pickupData);
    console.log(`   → Seeded ${pickupData.length} sample pickups`);
  }
}
