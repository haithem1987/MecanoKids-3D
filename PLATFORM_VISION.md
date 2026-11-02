# Vision Plateforme — Catalogue de Jeux Éducatifs STEM

> Document de décision architecturale — 1er novembre 2026

---

## 1. Objectif

Un **catalogue de jeux éducatifs STEM** (ingénierie, code, sciences) vendu par abonnement familial abordable. Chaque jeu est une PWA autonome et hors-ligne. Le backend — authentification parentale, profils, abonnements, contrôles — est **partagé** entre tous les jeux.

---

## 2. Les trois options (comparaison rapide)

| Option | Description | Avantage | Problème |
|:---|:---|:---|:---|
| **A — Monorepo mono-domaine** | Tous les jeux sur un seul site, routes ou sous-domaines | Simple à démarrer | Bundle géant, jeux s'interfèrent, impossible de vendre séparément |
| **B — Multi-sites indépendants liés** | Chaque jeu a son propre domaine + catalogue qui les liste | Indépendance totale | Auth dupliquée, abonnements fragmentés, pas de profil partagé |
| **C — Plateforme + PWAs jeux ✓** | Un backend central ; chaque jeu est une PWA qui lui parle | Propre, scalable, offline possible | Un vrai backend à construire (mais c'était prévu au Lot D2) |

**Choix : Option C.**

---

## 3. Architecture : Plateforme + Game PWAs

```
┌─────────────────────────────────────────────────────────────────┐
│                    PLATEFORME CENTRALE                          │
│              platform.mecanokids.fr  (ou kidsstem.io)           │
│                                                                 │
│  • Authentification parent (Firebase Auth / Supabase)           │
│  • Profils enfants (multi-profils par famille)                  │
│  • Abonnement (Stripe Checkout — un seul paiement pour tous)    │
│  • Sas parental centralisé                                      │
│  • Dashboard parent : tous les jeux, toutes les stats STEM      │
│  • Émission des Tokens de Session (JWT signé Ed25519)           │
│  • Vitrine catalogue + landing pages SEO                        │
└────────────────────────┬────────────────────────────────────────┘
                         │ Token de session (JWT Ed25519, TTL 30j)
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
   │ MécanoKids   │ │  Jeu STEM 2  │ │  Jeu STEM 3  │
   │     3D       │ │  (futur)     │ │  (futur)     │
   │  PWA offline │ │  PWA offline │ │  PWA offline │
   │  mecanokids  │ │  codestem.fr │ │  ...         │
   │  3d.com      │ │              │ │              │
   └──────────────┘ └──────────────┘ └──────────────┘
```

### Comment un jeu sait que l'utilisateur est abonné

**C'est déjà conçu dans MécanoKids 3D.** La clé école Ed25519 = un JWT signé par la plateforme, vérifié localement par le jeu. Il suffit de généraliser :

```
// Payload du token de session plateforme
{
  "sub": "profile_abc123",       // id profil enfant (opaque, non nominatif)
  "name": "Théo",                // prénom local uniquement
  "tier": "family",              // "free" | "family" | "school"
  "games": ["mecanokids3d", "*"],// jeux accessibles ("*" = tous)
  "exp": "2027-05-01",
  "iat": "2026-11-01"
}
```

Le jeu embarque la **clé publique Ed25519** de la plateforme (32 octets, non secrète). Il vérifie le token hors-ligne via `@noble/ed25519`. Aucun appel réseau pendant la partie.

**Conséquence directe** : le mécanisme de licence école déjà prévu dans le Lot V devient un cas particulier de ce token — le même code de vérification sert pour tout.

---

## 4. Ce que la Plateforme fournit (API minimale)

| Endpoint | Rôle |
|:---|:---|
| `POST /auth/login` | Firebase/Supabase — connexion parent |
| `GET /profiles` | Liste des profils enfants du compte |
| `POST /profiles` | Créer un profil |
| `GET /profiles/:id/token` | Émet un JWT de session signé Ed25519 (le jeu le stocke en localStorage) |
| `POST /billing/checkout` | Crée une session Stripe |
| `POST /billing/webhook` | Stripe → met à jour le tier |
| `GET /catalog` | Liste des jeux avec métadonnées (pour la vitrine) |

C'est ~7 routes. Cloud Run stateless, ~0 € jusqu'à des milliers d'utilisateurs.

---

## 5. Ce que chaque jeu doit implémenter (contrat minimal)

1. **Lire le token** depuis `localStorage` à l'ouverture (clé : `platform_session_token`)
2. **Vérifier la signature** Ed25519 + la date d'expiration (code partagé dans un package `@mecanokids/platform-client`, ~50 lignes)
3. **Résoudre les entitlements localement** à partir du token (`tier`, `games`, `exp`)
4. **Rediriger vers la plateforme** si aucun token valide (deep link de retour pour revenir au jeu après login)
5. **Publier les stats STEM** en fin de session (fire-and-forget, hors-ligne tolérée)

---

## 6. Structure des dépôts

```
mecanokids-platform/         ← backend + vitrine catalogue (Next.js ou Express)
  src/
    api/                     ← 7 routes
    platform-client/         ← package partagé (vérification token Ed25519)
  landing/                   ← vitrine SEO trilingue

mecanokids-3d/               ← ce dépôt (Lot C1 devient la vitrine du jeu seulement)
mecanokids-code/             ← futur jeu
mecanokids-science/          ← futur jeu
```

**MécanoKids 3D n'a plus besoin de gérer l'auth ni le paiement** : le Lot V (lien Stripe, envoi de clé par mail) devient la v0 de la plateforme. Même code, repositionné.

---

## 7. Modèle économique & tarification

| Offre | Prix | Accès |
|:---|:---|:---|
| **Découverte** (gratuit) | 0 € | 20 véhicules MécanoKids 3D + 1 profil |
| **Pass Famille** | **12,99 € / an** | Tous les jeux du catalogue, 5 profils |
| **Édition École** | Sur devis (Chorus Pro) | Tous les jeux, profils illimités, outils enseignant |

*Un seul abonnement famille donne accès à tous les jeux présents et futurs : c'est l'argument de vente.*

---

## 8. Chemin de migration depuis l'état actuel

| Étape | Ce qu'on fait | Lot |
|:---|:---|:---|
| **Maintenant** | MécanoKids 3D standalone (auth locale, clé école Ed25519 manuelle) | Lot V |
| **Après validation du marché** | Extraire le backend Lot V dans `mecanokids-platform` ; le jeu consomme le token | Lot D2 |
| **Au 2e jeu** | Le package `platform-client` est déjà là ; le 2e jeu l'importe et c'est tout | — |

**Ne pas construire la plateforme avant d'avoir vendu les premières licences.** Le Lot V (Stripe + clé par mail) est la v0 de la plateforme — suffisant pour valider l'intention d'achat.

---

## 8bis. Architecture Backend — Monolithe Modulaire Provider-Agnostic

### Principe directeur

**Monolithe modulaire, pas microservices.** Un seul processus, des modules à frontières nettes. Si la charge impose de séparer un module plus tard, les interfaces sont déjà là — c'est une extraction, pas une réécriture.

**Provider-agnostic via le pattern Repository.** Chaque module externe (auth, base de données, email, paiement) est caché derrière une interface TypeScript. Changer de fournisseur = remplacer une implémentation, pas modifier le code métier.

### Structure du backend (`mecanokids-platform/src/`)

```
src/
  modules/
    auth/
      IAuthProvider.ts          ← interface (login, verifyToken, deleteAccount)
      SupabaseAuthProvider.ts   ← implémentation Supabase (remplaçable)
    profiles/
      IProfileStore.ts          ← interface (get, save, list, delete)
      SupabaseProfileStore.ts   ← implémentation Supabase
    subscriptions/
      ISubscriptionProvider.ts  ← interface (createCheckout, getStatus, webhook)
      StripeSubscriptionProvider.ts
    email/
      IEmailProvider.ts         ← interface (sendLicenseKey, sendInvoice)
      ResendEmailProvider.ts    ← remplaçable par Postmark, SES, etc.
    licenses/
      LicenseService.ts         ← signe les JWT Ed25519 (aucun provider externe)
  api/
    routes.ts                   ← 7 routes, injecte les providers via DI simple
  container.ts                  ← composition root : instancie les providers concrets
```

### Pourquoi Supabase en v0 (pas Firebase)

| Critère | Supabase | Firebase |
|:---|:---|:---|
| Base de données | PostgreSQL (SQL standard) | Firestore (NoSQL propriétaire) |
| Migration vers un autre provider | `pg_dump` → n'importe quel Postgres | Export JSON + réécrire les requêtes |
| Auth | Compatible JWT standard | JWT Firebase propriétaire |
| Coût à l'échelle | Prévisible (Postgres) | Lecture/écriture = coût difficile à prévoir |
| Lock-in | Faible (Postgres = standard) | Fort (Firestore, Rules, Functions) |

**Décision : Supabase en v0.** Si on migre vers Neon, PlanetScale, Railway ou un Postgres self-hosted, c'est un remplacement d'implémentation derrière `IProfileStore`, pas une réécriture.

### Exemple : changer de provider auth

```typescript
// container.ts — un seul endroit à modifier
import { SupabaseAuthProvider } from './modules/auth/SupabaseAuthProvider'
// import { FirebaseAuthProvider } from './modules/auth/FirebaseAuthProvider'

export const container = {
  auth: new SupabaseAuthProvider(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY),
  profiles: new SupabaseProfileStore(...),
  email: new ResendEmailProvider(process.env.RESEND_KEY),
  subscriptions: new StripeSubscriptionProvider(process.env.STRIPE_KEY),
}
```

### Ce qu'on ne fait pas

- Pas d'ORM lourd (Prisma est acceptable, TypeORM non) — SQL direct via le client Supabase suffit en v0
- Pas d'injection de dépendances framework (NestJS, InversifyJS) — un simple `container.ts` suffit jusqu'à ~10 modules
- Pas de message broker (Redis, RabbitMQ) — appels synchrones jusqu'à preuve de besoin

---

## 9. Ce qu'on ne fait pas maintenant

- App Store / Google Play (Lot D2 — après validation)
- Dashboard parent cross-jeux (quand il y a ≥ 2 jeux)
- Système de recommandations / progression cross-jeux
- Gamification du catalogue (badges plateforme)

Ces fonctionnalités arrivent naturellement une fois que le catalogue compte ≥ 2 jeux et ≥ 100 familles.
