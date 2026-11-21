# Intention · Pipeline

## Produit
Un mini CRM de prospection pour une seule personne.
Je note mes contacts, je les fais avancer d'étape en étape, je sais qui relancer aujourd'hui.

## Architecture
Une architecture en 3 couches : présentation, service, données.
Seule la couche données parle à la base.
Une base légère et embarquée, facilement migrable vers une base managée.
Les règles métier ont des tests unitaires.

## Contraintes
Application web, bibliothèque de composants d'interface prête à l'emploi, déploiement sur une plateforme d'hébergement serverless.
Un seul utilisateur.

## Hors périmètre
Pas d'authentification, pas de gestion de droits, pas de multi-utilisateur.

## Critères d'acceptation
- J'ajoute un contact, il apparaît dans la liste.
- Après un redémarrage de l'application, les contacts ajoutés avant sont toujours affichés dans la liste.
- Après le passage à une base managée, la liste des modifications du code ne contient que des changements dans la couche données.
