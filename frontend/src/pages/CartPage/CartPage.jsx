import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  useEffect(() => {
    fetchCart();
  }, [token]);

  const getImages = (product) => {
    if (product.images && product.images.length) return product.images.slice(0, 5);
    return Array.from({ length: 5 }).map((_, i) => `https://picsum.photos/seed/${product._id}-${i + 1}/500/500`);
  };

  const fetchCart = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cart');
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    setMessage('');

    try {
      const { data } = await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(data.data);
      setMessage('Item removed from cart.');
      try { window.dispatchEvent(new CustomEvent('cart:updated')); } catch(e){}
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not remove item.');
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setMessage('');

    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/cart/${productId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCart(data.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not update quantity.');
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      setMessage('Your cart is empty.');
      return;
    }

    if (!address.street || !address.city || !address.state || !address.zipCode || !address.country) {
      setMessage('Please fill in all shipping address fields.');
      return;
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    try {
      await axios.post(
        'http://localhost:5000/api/orders/',
        {
          items: orderItems,
          shippingAddress: address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await axios.delete('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart({ ...cart, items: [], totalPrice: 0 });
      try { window.dispatchEvent(new CustomEvent('cart:updated')); } catch(e){}
      setMessage('✅ Order created successfully! Your cart is now empty.');
      setAddress({ street: '', city: '', state: '', zipCode: '', country: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Checkout failed. Please try again.');
    }
  };

  const handleClearCart = async () => {
    setMessage('');
    try {
      await axios.delete('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart({ items: [], totalPrice: 0 });
      try { window.dispatchEvent(new CustomEvent('cart:updated')); } catch(e){}
      setMessage('Cart cleared.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not clear cart.');
    }
  };

  if (loading) return <h2 className="status">Loading cart...</h2>;
  if (error) return <h2 className="status error">⚠️ {error}</h2>;

  const totalPrice = cart?.totalPrice || (cart?.items?.reduce((total, item) => total + item.product.price * item.quantity, 0) || 0);

  return (
    <div className="cart-container">
      <h1 className="cart-title">🛒 Your Shopping Cart</h1>

      {message && (
        <div className={`cart-message ${message.includes('✅') ? 'success' : 'info'}`}>
          {message}
        </div>
      )}

      {!cart || cart.items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <a href="/products" className="btn-continue-shopping">
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="cart-content">
          {/* Cart Items Section */}
          <div className="cart-items-section">
            <h2>Items in Cart ({cart.items.length})</h2>
            <div className="cart-items">
              {cart.items.map((item) => (
                <div className="cart-item" key={item.product._id} onClick={() => navigate(`/product/${item.product._id}`)} style={{ cursor: 'pointer' }}>
                  <div className="item-image-wrapper">
                    <img
                      src={getImages(item.product)[0]}
                      alt={item.product.name}
                      className="item-image"
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/seed/${item.product._id}/150/150`;
                      }}
                    />
                  </div>

                  <div className="item-details">
                    <h3 className="item-name">{item.product.name}</h3>
                    <p className="item-category">{item.product.category}</p>
                    <p className="item-price">₹{item.product.price}</p>
                    {item.product.stock && <p className="item-stock">Stock: {item.product.stock}</p>}
                  </div>

                  <div className="quantity-control" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="qty-input"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        if (val > 0) handleQuantityChange(item.product._id, val);
                      }}
                      min="1"
                    />
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-subtotal">
                    <p>₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <button className="btn-remove" onClick={(e) => { e.stopPropagation(); handleRemove(item.product._id); }}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Section */}
          <div className="checkout-section">
            {/* Cart Summary */}
            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Address Form */}
            <div className="shipping-form">
              <h2>Shipping Address</h2>
              <input
                type="text"
                placeholder="Street Address"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Zip Code"
                value={address.zipCode}
                onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Country"
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Checkout Button */}
            <button className="btn-checkout" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            <a href="/products" className="btn-continue-shopping-link">
              Continue Shopping
            </a>
            <button className="btn-clear" onClick={handleClearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;