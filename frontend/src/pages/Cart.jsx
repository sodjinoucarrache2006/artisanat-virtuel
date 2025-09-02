import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartItems([]);
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
        setCartItems([]);
      });
  }, []);

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    api.put(`/cart/update/${id}`, { quantity })
      .then(() => {
        setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity } : item));
      })
      .catch(error => console.error(error));
  };

  const removeItem = (id) => {
    api.delete(`/cart/remove/${id}`)
      .then(() => {
        setCartItems(cartItems.filter(item => item.id !== id));
      })
      .catch(error => console.error(error));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Votre Panier</h1>
      {cartItems.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <div className="list-group">
          {cartItems.map(item => (
            <div key={item.id} className="list-group-item d-flex align-items-center rounded shadow-sm mb-3">
              <img src={item.image_url} alt={item.name} className="img-thumbnail me-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              <div className="flex-grow-1">
                <h5>{item.name}</h5>
                <p className="mb-1">{item.price} €</p>
                <div className="d-flex align-items-center">
                  <label htmlFor={`quantity-${item.id}`} className="me-2 mb-0">Quantité:</label>
                  <input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                    className="form-control"
                    style={{ width: '80px' }}
                  />
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} className="btn btn-danger ms-3">Supprimer</button>
            </div>
          ))}
          <div className="d-flex justify-content-between align-items-center p-3 border rounded shadow-sm">
            <h4>Total: {total.toFixed(2)} €</h4>
            <Link to="/checkout" className="btn btn-primary btn-lg">Passer la commande</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
