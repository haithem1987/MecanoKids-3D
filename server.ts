import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getBackendAdapter } from './src/backend/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 7300;

// ── Security helpers ──────────────────────────────────────────────────────────

const BLUEPRINT_RE = /^[a-z0-9-]{1,100}$/i;
const EMAIL_RE = /^[^@\s]{1,64}@[^@\s]{1,255}\.[^@\s]{1,63}$/;

function validateBlueprintId(v: unknown): v is string {
  return typeof v === 'string' && BLUEPRINT_RE.test(v);
}

// Rate limiter: max 60 POST requests per IP per minute (in-memory)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip ?? 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    next();
    return;
  }
  entry.count++;
  if (entry.count > 60) {
    res.status(429).json({ error: 'too many requests' });
    return;
  }
  next();
}

// Security headers middleware
function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' *.supabase.co",
  );
  next();
}

// ─────────────────────────────────────────────────────────────────────────────

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '512kb' }));
  app.use(securityHeaders);

  const adapter = getBackendAdapter();

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, app: 'MécanoKids 3D' });
  });

  app.get('/api/leaderboard/:blueprintId', async (req: Request, res: Response) => {
    const { blueprintId } = req.params;
    if (!validateBlueprintId(blueprintId)) {
      res.status(400).json({ error: 'invalid blueprintId' });
      return;
    }
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    try {
      const entries = await adapter.getLeaderboard(blueprintId, limit);
      res.json(entries);
    } catch {
      res.status(500).json({ error: 'leaderboard unavailable' });
    }
  });

  app.post('/api/score', rateLimiter, async (req: Request, res: Response) => {
    const { blueprintId, profileName, timeMs, date } = req.body as Record<string, unknown>;
    if (
      !validateBlueprintId(blueprintId) ||
      typeof profileName !== 'string' || profileName.length < 1 || profileName.length > 50 ||
      typeof timeMs !== 'number' || timeMs <= 0 || timeMs > 3_600_000 ||
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

  app.post('/api/school-inquiry', rateLimiter, async (req: Request, res: Response) => {
    const { firstName, school, email, message } = req.body as Record<string, unknown>;
    if (
      typeof firstName !== 'string' || firstName.length < 1 || firstName.length > 100 ||
      typeof school !== 'string' || school.length < 1 || school.length > 200 ||
      typeof email !== 'string' || !EMAIL_RE.test(email)
    ) {
      res.status(400).json({ error: 'invalid payload' });
      return;
    }
    try {
      await adapter.postSchoolInquiry({
        firstName,
        school,
        email,
        message: typeof message === 'string' ? message.slice(0, 2000) : undefined,
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
