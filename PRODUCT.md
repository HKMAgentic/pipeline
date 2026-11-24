# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Une seule personne qui prospecte : elle note ses contacts, les fait avancer d'étape en étape et veut savoir chaque jour qui relancer. Pour l'instant, Pipeline est un projet d'entraînement (formation Ultra) sans utilisateur réel ; aucune donnée ni retour d'usage n'existe.

## Product Purpose
Mini CRM de prospection mono-utilisateur. Le succès : ajouter un contact et le voir dans la liste, le retrouver après un redémarrage, et savoir en un coup d'œil qui relancer aujourd'hui.

## Operating Context
Usage surtout sur ordinateur, en session de travail : saisir des contacts, changer leur étape, consulter les relances du jour. Le mobile doit fonctionner mais n'est pas prioritaire.

## Capabilities and Constraints
- Application web Next.js 16 (App Router), Tailwind CSS v4, bibliothèque de composants prête à l'emploi (shadcn/ui prévue), déploiement serverless.
- Architecture 3 couches : présentation, service, données. Seule la couche données parle à la base.
- Base légère et embarquée, migrable vers une base managée sans toucher aux autres couches.
- Terminologie : contact, étape, relance.
- Hors périmètre : authentification, droits, multi-utilisateur.
- Non décidé : la liste exacte des étapes du pipeline, les champs d'un contact au-delà de l'identité et de l'étape.

## Brand Commitments
Seul le nom « Pipeline » est fixé. Interface en français. Aucune identité visuelle imposée.

## Evidence on Hand
Aucune : pas de vrais contacts, pas de témoignages, pas de chiffres. Les exemples affichés doivent être clairement fictifs.

## Product Principles
- Savoir qui relancer aujourd'hui prime sur tout le reste.
- Saisir un contact doit prendre quelques secondes.
- L'étape d'un contact se lit sans effort.
- Rien d'inutile pour une seule personne : pas de rôles, pas d'équipe, pas de tableau de bord décoratif.
