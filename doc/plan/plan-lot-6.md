# Plan · Lot 6 · Corriger ou supprimer un contact

Statut : **validé en autonomie** le 26/11/2026 (consigne : enchaîner les lots sans s'arrêter, sauf anomalie majeure). Les décisions ci-dessous appliquent la recommandation.

Sources : `lots.md` (lot 6), `INTENT.md`, `.claude/rules/`, `DESIGN.md`, code des lots 1 à 5.

---

## Décisions

1. **« Modifier » et « Supprimer » à droite du pied de carte,** en boutons discrets (`ghost`), pour ne pas concurrencer « Relancer ». Chacun ouvre un panneau dans le pied de carte, comme « Relancer » au lot 5 : pas de fenêtre, pas de nouveau composant à installer.
2. **Modifier :** nom et entreprise préremplis, « Enregistrer » et « Annuler ». Même règle qu'à la création : nom obligatoire (« Le nom est obligatoire. »), espaces retirés. En cas de refus, la saisie reste dans les champs.
3. **Supprimer :** confirmation « Supprimer Camille Roux ? Cette action est définitive. », bouton « Confirmer la suppression » (variante `destructive` : rouge réservé à la destruction, `DESIGN.md`) et « Annuler ». Annuler ferme la confirmation sans rien envoyer au serveur.
4. **Suppression définitive** (pas de corbeille) : c'est ce que dit le critère « ne revient pas après un redémarrage ».
5. La validation du nom est partagée entre l'ajout et la modification dans le service (une seule règle).

## Tâches par couche

- **Données :** `remove(id)` dans le contrat.
- **Service :** `updateContact(repo, id, { name, company })` (erreurs `name_required`, `not_found`), `deleteContact(repo, id)` (erreur `not_found`).
- **Présentation :** `EditContact` et `DeleteContact` (bouton + panneau), actions serveur `updateContactAction`, `deleteContactAction`, ajoutées à `CardActions`.

## Critères et tests

| Critère | Tests (couche) | Navigateur |
|---|---|---|
| 1. « Atelier Roux » corrigé en « Atelier Roux & fils » → nouveau nom affiché, conservé après redémarrage | service `updateContact` · données `update` puis nouveau dépôt · présentation : panneau prérempli | saisie, puis redémarrage |
| 2. Nom vidé → rien de modifié, « Le nom est obligatoire. » | service (`name_required`, aucun `update`) · présentation : message, saisie conservée | idem |
| 3. « Supprimer » puis confirmer → disparaît, ne revient pas après redémarrage | service `deleteContact` · données `remove` puis nouveau dépôt · présentation : confirmation | clic, puis redémarrage |
| 4. Annuler la confirmation → le contact reste, inchangé | présentation : « Annuler » n'envoie pas le formulaire (`type="button"`) | clic sur Annuler, rechargement |

## Hors lot

Corbeille ou annulation d'une suppression, modification de l'étape ou de la date depuis le panneau « Modifier » (déjà possibles sur la carte).
