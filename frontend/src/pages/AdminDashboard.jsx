import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsResponse, statsResponse] = await Promise.all([
        api.get('/admin/products'),
        api.get('/admin/stats') // Assuming this endpoint exists
      ]);

      setProducts(productsResponse.data);
      setStats(statsResponse.data || {
        products_count: productsResponse.data.length,
        pending_orders: 0,
        delivered_orders: 0
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setStats({ products_count: 0, pending_orders: 0, delivered_orders: 0 });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await api.delete(`/admin/products/${id}`);
        setProducts(products.filter(product => product.id !== id));
        // Update stats
        setStats(prev => ({ ...prev, products_count: prev.products_count - 1 }));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du produit');
      }
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      {/* Header Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-2">Tableau de bord Administrateur</h1>
              <p className="text-muted mb-0">Gérez les produits et suivez les statistiques</p>
            </div>
            <div className="text-end">
              <small className="text-muted">Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-5">
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="fas fa-box fa-3x text-primary"></i>
              </div>
              <h2 className="card-title mb-2">{stats.products_count}</h2>
              <h6 className="card-subtitle mb-2 text-muted">Produits publiés</h6>
              <div className="progress mt-3" style={{ height: '6px' }}>
                <div className="progress-bar bg-primary" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="fas fa-clock fa-3x text-warning"></i>
              </div>
              <h2 className="card-title mb-2">{stats.pending_orders}</h2>
              <h6 className="card-subtitle mb-2 text-muted">Commandes en cours</h6>
              <div className="progress mt-3" style={{ height: '6px' }}>
                <div className="progress-bar bg-warning" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="fas fa-check-circle fa-3x text-success"></i>
              </div>
              <h2 className="card-title mb-2">{stats.delivered_orders}</h2>
              <h6 className="card-subtitle mb-2 text-muted">Commandes livrées</h6>
              <div className="progress mt-3" style={{ height: '6px' }}>
                <div className="progress-bar bg-success" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Management Section */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-1">Gestion des produits</h4>
                  <p className="text-muted mb-0">Modifiez ou supprimez les produits existants</p>
                </div>
                <button className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>Ajouter un produit
                </button>
              </div>
            </div>
            <div className="card-body">
              {products.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 fw-semibold">Produit</th>
                        <th className="border-0 fw-semibold">Prix</th>
                        <th className="border-0 fw-semibold">Adresse</th>
                        <th className="border-0 fw-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id} className="align-middle">
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={product.image_url || '/placeholder.jpg'}
                                alt={product.name}
                                className="rounded me-3"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                              <div>
                                <h6 className="mb-0">{product.name}</h6>
                                <small className="text-muted">{product.description?.substring(0, 50)}...</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="fw-semibold text-primary">{product.price} €</span>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">{product.address || 'N/A'}</span>
                          </td>
                          <td className="text-center">
                            <div className="btn-group" role="group">
                              <button className="btn btn-outline-primary btn-sm">
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                onClick={() => deleteProduct(product.id)}
                                className="btn btn-outline-danger btn-sm"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-box-open fa-4x text-muted mb-3"></i>
                  <h5 className="text-muted">Aucun produit trouvé</h5>
                  <p className="text-muted">Commencez par ajouter votre premier produit</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
