
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
    <div className="container mt-5">
      <h1>Tableau de bord Fournisseur</h1>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>Produits publiés</h5>
              <p>{stats.products_count}</p>
              <button className="btn btn-primary btn-sm" onClick={showProducts}>Voir</button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>Commandes en cours</h5>
              <p>{stats.pending_orders}</p>
              <button className="btn btn-warning btn-sm" onClick={showPendingOrders}>Voir</button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>Commandes livrées</h5>
              <p>{stats.delivered_orders}</p>
              <button className="btn btn-success btn-sm" onClick={showDeliveredOrders}>Voir</button>
            </div>
          </div>
        </div>
      </div>
      <h2>{editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}</h2>
      <div className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Nom"
          value={newProduct.name}
          onChange={handleInputChange}
          className="form-control mb-2"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleInputChange}
          className="form-control mb-2"
        />
        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Prix"
          value={newProduct.price}
          onChange={handleInputChange}
          className="form-control mb-2"
        />
        <input
          type="text"
          name="image_url"
          placeholder="URL de l'image"
          value={newProduct.image_url}
          onChange={handleInputChange}
          className="form-control mb-2"
        />
        <input
          type="text"
          name="address"
          placeholder="Adresse"
          value={newProduct.address}
          onChange={handleInputChange}
          className="form-control mb-2"
        />
        <button className="btn btn-success me-2" onClick={handleAddProduct}>
          {editingProduct ? 'Modifier le produit' : 'Ajouter le produit'}
        </button>
        {editingProduct && (
          <button className="btn btn-secondary" onClick={handleCancelEdit}>Annuler</button>
        )}
      </div>

      <h2>Évolution des ventes</h2>
      <div className="mb-4">
        <button className="btn btn-primary me-2" onClick={handleViewSales}>
          Voir l'évolution des ventes générales
        </button>
        {addresses.length > 0 && (
          <div className="mt-3">
            <h5>Filtrer par adresse :</h5>
            <div className="d-flex flex-wrap">
              {addresses.map(address => (
                <button
                  key={address}
                  className={`btn me-2 mb-2 ${selectedAddress === address ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => handleAddressClick(address)}
                >
                  {address}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {salesData.length > 0 && (
        <div className="mb-4">
          <h3>
            Évolution des ventes {selectedAddress ? `pour ${selectedAddress}` : 'générales'}
          </h3>
          <div className="mb-3">
            <label htmlFor="period" className="form-label">Période</label>
            <select id="period" className="form-select" value={period} onChange={handlePeriodChange}>
              <option value="day">Jour</option>
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total_sales" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}



      <h2>Gestion des produits</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prix</th>
            <th>Adresse</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price} €</td>
              <td>{product.address || 'N/A'}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => handleEditProduct(product)}>Modifier</button>
                <button onClick={() => deleteProduct(product.id)} className="btn btn-danger">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
