# Plan · Lot 3 · Voir qui relancer aujourd'hui

Statut : **validé en autonomie** le 26/11/2026 (consigne : enchaîner les lots sans s'arrêter, sauf anomalie majeure). Les décisions ci-dessous appliquent la recommandation.

Sources : `lots.md` (lot 3), `INTENT.md`, `.claude/rules/`, `DESIGN.md`, code des lots 1 et 2.

---

## Décisions

1. **Qui va dans « Relances du jour » :** un contact dont la date de relance est aujourd'hui ou passée. Tri : le plus en retard en tête ; à retard égal, l'ordre de la liste (plus récent d'abord).
2. **Qui va dans « À venir » :** tous les autres (« Les autres contacts sont rangés dans À venir »), y compris ceux sans date. Tri : date la plus proche d'abord, puis les contacts sans date à la fin.
3. **Texte du bandeau :** « 2 relances à faire, dont 1 en retard ». Variantes : « 1 relance à faire » (singulier), sans « dont … » s'il n'y a aucun retard, « Aucune relance à faire aujourd'hui » à zéro.
4. **Listes vides :** « Relances du jour » vide → « Rien à relancer aujourd'hui ». « À venir » vide → « Aucun contact pour l'instant. Ajoutez votre premier contact avec le formulaire. » s'il n'y a aucun contact (critère 4 du lot 1 conservé), sinon « Rien à venir pour l'instant. ».
5. **Calcul :** une fonction pure du service, `buildAgenda(contacts)`, sur les contacts déjà calculés pour aujourd'hui (lot 2). Le bandeau et les deux sections lisent le même résultat ; `page.tsx` évite la double lecture avec `cache` de React.
6. **Vérification « le lendemain » (critère 5) :** horloge du serveur réglée au 25/11, puis redémarrage avec l'horloge au 26/11 (fichier préchargé hors du projet, comme au lot 2).

## Tâches par couche

- **Données :** rien à changer.
- **Service :** `services/agenda.ts` : `buildAgenda(contacts)` → `{ due, upcoming, dueCount, lateCount, total }`.
- **Présentation :**
  - `presentation/contacts/agenda-summary.ts` : texte du bandeau (mise en forme seulement) ;
  - `presentation/contacts/agenda-sections.tsx` : les deux sections et leurs messages vides ;
  - `ContactList` reçoit le message à afficher quand elle est vide ;
  - `app/contacts-actions.ts` : `loadAgenda()` ; `page.tsx` : bandeau dans l'en-tête, sections à la place de « Contacts ».

## Critères et tests

| Critère | Tests (couche) | Navigateur |
|---|---|---|
| 1. 3 contacts (−4 j, aujourd'hui, +5 j) → « Relances du jour » montre les 2 premiers, le plus en retard en tête | service `agenda.test.ts` · présentation `agenda-sections.test.tsx` (ordre dans le HTML) | horloge au 24/11, contacts au 20/11, 24/11, 29/11 |
| 2. Celui à +5 j est dans « À venir », pas dans « Relances du jour » | service · présentation | idem |
| 3. Bandeau « 2 relances à faire, dont 1 en retard » | service (`dueCount`, `lateCount`) · présentation `agenda-summary.test.ts` | idem |
| 4. Rien à relancer → « Rien à relancer aujourd'hui » | service · présentation | contact sans date seulement |
| 5. À relancer demain → le lendemain dans « Relances du jour » | service : même contact, `listContacts` avec aujourd'hui = J puis J+1, puis `buildAgenda` | horloge 25/11 puis redémarrage au 26/11 |

## Hors lot

Boutons « Relancer » (lot 5) et « Étape suivante » (lot 4).
