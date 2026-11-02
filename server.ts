import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getBackendAdapter } from './src/backend/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '512kb' }));

  const adapter = getBackendAdapter();

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, app: 'MécanoKids 3D' });
  });

  app.get('/api/leaderboard/:blueprintId', async (req: Request, res: Response) => {
    const { blueprintId } = req.params;
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    try {
      const entries = await adapter.getLeaderboard(blueprintId, limit);
      res.json(entries);
    } catch {
      res.status(500).json({ error: 'leaderboard unavailable' });
    }
  });

  app.post('/api/score', async (req: Request, res: Response) => {
    const { blueprintId, profileName, timeMs, date } = req.body as Record<string, unknown>;
    if (
      typeof blueprintId !== 'string' ||
      typeof profileName !== 'string' ||
      typeof timeMs !== 'number' ||
      typeof date !== 'string'
    ) {
      res.status(400).json({ error: 'invalid payload' });
      return;
    }
    try {
      await adapter.postScore(blueprintId, { profileName, timeMs, date });
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: 'score submission failed' });
    }
  });

  app.post('/api/school-inquiry', async (req: Request, res: Response) => {
    const { firstName, school, email, message } = req.body as Record<string, unknown>;
    if (
      typeof firstName !== 'string' ||
      typeof school !== 'string' ||
      typeof email !== 'string'
    ) {
      res.status(400).json({ error: 'invalid payload' });
      return;
    }
    try {
      await adapter.postSchoolInquiry({
        firstName,
        school,
        email,
        message: typeof message === 'string' ? message : undefined,
      });
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: 'inquiry submission failed' });
    }
  });

  const isProduction =
    process.env.NODE_ENV === 'production' || process.argv.includes('--prod');

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MécanoKids 3D lancé sur http://localhost:${PORT}`);
  });
}

startServer();
