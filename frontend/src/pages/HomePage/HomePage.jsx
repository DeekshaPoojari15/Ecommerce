import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>Welcome to RaptorMall</h1>
        <p>Shop smart. Ship fast. Save big.</p>
        <Link to="/products" className="browse-button">Browse Products</Link>
      </div>
      <section className="features">
        <div className="feature-card">
          <h3>Top Quality</h3>
          <p>Curated products from trusted brands.</p>
        </div>
        <div className="feature-card">
          <h3>Fast Delivery</h3>
          <p>Same-day dispatch for most products.</p>
        </div>
        <div className="feature-card">
          <h3>24/7 Support</h3>
          <p>We're here to help whenever you need us.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
