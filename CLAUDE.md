# CLAUDE.md — cosmo-task-manager

## Vue d'ensemble du projet

**cosmo-task-manager** est une application de productivité personnelle (SPA) construite avec React + Vite + TypeScript. Elle permet de gérer des tâches, habitudes, événements, OKRs, amis et messages, avec deux modes de fonctionnement : **démo** (LocalStorage) et **production** (Supabase).

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework UI | React 18 + Vite 5 |
| Langage | TypeScript 5 (strict) |
| Routing | React Router DOM v6 |
| State / Data fetching | TanStack React Query v5 |
| Base de données | Supabase (PostgreSQL) |
| Auth | Supabase Auth + better-auth (legacy) |
| Styling | Tailwind CSS v3 + Radix UI |
| Animations | Framer Motion + GSAP |
| Calendrier | FullCalendar v6 |
| Paiement | Stripe |
| Notifications | Sonner |
| Alias import | `@/*` → `src/*` |

---

## Architecture

### Pattern Repository (critique)

Chaque domaine métier suit strictement ce pattern :

```
src/modules/<domain>/
├── types.ts              # Types TypeScript du domaine
├── constants.ts          # Clés localStorage, query keys
├── repository.ts         # Interface IXxxRepository + implémentation LocalStorage (demo data)
├── supabase.repository.ts # Implémentation Supabase (production)
├── hooks.ts              # Hooks React Query (useXxx, useCreateXxx, etc.)
└── index.ts              # Barrel export
```

**Factory centralisée** : `src/lib/repository.factory.ts`
- Sélectionne automatiquement l'implémentation selon `isDemoMode` (variable depuis `src/lib/supabase.ts`)
- Singletons par repository — utiliser `getXxxRepository()` et jamais instancier directement

**Modules existants** : `tasks`, `habits`, `events`, `categories`, `lists`, `friends`, `okrs`, `auth`

### Convention de mapping DB

Les repositories Supabase font toujours le mapping `snake_case` (DB) ↔ `camelCase` (TypeScript) via `mapFromDb()` / `mapToDb()`. Ne jamais exposer les types DB Row à l'extérieur du repository.

### Pages & Routing

```
/welcome, /login, /signup   → Pages publiques (hors Layout)
/dashboard                  → Page d'accueil (index)
/tasks                      → Gestion des tâches
/agenda                     → Calendrier (FullCalendar)
/habits                     → Suivi des habitudes
/okr                        → Objectifs & Key Results
/statistics                 → Statistiques
/settings                   → Paramètres
/premium                    → Page premium (Stripe)
/messages                   → Messagerie (amis)
```

Toutes les pages sont **lazy-loadées** via `React.lazy()` + `<Suspense>`.

---

## Commandes de développement

```bash
npm run dev        # Serveur de dev (Vite)
npm run build      # Build de production
npm run lint       # ESLint
npm run preview    # Preview du build
npm start          # Serveur sur 0.0.0.0:3000
```

---

## Variables d'environnement

Fichier `.env` à la racine :

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_SUPABASE_SERVICE_ROLE_KEY=...
DATABASE_URL=...          # Pour better-auth (legacy)
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=...
```

> ⚠️ Sans `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`, l'app tourne automatiquement en mode **démo** (LocalStorage).

---

## Conventions de code

### TypeScript

- Mode strict activé (`"strict": true` dans tsconfig)
- `noUnusedLocals` et `noUnusedParameters` actifs — ne pas laisser de variables inutilisées
- Toujours typer explicitement les inputs/outputs des fonctions de repository
- Utiliser les types du module (`CreateXxxInput`, `UpdateXxxInput`) et jamais les types DB Row en dehors du repository

### Imports

- Utiliser l'alias `@/` pour tous les imports depuis `src/`
- Barrel exports depuis `index.ts` de chaque module — éviter les imports directs de fichiers internes

### React Query

- Query keys centralisées dans `constants.ts` de chaque module (ex: `habitKeys.lists()`, `habitKeys.detail(id)`)
- Invalider **uniquement** les queries nécessaires dans `onSuccess` (pas `queryClient.invalidateQueries()` global)
- `staleTime: 5min`, `gcTime: 30min`, `retry: 1`, `refetchOnWindowFocus: false` (config globale)

### Gestion d'erreurs

- Toujours utiliser `normalizeApiError()` dans les repositories Supabase
- Les erreurs Supabase `PGRST116` (not found) retournent `null`, pas une exception

### Styling

- Tailwind CSS uniquement — pas de CSS custom sauf dans `index.css`
- Dark mode via classes `dark:` (thème slate-950 de base)
- Composants Radix UI pour accessibilité (Dialog, Dropdown, Tooltip, etc.)

---

## Ajouter un nouveau module

1. Créer `src/modules/<domain>/` avec tous les fichiers du pattern
2. Définir l'interface `IXxxRepository` dans `repository.ts`
3. Implémenter `LocalStorageXxxRepository` (avec `DEMO_DATA`) dans `repository.ts`
4. Implémenter `SupabaseXxxRepository` dans `supabase.repository.ts` (mapping snake_case ↔ camelCase)
5. Écrire les hooks React Query dans `hooks.ts` avec les query keys dans `constants.ts`
6. Enregistrer le repository dans `src/lib/repository.factory.ts`
7. Exporter depuis `index.ts`
8. Créer la table Supabase correspondante avec RLS activé

---

## Points d'attention

- **Mode démo vs production** : vérifier `isInDemoMode()` ou `isDemoMode` avant d'ajouter des features qui nécessitent Supabase
- **Contexte TaskContext** (`src/context/TaskContext.tsx`) : legacy, en cours de migration vers les modules. Ne pas y ajouter de nouveaux domaines — utiliser le pattern repository
- **Authentification** : géré par `src/modules/auth/AuthContext.tsx` (Supabase Auth). `better-auth` dans `src/lib/auth.ts` est présent mais non utilisé en production
- **FullCalendar** : ne pas importer les modules FullCalendar individuellement — utiliser les imports groupés déjà configurés
- **Stripe** : intégration dans `PremiumPage`, ne pas modifier sans vérifier la config côté Supabase Edge Functions

---

## Structure des dossiers

```
src/
├── App.tsx                     # Routing principal + providers
├── main.tsx                    # Entry point + error reporting iframe
├── index.css                   # Styles globaux Tailwind
├── components/                 # Composants réutilisables (UI)
├── context/                    # TaskContext (legacy)
├── lib/
│   ├── supabase.ts             # Client Supabase + isDemoMode
│   ├── repository.factory.ts   # Factory centralisée
│   ├── mockData.ts             # Données mock globales
│   ├── auth.ts                 # better-auth (legacy)
│   └── normalizeApiError.ts    # Normalisation erreurs API
├── modules/                    # Modules métier (pattern repository)
│   ├── auth/
│   ├── tasks/
│   ├── habits/
│   ├── events/
│   ├── categories/
│   ├── lists/
│   ├── friends/
│   └── okrs/
└── pages/                      # Pages React (lazy-loadées)
```
