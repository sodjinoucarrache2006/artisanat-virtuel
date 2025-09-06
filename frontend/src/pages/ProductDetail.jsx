import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Veuillez vous connecter pour ajouter des produits au panier');
      return;
    }

    api.post('/cart/add', { product_id: id, quantity: 1 })
      .then(() => alert('Produit ajouté au panier'))
      .catch(error => {
        console.error('Erreur lors de l\'ajout au panier:', error);
        alert('Erreur lors de l\'ajout au panier. Veuillez réessayer.');
      });
  };

  if (loading) {
    return (
      <div className="container-fluid py-5" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      }}>
        <div className="text-center">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div>Produit non trouvé</div>;

  return (
    <div style={{
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      padding: '80px 0'
    }}>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-lg" style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="card-body p-5">
                <div className="row">
                  <div className="col-lg-6 mb-4">
                    <div className="text-center">
                      <img
                        src={product.image_url}
                        className="img-fluid rounded shadow"
                        alt={product.name}
                        style={{ maxHeight: '500px', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="product-info">
                      <h1 className="display-4 mb-4" style={{ color: '#2c3e50' }}>{product.name}</h1>
                      <div className="mb-4">
                        <span className="badge bg-primary fs-6 px-3 py-2 mb-3">
                          <i className="fas fa-map-marker-alt me-2"></i>
                          {product.address || 'Adresse non spécifiée'}
                        </span>
                      </div>
                      <p className="lead mb-4" style={{ color: '#34495e', lineHeight: '1.6' }}>
                        {product.description}
                      </p>
                      <div className="price-section mb-4">
                        <h2 className="text-primary fw-bold mb-3" style={{ fontSize: '2.5rem' }}>
                          {product.price} €
                        </h2>
                      </div>
                      <div className="action-buttons">
                        <button
                          onClick={addToCart}
                          className="btn btn-primary btn-lg me-3 px-4 py-3"
                          style={{ borderRadius: '25px' }}
                        >
                          <i className="fas fa-cart-plus me-2"></i>Ajouter au panier
                        </button>
                        <Link
                          to="/"
                          className="btn btn-outline-secondary btn-lg px-4 py-3"
                          style={{ borderRadius: '25px' }}
                        >
                          <i className="fas fa-arrow-left me-2"></i>Retour aux produits
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
