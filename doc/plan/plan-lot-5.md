# Plan · Lot 5 · Noter une relance faite

Statut : **validé en autonomie** le 26/11/2026 (consigne : enchaîner les lots sans s'arrêter, sauf anomalie majeure). Les décisions ci-dessous appliquent la recommandation.

Sources : `lots.md` (lot 5), `INTENT.md`, `.claude/rules/`, `DESIGN.md`, code des lots 1 à 4.

---

## Décisions

1. **« Relancer » ouvre un petit panneau dans le pied de carte,** sans fenêtre : champ « Prochaine relance (facultatif) », boutons « Valider » et « Annuler ». Pas de nouveau composant à installer (une fenêtre de dialogue demanderait d'ajouter un composant shadcn). Le bouton est en primaire, comme dans `DESIGN.md`.
2. **Ce qui est enregistré :** la date de la relance faite (= aujourd'hui, heure de Paris) et la prochaine date (ou aucune). Nouvelle colonne `last_follow_up_date`, ajoutée si elle manque (même méthode qu'au lot 2).
3. **Date passée refusée** par le service (code `past_date`) : « Choisissez aujourd'hui ou une date à venir. ». Aujourd'hui est accepté. Le champ n'a pas d'attribut `min` : c'est le service qui décide, l'écran affiche son message.
4. **Texte « Relancé le 24 nov. »** : jour et mois abrégé en français, sous l'étiquette d'étape, en encre délavée.
5. Le champ « Date de relance » du lot 2 reste sur la carte : il sert à changer la date sans noter de relance.

## Tâches par couche

- **Données :** `lastFollowUpDate` dans `ContactRecord` et dans les modifications autorisées ; colonne ajoutée si absente.
- **Service :** `recordFollowUp(repo, id, prochaineDate, aujourdhui)` (erreurs `invalid_date`, `past_date`, `not_found`) ; `Contact` gagne `lastFollowUpDate`.
- **Présentation :** `RecordFollowUp` (bouton « Relancer » + panneau) ; texte « Relancé le … » (`follow-up-view.ts`) ; action serveur `recordFollowUpAction`.

## Critères et tests

| Critère | Tests (couche) | Navigateur |
|---|---|---|
| 1. Hugo en retard, « Relancer », 01/12, valider → « Relancé le 24 nov. », tampon bleu « 01·12 », plus dans « Relances du jour » | service `recordFollowUp` (aujourd'hui = 24/11) + `buildAgenda` · présentation : carte avec « Relancé le 24 nov. » ; panneau | horloge au 24/11 |
| 2. Pas de prochaine date → relance notée, « Pas de relance prévue » | service · présentation | idem |
| 3. Prochaine date passée → rien d'enregistré, message | service (`past_date`, aucun `update`) · présentation : message dans le panneau | date du 20/11 |
| 4. Après redémarrage, « Relancé le … » et la nouvelle date sont conservés | données : `update` puis nouveau dépôt sur le même fichier | redémarrage du serveur |

## Hors lot

Historique de toutes les relances (seule la dernière est gardée), modification et suppression (lot 6).
