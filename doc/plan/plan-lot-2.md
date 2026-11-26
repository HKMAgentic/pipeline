# Plan · Lot 2 · Programmer la date de relance d'un contact

Statut : **validé** le 26/11/2026 (les 6 décisions recommandées sont retenues).

Sources : `lots.md` (lot 2), `INTENT.md`, `.claude/rules/`, `DESIGN.md` (tampon dateur), code du lot 1.

---

## Décisions à valider

### 1. Champ de date : `Input type="date"` de shadcn (recommandé)

Le champ `Input` déjà présent dans `components/ui/`, avec `type="date"` : le navigateur affiche son propre calendrier.
- Pour : aucune nouvelle dépendance, accessible au clavier, respecte la règle 3 de la présentation (composant du design system).
- Contre : l'apparence du calendrier dépend du navigateur.
- Alternative écartée : `Calendar` + `Popover` de shadcn (ajoute `react-day-picker` et `date-fns`, plus de code pour un seul champ).

### 2. « Aujourd'hui » : calculé sur le serveur, fuseau `Europe/Paris` (recommandé)

`lots.md` dit « la date du jour de l'ordinateur ». En local, l'ordinateur est le serveur. Mais une plateforme serverless tourne en heure UTC : entre minuit et 1 h (ou 2 h en été), le serveur serait encore « hier ».
- Le service reçoit « aujourd'hui » en paramètre (jour au format `AAAA-MM-JJ`). Les tests fixent donc la date du jour au 24/11 sans toucher à l'horloge.
- `app/contacts-actions.ts` calcule ce jour à partir de l'heure actuelle, dans le fuseau `Europe/Paris` (fonction du service `todayIn`).
- **À vérifier dans `node_modules/next/dist/docs/`** : lire l'heure (`new Date()`) avec `cacheComponents` après `connection()`.

### 3. Modifier la date sur la carte : un petit formulaire sur chaque carte (recommandé)

Sous l'étiquette d'étape : le champ date (prérempli) et un bouton « Changer la relance ». Vider le champ puis valider retire la relance (« Pas de relance prévue »).
- Alternative écartée : une fenêtre (dialog) « Modifier » : plus de code, et la modification complète d'un contact arrive au lot 6.

### 4. Texte du tampon

Le tampon (`presentation/contacts/date-stamp.tsx`, déjà prêt) affiche :

| Cas | Haut | Centre | Bas | Encre |
|---|---|---|---|---|
| À venir | RELANCE | 26·11 | jour de la semaine (« JEUDI ») | bleue, −9° |
| Aujourd'hui | RELANCE | 26·11 | AUJOURD'HUI | bleue, −9° |
| En retard de 4 jours | EN RETARD | 20·11 | −4 JOURS (« −1 JOUR » au singulier) | rouge, +6° |

Le libellé lu par les lecteurs d'écran : « Relance en retard de 4 jours, prévue le vendredi 20 novembre » (`DESIGN.md`).
Le critère 2 (« EN RETARD · −4 JOURS ») est lu comme : « EN RETARD » en haut et « −4 JOURS » en bas.

### 5. Date saisie invalide

Le service refuse une date qui n'existe pas (code `invalid_date`) ; l'écran affiche « Cette date n'existe pas. Choisissez un jour du calendrier. » (phrase de `DESIGN.md`).
Une date passée **est acceptée** au lot 2 : le refus d'une date passée est une règle du lot 5, je ne l'ajoute pas ici.

### 6. Base existante : ajouter la colonne si elle manque

Le fichier `pipeline.db` créé au lot 1 n'a pas de colonne pour la date. Au démarrage, le dépôt ajoute la colonne `follow_up_date` si elle manque. Les contacts déjà enregistrés gardent leurs données et n'ont pas de relance.

---

## Tâches par couche

### Données (`data/contact-repository.ts`)

1. Colonne `follow_up_date TEXT` (vide autorisé), ajoutée si absente.
2. `ContactRecord` gagne `followUpDate: string | null` (jour `AAAA-MM-JJ`) ; `add` l'accepte.
3. Nouvelle méthode du contrat : `setFollowUpDate(id, date | null)`.
4. Aucun calcul de retard : le dépôt enregistre et relit (règle 3 des données).

### Service (`services/`), test écrit avant le code

1. `services/follow-up.ts` :
   - `parseDay(texte)` : vérifie qu'un jour `AAAA-MM-JJ` existe, sinon `invalid_date` ;
   - `todayIn(maintenant, fuseau)` : le jour du calendrier dans le fuseau donné ;
   - `followUpStatus(jour, aujourdhui)` : `{ date, late, daysLate }` (`late` vrai si la date est passée ; aujourd'hui n'est pas en retard).
2. `services/contacts.ts` :
   - `addContact` accepte une date de relance facultative ;
   - nouvelle fonction `setFollowUp(repo, id, date)` ;
   - `listContacts(repo, aujourdhui)` : chaque contact porte `followUp: { date, late, daysLate } | null`.
3. Le service renvoie des valeurs et des codes, jamais de phrase (règle 4 du service).

### Présentation (`app/`, `presentation/`)

1. `presentation/contacts/follow-up-view.ts` : met en forme le résultat du service pour le tampon (« 26·11 », « JEUDI », « −4 JOURS », libellé complet). Mise en forme seulement, pas de calcul de retard.
2. `ContactForm` : champ « Date de relance » (facultatif), message d'erreur sous le champ.
3. `ContactCard` : le tampon en haut à droite si une date existe (112 px réservés), sinon « Pas de relance prévue » en encre délavée ; le petit formulaire de modification.
4. `app/contacts-actions.ts` : `addContactAction` lit le champ `relance` ; nouvelle action `setFollowUpAction` ; `loadContacts` passe la date du jour.
5. Retirer le commentaire « Prêt pour le lot 2 » de `date-stamp.tsx` et le test « ne propose pas name="relance" » du lot 1.

---

## Critères d'acceptation et tests qui les prouvent

| Critère | Tests automatiques (couche) | Vérification navigateur |
|---|---|---|
| **1.** Je choisis le 26/11 et j'enregistre → tampon bleu « 26·11 » | Service : `addContact` avec `2026-11-26` enregistre cette date (faux dépôt). Données : `add` puis `list` relisent `2026-11-26`. Présentation : la carte avec une relance à venir affiche « 26·11 » et la classe `text-stamp` | Saisie dans le formulaire, capture du tampon |
| **2.** Relance le 20/11, aujourd'hui 24/11 → tampon rouge « EN RETARD · −4 JOURS » | Service : `followUpStatus("2026-11-20", "2026-11-24")` → en retard de 4 jours ; `listContacts` avec aujourd'hui = 24/11 renvoie ce statut. Présentation : « EN RETARD », « −4 JOURS », classe `text-stamp-late` | L'horloge ne se règle pas : un contact daté de 4 jours avant aujourd'hui (22/11) doit afficher « −4 JOURS » en rouge |
| **3.** Sans date → pas de tampon, « Pas de relance prévue » | Service : un contact sans date a `followUp: null`. Données : une date vide est relue `null`. Présentation : pas de `role="img"`, texte « Pas de relance prévue » | Contact créé sans date |
| **4.** Date modifiée sur une carte → conservée après redémarrage | Service : `setFollowUp` enregistre la nouvelle date, refuse une date invalide sans rien enregistrer. Données : `setFollowUpDate`, puis **nouveau dépôt sur le même fichier** → la nouvelle date est relue | Modifier la date, arrêter puis relancer `pnpm dev -p 3123`, la date est toujours là |

Tests en plus (hors critères mais nécessaires) : date invalide refusée (service + message à l'écran), base du lot 1 sans colonne ouverte sans erreur (données), « AUJOURD'HUI » et le singulier « −1 JOUR » (présentation), `todayIn` à 23 h 30 UTC donne le lendemain à Paris (service).

---

## Hors lot (signalé, non codé)

- Sections « Relances du jour » / « À venir » et tri par retard : lot 3.
- Refus d'une date passée et bouton « Relancer » : lot 5.

## Vérifications de fin de lot

1. Commandes « Comment vérifier » des 3 fichiers de `.claude/rules/` : aucun résultat.
2. `pnpm test`, `pnpm lint`, `pnpm build` passent.
3. Navigateur piloté par Claude (Chrome + `playwright-core` dans le scratchpad), base vide, un contrôle par critère, redémarrage pour le critère 4, captures en clair et en sombre.
4. Cocher les critères du lot 2 dans `lots.md`, mettre à jour « État actuel » dans `CLAUDE.md`.
