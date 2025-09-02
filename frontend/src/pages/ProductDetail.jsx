import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(response => setProduct(response.data))
      .catch(error => console.error(error));
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

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img src={product.image_url} className="img-fluid" alt={product.name} />
        </div>
        <div className="col-md-6">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p>Prix: {product.price} €</p>
          <button onClick={addToCart} className="btn btn-primary">Ajouter au panier</button>
          <Link to="/" className="btn btn-secondary ms-2">Retour</Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
