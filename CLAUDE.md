# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Lis INTENT.md avant tout travail.

## Projet

Mini CRM de prospection mono-utilisateur. Les intentions produit, les contraintes et les critères d'acceptation sont dans `INTENT.md` : c'est la référence à relire avant toute décision d'architecture.

État actuel : un scaffold Next.js nu. `app/page.tsx` affiche seulement « Pipeline ». Aucune couche métier, aucune base et aucun test n'existent encore.

## Commandes (pnpm uniquement)

- `pnpm dev` : serveur de dev Turbopack sur http://localhost:3000
- `pnpm build` / `pnpm start`
- `pnpm lint` : ESLint 9 en flat config (`eslint-config-next` core-web-vitals + typescript)
- Aucun script `test` pour l'instant. `INTENT.md` exige des tests unitaires sur les règles métier, donc le framework de test reste à ajouter.

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
