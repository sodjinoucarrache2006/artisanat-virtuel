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

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    setLoading(true);
    api.post('/orders')
      .then(response => {
        setLoading(false);
        setOrderPlaced(true);
        setShowModal(true);
        // Clear cart after successful order
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
      <div className="container mt-5">
        <div className="alert alert-info">
          Votre panier est vide. <a href="/">Retour à l'accueil</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Finaliser la commande</h1>

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
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Commande confirmée !</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <div className="text-center">
                  <div className="spinner-border text-success mb-3" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                  <h4 className="text-success">Votre commande a été passée avec succès !</h4>
                  <p>Veuillez patienter pendant que nous traitons votre commande.</p>
                  <p>Le fournisseur recevra une notification automatiquement.</p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleCloseModal}>
                  Voir mes commandes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
