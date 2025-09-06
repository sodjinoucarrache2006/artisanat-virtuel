
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function SupplierDashboard() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [salesData, setSalesData] = useState([]);
  const [period, setPeriod] = useState('month');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    address: ''
  });
  const [supplierOrders, setSupplierOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [showPendingOrdersModal, setShowPendingOrdersModal] = useState(false);
  const [showDeliveredOrdersModal, setShowDeliveredOrdersModal] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);

  useEffect(() => {
    fetchProductsAndStats();
    fetchSupplierOrders();
    fetchSalesData();
    // Extract unique addresses from products for filtering
    if (products.length > 0) {
      const uniqueAddresses = [...new Set(products.map(p => p.address).filter(Boolean))];
      setAddresses(uniqueAddresses);
    }
    // Rafraîchir automatiquement les statistiques et commandes toutes les 30 secondes
    const interval = setInterval(() => {
      refreshStats();
      fetchSupplierOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, [products]);

  const fetchProductsAndStats = () => {
    // First fetch products
    api.get('/supplier/products')
      .then(productsResponse => {
        setProducts(productsResponse.data);
        // Then fetch stats with the correct product count
        return api.get('/supplier/order-stats').then(statsResponse => ({
          products: productsResponse.data,
          stats: statsResponse.data
        }));
      })
      .then(({ products: productsData, stats: statsData }) => {
        setStats({
          products_count: productsData.length,
          pending_orders: statsData.pending_orders,
          delivered_orders: statsData.delivered_orders
        });
      })
      .catch(error => {
        console.error('Erreur lors du chargement des données:', error);
        setStats({ products_count: 0, pending_orders: 0, delivered_orders: 0 });
      });
  };

  const refreshStats = () => {
    api.get('/supplier/order-stats')
      .then(response => {
        setStats(prevStats => ({
          ...prevStats,
          pending_orders: response.data.pending_orders,
          delivered_orders: response.data.delivered_orders
        }));
      })
      .catch(error => {
        console.error('Erreur lors du rafraîchissement des statistiques:', error);
      });
  };

  const fetchSalesData = (address = null) => {
    const params = new URLSearchParams({ period });
    if (address) {
      params.append('address', address);
    }
    api.get(`/supplier/sales-evolution?${params}`)
      .then(response => {
        setSalesData(response.data);
      })
      .catch(error => console.error(error));
  };

  const deleteProduct = (id) => {
    api.delete(`/supplier/products/${id}`)
      .then(() => {
        setProducts(products.filter(product => product.id !== id));
      })
      .catch(error => console.error(error));
  };

  const handleViewSales = () => {
    setSelectedAddress(null);
    fetchSalesData();
  };

  const handleAddressClick = (address) => {
    setSelectedAddress(address);
    fetchSalesData(address);
  };

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
    fetchSalesData(selectedAddress);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url || '',
      address: product.address || ''
    });
  };

  const handleAddProduct = () => {
    if (editingProduct) {
      // Update existing product
      api.put(`/supplier/products/${editingProduct.id}`, newProduct)
        .then(response => {
          setProducts(products.map(p => p.id === editingProduct.id ? response.data : p));
          setEditingProduct(null);
          setNewProduct({
            name: '',
            description: '',
            price: '',
            image_url: '',
            address: ''
          });
        })
        .catch(error => console.error(error));
    } else {
      // Add new product
      api.post('/supplier/products', newProduct)
        .then(response => {
          setProducts([...products, response.data]);
          setNewProduct({
            name: '',
            description: '',
            price: '',
            image_url: '',
            address: ''
          });
        })
        .catch(error => console.error(error));
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      image_url: '',
      address: ''
    });
  };

  const fetchSupplierOrders = () => {
    return api.get('/supplier/orders')
      .then(response => {
        console.log('Commandes du fournisseur:', response.data.length);
        if (!response.data || !Array.isArray(response.data)) {
          console.error('Format de données invalide pour les commandes:', response.data);
          setSupplierOrders([]);
          return [];
        }
        setSupplierOrders(response.data);
        return response.data;
      })
      .catch(error => {
        console.error('Erreur lors du chargement des commandes:', error);
        setSupplierOrders([]);
        return [];
      });
  };

  const showProducts = () => {
    setShowProductsModal(true);
  };

  const showPendingOrders = () => {
    // First fetch latest orders, then filter
    fetchSupplierOrders().then((orders) => {
      if (!orders || !Array.isArray(orders)) {
        console.error('Les données des commandes sont invalides:', orders);
        setPendingOrders([]);
        setShowPendingOrdersModal(true);
        return;
      }
      const pending = orders.filter(order => order.status === 'en cours');
      setPendingOrders(pending);
      setShowPendingOrdersModal(true);
    }).catch(error => {
      console.error('Erreur lors de la récupération des commandes:', error);
      setPendingOrders([]);
      setShowPendingOrdersModal(true);
    });
  };

  const showDeliveredOrders = () => {
    // First fetch latest orders, then filter
    fetchSupplierOrders().then((orders) => {
      if (!orders || !Array.isArray(orders)) {
        console.error('Les données des commandes sont invalides:', orders);
        setDeliveredOrders([]);
        setShowDeliveredOrdersModal(true);
        return;
      }
      const delivered = orders.filter(order => order.status === 'livrée');
      setDeliveredOrders(delivered);
      setShowDeliveredOrdersModal(true);
    }).catch(error => {
      console.error('Erreur lors de la récupération des commandes:', error);
      setDeliveredOrders([]);
      setShowDeliveredOrdersModal(true);
    });
  };

  const updateOrderStatus = (orderId, newStatus) => {
    api.put(`/supplier/orders/${orderId}/status`, { status: newStatus })
      .then(response => {
        // Update the order status in the local state
        const updatedOrder = response.data.order;
        setSupplierOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? updatedOrder : order
          )
        );

        // Update filtered lists dynamically
        if (newStatus === 'livrée') {
          // Remove from pending and add to delivered
          setPendingOrders(prevOrders =>
            prevOrders.filter(order => order.id !== orderId)
          );
          setDeliveredOrders(prevDelivered => [...prevDelivered, updatedOrder]);
        } else if (newStatus === 'en cours') {
          // Remove from delivered and add to pending
          setDeliveredOrders(prevDelivered =>
            prevDelivered.filter(order => order.id !== orderId)
          );
          setPendingOrders(prevPending => [...prevPending, updatedOrder]);
        }
        refreshStats();
        alert('Statut de la commande mis à jour avec succès');
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        alert('Erreur lors de la mise à jour du statut');
      });
  };



  return (
    <div className="container-fluid mt-4">
      {/* Header Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-2">Tableau de bord Fournisseur</h1>
              <p className="text-muted mb-0">Gérez vos produits et suivez vos ventes</p>
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
              <h6 className="card-subtitle mb-3 text-muted">Produits publiés</h6>
              <button className="btn btn-primary btn-sm w-100" onClick={showProducts}>
                <i className="fas fa-eye me-2"></i>Voir les produits
              </button>
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
              <h6 className="card-subtitle mb-3 text-muted">Commandes en cours</h6>
              <button className="btn btn-warning btn-sm w-100" onClick={showPendingOrders}>
                <i className="fas fa-list me-2"></i>Gérer les commandes
              </button>
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
              <h6 className="card-subtitle mb-3 text-muted">Commandes livrées</h6>
              <button className="btn btn-success btn-sm w-100" onClick={showDeliveredOrders}>
                <i className="fas fa-history me-2"></i>Voir l'historique
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Product Management Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-4">
              <h4 className="mb-0">
                <i className="fas fa-plus-circle text-primary me-2"></i>
                {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
              </h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Nom du produit</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Entrez le nom du produit"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      name="description"
                      placeholder="Décrivez votre produit"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      className="form-control"
                      rows="3"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Prix (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      placeholder="0.00"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">URL de l'image</label>
                    <input
                      type="url"
                      name="image_url"
                      placeholder="https://exemple.com/image.jpg"
                      value={newProduct.image_url}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Adresse</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Adresse de votre atelier"
                      value={newProduct.address}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="d-flex gap-2 mt-4">
                    <button className="btn btn-success flex-fill" onClick={handleAddProduct}>
                      <i className="fas fa-save me-2"></i>
                      {editingProduct ? 'Modifier le produit' : 'Ajouter le produit'}
                    </button>
                    {editingProduct && (
                      <button className="btn btn-secondary" onClick={handleCancelEdit}>
                        <i className="fas fa-times me-2"></i>Annuler
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Evolution Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-1">
                    <i className="fas fa-chart-line text-primary me-2"></i>Évolution des ventes
                  </h4>
                  <p className="text-muted mb-0">Analysez les performances de vos ventes</p>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" onClick={handleViewSales}>
                    <i className="fas fa-chart-bar me-2"></i>Ventes générales
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              {addresses.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-semibold mb-3">
                    <i className="fas fa-map-marker-alt text-muted me-2"></i>Filtrer par adresse
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {addresses.map(address => (
                      <button
                        key={address}
                        className={`btn btn-sm ${selectedAddress === address ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => handleAddressClick(address)}
                      >
                        <i className="fas fa-map-pin me-1"></i>{address}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {salesData.length > 0 ? (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">
                      Évolution des ventes {selectedAddress ? `pour ${selectedAddress}` : 'générales'}
                    </h5>
                    <div className="d-flex align-items-center gap-2">
                      <label htmlFor="period" className="form-label mb-0 fw-semibold">Période:</label>
                      <select id="period" className="form-select form-select-sm" value={period} onChange={handlePeriodChange} style={{ width: 'auto' }}>
                        <option value="day">Jour</option>
                        <option value="week">Semaine</option>
                        <option value="month">Mois</option>
                      </select>
                    </div>
                  </div>
                  <div className="chart-container" style={{ height: '400px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="period"
                          stroke="#6c757d"
                          fontSize={12}
                        />
                        <YAxis
                          stroke="#6c757d"
                          fontSize={12}
                          tickFormatter={(value) => `${value}€`}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}€`, 'Ventes']}
                          labelStyle={{ color: '#333' }}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #dee2e6',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="total_sales"
                          stroke="#0d6efd"
                          strokeWidth={3}
                          dot={{ fill: '#0d6efd', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#0d6efd', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-chart-line fa-4x text-muted mb-3"></i>
                  <h5 className="text-muted">Aucune donnée de vente disponible</h5>
                  <p className="text-muted">Les données de ventes apparaîtront ici une fois que vous aurez des commandes</p>
                </div>
              )}
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
                  <h4 className="mb-1">
                    <i className="fas fa-boxes text-primary me-2"></i>Gestion des produits
                  </h4>
                  <p className="text-muted mb-0">Modifiez ou supprimez vos produits existants</p>
                </div>
                <div className="text-muted">
                  <small>{products.length} produit{products.length > 1 ? 's' : ''}</small>
                </div>
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
                            <span className="badge bg-light text-dark">
                              <i className="fas fa-map-marker-alt me-1"></i>
                              {product.address || 'N/A'}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleEditProduct(product)}
                                title="Modifier"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                onClick={() => deleteProduct(product.id)}
                                className="btn btn-outline-danger btn-sm"
                                title="Supprimer"
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
                  <p className="text-muted">Commencez par ajouter votre premier produit ci-dessus</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Modal */}
      {showProductsModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Mes Produits</h5>
                <button type="button" className="btn-close" onClick={() => setShowProductsModal(false)}></button>
              </div>
              <div className="modal-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Prix</th>
                      <th>Adresse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.price} €</td>
                        <td>{product.address || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending Orders Modal */}
      {showPendingOrdersModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Commandes en Cours</h5>
                <button type="button" className="btn-close" onClick={() => setShowPendingOrdersModal(false)}></button>
              </div>
              <div className="modal-body">
                {pendingOrders.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID Commande</th>
                        <th>Client</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingOrders.map(order => {
                        const total = order.total || (order.orderProducts && Array.isArray(order.orderProducts)
                          ? order.orderProducts.reduce((sum, op) => sum + (op.unit_price * op.quantity), 0)
                          : 0);
                        const clientName = order.user && order.user.name ? order.user.name : 'N/A';
                        return (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{clientName}</td>
                            <td>{order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A'}</td>
                            <td>{total.toFixed(2)} €</td>
                            <td>
                              <button
                                className="btn btn-success btn-sm me-2"
                                onClick={() => updateOrderStatus(order.id, 'livrée')}
                              >
                                Valider Livraison
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p>Aucune commande en cours trouvée.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delivered Orders Modal */}
      {showDeliveredOrdersModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Commandes Livrées</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeliveredOrdersModal(false)}></button>
              </div>
              <div className="modal-body">
                {deliveredOrders.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID Commande</th>
                        <th>Client</th>
                        <th>Date</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveredOrders.map(order => {
                        const total = order.total || (order.orderProducts && Array.isArray(order.orderProducts)
                          ? order.orderProducts.reduce((sum, op) => sum + (op.unit_price * op.quantity), 0)
                          : 0);
                        const clientName = order.user && order.user.name ? order.user.name : 'N/A';
                        return (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{clientName}</td>
                            <td>{order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A'}</td>
                            <td>{total.toFixed(2)} €</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p>Aucune commande livrée trouvée.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupplierDashboard;
