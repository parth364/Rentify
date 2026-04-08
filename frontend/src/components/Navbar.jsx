import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Plus, MessageCircle, Package, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

/**
 * Navbar — top navigation bar with Rentify branding, nav links, and auth actions.
 * Adapts to authenticated vs. guest state.
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" id="navbar-brand">
          <div className="navbar-logo">R</div>
          <span>Rentify</span>
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="navbar-link" onClick={() => setMenuOpen(false)}>
            Browse
          </Link>

          {user ? (
            <>
              <Link to="/items/new" className="navbar-link" onClick={() => setMenuOpen(false)}>
                <Plus size={18} />
                List Item
              </Link>
              <Link to="/rentals" className="navbar-link" onClick={() => setMenuOpen(false)}>
                <Package size={18} />
                Rentals
              </Link>
              <Link to="/chat" className="navbar-link" onClick={() => setMenuOpen(false)}>
                <MessageCircle size={18} />
                Chat
              </Link>
              <Link to="/profile" className="navbar-link" onClick={() => setMenuOpen(false)}>
                <User size={18} />
                Profile
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout} id="logout-btn">
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <div className="navbar-auth">
              <Link
                to="/login"
                className="btn btn-ghost btn-sm"
                onClick={() => setMenuOpen(false)}
                id="login-btn"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm"
                onClick={() => setMenuOpen(false)}
                id="register-btn"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
