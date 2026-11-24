---
paths:
  - "data/**"
---

# Couche données

Rôle : lire et écrire les contacts dans la base. C'est la seule couche qui parle à la base.

## Règles

1. **Seule couche qui parle à la base.** Un client de base de données, un ORM, une connexion, une requête ou un accès au disque pour stocker n'apparaissent que dans `data/`.
2. **Expose un contrat, cache la base.** Chaque dépôt publie une interface TypeScript (ex. `ExampleRepository`) avec des types simples du projet. Aucun type venant de la bibliothèque de base ne sort de `data/`.
   But : passer à une base managée en ne modifiant que `data/` (critère d'acceptation d'`INTENT.md`).
3. **Pas de règle métier.** Le dépôt enregistre et relit, il ne décide pas. Les décisions sont dans `services/`.
4. **N'importe rien des autres couches.** Pas d'import de `@/services`, `@/presentation`, `@/app` ou `@/components`.
5. **Secrets hors du code.** Les URL et clés de connexion viennent de variables d'environnement définies dans `.env.local`, jamais écrites dans un fichier versionné.

## Comment vérifier

1. **La base n'est utilisée que dans `data/`** (résultat attendu : rien) :
   `git grep --untracked -nE 'from .(better-sqlite3|sqlite3|@libsql/|drizzle-orm|@prisma/|prisma|pg|postgres|mysql2|mongodb|@neondatabase/|@vercel/postgres|@supabase/)' -- . ":!data/"`
2. **Aucun import des autres couches** (résultat attendu : rien) :
   `git grep --untracked -nE "@/(services|presentation|app|components)" -- data`
3. **Aucun secret en dur** (résultat attendu : rien) :
   `git grep --untracked -niE "(password|secret|token|api[_-]?key|://[^/\s]+:[^/\s]+@)" -- data`
4. **Persistance** : ajouter un contact, redémarrer l'app (`Ctrl + C` puis `pnpm dev`), vérifier qu'il est toujours dans la liste.
5. `pnpm test` passe.
