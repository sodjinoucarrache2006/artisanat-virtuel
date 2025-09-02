import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  // Fallback image URLs for different product categories
  const getFallbackImage = (productName) => {
    const name = productName.toLowerCase();
    if (name.includes('pot') || name.includes('vase')) {
      return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center';
    } else if (name.includes('table') || name.includes('chaise')) {
      return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center';
    } else if (name.includes('bijou') || name.includes('collier')) {
      return 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&crop=center';
    } else if (name.includes('tissu') || name.includes('textile')) {
      return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center';
    } else {
      return 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=300&fit=crop&crop=center';
    }
  };

  const handleImageError = (e, product) => {
    e.target.src = getFallbackImage(product.name);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3" style={{ color: '#3E3E3E' }}>Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="display-4 fw-bold mb-3" style={{ color: '#A0522D' }}>
          Bienvenue sur Artisanat Virtuel
        </h1>
        <p className="lead mb-4" style={{ color: '#3E3E3E' }}>
          Découvrez l'artisanat authentique et les produits uniques de nos créateurs passionnés
        </p>
        <motion.div
          className="d-flex justify-content-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link to="/register" className="btn btn-lg px-4" style={{ backgroundColor: '#DAA520', borderColor: '#DAA520', color: 'white' }}>
            <i className="fas fa-user-plus me-2"></i>Commencer
          </Link>
          <Link to="/login" className="btn btn-outline-secondary btn-lg px-4" style={{ borderColor: '#A0522D', color: '#A0522D' }}>
            <i className="fas fa-sign-in-alt me-2"></i>Se connecter
          </Link>
        </motion.div>
      </motion.div>

      {/* Products Section */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <h2 className="text-center mb-4" style={{ color: '#A0522D' }}>
          <i className="fas fa-star me-2" style={{ color: '#DAA520' }}></i>Nos Produits Phares
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-5">
            <div className="card">
              <div className="card-body py-5">
                <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">Aucun produit disponible</h4>
                <p className="text-muted">Les produits seront bientôt disponibles.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="col-lg-4 col-md-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="card h-100 shadow-sm">
                  <div className="position-relative overflow-hidden">
                    <img
                      src={product.image_url || getFallbackImage(product.name)}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: '250px', objectFit: 'cover' }}
                      onError={(e) => handleImageError(e, product)}
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="badge bg-primary">
                        <i className="fas fa-tag me-1"></i>Nouveau
                      </span>
                    </div>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-dark mb-2">{product.name}</h5>
                    <p className="card-text text-muted mb-2 flex-grow-1">
                      {product.description || 'Produit artisanal de qualité supérieure.'}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="h4 text-primary fw-bold mb-0">
                        {product.price} €
                      </span>
                      {product.address && (
                        <small className="text-muted">
                          <i className="fas fa-map-marker-alt me-1"></i>
                          {product.address}
                        </small>
                      )}
                    </div>
                    <Link
                      to={`/product/${product.id}`}
                      className="btn btn-primary w-100"
                    >
                      <i className="fas fa-eye me-2"></i>Voir les détails
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="row g-4 mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="col-md-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="mb-3">
                <i className="fas fa-handshake fa-3x text-primary"></i>
              </div>
              <h5 className="card-title">Artisans Locaux</h5>
              <p className="card-text text-muted">
                Soutenez les artisans de votre région et découvrez des talents uniques.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="mb-3">
                <i className="fas fa-shield-alt fa-3x text-success"></i>
              </div>
              <h5 className="card-title">Qualité Garantie</h5>
              <p className="card-text text-muted">
                Tous nos produits sont vérifiés et répondent aux standards de qualité.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="mb-3">
                <i className="fas fa-truck fa-3x text-warning"></i>
              </div>
              <h5 className="card-title">Livraison Rapide</h5>
              <p className="card-text text-muted">
                Recevez vos commandes dans les meilleurs délais avec notre service de livraison.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
