import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get('/admin/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
    // TODO: Implement stats endpoint in backend
    setStats({ products_count: 0, pending_orders: 0, delivered_orders: 0 });
  }, []);

  const deleteProduct = (id) => {
    api.delete(`/admin/products/${id}`)
      .then(() => {
        setProducts(products.filter(product => product.id !== id));
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="container mt-5">
      <h1>Tableau de bord Admin</h1>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>Produits publiés</h5>
              <p>{stats.products_count}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>Commandes en cours</h5>
              <p>{stats.pending_orders}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>Commandes livrées</h5>
              <p>{stats.delivered_orders}</p>
            </div>
          </div>
        </div>
      </div>
      <h2>Gestion des produits</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prix</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price} €</td>
              <td>
                <button className="btn btn-warning me-2">Modifier</button>
                <button onClick={() => deleteProduct(product.id)} className="btn btn-danger">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
