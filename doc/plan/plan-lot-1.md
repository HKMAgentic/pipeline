# Plan · Lot 1 · Ajouter un contact et le retrouver dans la liste

Statut : **en attente de validation**. Rien n'est écrit tant que les 3 décisions ne sont pas validées.

Sources : `lots.md` (lot 1), `INTENT.md`, `.claude/rules/`.

---

## Décisions à valider

### 1. Choix de la base : libSQL (`@libsql/client`)

libSQL est une variante de SQLite : une base de données qui tient dans un seul fichier.

- En local : un fichier `pipeline.db` (base légère et embarquée).
- Sur un hébergement serverless, le disque est effacé à chaque redémarrage : un fichier local n'y survit pas. Le même client fonctionne avec Turso (libSQL hébergé) en changeant seulement l'URL dans `.env.local`.
- La migration vers la base managée ne touche donc que `data/` (critère d'`INTENT.md`).
- **Non vérifié :** version exacte du paquet, et compatibilité avec le blocage `allowBuilds` de `pnpm-workspace.yaml`. À vérifier à l'installation.

### 2. Point de branchement de la base

Problème : un fichier doit créer le vrai dépôt et le donner au service. Or `app/` ne doit jamais importer `@/data`, et `services/` n'en importe que des types.

Proposition : une seule exception, documentée dans `.claude/rules/presentation.md` : `app/contacts-actions.ts` (les Server Actions, fonctions exécutées sur le serveur quand on envoie le formulaire) peut importer `createContactRepository` depuis `@/data`. Sa signature ne change pas lors d'une migration : le critère reste respecté.

### 3. Périmètre de l'écran au lot 1

- Formulaire : seulement Nom et Entreprise. Les champs « Étape » et « Date de relance » sont retirés (la date revient au lot 2).
- Carte : nom, entreprise, étiquette d'étape. Le tampon et les boutons « Relancer » et « Étape suivante » sont masqués jusqu'aux lots 2, 4 et 5.
- Titre de la liste : « Contacts » (« Relances du jour » arrive au lot 3). Le compteur du bandeau est retiré.

---

## Tâches par couche

### Données (`data/`)

1. Installer `@libsql/client` avec pnpm.
2. Créer `data/contact-repository.ts` :
   - type `ContactRecord` : `id`, `name`, `company`, `stage` (texte), `createdAt` ;
   - interface `ContactRepository` : `add(contact)`, `list()` ;
   - `createContactRepository(url)` : crée la table si elle n'existe pas.
3. URL lue dans `DATABASE_URL` (`.env.local`), avec `file:pipeline.db` par défaut en local. Ajouter `pipeline.db` dans `.gitignore`.
4. Supprimer les fichiers `example-*` des 3 couches.

### Service (`services/`), test écrit avant le code (rouge, puis vert)

1. `services/stages.ts` : la liste des étapes et l'étape de départ « À contacter ».
2. `services/contacts.ts` :
   - `addContact(repo, { name, company })` : nettoie les espaces, refuse un nom vide (code d'erreur `name_required`), sinon enregistre le contact avec l'étape « À contacter » ;
   - `listContacts(repo)`.
3. Le service renvoie un code d'erreur et non une phrase (règle 4 du service). L'écran le traduit en « Le nom est obligatoire. ».

### Présentation (`app/`, `presentation/`)

1. `app/contacts-actions.ts` : Server Action qui crée le dépôt, appelle `addContact` et rafraîchit la page.
2. `ContactForm` : branché sur l'action, affiche le message d'erreur sous le champ Nom.
3. Nouveau composant `ContactList` : les cartes, ou « Aucun contact pour l'instant » si la liste est vide.
4. `page.tsx` : lit les contacts avec `listContacts`.
5. Supprimer `demo-contacts.ts`. Déplacer le type `Stage` vers `services/`.
6. **À vérifier dans `node_modules/next/dist/docs/` avant de coder :** comment lire la base à chaque requête avec `cacheComponents` activé, pour que la liste ne soit pas figée en cache.

---

## Critères d'acceptation et tests qui les prouvent

| Critère | Test automatique | Vérification à la main |
|---|---|---|
| **1.** Je saisis « Camille Roux » et « Atelier Roux » → la carte apparaît avec « À contacter » | Service : `addContact` avec un faux dépôt enregistre Camille Roux à l'étape « À contacter ». Données : `add` puis `list` sur une base de test renvoient Camille Roux. Présentation : `ContactList` affiche « Camille Roux » et « À contacter » | Saisie dans le navigateur |
| **2.** Nom vide → aucun contact créé et message « Le nom est obligatoire. » | Service : un nom `""` ou `"   "` renvoie `name_required`, et `add` n'est jamais appelé. Présentation : `ContactForm` affiche le message sous le champ quand on lui passe cette erreur | Clic sur Enregistrer avec le nom vide |
| **3.** Le contact reste après un redémarrage | Données : enregistrer dans un fichier temporaire, créer un **nouveau** dépôt sur le même fichier, `list` retrouve le contact | `Ctrl + C`, puis `pnpm dev` : le contact est toujours là |
| **4.** Aucun contact → « Aucun contact pour l'instant » et aucune donnée fictive | Présentation : `ContactList` avec une liste vide affiche le message. Données : une base neuve renvoie `[]` | Une recherche de `demo` dans le code ne trouve plus rien |

---

## Vérifications de fin de lot

1. Commandes « Comment vérifier » de `.claude/rules/donnees.md`, `service.md` et `presentation.md`.
2. `pnpm test`, `pnpm lint`, `pnpm build` passent.
3. Écran contrôlé à l'œil en clair et en sombre.
4. Cocher les critères du lot 1 dans `lots.md`.
