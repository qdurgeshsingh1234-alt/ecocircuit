import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { Pickup } from '../models/Pickup';

const router = Router();

const CATEGORY_WEIGHT_KG: Record<string, number> = {
  'IT Equipment': 4.5,
  'Large Appliances': 30.0,
  'Small Appliances': 2.0,
  'Batteries': 0.5,
  'Lighting': 0.3,
  'Cables & Peripherals': 1.0,
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
    const trackingId = `ECO-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`;
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
