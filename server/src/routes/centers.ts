import { Router, Request, Response } from 'express';
import { Center } from '../models/Center';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const query = category ? { categories: { $in: [category as string] } } : {};
    const centers = await Center.find(query).sort({ name: 1 });
    res.json({ success: true, data: centers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch centers' });
  }
});

export default router;
