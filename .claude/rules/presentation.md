---
paths:
  - "app/**"
  - "presentation/**"
---

# Couche présentation

Rôle : afficher et recueillir des informations. Elle ne décide rien.

## Règles

1. **Elle n'appelle que la couche service.** Le code de `app/` et `presentation/` n'importe jamais `@/data/...`.
   Imports autorisés : `@/services/...`, `@/presentation/...`, `@/components/ui/...`, `@/lib/utils`, et les bibliothèques d'interface (React, Next, next-themes, lucide-react).
   **Seule exception** : `app/contacts-actions.ts`, le point de branchement. Il peut importer `createContactRepository` (et son type) depuis `@/data/contact-repository` pour créer le dépôt et le passer au service. Il ne contient aucune règle métier. Le nom et la signature de `createContactRepository` ne changent pas lors d'une migration de base.
2. **Aucune règle métier dans un composant.** Calculer un retard, compter des relances, choisir la prochaine étape : tout cela se fait dans `services/`. Le composant reçoit le résultat.
3. **Uniquement les composants du design system.** Boutons, champs, listes de choix, cartes et étiquettes viennent de `components/ui/` (shadcn) ou des composants Cachet de `presentation/`. Pas de `<button>`, `<input>` ou `<select>` HTML stylé à la main. Si un composant manque, l'ajouter avec `pnpm dlx shadcn@latest add <nom>`.
4. **Aucune couleur en dur.** Seulement les tokens du thème : `bg-primary`, `text-muted-foreground`, `text-stamp`, `bg-kraft`, etc. (voir `DESIGN.md`).
   Interdits : codes `#1E3A8A`, `rgb()`, `hsl()`, `oklch()`, couleurs Tailwind brutes (`bg-blue-600`, `text-white`, `text-black`) et valeurs arbitraires `bg-[#...]`.
5. **Clair et sombre.** Tout nouvel élément doit être correct dans les deux thèmes. Les tokens s'en chargent si la règle 4 est respectée.

## Comment vérifier

1. **Aucun accès aux données** (résultat attendu : rien) :
   `git grep --untracked -n "@/data" -- app presentation ":!app/contacts-actions.ts"`
2. **Aucune couleur en dur** (résultat attendu : rien) :
   `git grep --untracked -nE "#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|oklch\(|-\[#|(bg|text|border|ring|fill|stroke|from|to)-(white|black|(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3})\b" -- app presentation ":!*.test.*" ":!*.css"`
3. **Aucun contrôle HTML brut** (résultat attendu : rien) :
   `git grep --untracked -nE "<(button|input|select|textarea)\b" -- app presentation`
4. **Tests, lint et build** : `pnpm test`, `pnpm lint`, `pnpm build` passent.
5. **À l'œil** : `pnpm dev`, puis vérifier l'écran en clair et en sombre (bouton soleil/lune).
