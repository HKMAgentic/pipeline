# Lots · Pipeline

Un lot = une chose que l'utilisateur fait de bout en bout, de l'écran à la base.
Sources : `INTENT.md`, `PRODUCT.md`, `.claude/rules/`. Hors périmètre respecté : pas d'authentification, pas de droits, pas de multi-utilisateur.

Hypothèses :
- Étapes du pipeline : À contacter → Contacté → Échange → Proposition → Signé.
- « Aujourd'hui » = la date du jour de l'ordinateur.

---

## Lot 1 · Ajouter un contact et le retrouver dans la liste

Je saisis un nom et une entreprise dans le formulaire, puis j'enregistre. Le contact apparaît dans la liste avec l'étape « À contacter » et y est toujours après un redémarrage. Les contacts fictifs disparaissent : la liste montre les vrais contacts.

- [x] Étant donné une liste vide, quand je saisis « Camille Roux » et « Atelier Roux » puis j'enregistre, alors la carte « Camille Roux » apparaît dans la liste avec l'étape « À contacter ».
- [x] Étant donné un champ Nom vide, quand j'enregistre, alors aucun contact n'est créé et le message « Le nom est obligatoire. » s'affiche sous le champ.
- [x] Étant donné un contact ajouté, quand je redémarre l'application, alors il est toujours affiché dans la liste.
- [x] Étant donné aucun contact enregistré, quand j'ouvre l'application, alors je vois « Aucun contact pour l'instant » et aucune donnée fictive.

## Lot 2 · Programmer la date de relance d'un contact

Je choisis une date de relance, en créant le contact ou plus tard sur sa carte. La carte affiche cette date sous forme de tampon : bleu si elle est à venir, rouge si elle est dépassée.

- [ ] Étant donné le formulaire, quand je choisis le 26/11 et j'enregistre, alors la carte affiche un tampon bleu « 26·11 ».
- [ ] Étant donné un contact à relancer le 20/11 et la date du jour au 24/11, quand j'ouvre la liste, alors son tampon est rouge et indique « EN RETARD · −4 JOURS ».
- [ ] Étant donné un contact sans date de relance, quand j'ouvre la liste, alors sa carte n'a pas de tampon et indique « Pas de relance prévue ».
- [ ] Étant donné une date de relance modifiée sur une carte, quand je redémarre l'application, alors la nouvelle date est conservée.

## Lot 3 · Voir qui relancer aujourd'hui

À l'ouverture, la section « Relances du jour » montre seulement les contacts à relancer aujourd'hui ou en retard, les plus en retard en tête. Les autres contacts sont rangés dans une section « À venir », et le bandeau du haut donne le compte.

- [ ] Étant donné 3 contacts (en retard de 4 jours, à relancer aujourd'hui, à relancer dans 5 jours), quand j'ouvre l'application, alors « Relances du jour » montre les 2 premiers, le plus en retard en tête.
- [ ] Étant donné ces mêmes contacts, quand j'ouvre l'application, alors celui à relancer dans 5 jours apparaît dans « À venir » et pas dans « Relances du jour ».
- [ ] Étant donné ces mêmes contacts, quand j'ouvre l'application, alors le bandeau affiche « 2 relances à faire, dont 1 en retard ».
- [ ] Étant donné aucun contact à relancer aujourd'hui ni en retard, quand j'ouvre l'application, alors « Relances du jour » affiche « Rien à relancer aujourd'hui ».
- [ ] Étant donné un contact à relancer demain, quand j'ouvre l'application le lendemain, alors il est passé dans « Relances du jour ».

## Lot 4 · Faire avancer un contact d'étape

Je clique sur « Étape suivante » sur une carte : le contact passe à l'étape d'après et son étiquette change. Si je me suis trompé, je peux choisir une autre étape dans la liste des étapes.

- [ ] Étant donné un contact à l'étape « Contacté », quand je clique sur « Étape suivante », alors son étiquette devient « Échange » et l'étape est conservée après un redémarrage.
- [ ] Étant donné un contact à l'étape « Signé », quand j'affiche sa carte, alors le bouton « Étape suivante » n'est pas proposé.
- [ ] Étant donné un contact passé à « Proposition » par erreur, quand je choisis « Échange » dans la liste des étapes, alors il revient à « Échange ».
- [ ] Étant donné un contact à « À contacter » ou « Contacté », quand j'affiche sa carte, alors son étiquette est kraft ; aux étapes suivantes, elle est bleue.

## Lot 5 · Noter une relance faite

Après avoir relancé quelqu'un, je clique sur « Relancer » sur sa carte, je choisis éventuellement la prochaine date de relance, puis je valide. La carte affiche « Relancé le … » et le contact quitte les relances du jour.

- [ ] Étant donné Hugo Bernard en retard, quand je clique sur « Relancer », choisis le 01/12 et valide, alors sa carte affiche « Relancé le 24 nov. » et un tampon bleu « 01·12 », et Hugo n'est plus dans « Relances du jour ».
- [ ] Étant donné aucune prochaine date choisie, quand je valide, alors la relance est notée et la carte indique « Pas de relance prévue ».
- [ ] Étant donné une prochaine date dans le passé, quand je valide, alors rien n'est enregistré et le message « Choisissez aujourd'hui ou une date à venir. » s'affiche.
- [ ] Étant donné une relance notée, quand je redémarre l'application, alors « Relancé le … » et la nouvelle date sont conservés.

## Lot 6 · Corriger ou supprimer un contact

Je peux modifier le nom ou l'entreprise d'un contact. Je peux aussi le supprimer, après une confirmation, pour ne pas le perdre par erreur.

- [ ] Étant donné « Atelier Roux », quand je le corrige en « Atelier Roux & fils » et j'enregistre, alors la carte affiche le nouveau nom, conservé après un redémarrage.
- [ ] Étant donné un nom vidé lors de la modification, quand j'enregistre, alors rien n'est modifié et le message « Le nom est obligatoire. » s'affiche.
- [ ] Étant donné le contact « Camille Roux », quand je clique sur « Supprimer » puis confirme, alors il disparaît de la liste et ne revient pas après un redémarrage.
- [ ] Étant donné la demande de confirmation, quand j'annule, alors le contact reste dans la liste, inchangé.

---

## Règles communes à chaque lot

- Écran : composants shadcn et thème Cachet uniquement, en clair et en sombre (`.claude/rules/presentation.md`).
- Règles métier dans `services/`, tests écrits avant le code (`.claude/rules/service.md`).
- Lecture et écriture uniquement dans `data/`, derrière un contrat (`.claude/rules/donnees.md`).
- Critère transverse d'`INTENT.md` : passer à une base managée ne modifie que `data/`. Vérifié à chaque lot avec les commandes de `.claude/rules/donnees.md`.
- Le choix de la base (légère, embarquée, compatible serverless) se fait au lot 1, avant d'écrire la couche données.
