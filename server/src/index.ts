import express from 'express';
import cors from 'cors';
import { connectDB } from './db';
import centerRoutes from './routes/centers';
import pickupRoutes from './routes/pickups';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/centers', centerRoutes);
app.use('/api/pickups', pickupRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

async function main() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🌿 EcoCircuit API running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health\n`);
  });
}

main().catch(console.error);
