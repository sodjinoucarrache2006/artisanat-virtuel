import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vous devez être connecté pour voir vos commandes.');
          setLoading(false);
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const response = await api.get('/orders');
        setOrders(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
        if (error.response?.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.');
          localStorage.removeItem('token');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError('Erreur lors du chargement des commandes. Veuillez réessayer.');
        }
        setOrders([]);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const calculateTotal = (orderProducts) => {
    if (!orderProducts || !Array.isArray(orderProducts)) return 0;
    return orderProducts.reduce((total, op) => {
      const price = parseFloat(op.unit_price || op.price || 0);
      const quantity = parseInt(op.quantity || 1);
      return total + (price * quantity);
    }, 0);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.')) {
      return;
    }

    try {
      await api.delete(`/orders/${orderId}`);
      // Refresh the orders list
      const response = await api.get('/orders');
      setOrders(response.data || []);
    } catch (error) {
      console.error('Erreur lors de la suppression de la commande:', error);
      alert('Erreur lors de la suppression de la commande. Veuillez réessayer.');
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3" style={{ color: '#3E3E3E' }}>Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Erreur</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <button
              className="btn btn-primary me-2"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Retour à l'accueil
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-center mb-4" style={{ color: '#A0522D' }}>
          Historique des commandes
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-5">
            <div className="card">
              <div className="card-body py-5">
                <i className="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                <h4 style={{ color: '#3E3E3E' }}>Aucune commande trouvée</h4>
                <p className="text-muted">Vous n'avez pas encore passé de commande.</p>
                <button
                  className="btn mt-3"
                  style={{ backgroundColor: '#DAA520', borderColor: '#DAA520', color: 'white' }}
                  onClick={() => navigate('/')}
                >
                  Commencer vos achats
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                className="col-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <div className="card shadow-sm">
                  <div className="card-header" style={{ backgroundColor: '#9CAF88', color: 'white' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Commande #{order.id}</h5>
                      <div className="d-flex align-items-center">
                        <span className={`badge me-2 ${order.status === 'livrée' ? 'bg-success' : order.status === 'en cours' ? 'bg-warning' : 'bg-secondary'}`}>
                          {order.status === 'livrée' ? 'Terminée' : order.status === 'en cours' ? 'En cours' : order.status}
                        </span>
                        {order.status === 'livrée' && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteOrder(order.id)}
                            title="Supprimer cette commande"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-2">
                          <strong style={{ color: '#A0522D' }}>Date:</strong>{' '}
                          {order.order_date ? new Date(order.order_date).toLocaleDateString('fr-FR') : 'N/A'}
                        </p>
                        <p className="mb-2">
                          <strong style={{ color: '#A0522D' }}>Statut:</strong>{' '}
                          <span className={`badge ${order.status === 'completed' ? 'bg-success' : order.status === 'pending' ? 'bg-warning' : 'bg-secondary'}`}>
                            {order.status === 'completed' ? 'Terminée' : order.status === 'pending' ? 'En cours' : order.status}
                          </span>
                        </p>
                      </div>
                      <div className="col-md-6 text-end">
                        <h4 style={{ color: '#A0522D' }}>
                          Total: {(order.total || calculateTotal(order.orderProducts)).toFixed(2)} €
                        </h4>
                      </div>
                    </div>

                    {order.orderProducts && order.orderProducts.length > 0 && (
                      <div className="mt-3">
                        <h6 style={{ color: '#A0522D' }}>Produits commandés:</h6>
                        <div className="table-responsive">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Produit</th>
                                <th className="text-center">Quantité</th>
                                <th className="text-end">Prix</th>
                                <th className="text-end">Sous-total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.orderProducts.map((product, idx) => (
                                <tr key={idx}>
                                  <td>{product.product?.name || product.name || 'Produit inconnu'}</td>
                                  <td className="text-center">{product.quantity || 1}</td>
                                  <td className="text-end">{(parseFloat(product.unit_price || product.price || 0)).toFixed(2)} €</td>
                                  <td className="text-end">
                                    {((parseFloat(product.unit_price || product.price || 0)) * (parseInt(product.quantity || 1))).toFixed(2)} €
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default OrderHistory;
