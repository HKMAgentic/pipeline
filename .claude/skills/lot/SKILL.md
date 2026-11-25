---
name: lot
description: Traiter un lot de lots.md selon le process du projet Pipeline : plan validé, TDD, preuves (rouge, vert, navigateur), puis PR de dev vers main. Utiliser quand l'utilisateur tape « /lot N » ou demande de traiter, planifier ou livrer un lot.
---

# lot · notre façon de développer un lot

Ce skill définit le process du projet. Il s'applique à chaque lot, sans le redire.
Argument : le numéro du lot ($ARGUMENTS). Sans numéro : prendre le premier lot dont les cases ne sont pas cochées dans `lots.md`, et le dire.

L'utilisateur n'est pas développeur : chaque étape se termine par une phrase simple qui dit ce qui a été fait et ce qu'il doit voir.

## 1. Préparer
- Branche `dev`, à jour avec `main`. En PowerShell 5.1, `&&` n'existe pas :
  `git checkout dev; if ($?) { git pull origin main }`
- Lis le lot $ARGUMENTS dans `lots.md`, puis `INTENT.md`, `CLAUDE.md` et les règles de `.claude/rules/`.
- Lis le code existant que le lot touche avant de proposer quoi que ce soit.
- Next.js de ce projet est récent : consulte `node_modules/next/dist/docs/` pour toute API Next utilisée (voir `AGENTS.md`).

## 2. Planifier, puis attendre la validation
- Les tâches, couche par couche : présentation, service, données.
- Pour chaque critère d'acceptation : le ou les tests qui le prouvent, et la couche testée.
- Si un critère est flou ou impossible à tester automatiquement, signale-le et dis comment il sera vérifié (navigateur).
- Les décisions à prendre (choix technique, conflit avec une règle, périmètre de l'écran) : une recommandation pour chacune.
- Écris le plan dans `doc/plan/plan-lot-$ARGUMENTS.md` (statut « en attente de validation »).
- **STOP** : attends la validation du plan et des critères avant d'écrire du code.

## 3. Exécuter en TDD
1. Écris d'abord les tests, dans les trois couches :
   - service : `services/<nom>.test.ts`, avec un faux dépôt écrit dans le test ;
   - données : `data/<nom>.test.ts`, sur une base libSQL dans un fichier temporaire (le « redémarrage » = un nouveau dépôt sur le même fichier) ;
   - présentation : `*.test.tsx` avec `renderToStaticMarkup`, composants rendus avec des données en props.
2. Lance `pnpm test` : ils échouent. **Garde cette sortie rouge** (résumé lisible : `pnpm exec vitest run --reporter=verbose`).
   - Note pour chaque test s'il échoue sur une assertion (rouge fort) ou parce que le module n'existe pas encore (rouge faible).
   - Un test qui passe déjà avant le code ne prouve rien : signale-le.
3. Écris le code, couche par couche, jusqu'à ce que `pnpm test` passe. Garde la sortie verte.
4. Supprime ce que le lot rend obsolète (données fictives, exemples).

## 4. Vérifier (avant le commit)
1. `pnpm test`, `pnpm lint`, `pnpm build` passent.
   En PowerShell, le texte rouge `NativeCommandError` autour de pnpm ou git n'est pas une erreur : vérifier `$LASTEXITCODE`.
2. Les commandes « Comment vérifier » des 3 fichiers de `.claude/rules/` ne renvoient rien.
3. **Dans le navigateur, c'est Claude qui vérifie**, pas l'utilisateur :
   - lancer `pnpm dev -p 3123` en arrière-plan, sur une base vide (`pipeline.db` supprimé) ;
   - piloter Chrome (`C:\Program Files\Google\Chrome\Application\chrome.exe`) avec `playwright-core`, installé dans le scratchpad et jamais dans le projet ;
   - un contrôle par critère, plus le redémarrage du serveur pour les critères de persistance ;
   - captures d'écran en clair et en sombre, et les regarder ;
   - arrêter le serveur, supprimer `pipeline.db` pour rendre une application vide.
4. Coche les critères vérifiés dans `lots.md`. Mets à jour « État actuel » dans `CLAUDE.md` si le lot le change.

## 5. Commiter
- Un seul commit pour le lot : `feat(lot-$ARGUMENTS): <titre du lot>`, avec le plan, le code, les tests et `lots.md` coché.
- En PowerShell 5.1, ne pas passer le message par `-F -` : l'écrire dans un fichier du scratchpad, puis `git commit -F <fichier>`.
- Jamais `pipeline.db` ni `.env*` dans le commit (vérifier `git status` avant).

## 6. Ouvrir la PR
- Pousse `dev` (`git push origin dev`) : c'est nécessaire pour la PR, et c'est autorisé par ce skill.
- Si une PR de `dev` vers `main` est déjà ouverte (`gh pr list --head dev`), ne pas en créer une autre : le push la met à jour, donne son lien.
- Sinon : `gh pr create --base main --head dev --title "<titre du commit>" --body-file <fichier>`.
- Corps de la PR : les critères cochés, le test de chaque critère, la sortie rouge puis la sortie verte de `pnpm test`, la vérification navigateur, les limites connues. Terminer par la ligne d'attribution Claude Code.
- Donne le lien de la PR et explique en une phrase comment fusionner (bouton vert « Merge pull request »).

## Preuves à montrer à la fin
Un tableau par critère : test(s) · rouge avant le code · vert maintenant · vérification navigateur.
Sépare ce qui est vérifié (avec la preuve), ce qui est supposé, ce qu'il reste à vérifier.

## Nomenclature des commits
- `feat(lot-N): <titre du lot>` : un lot.
- `fix(lot-N): <ce qui est corrigé>` : une correction.
- `chore: <quoi>` : mise en place, outillage.
- `docs: <quoi>` : documentation.

## Règles
- Ne sors pas du lot. Une idée hors lot : signale-la, ne la code pas.
- Une règle de `.claude/rules/` qui bloque : propose une exception écrite dans la règle, ne la contourne pas en silence.
- Ne fusionne jamais : la fusion est à l'utilisateur.
