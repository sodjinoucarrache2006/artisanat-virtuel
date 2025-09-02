import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Try to get user info from API
          const response = await api.get('/user');
          setUser(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des infos utilisateur:', error);
          // Fallback: assume user is logged in but with generic name
          setUser({ name: 'Utilisateur', email: '' });
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-lg" style={{
      background: 'rgba(253, 246, 227, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(160, 82, 45, 0.2)'
    }}>
      <div className="container-fluid">
        {/* Logo and Brand */}
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{ textDecoration: 'none' }}>
          <img
            src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=50&h=50&fit=crop&crop=center"
            alt="Artisanat Virtuel Logo"
            className="rounded-circle me-3"
            style={{ width: '50px', height: '50px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)' }}
          />
          <div>
            <span className="fw-bold" style={{ fontSize: '1.5rem', letterSpacing: '1px', color: '#A0522D' }}>
              Artisanat Virtuel
            </span>
            <div className="small" style={{ fontSize: '0.8rem', marginTop: '-5px', color: '#9CAF88' }}>
              L'art de l'excellence
            </div>
          </div>
        </Link>

        {/* Mobile menu button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link
                className="nav-link fw-semibold px-3 py-2 mx-1 rounded-pill"
                to="/"
                style={{
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  color: '#A0522D'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(160, 82, 45, 0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <i className="fas fa-home me-2"></i>Accueil
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link fw-semibold px-3 py-2 mx-1 rounded-pill"
                to="/cart"
                style={{
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  color: '#A0522D'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(160, 82, 45, 0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <i className="fas fa-shopping-cart me-2"></i>Panier
              </Link>
            </li>

            {user ? (
              <>
                {/* Message de bienvenue */}
                <li className="nav-item d-none d-lg-block">
                  <span className="navbar-text me-3" style={{ color: '#9CAF88', fontSize: '0.9rem' }}>
                    <i className="fas fa-handshake me-1"></i>
                    Bienvenue, <strong style={{ color: '#A0522D' }}>{user.name}</strong>
                  </span>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle fw-semibold px-3 py-2 mx-1 rounded-pill"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      color: '#A0522D'
                    }}
                  >
                    <i className="fas fa-user me-2"></i>{user.name}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0" aria-labelledby="userDropdown">
                    <li><h6 className="dropdown-header" style={{ color: '#A0522D' }}>Mon Compte</h6></li>
                    <li><Link className="dropdown-item" to="/orders">
                      <i className="fas fa-history me-2"></i>Historique des Commandes
                      <span className="badge bg-primary ms-2">Accès rapide</span>
                    </Link></li>
                    <li><Link className="dropdown-item" to="/cart">
                      <i className="fas fa-shopping-cart me-2"></i>Mon Panier
                    </Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item text-danger" href="#" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>Déconnexion
                    </a></li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link fw-semibold px-3 py-2 mx-1 rounded-pill"
                    to="/login"
                    style={{
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      color: '#A0522D'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(160, 82, 45, 0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>Connexion
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn fw-semibold px-4 py-2 mx-1 rounded-pill"
                    to="/register"
                    style={{
                      transition: 'all 0.3s ease',
                      backgroundColor: '#DAA520',
                      borderColor: '#DAA520',
                      color: 'white',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#C8961A';
                      e.target.style.borderColor = '#C8961A';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#DAA520';
                      e.target.style.borderColor = '#DAA520';
                    }}
                  >
                    <i className="fas fa-user-plus me-2"></i>Inscription
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
