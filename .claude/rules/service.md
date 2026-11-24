---
paths:
  - "services/**"
---

# Couche service

Rôle : porter les règles métier de Pipeline (étapes, relances, retards, validation d'un contact).

## Règles

1. **Toutes les règles métier vivent ici.** Une décision sur les données (un contact est-il en retard ? quelle est l'étape suivante ? un nom est-il obligatoire ?) est une fonction de `services/`, jamais un calcul dans un composant ou une requête.
2. **Les tests sont écrits avant le code.** Pour chaque règle :
   1. écrire le test dans `services/<nom>.test.ts` ;
   2. lancer `pnpm test` et constater qu'il échoue (rouge) ;
   3. écrire le minimum de code pour qu'il passe (vert) ;
   4. nettoyer le code sans casser le test.

   Aucune fonction exportée sans test.
3. **Ne connaît la base qu'à travers un contrat.** Le service reçoit un dépôt (ex. `ExampleRepository`) en paramètre. Il n'importe de `@/data/...` que des types (`import type`), jamais une implémentation ni un client de base.
4. **Indépendant de l'interface.** Pas de React, pas de Next, pas de JSX, pas de texte d'affichage formaté pour un écran.
5. **Testable sans base.** Les tests utilisent un faux dépôt écrit dans le test, jamais la vraie base.

## Comment vérifier

1. **Chaque fichier de service a son test** (PowerShell, résultat attendu : rien) :
   `Get-ChildItem services -Filter *.ts -Recurse | Where-Object { $_.Name -notlike '*.test.ts' -and -not (Test-Path ($_.FullName -replace '\.ts$', '.test.ts')) }`
2. **Seulement des types venant des données** (PowerShell, résultat attendu : rien) :
   `git grep --untracked -n "@/data" -- services ":!*.test.ts" | Select-String -NotMatch "import type"`
3. **Aucune dépendance à l'interface** (résultat attendu : rien) :
   `git grep --untracked -nE 'from .(react|next|@/presentation|@/app|@/components)' -- services`
4. **Test d'abord** : dans l'historique de la session, le test a été lancé et vu en échec avant l'écriture du code.
5. `pnpm test` passe.
