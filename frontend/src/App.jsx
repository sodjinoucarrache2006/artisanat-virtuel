import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderHistory from './pages/OrderHistory'
import AdminDashboard from './pages/AdminDashboard'
import SupplierDashboard from './pages/SupplierDashboard'
import './App.css'

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/supplier" element={<SupplierDashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column" style={{
        minHeight: '100vh',
        backgroundColor: '#FDF6E3',
        color: '#3E3E3E',
      }}>
        <Navbar />
        <main className="flex-grow-1 container py-4">
          <AnimatedRoutes />
        </main>

        {/* Footer */}
        <footer className="bg-primary text-white py-4 mt-auto">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <h5>Artisanat Virtuel</h5>
                <p className="mb-0">Découvrez l'artisanat authentique et les produits uniques de nos créateurs.</p>
              </div>
              <div className="col-md-4">
                <h5>Liens utiles</h5>
                <ul className="list-unstyled">
                  <li><a href="#" className="text-white-50">À propos</a></li>
                  <li><a href="#" className="text-white-50">Contact</a></li>
                  <li><a href="#" className="text-white-50">Conditions générales</a></li>
                </ul>
              </div>
              <div className="col-md-4">
                <h5>Suivez-nous</h5>
                <div>
                  <a href="#" className="text-white-50 me-3"><i className="fab fa-facebook-f"></i></a>
                  <a href="#" className="text-white-50 me-3"><i className="fab fa-instagram"></i></a>
                  <a href="#" className="text-white-50 me-3"><i className="fab fa-twitter"></i></a>
                </div>
              </div>
            </div>
            <hr className="my-3 border-white-50" />
            <div className="text-center">
              <small>&copy; 2024 Artisanat Virtuel. Tous droits réservés.</small>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
