import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    api.get('/cart')
      .then(response => {
        const items = response.data.items.map(item => ({
          id: item.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          product_id: item.product.id,
          image_url: item.product.image_url
        }));
        setCartItems(items);
      })
      .catch(error => {
        console.error('Erreur lors du chargement du panier:', error);
        navigate('/cart');
      });
  }, [navigate]);

  // Bloquer le scroll quand le modal est ouvert
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showModal]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    setLoading(true);
    api.post('/orders')
      .then(() => {
        setLoading(false);
        setOrderPlaced(true);
        setShowModal(true);
        setCartItems([]);
      })
      .catch(error => {
        setLoading(false);
        console.error('Erreur lors de la commande:', error);
        alert('Erreur lors de la commande. Veuillez réessayer.');
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/orders');
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="container-fluid mt-5">
        <div className="alert alert-info">
          Votre panier est vide. <a href="/">Retour à l'accueil</a>
        </div>
      </div>
    );
  }

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
                <h1 className="mb-4 text-center" style={{ color: '#2c3e50' }}>Finaliser la commande</h1>

                {!orderPlaced && (
                  <div className="row">
                    <div className="col-md-8">
                      <h3>Récapitulatif de la commande</h3>
                      <div className="list-group">
                        {cartItems.map(item => (
                          <div key={item.id} className="list-group-item d-flex align-items-center">
                            <img src={item.image_url} alt={item.name} className="img-thumbnail me-3" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                            <div className="flex-grow-1">
                              <h5>{item.name}</h5>
                              <p className="mb-1">Prix: {item.price} €</p>
                              <p className="mb-1">Quantité: {item.quantity}</p>
                              <p className="mb-1">Sous-total: {(item.price * item.quantity).toFixed(2)} €</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">Total</h5>
                          <p className="card-text fs-4 fw-bold">{total.toFixed(2)} €</p>
                          <button
                            className="btn btn-success btn-lg w-100"
                            onClick={handlePlaceOrder}
                            disabled={loading}
                          >
                            {loading ? 'Traitement...' : 'Confirmer la commande'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal de confirmation */}
                {showModal && (
                  <div 
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      zIndex: 1050
                    }}
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content border-0 shadow-lg" style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <div className="modal-header border-0">
                          <h5 className="modal-title fw-bold text-success">Commande confirmée !</h5>
                          <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                        </div>
                        <div className="modal-body text-center py-4">
                          <div className="mb-4">
                            <i className="fas fa-check-circle" style={{ fontSize: '4rem', color: '#28a745' }}></i>
                          </div>
                          <h4 className="fw-bold mb-3" style={{ color: '#2c3e50', fontSize: '1.5rem' }}>
                            Votre commande a été passée avec succès !
                          </h4>
                          <p className="mb-2" style={{ color: '#495057', fontSize: '1.1rem' }}>
                            Veuillez patienter pendant que nous traitons votre commande.
                          </p>
                          <p className="mb-3" style={{ color: '#6c757d', fontSize: '1rem' }}>
                            Le fournisseur recevra une notification automatiquement.
                          </p>
                          <div className="mt-4">
                            <small style={{ color: '#868e96', fontSize: '0.9rem' }}>
                              Vous serez redirigé vers l'historique de vos commandes
                            </small>
                          </div>
                        </div>
                        <div className="modal-footer border-0">
                          <button type="button" className="btn btn-primary px-4 py-2" onClick={handleCloseModal}>
                            <i className="fas fa-list me-2"></i>Voir mes commandes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
