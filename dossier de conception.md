Dossier de Conception
Nom de l'application web : "Artisanat Virtuel"
1. Architecture Générale L'application sera une Application à Page Unique (SPA) développée
avec React pour le front-end. Le front-end communiquera avec un back-end Laravel qui servira
d'API RESTful. Les deux parties interagiront via des requêtes HTTP (GET, POST, PUT, DELETE) au
format JSON.
2. Modèle de Données (Structure de la Base de Données) C'est le point central qui lie le front-
end et le back-end.
•
Table : utilisateurs
• id (INT, PK)
• nom (VARCHAR)
• email (VARCHAR, UNIQUE)
• mot_de_passe_hash (VARCHAR)
• role (VARCHAR, ex: 'client' ou 'admin')
•
Table : produits
• id (INT, PK)
• nom (VARCHAR)
• description (TEXT)
• prix (DECIMAL)
• image_url (VARCHAR)
•
Table : paniers
• id (INT, PK)
• utilisateur_id (INT, FK vers utilisateurs)
•
Table : paniers_produits
• panier_id (INT, FK vers paniers)
• produit_id (INT, FK vers produits)
• quantite (INT)
•
Table : commandes
• id (INT, PK)
• utilisateur_id (INT, FK vers utilisateurs)
• date_commande (DATETIME)
• statut (VARCHAR, ex: 'en cours' ou 'livrée')
•
Table : commandes_produits
• commande_id (INT, FK vers commandes)
• produit_id (INT, FK vers produits)• quantite (INT)
• prix_unitaire (DECIMAL)
3. Conception de l'API Back-end (Laravel) Voici les principaux points d'entrée de l'API que le
front-end utilisera :
POST /api/inscription : Enregistre un nouvel utilisateur client.
• POST /api/connexion : Authentifie un utilisateur (client ou admin).
• GET /api/produits : Récupère la liste de tous les produits.
• GET /api/produits/{id} : Récupère les détails d'un produit spécifique.
• POST /api/panier/ajouter : Ajoute un produit au panier d'un utilisateur authentifié.
• GET /api/panier : Récupère le contenu du panier de l'utilisateur. (Authentification requise)
• POST /api/commandes : Crée une nouvelle commande à partir du panier. (Authentification
•
requise)
•GET /api/historique-commandes : Récupère l'historique des commandes de l'utilisateur.
•GET /api/admin/dashboard : Récupère les données pour le tableau de bord de l'admin.
•POST /api/admin/produits : Ajoute un nouveau produit. (Authentification et rôle 'admin'
(Authentification requise)
(Authentification et rôle 'admin' requis)
requis)
4. Structure du Front-end (React) L'application React sera organisée avec les pages et
composants majeurs suivants :
•
Pages (Vues) :
• / : HomePage (catalogue de produits)
• /connexion : ConnexionPage
• /inscription : InscriptionPage
• /produit/:id : DetailProduitPage
• /panier : PanierPage
• /profil : ProfilPage (inclut l'historique des commandes)
• /admin/dashboard : DashboardAdminPage
•
Composants réutilisables :
• Header et Footer
• CardProduit
• FormulaireConnexion et FormulaireInscription
• Panier
• GraphiqueVentes
• StatistiqueCardLa navigation sera gérée par react-router-dom, et la gestion de l'état (utilisateur, panier) se fera
via un Context API simple.
5. Réflexions sur les Exigences Non Fonctionnelles Clés
• Sécurité : L'authentification et l'autorisation seront gérées par Laravel via des tokens. Les
données seront validées côté back-end pour se prémunir des injections. La distinction des
rôles (client/admin) sera gérée par le back-end.
•Performance : Les images des produits seront optimisées avant d'être utilisées. Les
•Éco-responsabilité : L'optimisation des images et la réduction des requêtes API
requêtes API seront conçues pour ne récupérer que les données nécessaires.
contribueront à une utilisation plus responsable des ressources.