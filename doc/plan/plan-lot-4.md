# Plan · Lot 4 · Faire avancer un contact d'étape

Statut : **validé en autonomie** le 26/11/2026 (consigne : enchaîner les lots sans s'arrêter, sauf anomalie majeure). Les décisions ci-dessous appliquent la recommandation.

Sources : `lots.md` (lot 4), `INTENT.md`, `.claude/rules/`, `DESIGN.md`, code des lots 1 à 3.

---

## Décisions

1. **Où sont les actions :** dans un pied de carte (fond gris de tri à 50 %, filet supérieur, comme décrit dans `DESIGN.md`) : « Étape suivante » (bouton outline) et la liste des étapes. Les lots 5 et 6 y ajouteront « Relancer », « Modifier » et « Supprimer ».
2. **Liste des étapes :** le composant `Select` de shadcn déjà installé. Choisir une étape l'enregistre tout de suite, sans bouton de validation (le critère dit « quand je choisis … alors il revient »).
3. **Règles d'étape dans le service :** `nextStage(stage)` (null après « Signé ») et `isEarlyStage(stage)` (« À contacter », « Contacté »). Aujourd'hui, la liste des étapes précoces est écrite dans `stage-badge.tsx` : c'est une règle métier dans un composant (règle 2 de la présentation), je la déplace dans le service. Les composants appellent ces fonctions du service, ils ne décident rien eux-mêmes.
4. **L'étape suivante se calcule sur le serveur,** à partir de l'étape enregistrée (pas de celle affichée dans le navigateur) : le dépôt gagne `get(id)`.
5. **Un seul moyen de modifier un contact dans le dépôt :** `update(id, changes)` remplace `setFollowUpDate` du lot 2. Les lots 5 et 6 l'utiliseront aussi (nom, entreprise, date de dernière relance), sans multiplier les méthodes du contrat.
6. **Actions de la carte regroupées :** les composants reçoivent un objet `actions` (`setFollowUp`, `advanceStage`, `changeStage`) au lieu d'une prop par action.

## Tâches par couche

- **Données :** `get(id)`, `update(id, changes)` (colonnes autorisées seulement) ; `setFollowUpDate` supprimé.
- **Service :** `stages.ts` : `nextStage`, `isEarlyStage`. `contacts.ts` : `advanceStage(repo, id)` (erreurs `not_found`, `last_stage`), `changeStage(repo, id, étape)` (erreurs `not_found`, `invalid_stage`) ; `setFollowUp` passe par `update`.
- **Présentation :** pied de carte avec `StageControls` (bouton « Étape suivante » absent à « Signé », liste des étapes) ; `StageBadge` utilise `isEarlyStage` ; type `CardActions` ; actions serveur `advanceStageAction`, `changeStageAction`.

## Critères et tests

| Critère | Tests (couche) | Navigateur |
|---|---|---|
| 1. « Contacté » + « Étape suivante » → « Échange », conservé après redémarrage | service `advanceStage` (faux dépôt) · données `update` de l'étape puis nouveau dépôt sur le même fichier · présentation : bouton présent | clics, puis redémarrage du serveur |
| 2. « Signé » → pas de bouton « Étape suivante » | service `nextStage("Signé")` = null, `advanceStage` refuse (`last_stage`) · présentation : carte « Signé » sans bouton | choisir « Signé » dans la liste |
| 3. « Proposition » par erreur → choisir « Échange » → « Échange » | service `changeStage` (et refus d'une étape inconnue) · présentation : liste des étapes préremplie | choisir dans la liste |
| 4. Étiquette kraft à « À contacter » / « Contacté », bleue ensuite | service `isEarlyStage` · présentation : classes `bg-kraft` / `bg-secondary` | couleur de fond calculée |

## Hors lot

« Relancer » (lot 5), « Modifier » et « Supprimer » (lot 6).
