# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Lis INTENT.md avant tout travail.

## Projet

Mini CRM de prospection mono-utilisateur. Les intentions produit, les contraintes et les critères d'acceptation sont dans `INTENT.md` : c'est la référence à relire avant toute décision d'architecture.

État actuel : `app/page.tsx` affiche seulement « Pipeline ». Les 3 couches existent avec un exemple vide chacune (`presentation/example-view.tsx`, `services/example-service.ts`, `data/example-repository.ts`). Aucune base n'est encore branchée : le dépôt d'exemple renvoie une liste vide.

## Commandes (pnpm uniquement)

- `pnpm dev` : serveur de dev Turbopack sur http://localhost:3000
- `pnpm build` / `pnpm start`
- `pnpm lint` : ESLint 9 en flat config (`eslint-config-next` core-web-vitals + typescript)
- `pnpm test` : Vitest (`vitest run`, config dans `vitest.config.mts`, environnement node). Les tests sont à côté du code (`*.test.ts` / `*.test.tsx`). Les composants sont testés via `renderToStaticMarkup`.

## Couches

- `presentation/` : composants React, reçoivent des données en props, n'importent jamais `data/`.
- `services/` : règles métier, ne dépendent que des interfaces de `data/` (jamais d'un client de base). Tester avec un faux dépôt.
- `data/` : seule couche qui parle à la base ; expose une interface (ex. `ExampleRepository`) et son implémentation.

## Stack et configuration notables

- Next.js 16.4.6 (App Router, dossier `app/`), React 19.3. Voir la note d'`AGENTS.md` : consulter `node_modules/next/dist/docs/` plutôt que de se fier aux API connues.
- `next.config.ts` active `cacheComponents` et `partialPrefetching`. Ces options influencent le rendu et le cache des Server Components.
- Tailwind CSS v4, chargé via un loader Turbopack (`@tailwindcss/turbopack`) déclaré dans `next.config.ts`. Pas de `tailwind.config` : `app/globals.css` fait seulement `@import "tailwindcss"`.
- Alias d'import `@/*` → racine du projet.
- `pnpm-workspace.yaml` bloque les scripts de build de `sharp` et `unrs-resolver` (`allowBuilds: false`).

## Architecture visée (INTENT.md)

- Trois couches : présentation → service → données. **Seule la couche données accède à la base.**
- Base légère et embarquée au départ, migrable vers une base managée. Critère d'acceptation : cette migration ne doit modifier que la couche données. Les couches présentation et service ne doivent donc dépendre d'aucun type ni client propre à la base.
- Les données doivent persister après un redémarrage de l'application.
- Bibliothèque de composants UI prête à l'emploi, déploiement sur une plateforme serverless (en tenir compte pour le choix de la base embarquée et l'accès au système de fichiers).
- Hors périmètre : authentification, droits, multi-utilisateur.
