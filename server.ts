import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getBackendAdapter } from './src/backend/index.js';
import Stripe from 'stripe';

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

// ── Stripe helpers ────────────────────────────────────────────────────────────

function getStripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.startsWith('sk_REPLACE')) return null;
  return new Stripe(key, { apiVersion: '2026-10-28.endive' as Stripe.LatestApiVersion });
}

async function sha256hex(text: string): Promise<string> {
  const { createHash } = await import('crypto');
  return createHash('sha256').update(text).digest('hex');
}

function generateLicenseKey(): string {
  const seg = () => Math.random().toString(36).toUpperCase().slice(2, 6).padEnd(4, '0');
  return `MK3D-${seg()}-${seg()}-${seg()}`;
}

// ─────────────────────────────────────────────────────────────────────────────

async function startServer() {
  const app = express();
  // Webhook must receive raw body — register before json middleware
  app.use('/api/webhook', express.raw({ type: 'application/json' }));
  app.use(express.json({ limit: '512kb' }));
  app.use(securityHeaders);

  const adapter = getBackendAdapter();

  const stripe = getStripeClient();

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, app: 'Octo Gears' });
  });

  // ── Stripe checkout ───────────────────────────────────────────────────────

  app.post('/api/checkout', rateLimiter, async (req: Request, res: Response) => {
    if (!stripe) { res.status(503).json({ error: 'payments_unavailable' }); return; }
    const { plan } = req.body as Record<string, unknown>;
    if (plan !== 'family' && plan !== 'school') {
      res.status(400).json({ error: 'invalid plan' }); return;
    }
    const priceId = plan === 'family'
      ? process.env.STRIPE_PRICE_FAMILY_YEAR
      : process.env.STRIPE_PRICE_SCHOOL_YEAR;
    if (!priceId || priceId.startsWith('price_REPLACE')) {
      res.status(503).json({ error: 'price_not_configured' }); return;
    }
    const base = process.env.APP_BASE_URL ?? 'http://localhost:7301';
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      automatic_tax: { enabled: false }, // activer après enregistrement TVA Stripe
      success_url: `${base}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/?checkout=cancel`,
      integration_identifier: `octo-gears-${plan}-jkxrtqwp`,
    });
    res.json({ url: session.url });
  });

  // POST /api/checkout/verify?session_id=xxx → retourne { tier, licenseKey }
  app.get('/api/checkout/verify', async (req: Request, res: Response) => {
    if (!stripe) { res.status(503).json({ error: 'payments_unavailable' }); return; }
    const sessionId = req.query.session_id;
    if (typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
      res.status(400).json({ error: 'invalid session_id' }); return;
    }
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== 'paid' && session.status !== 'complete') {
        res.status(402).json({ error: 'not_paid' }); return;
      }
      const metadata = session.metadata ?? {};
      const licenseKey = metadata.license_key ?? null;
      const tier = metadata.tier ?? 'family';
      res.json({ tier, licenseKey });
    } catch {
      res.status(500).json({ error: 'verification_failed' });
    }
  });

  // ── Stripe webhook ────────────────────────────────────────────────────────

  app.post('/api/webhook', async (req: Request, res: Response) => {
    if (!stripe) { res.sendStatus(503); return; }
    const sig = req.headers['stripe-signature'];
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!sig || !secret || secret.startsWith('whsec_REPLACE')) {
      res.sendStatus(400); return;
    }
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body as Buffer, sig, secret);
    } catch {
      res.sendStatus(400); return;
    }

    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status !== 'paid') { res.sendStatus(200); return; }

      const subId = typeof session.subscription === 'string'
        ? session.subscription : (session.subscription as Stripe.Subscription | null)?.id;
      const sub = subId ? await stripe.subscriptions.retrieve(subId) : null;
      const rawTier = (sub?.metadata?.tier ?? session.metadata?.tier ?? 'family');
      const tier: 'family' | 'school' = rawTier === 'school' ? 'school' : 'family';

      // Generate license key and store in Supabase
      const licenseKey = generateLicenseKey();
      const keyHash = await sha256hex(licenseKey);
      const periodEnd = (sub as unknown as { current_period_end?: number } | null)?.current_period_end;
      const expiresAt = periodEnd ? new Date(periodEnd * 1000).toISOString() : null;
      try {
        const adapter = getBackendAdapter();
        await adapter.storeLicenseKey?.({ keyHash, tier, expiresAt });
      } catch (err) {
        console.error('Failed to store license key:', err);
      }

      // Attach key to session metadata for /verify
      await stripe.checkout.sessions.update(session.id, {
        metadata: { ...session.metadata, license_key: licenseKey, tier },
      });
    }

    res.sendStatus(200);
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
    console.log(`Octo Gears lancé sur http://localhost:${PORT}`);
  });
}

startServer();
