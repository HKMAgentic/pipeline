# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Lis INTENT.md avant tout travail.

## Projet

Mini CRM de prospection mono-utilisateur. Les intentions produit, les contraintes et les critères d'acceptation sont dans `INTENT.md` : c'est la référence à relire avant toute décision d'architecture.

État actuel : lots 1 à 6 livrés (tous les lots de `lots.md`) (voir `lots.md` et `doc/plan/`). On ajoute un contact (nom, entreprise, date de relance facultative), il est persisté en base ; la page répartit les contacts entre « Relances du jour » (aujourd’hui ou en retard, le plus en retard en tête) et « À venir », et le bandeau compte les relances à faire. La carte affiche un tampon (bleu à venir, rouge en retard), la date se change sur la carte, et le pied de carte fait avancer l’étape (« Étape suivante », liste des étapes) , note une relance faite (« Relancer » : « Relancé le … », prochaine date facultative, jamais dans le passé), corrige le nom ou l’entreprise (« Modifier ») et supprime un contact après confirmation (« Supprimer »).
- Base : libSQL (`@libsql/client`), fichier local `pipeline.db` (ignoré par git) ou `DATABASE_URL` dans `.env.local`. Dépôt : `data/contact-repository.ts` (`add`, `list`, `get`, `update`, `remove`) ; les colonnes ajoutées après le lot 1 sont créées au démarrage si elles manquent.
- Règles : `services/contacts.ts` (ajout, validation du nom, date de relance, liste), `services/follow-up.ts` (jour valide, « aujourd’hui » à l’heure de Paris, retard), `services/agenda.ts` (relances du jour / à venir, comptes), `services/stages.ts` (étapes, étape suivante, étapes précoces), `services/contacts.ts` aussi : `advanceStage`, `changeStage`, `recordFollowUp`, `updateContact`, `deleteContact`.
- Écran : `presentation/contacts/` (sections `agenda-sections.tsx`, texte du bandeau `agenda-summary.ts`, formulaire, liste, carte, tampon `date-stamp.tsx`, texte du tampon `follow-up-view.ts`, formulaire de relance `follow-up-form.tsx`, contrôles d’étape `stage-controls.tsx`, panneau « Relancer » `record-follow-up.tsx`, panneaux « Modifier » `edit-contact.tsx` et « Supprimer » `delete-contact.tsx`, actions de carte regroupées dans `card-actions.ts`, fausses actions pour les tests `fake-actions.ts`). Branchement dépôt → service dans `app/contacts-actions.ts`, seule exception à la règle « app n’importe pas @/data ».
- `page.tsx` lit l’agenda (`loadAgenda`) dans des `<Suspense>` après `connection()` (exigé par `cacheComponents`), une seule fois par requête grâce à `cache` de React ; les actions appellent `refresh()` de `next/cache`.

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
- shadcn/ui (style `base-nova`, primitives `@base-ui/react`, `cn` depuis le paquet `cn`) : composants dans `components/ui/`. Ajouter avec `pnpm dlx shadcn@latest add <nom>`.
- Thème « Cachet » dans `app/globals.css` : clair dans `:root`, sombre dans `.dark`, toujours remplir les deux. Tokens propres : `stamp`, `stamp-late`, `kraft`, `kraft-foreground`. Polices via `next/font` dans `app/layout.tsx` : Public Sans (`font-sans`), Barlow Condensed (`font-heading`, titres h1–h3). Système visuel documenté dans `DESIGN.md`, produit dans `PRODUCT.md`.
- Clair/sombre : `next-themes` (`presentation/theme-provider.tsx`, défaut = réglage système), bouton `presentation/theme-toggle.tsx`.
- `design-options.html` : page statique de comparaison des 3 directions de design étudiées (Cachet retenue).
- `pnpm-workspace.yaml` bloque les scripts de build de `sharp` et `unrs-resolver` (`allowBuilds: false`).

## Architecture visée (INTENT.md)

- Trois couches : présentation → service → données. **Seule la couche données accède à la base.**
- Base légère et embarquée au départ, migrable vers une base managée. Critère d'acceptation : cette migration ne doit modifier que la couche données. Les couches présentation et service ne doivent donc dépendre d'aucun type ni client propre à la base.
- Les données doivent persister après un redémarrage de l'application.
- Bibliothèque de composants UI prête à l'emploi, déploiement sur une plateforme serverless (en tenir compte pour le choix de la base embarquée et l'accès au système de fichiers).
- Hors périmètre : authentification, droits, multi-utilisateur.
