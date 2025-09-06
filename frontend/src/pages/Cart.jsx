import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/cart');
      const items = response.data.items.map(item => ({
        id: item.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        product_id: item.product.id,
        image_url: item.product.image_url,
        address: item.product.address
      }));
      setCartItems(items);
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await api.put(`/cart/update/${id}`, { quantity });
      setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity } : item));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/cart/remove/${id}`);
      setCartItems(cartItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="container-fluid py-5" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200")',
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

  return (
    <div style={{
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      padding: '80px 0'
    }}>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg" style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="card-header bg-white border-0 py-4">
                <div className="d-flex align-items-center">
                  <i className="fas fa-shopping-cart text-primary me-3 fs-4"></i>
                  <div>
                    <h1 className="mb-1">Votre Panier</h1>
                    <p className="text-muted mb-0">
                      {cartItems.length} article{cartItems.length > 1 ? 's' : ''} dans votre panier
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-body p-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
                    <h3 className="text-muted mb-3">Votre panier est vide</h3>
                    <p className="text-muted mb-4">Découvrez nos produits artisanaux uniques</p>
                    <Link to="/" className="btn btn-primary btn-lg px-4 py-3" style={{ borderRadius: '25px' }}>
                      <i className="fas fa-store me-2"></i>Explorer les produits
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="cart-items">
                      {cartItems.map(item => (
                        <div key={item.id} className="card mb-3 border-0 shadow-sm" style={{
                          background: 'rgba(248, 249, 250, 0.8)',
                          backdropFilter: 'blur(5px)'
                        }}>
                          <div className="card-body p-4">
                            <div className="row align-items-center">
                              <div className="col-md-2">
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="img-fluid rounded shadow-sm"
                                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                              </div>
                              <div className="col-md-4">
                                <h5 className="mb-1">{item.name}</h5>
                                <small className="text-muted">
                                  <i className="fas fa-map-marker-alt me-1"></i>
                                  {item.address || 'Adresse non spécifiée'}
                                </small>
                              </div>
                              <div className="col-md-2">
                                <span className="fw-bold text-primary fs-5">{item.price} €</span>
                              </div>
                              <div className="col-md-2">
                                <div className="d-flex align-items-center">
                                  <label htmlFor={`quantity-${item.id}`} className="me-2 mb-0 fw-semibold">Qté:</label>
                                  <input
                                    id={`quantity-${item.id}`}
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                                    className="form-control form-control-sm"
                                    style={{ width: '70px' }}
                                  />
                                </div>
                              </div>
                              <div className="col-md-2 text-end">
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="btn btn-outline-danger btn-sm"
                                  title="Supprimer"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="card border-0 shadow-sm mt-4" style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white'
                    }}>
                      <div className="card-body p-4">
                        <div className="row align-items-center">
                          <div className="col-md-8">
                            <h4 className="mb-0">Total de la commande</h4>
                            <small className="opacity-75">TVA incluse</small>
                          </div>
                          <div className="col-md-4 text-end">
                            <h2 className="mb-0 fw-bold">{total.toFixed(2)} €</h2>
                            <Link
                              to="/checkout"
                              className="btn btn-light btn-lg mt-3 px-4 py-3"
                              style={{ borderRadius: '25px' }}
                            >
                              <i className="fas fa-credit-card me-2"></i>Passer la commande
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
