# TODO - Evolution des ventes pour le fournisseur

## Backend
- [x] Ajouter un champ 'address' à la table products si nécessaire (migration, modèle Product, contrôleur).
- [x] Créer un nouvel endpoint API `/api/supplier/sales-evolution` dans OrderController ou un nouveau SalesController.
  - Récupérer les données de ventes par période (jour, semaine, mois) pour les produits du fournisseur connecté.
  - Protéger l'endpoint par authentification et rôle 'supplier'.

## Frontend
- [x] Modifier SupplierDashboard.jsx pour afficher une liste d'adresses cliquables.
- [x] Sur clic, afficher une modale ou section avec un graphique dynamique (Recharts).
- [x] Afficher l'évolution des ventes (axe X : temps, axe Y : ventes) pour la période sélectionnée.
- [x] Installer la dépendance Recharts.

## Tests
- [ ] Tester l'endpoint backend avec des données fictives.
- [ ] Intégrer et tester le frontend.
