---
name: Pipeline
description: Mini CRM de prospection, habillé comme un bureau de poste. Chaque relance est une lettre à poster.
colors:
  background: "#EEF0F3"
  foreground: "#14213D"
  card: "#FFFFFF"
  primary: "#1E3A8A"
  primary-foreground: "#FFFFFF"
  secondary: "#E3E9F7"
  secondary-foreground: "#1E3A8A"
  muted: "#E1E6EF"
  muted-foreground: "#4B5670"
  destructive: "#B3261E"
  border: "#D5DAE3"
  input: "#B9C1CF"
  ring: "#2F5BD3"
  stamp: "#1E3A8A"
  stamp-late: "#B3261E"
  kraft: "#F1E6D2"
  kraft-foreground: "#6B4A16"
  selection: "#C9D6F6"
  background-dark: "#0E1626"
  foreground-dark: "#E6EBF5"
  card-dark: "#16213A"
  primary-dark: "#8FA8FF"
  primary-foreground-dark: "#0E1626"
  secondary-dark: "#22315A"
  secondary-foreground-dark: "#C7D4FF"
  muted-dark: "#1C2A47"
  muted-foreground-dark: "#A3AEC6"
  destructive-dark: "#FF8A80"
  border-dark: "#26324F"
  input-dark: "#34405E"
  ring-dark: "#8FA8FF"
  stamp-dark: "#8FA8FF"
  stamp-late-dark: "#FF8A80"
  kraft-dark: "#3A2E1A"
  kraft-foreground-dark: "#E8CF9F"
  selection-dark: "#2C4380"
typography:
  display:
    fontFamily: "Barlow Condensed, Public Sans, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.025em"
  title:
    fontFamily: "Barlow Condensed, Public Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.375
  body:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-ui:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1
  stamp:
    fontFamily: "Barlow Condensed, sans-serif"
    fontWeight: 700
    letterSpacing: "0.15em"
rounded:
  sm: "3.6px"
  md: "4.8px"
  lg: "6px"
  xl: "8.4px"
spacing:
  control-x: "10px"
  card-sm: "12px"
  card: "16px"
  page-x: "16px"
  page-y: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  button-primary-hover:
    backgroundColor: "color-mix(in oklch, #1E3A8A 80%, transparent)"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    height: "32px"
  button-outline-hover:
    backgroundColor: "{colors.muted}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.lg}"
    height: "32px"
  button-ghost-hover:
    backgroundColor: "{colors.muted}"
  button-destructive:
    backgroundColor: "color-mix(in oklch, #B3261E 10%, transparent)"
    textColor: "{colors.destructive}"
    rounded: "{rounded.lg}"
    height: "32px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "4px 10px"
    height: "32px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "{spacing.card}"
  chip-stage:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.sm}"
    padding: "3px 9px"
  chip-stage-kraft:
    backgroundColor: "{colors.kraft}"
    textColor: "{colors.kraft-foreground}"
    rounded: "{rounded.sm}"
    padding: "3px 9px"
  stamp:
    textColor: "{colors.stamp}"
    typography: "{typography.stamp}"
    size: "92px"
  stamp-late:
    textColor: "{colors.stamp-late}"
    typography: "{typography.stamp}"
    size: "92px"
---

# Design System: Pipeline

## Overview

**Creative North Star: "Cachet"**

Pipeline vit dans le monde du courrier. Chaque relance est une lettre à poster, et sa date s'imprime comme un tampon dateur : encre bleue quand on est à l'heure, encre rouge quand on est en retard. Le fond est un papier gris-bleu, le texte une encre marine, les étiquettes d'étape précoces sont en papier kraft. Le monde n'apporte que quatre choses : la typographie, la palette, la densité et un seul geste signature, le tampon. La navigation et les contrôles restent des composants web standard (shadcn, style base-nova), sans déguisement postal.

L'outil est mono-utilisateur et se consulte en session de travail sur ordinateur : densité moyenne, contrôles compacts, une question prioritaire à l'écran (« qui relancer aujourd'hui ? »). Le tampon répond à cette question d'un coup d'œil ; tout le reste se tait autour de lui. L'interface est en français.

Les thèmes clair et sombre sont tous deux de premier rang. Le thème suit le réglage du système par défaut (classe `.dark` posée sur `<html>`), et chaque token a sa valeur claire et sa valeur sombre (« nuit d'encre »). Aucune surface, maquette ou composant n'est livré dans un seul thème.

**Key Characteristics:**
- Papier gris-bleu, encre marine, un seul bleu d'action.
- Titres condensés en capitales (Barlow Condensed), corps en Public Sans.
- Le tampon dateur circulaire et légèrement tourné est le seul élément « du monde » ; il reste petit et rare.
- Rouge réservé au retard et aux erreurs ou actions destructives.
- Contrôles shadcn standard, compacts, coins doucement arrondis (6px).
- Clair et sombre toujours livrés ensemble.

## Colors

Une palette de bureau de poste : papier froid, encre de tampon bleue, rouge d'oblitération en retard, kraft pour les plis en attente.

### Primary
- **Encre de tampon** (`primary`, sombre `primary-dark`) : boutons principaux, liens, état « actif ». En sombre, l'encre s'éclaircit en bleu pervenche pour garder le contraste sur la nuit d'encre.
- **Bleu de focus** (`ring`) : anneau de focus clavier et bordure de champ focalisé uniquement, plus vif que l'encre pour se distinguer d'un bouton.

### Secondary
- **Pli bleuté** (`secondary` / `secondary-foreground`) : boutons secondaires et étiquettes d'étape par défaut.
- **Kraft** (`kraft` / `kraft-foreground`) : étiquettes des étapes précoces ou en attente (par exemple « Contacté »). C'est la seule couleur chaude de l'interface.

### Tertiary
- **Rouge d'oblitération** (`destructive`, `stamp-late`) : tampon en retard, message d'erreur de champ, bordure de champ invalide, actions destructives. Même valeur pour ces quatre usages dans chaque thème.

### Neutral
- **Papier gris-bleu** (`background`) : fond de page.
- **Feuille blanche** (`card`, aussi `popover`) : cartes et surfaces flottantes posées sur le papier.
- **Encre marine** (`foreground`) : texte courant et titres.
- **Encre délavée** (`muted-foreground`) : métadonnées, dates de dernier échange, descriptions.
- **Gris de tri** (`muted`, aussi `accent`) : survol des boutons outline et ghost, pieds de carte.
- **Filet** (`border`) : séparateurs et bordures de surface. **Bord de champ** (`input`) : contour des champs et des boutons outline en sombre, plus marqué que le filet.
- **Surlignage** (`selection`) : fond de la sélection de texte.

Les tokens `sidebar-*` et `chart-*` existent dans `app/globals.css` mais ne sont encore utilisés par aucune surface ; ils ne sont pas canoniques tant qu'un écran ne s'en sert pas.

### Named Rules
**The Two Inks Rule.** Le tampon n'a que deux encres : `stamp` (à l'heure) et `stamp-late` (en retard). Pas de troisième état coloré, pas de vert, pas d'orange.

**The Red Means Late Rule.** Le rouge signale un retard, une erreur ou une destruction, rien d'autre. Jamais de rouge décoratif.

**The One Warm Note Rule.** Le kraft est la seule couleur chaude ; il ne sert qu'aux étiquettes d'étape précoces ou en attente.

## Typography

**Display Font:** Barlow Condensed 500/600/700 (repli Public Sans, sans-serif), variable `--font-heading`, appliquée automatiquement à h1, h2, h3 et aux titres de carte.
**Body Font:** Public Sans (repli system-ui, sans-serif), variable `--font-sans`, pour tout le reste.

**Character:** Un condensé de signalétique postale pour les titres, en capitales espacées, posé sur une sans-serif administrative et très lisible pour le texte et les contrôles.

### Hierarchy
- **Display** (700, 2.25rem, interligne 1.1, capitales, interlettrage 0.025em) : titre de page, un par écran.
- **Title** (Barlow Condensed 500, 1rem, interligne 1.375) : titres de carte.
- **Body** (400, 1rem, interligne 1.5) : texte courant ; 0.875rem (`body-ui`) dans les cartes, champs sur ordinateur et descriptions.
- **Label** (500, 0.875rem, interligne 1) : libellés de champ, texte des boutons.
- **Stamp** (Barlow Condensed 700, capitales, interlettrage large) : uniquement dans le tampon dateur, en SVG.

### Named Rules
**The Condensed Is For Headings Rule.** Barlow Condensed ne sert qu'aux titres (h1 à h3, titres de carte) et au tampon. Jamais pour un paragraphe, un champ ou un bouton.

## Layout

Colonne de lecture centrée et étroite (largeur max 48rem), marges latérales de 16px, marge verticale de 32px. Rythme sur la grille de 4px de Tailwind : 16px d'espacement interne dans les cartes (12px en taille compacte), 10px de marge horizontale dans les contrôles. Les cartes de contact s'empilent avec un écart de 10px. Densité de travail : contrôles de 32px de haut par défaut. Pensé d'abord pour l'ordinateur ; sur mobile, la même colonne pleine largeur avec la gouttière de 16px.

## Elevation & Depth

Surfaces plates. La profondeur vient du contraste tonal entre le papier gris-bleu et la feuille blanche (ou bleu nuit en sombre), complété par un filet d'1px : les cartes shadcn livrées portent un anneau `ring-1` à 10 % de l'encre, sans ombre. La carte de contact de référence (colonne « Cachet » des maquettes) ajoute une ombre très douce et diffuse, notée dans le sidecar comme provisoire jusqu'à sa construction.

### Named Rules
**The Paper On Paper Rule.** La profondeur se lit comme une feuille posée sur une autre : changement de ton et filet fin. Pas d'ombre portée dure, pas d'empilement de calques.

## Shapes

Coins doucement arrondis, dérivés d'un rayon de base de 6px (`--radius: 0.375rem`) : 6px pour boutons et champs, environ 8px pour les cartes, 4px pour les étiquettes d'étape. Une seule forme échappe au rectangle : le cercle du tampon dateur (double anneau, texte en arc). La rotation est réservée au tampon : -9° à l'heure, +6° en retard.

## Components

Des contrôles shadcn standard, sobres et compacts ; le monde postal se limite aux couleurs et au tampon.

### Buttons
- **Shape :** coins doux (6px), hauteur 32px par défaut (28px `sm`, 36px `lg`), carré de 32px pour les boutons icône.
- **Primary :** fond encre, texte blanc (en sombre : fond pervenche, texte nuit d'encre). Survol : encre à 80 %.
- **Outline :** fond papier, filet ; survol gris de tri. Utilisé par le bouton de thème (soleil / lune).
- **Secondary :** fond pli bleuté, texte encre.
- **Ghost / Link :** sans fond, survol gris de tri ; lien souligné au survol.
- **Destructive :** fond rouge à 10 %, texte rouge ; plus foncé au survol. Jamais un aplat rouge plein.
- **Focus / Active :** bordure `ring` et anneau de 3px à 50 % ; enfoncement d'1px au clic ; désactivé à 50 % d'opacité.

### Chips
- **Étiquette d'étape :** texte 12.5px demi-gras, marge interne 3px 9px, coins 4px, fond pli bleuté, texte encre.
- **Variante kraft :** fond kraft, texte brun kraft, pour les étapes précoces ou en attente.
- Provisoire : défini par la maquette « Cachet », pas encore construit dans l'application.

### Cards / Containers
- **Corner Style :** environ 8px (`rounded-xl`).
- **Background :** feuille blanche (`card`), bleu nuit en sombre.
- **Shadow Strategy :** aucune ombre ; anneau d'1px (voir Elevation & Depth).
- **Internal Padding :** 16px (12px en taille compacte) ; pied de carte sur gris de tri à 50 % avec filet supérieur.

### Inputs / Fields
- **Style :** fond transparent (en sombre, bord de champ à 30 %), contour `input` d'1px, coins 6px, hauteur 32px, texte 16px sur mobile et 14px sur ordinateur, placeholder en encre délavée.
- **Focus :** bordure `ring` et anneau de 3px à 50 %.
- **Error :** `aria-invalid` passe la bordure au rouge avec un anneau rouge léger ; le message d'erreur s'affiche sous le champ en 12.5px rouge, une phrase qui explique et propose la correction (« Cette date n'existe pas. Choisissez un jour du calendrier. »).
- **Disabled :** 50 % d'opacité, fond `input` à 50 %.
- **Label :** 14px demi-gras (500), au-dessus du champ.

### Navigation
Pas encore de navigation construite. L'en-tête actuel aligne le titre display à gauche et le bouton de thème à droite. Toute navigation future reste un composant shadcn standard aux couleurs du thème.

### Tampon dateur (signature)
Le geste signature, provisoire jusqu'à sa construction (référence : colonne « Cachet » des maquettes). Un SVG circulaire de 92px, placé en haut à droite d'une carte de contact : double anneau (trait 2.5 puis 1), un mot en arc en haut (« RELANCE » ou « EN RETARD »), la date au centre en grand (« 26·11 »), une ligne en dessous (jour de la semaine, ou « −4 JOURS »). Encre `stamp` tourné de -9° à l'heure ; encre `stamp-late` tourné de +6° en retard. Le SVG porte un `aria-label` complet en français (« Relance en retard de 4 jours, prévue le vendredi 20 novembre ») : la couleur n'est jamais la seule information. Une carte qui l'accueille réserve 112px à droite pour qu'il ne chevauche pas le texte.

### Carte de contact
Provisoire, d'après la maquette « Cachet » : nom en titre (17px gras), entreprise et métier en encre délavée, étiquette d'étape, date du dernier échange en encre délavée, puis les actions (« Relancer » en primaire, « Étape suivante » en outline), et le tampon dateur à droite.

## Do's and Don'ts

### Do:
- **Do** livrer chaque écran, composant et maquette en thème clair et en thème sombre, avec les tokens des deux thèmes.
- **Do** passer par les tokens (`primary`, `stamp`, `kraft`…) plutôt que par des couleurs en dur.
- **Do** donner au tampon un `aria-label` qui dit la date et l'état (à l'heure ou en retard).
- **Do** garder les contrôles shadcn standard ; le monde postal s'exprime par la couleur, la typographie et le tampon.
- **Do** écrire toute l'interface en français.

### Don't:
- **Don't** poser plus d'un tampon par carte de contact, ni de tampon ailleurs que sur une relance datée.
- **Don't** tourner autre chose que le tampon.
- **Don't** utiliser le rouge hors retard, erreur ou destruction.
- **Don't** déguiser la navigation ou les contrôles en objets postaux (enveloppes, timbres, boîtes aux lettres).
- **Don't** utiliser Barlow Condensed pour le texte courant, les champs ou les boutons.
