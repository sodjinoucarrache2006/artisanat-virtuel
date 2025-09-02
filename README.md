# Artisanat Virtuel - Plateforme E-commerce

Une plateforme e-commerce moderne pour les artisans et fournisseurs, développée avec Laravel (backend) et React (frontend).

## 🚀 Fonctionnalités

- **Authentification multi-rôles** : Client, Fournisseur, Administrateur
- **Gestion des produits** : CRUD complet pour les fournisseurs
- **Système de panier** : Ajout, modification, suppression d'articles
- **Gestion des commandes** : Suivi des commandes et statuts
- **Tableau de bord fournisseur** : Évolution des ventes, gestion des produits
- **Interface responsive** : Design moderne avec Bootstrap et Tailwind CSS

## 🛠️ Technologies utilisées

- **Backend** : Laravel 11, PHP 8.2, MySQL
- **Frontend** : React 19, Vite, Axios
- **Authentification** : Laravel Sanctum
- **UI** : Bootstrap 5, Tailwind CSS, Recharts (graphiques)

## 📋 Prérequis

- PHP 8.2 ou supérieur
- Composer
- Node.js 18+ et npm
- MySQL 8.0+

## 🚀 Installation et Configuration

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/artisanat-virtuel.git
cd artisanat-virtuel
```

### 2. Configuration du Backend (Laravel)

```bash
cd backend

# Installer les dépendances PHP
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=artisanat_virtuel
DB_USERNAME=votre_username
DB_PASSWORD=votre_password

# Créer la base de données
php artisan migrate

# Peupler la base de données avec des données de test
php artisan db:seed
```

### 3. Configuration du Frontend (React)

```bash
cd ../frontend

# Installer les dépendances Node.js
npm install

# Lancer le serveur de développement
npm run dev
```

### 4. Lancer les serveurs

**Terminal 1 - Backend :**
```bash
cd backend
php artisan serve --host=0.0.0.0 --port=5000
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

## 🔐 Comptes de test

Après avoir lancé `php artisan db:seed`, vous pouvez utiliser ces comptes :

### Administrateur
- Email : `admin@artisan.com`
- Mot de passe : `admin123`

### Fournisseur
- Email : `fournisseur@artisan.com`
- Mot de passe : `fournisseur123`

### Client
- Email : `client@artisan.com`
- Mot de passe : `client123`

## 🌐 Accès à l'application

- **Frontend** : http://localhost:5173 (Vite dev server)
- **Backend API** : http://localhost:5000/api

## 📁 Structure du projet

```
artisanat-virtuel/
├── backend/                 # API Laravel
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── ...
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── ...
├── cahier de chrage.md     # Cahier des charges
├── TODO.md                 # Liste des tâches
└── README.md
```

## 🔧 Scripts disponibles

### Backend
```bash
php artisan migrate:fresh --seed  # Reset et repeupler la DB
php artisan route:list            # Lister les routes API
php artisan tinker                # Console interactive
```

### Frontend
```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualisation du build
```

## 🚀 Déploiement

### Option 1 : Déploiement séparé (Recommandé)

**Backend :** Déployer sur Heroku, DigitalOcean, ou serveur dédié
**Frontend :** Déployer sur Vercel, Netlify, ou GitHub Pages

### Option 2 : Déploiement intégré

Utiliser des services comme :
- **Railway** : Déploiement full-stack
- **Render** : Backend + Frontend
- **Heroku** : Avec buildpacks personnalisés

## 📝 API Documentation

### Authentification
```
POST /api/login
POST /api/register
POST /api/logout
GET  /api/user
```

### Produits
```
GET    /api/products
GET    /api/products/{id}
POST   /api/admin/products     # Admin seulement
PUT    /api/admin/products/{id} # Admin seulement
DELETE /api/admin/products/{id} # Admin seulement
```

### Panier et Commandes
```
GET    /api/cart
POST   /api/cart/add
PUT    /api/cart/update/{id}
DELETE /api/cart/remove/{id}
POST   /api/orders
GET    /api/orders
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**Développé avec ❤️ pour les artisans et fournisseurs**
