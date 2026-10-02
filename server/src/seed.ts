import { Center } from './models/Center';
import { Pickup } from './models/Pickup';

const centerData = [
  {
    name: 'E-Waste Recycling Hub — Nehru Place',
    address: 'Outer Ring Road, Nehru Place, New Delhi — 110019',
    lat: 28.5487,
    lng: 77.2519,
    categories: ['IT Equipment', 'Cables & Peripherals', 'Small Appliances'],
    hours: 'Mon–Sat: 9 AM – 6 PM',
    phone: '+91-11-4567-8901',
  },
  {
    name: 'GreenMend Collection Point — Saket',
    address: 'Near M-Block Market, Saket, New Delhi — 110017',
    lat: 28.5244,
    lng: 77.2090,
    categories: ['Batteries', 'IT Equipment', 'Small Appliances', 'Lighting'],
    hours: 'Mon–Sun: 10 AM – 7 PM',
    phone: '+91-11-4234-5678',
  },
  {
    name: 'Eco Kendra — Connaught Place',
    address: 'Inner Circle, Connaught Place, New Delhi — 110001',
    lat: 28.6304,
    lng: 77.2177,
    categories: ['Lighting', 'Cables & Peripherals', 'Small Appliances'],
    hours: 'Tue–Sun: 11 AM – 8 PM',
    phone: '+91-11-2341-2345',
  },
  {
    name: 'TechCycle Center — Gurgaon',
    address: 'Sector 14, MG Road, Gurugram, Haryana — 122001',
    lat: 28.4697,
    lng: 77.0344,
    categories: ['IT Equipment', 'Large Appliances', 'Batteries', 'Cables & Peripherals'],
    hours: 'Mon–Fri: 9 AM – 5 PM, Sat: 10 AM – 4 PM',
    phone: '+91-124-456-7890',
  },
  {
    name: 'E-Circle Drop-off — Noida Sector 18',
    address: 'Atta Market, Sector 18, Noida, UP — 201301',
    lat: 28.5702,
    lng: 77.3219,
    categories: ['IT Equipment', 'Small Appliances', 'Cables & Peripherals', 'Batteries'],
    hours: 'Mon–Sun: 9 AM – 8 PM',
    phone: '+91-120-456-7891',
  },
  {
    name: 'Prithvi Recycle — Janakpuri',
    address: 'District Centre, Janakpuri, New Delhi — 110058',
    lat: 28.6258,
    lng: 77.0852,
    categories: ['Large Appliances', 'Small Appliances', 'IT Equipment'],
    hours: 'Mon–Sat: 10 AM – 6 PM',
    phone: '+91-11-2551-7654',
  },
  {
    name: 'Vatavaran E-Waste — Lajpat Nagar',
    address: 'Central Market, Lajpat Nagar II, New Delhi — 110024',
    lat: 28.5706,
    lng: 77.2369,
    categories: ['Batteries', 'Small Appliances', 'Lighting'],
    hours: 'Tue–Sun: 10 AM – 7 PM',
    phone: '+91-11-4657-3456',
  },
  {
    name: 'GreenDrop — Faridabad',
    address: 'Sector 16A, Near NIT, Faridabad, Haryana — 121002',
    lat: 28.3916,
    lng: 77.3178,
    categories: ['Large Appliances', 'IT Equipment', 'Cables & Peripherals'],
    hours: 'Mon–Fri: 9 AM – 5 PM',
    phone: '+91-129-456-1234',
  },
  {
    name: 'Cycle-E Hub — Dwarka',
    address: 'Sector 10 Market, Dwarka, New Delhi — 110075',
    lat: 28.5921,
    lng: 77.0460,
    categories: ['IT Equipment', 'Batteries', 'Small Appliances', 'Lighting', 'Cables & Peripherals'],
    hours: 'Mon–Sun: 9 AM – 7 PM',
    phone: '+91-11-2508-9876',
  },
  {
    name: 'EcoRevive — Greater Noida',
    address: 'Alpha-I Commercial Belt, Greater Noida, UP — 201308',
    lat: 28.4745,
    lng: 77.5040,
    categories: ['Large Appliances', 'IT Equipment', 'Batteries'],
    hours: 'Mon–Sat: 9 AM – 6 PM',
    phone: '+91-120-234-5678',
  },
];

const pickupData = [
  {
    trackingId: 'ECO-2024-001',
    categories: ['IT Equipment', 'Cables & Peripherals'],
    quantity: '3–5 items (light)',
    address: '42, Vasant Vihar, New Delhi — 110057',
    preferredWindow: '2024-11-15, Morning (9 AM – 1 PM)',
    contactName: 'Priya Sharma',
    contactEmail: 'priya.sharma@example.com',
    contactPhone: '+91-98765-43210',
    status: 'collected' as const,
    estimatedImpactKg: 12.5,
  },
  {
    trackingId: 'ECO-2024-002',
    categories: ['Large Appliances'],
    quantity: '1–2 large items',
    address: '18, Sushant Lok Phase 1, Gurugram — 122009',
    preferredWindow: '2024-11-20, Afternoon (1 PM – 5 PM)',
    contactName: 'Rahul Mehta',
    contactEmail: 'rahul.mehta@example.com',
    contactPhone: '+91-87654-32109',
    status: 'scheduled' as const,
    estimatedImpactKg: 45.0,
  },
  {
    trackingId: 'ECO-2024-003',
    categories: ['Batteries', 'Small Appliances'],
    quantity: '5+ items (mixed)',
    address: '7, Civil Lines, Noida — 201301',
    preferredWindow: '2024-11-25, Morning (9 AM – 1 PM)',
    contactName: 'Anjali Gupta',
    contactEmail: 'anjali.gupta@example.com',
    contactPhone: '+91-76543-21098',
    status: 'requested' as const,
    estimatedImpactKg: 8.2,
  },
];

export async function seedDatabase(): Promise<void> {
  const centerCount = await Center.countDocuments();
  if (centerCount === 0) {
    await Center.insertMany(centerData);
    console.log(`   → Seeded ${centerData.length} collection centers`);
  }

  const pickupCount = await Pickup.countDocuments();
  if (pickupCount === 0) {
    await Pickup.insertMany(pickupData);
    console.log(`   → Seeded ${pickupData.length} sample pickups`);
  }
}
