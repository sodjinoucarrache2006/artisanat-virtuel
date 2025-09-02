Cahier des charges (DSF) pour l’application "Artisanat Virtuel"
Intitulé : "Artisanat Virtuel"
1. Introduction
Ce document définit les spécifications pour le développement de l'application web
"Artisanat Virtuel", une plateforme e-commerce simple permettant aux artisans de
présenter leurs créations et aux clients de les acheter. L'application sera développée avec
React pour l'interface utilisateur et Laravel pour le back-end.
2. Objectifs du Projet
L'objectif est de créer un prototype fonctionnel d'une boutique en ligne. Les buts
spécifiques sont de :
• Mettre en pratique la gestion d'un système e-commerce complet (catalogue, panier,
commandes).
• Implémenter une architecture robuste avec une API REST pour gérer des données
complexes.
• Créer une interface utilisateur visuellement attrayante et intuitive.
• Démontrer une maîtrise des relations de données dans la base de données.
3. Portée du Projet
Le périmètre est fixé pour une durée de 20 heures.
•
•
Fonctionnalités essentielles (obligatoires) :
Gestion des utilisateurs : Inscription, connexion et déconnexion pour les clients.
Connexion et accès contrôlé pour l'administrateur (fournisseur).
Catalogue de produits : Affichage de tous les produits, page de détails pour chaque
produit.
• Panier d'achat : Ajout de produits, consultation, mise à jour des quantités et suppression.
• Passer une commande : Processus de commande simple (sans paiement réel, on peut
simuler la validation).
• Gestion des produits : Un administrateur doit pouvoir ajouter, modifier et supprimer des
produits via une interface dédiée.
• Fonctionnalités reportées (futures) :
• Intégration d'un système de paiement réel.
•
• Système d'avis et de notation des produits.
• Gestion des stocks en temps réel.
4. Exigences Fonctionnelles
• Gestion des produits :
• Afficher une liste de produits sur la page d'accueil avec une image, un titre et un prix.
• Les administrateurs peuvent ajouter, modifier et supprimer des produits depuis une
interface dédiée.
• Panier d'achat :
• Les utilisateurs peuvent ajouter un produit à leur panier depuis la page de détails.• Les utilisateurs peuvent voir leur panier et ajuster les quantités avant de passer la
commande.
• Passage de commande :
• Les utilisateurs connectés peuvent valider leur panier pour créer une commande.
• L'historique des commandes passées sera affiché sur la page de profil de l'utilisateur.
5. Modèle de Données / Structure des Données
• Utilisateur : id, nom, email, mot_de_passe_hash, role (client/admin).
• Produit : id, nom, description, prix, image_url.
• Panier : id, utilisateur_id.
• Panier_Produit : panier_id, produit_id, quantite (relation Many-to-Many).
• Commande : id, utilisateur_id, date_commande, statut (en cours/livrée).
• Commande_Produit : commande_id, produit_id, quantite, prix_unitaire.
6. Exigences Non Fonctionnelles
• Performance : L'application doit être réactive, avec un temps de chargement rapide.
• Sécurité : Les mots de passe seront hachés. L'API Laravel sera sécurisée et gérera les rôles
pour restreindre l'accès à certaines fonctionnalités.
Convivialité/Ergonomie : L'interface sera simple et visuellement agréable, avec un flux
d'achat clair.
• Éco-responsabilité : Les images des produits seront optimisées pour réduire la
consommation de bande passante. Le code sera optimisé pour minimiser les requêtes
inutiles.
•
7. Architecture Technique
• Architecture globale : SPA (Single Page Application) avec une API REST.
• Technologies Front-end : React, avec React Router pour la navigation. Une librairie d'UI
comme Material UI ou Chakra UI peut être utilisée pour un rendu visuel de qualité
(alternative à Bootstrap).
•
•
Technologies Back-end : Laravel, avec une base de données MySQL.
Communication : Le front-end communiquera avec l'API Laravel via Axios pour les
requêtes HTTP en format JSON.
2. Dossier de Conception visuelle pour "Artisanat Virtuel"
1. Layout Général (Structure de la page)
• En-tête : En haut de chaque page, contenant le logo, des liens de navigation (Accueil,
Produits, Panier), et des liens de compte (Connexion/Déconnexion).
• Contenu principal : Le cœur de chaque page.
• Pied de page : En bas de chaque page, avec des liens vers les informations de contact.
2. Wireframes des Écrans Clés
• Page d'accueil : Une bannière en haut de page, suivie d'une grille de produits stylisée
avec des cartes (images, nom, prix).
Page Panier : Une page récapitulant les produits sélectionnés, avec des boutons pour
ajuster la quantité ou supprimer un article. Un bouton "Commander" en bas de page.
• Page de détails d'un produit : Un grand visuel du produit, une description détaillée, et un
bouton "Ajouter au panier".
• Tableau de bord de l'administrateur : Une page dédiée après connexion, avec :
•• Des cartes de KPI (Indicateurs Clés de Performance) en haut, affichant le nombre de
produits publiés, le nombre de commandes en cours, et le nombre de commandes livrées.
• Un graphique en courbe d'évolution pour visualiser les ventes sur une période donnée.
• Un bouton pour "Ajouter un nouveau produit" et une liste des derniers produits et
commandes pour la gestion.
3. Flux Utilisateurs Simples
• Flux d'achat : L'utilisateur navigue sur la page d'accueil, clique sur un produit, le consulte,
•
l'ajoute au panier. Il peut ensuite aller sur la page Panier et valider sa commande.
Flux d'administration : L'administrateur se connecte via le formulaire de connexion
standard. L'application reconnaît son rôle et le redirige vers le tableau de bord où il peut
gérer ses produits et consulter les statistiques.
4. Éléments de Style
• Le design sera épuré et moderne, avec des couleurs qui évoquent l'artisanat.
• L'utilisation d'une librairie d'UI (comme Material UI) vous donnera accès à des composants
de haute qualité, comme des cartes stylisées pour les produits, des boutons élégants, et
un style de formulaire professionnel.
• Des animations et des transitions peuvent être ajoutées en React pour un effet visuel plus
dynamique (ex: un effet de fondu lors de l'ajout d'un produit au panier).