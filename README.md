# Projet TypeScript Bibliotheque

Ce prototype console illustre la gestion de livres, utilisateurs et emprunts en TypeScript.

## Installation

```bash
npm install
```

## Execution de la demo

```bash
npm run demo
```

La commande affiche successivement :
- la creation des entites (auteurs, livres, utilisateurs) ;
- le polymorphisme Student/Librarian ;
- la gestion des emprunts (ajout, retour, filtrage) ;
- l'utilisation du repository generique ;
- la demonstration des retards/pénalites et de la file de reservation.

## Menu interactif

Pour manipuler manuellement les fonctionnalites bonus (reservations, retours, pénalites), lancez :

```bash
npm run menu
```

Un menu texte s'ouvre pour lister les livres, emprunter, retourner, reserver ou consulter les retards en temps reel.
