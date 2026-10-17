import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { Pickup } from '../models/Pickup';

const router = Router();

// ── Environmental Impact Calculation Formula & Assumptions ──────────────────
// Based on United Nations Global E-waste Monitor (GEM 2024) average unit weights:
// - IT Equipment: ~4.5 kg (laptops ~2.2 kg, monitors ~4.5 kg)
// - Large Appliances: ~30.0 kg (microwaves, mini-coolers)
// - Small Appliances: ~2.0 kg (kettles, irons, hairdryers)
// - Batteries: ~0.5 kg (lithium-ion and alkaline packs)
// - Lighting: ~0.3 kg (CFLs, LED tubes)
// - Cables & Peripherals: ~1.0 kg (chargers, mice, keyboards)
// - Mobiles & Accessories: ~1.2 kg (phones ~0.18 kg + powerbanks/accessories)
// Multipliers estimate volume based on user-selected bucket.
// Note: Labeled in UI as "Estimated impact (Sample data)".
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
  const categoryWeight = categories.reduce((sum, cat) => sum + (CATEGORY_WEIGHT_KG[cat] ?? 2.0), 0);
  const multiplier = QUANTITY_MULTIPLIERS[quantity] ?? 3;
  return Math.round(categoryWeight * multiplier * 10) / 10;
}

// Generate canonical ECO-XXXXXX tracking ID (6 uppercase alphanumeric chars)
function generateTrackingId(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ECO-${code}`;
}

const CreatePickupSchema = z.object({
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  quantity: z.string().min(1, 'Quantity is required'),
  address: z.string().min(5, 'Please enter a valid address'),
  preferredWindow: z.string().min(1, 'Preferred time window is required'),
  contactName: z.string().min(2, 'Name must be at least 2 characters'),
  contactEmail: z.string().email('Valid email is required'),
  contactPhone: z.string().min(7, 'Valid phone number is required'),
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = CreatePickupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const data = parsed.data;
    const trackingId = generateTrackingId();
    const estimatedImpactKg = calculateImpactKg(data.categories, data.quantity);

    const pickup = new Pickup({
      ...data,
      trackingId,
      estimatedImpactKg,
      status: 'requested',
    });

    await pickup.save();

    res.status(201).json({
      success: true,
      data: {
        trackingId,
        estimatedImpactKg,
        status: 'requested',
        createdAt: pickup.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create pickup' });
  }
});

router.get('/all', async (_req: Request, res: Response) => {
  try {
    const pickups = await Pickup.find().sort({ createdAt: -1 });
    res.json({ success: true, data: pickups });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch pickups' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email parameter required' });
    }
    const pickups = await Pickup.find({
      contactEmail: { $regex: new RegExp(`^${email as string}$`, 'i') },
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: pickups });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch pickups' });
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['requested', 'scheduled', 'collected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    const pickup = await Pickup.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!pickup) {
      return res.status(404).json({ success: false, error: 'Pickup not found' });
    }
    res.json({ success: true, data: pickup });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update pickup' });
  }
});

export default router;
