# ADR 001 — API disponible en production

**Date :** 2026-11-03  
**Statut :** ✅ Décidé le 2026-11-03  
**Contexte :** `wrangler.jsonc` ne déclare pas de `main` ; les routes `server.ts` (`/api/checkout`, `/api/webhook`, `/api/leaderboard`, `/api/score`, `/api/school-inquiry`) n'existent qu'en dev local Express. Aucune API ne fonctionne en production Cloudflare Workers.

---

## Option (a) — Worker Hono + D1 + binding ASSETS

**Architecture :** Un seul Worker (`src/worker.ts`) avec Hono comme routeur. Les routes `/api/*` sont traitées par le Worker ; les assets statiques sont servis via le binding `ASSETS` (remplace l'actuel SPA fallback passif). D1 remplace ou complète Supabase pour les tables `licenses` et `school_inquiries`.

| Critère | Évaluation |
|---|---|
| **Coût** | Workers free tier : 100 000 req/jour. D1 : 5 Go stockage, 25 M lectures/mois gratuits. Pour le volume attendu (lancement) : **gratuit**. |
| **Hors-ligne** | Aucun impact : le PWA Workbox pré-cache les assets indépendamment du Worker. ✅ |
| **RGPD / localisation** | D1 est aujourd'hui en région `wnam` (USA) par défaut. Cloudflare propose des régions EU (`eeur`) en Workers Paid. **Risque RGPD réel si données école/licence en USA sans DPA Cloudflare.** Mitigation : stocker les contacts école dans Supabase EU uniquement, D1 pour les hash de clés de licence seulement. |
| **Migration routes existantes** | Effort modéré : réécrire `server.ts` en Hono (même structure, API identique). Les middlewares `rateLimiter`, `securityHeaders` se portent directement. Stripe webhook : `req.body` en `Buffer` → remplacer par `await request.arrayBuffer()`. Estimation : **1–2 jours**. |
| **Webhook Stripe** | Workers supporte les raw body via `request.arrayBuffer()`. La vérification de signature `stripe.webhooks.constructEvent` fonctionne. ✅ |

**Inconvénients :** Ajoute D1 comme nouvelle dépendance de données. Nécessite `wrangler secret put` pour les variables d'environnement Stripe.

---

## Option (b) — Supabase Edge Functions

**Architecture :** Les routes `/api/*` deviennent des Edge Functions Supabase (Deno). Le Worker Cloudflare reste passif (assets seulement). Le front appelle directement `https://<project>.supabase.co/functions/v1/checkout` etc.

| Critère | Évaluation |
|---|---|
| **Coût** | Supabase free : 500 000 invocations/mois. Au-delà : 2 $/million. **Gratuit au lancement.** |
| **Hors-ligne** | Aucun impact. ✅ |
| **RGPD / localisation** | Supabase EU (région `eu-central-1` Frankfurt) disponible sur Free. **Meilleur profil RGPD** que Cloudflare D1 USA. ✅ |
| **Migration routes existantes** | Effort plus élevé : réécrire en Deno/TypeScript, gérer CORS manuellement, déployer chaque fonction séparément. Stripe webhook : `Deno.serve` + `req.arrayBuffer()`. Estimation : **2–3 jours**. |
| **Webhook Stripe** | Supporté mais nécessite de gérer le CORS et le raw body en Deno. Légèrement plus complexe. |

**Inconvénients :** Deux plateformes à opérer (Cloudflare + Supabase). Le front doit connaître l'URL Supabase pour les appels API (plus de `/api/*` relatif). Cold starts Deno potentiellement plus longs.

---

## Décision retenue

**Option (b) — Supabase Edge Functions**, pour ces raisons :

1. La base de données Supabase est déjà en place (migrations, schéma, adaptateur).
2. Données hébergées en Europe (Frankfurt) — argument RGPD fort, notamment pour les contacts école.
3. Zéro donnée enfant collectée + hébergement EU = argument commercial différenciant.
4. Pas de nouvelle dépendance de données (pas de D1).

**Note pour la suite :** L'hébergement des assets statiques sur Cloudflare sera réévalué au profit d'un hébergeur européen (Scaleway, Bunny CDN, OVH) — tâche à créer en Phase 4.

## 🧑 Décision attendue

- [x] ✅ Option (b) Supabase Edge Functions validée le 2026-11-03.

Implémentation à faire dans la tâche B4 (Phase 3, prérequis P0-ARCH).
