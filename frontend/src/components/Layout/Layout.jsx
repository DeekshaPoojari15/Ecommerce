import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { count: cartCount } = useContext(CartContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-brand">
          <Link to="/">Ecommerce</Link>
        </div>
        <nav className="layout-nav">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart" className="cart-link">
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <Link to="/orders">Orders</Link>
          {isAuthenticated ? (
            <>
              <span className="layout-user">Hi, {user?.name || 'Customer'}</span>
              <button type="button" className="layout-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
      <main className="layout-content">{children}</main>
      <footer className="layout-footer">&copy; {new Date().getFullYear()} Ecommerce</footer>
    </div>
  );
};

export default Layout;
