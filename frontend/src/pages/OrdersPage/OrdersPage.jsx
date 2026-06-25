import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import "./OrdersPage.css";

const OrdersPage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getOrderImages = (product) => {
    if (!product) return Array.from({ length: 5 }).map((_, i) => `https://picsum.photos/seed/unknown-${i + 1}/500/500`);
    if (product.images && product.images.length) return product.images.slice(0, 5);
    return Array.from({ length: 5 }).map((_, i) => `https://picsum.photos/seed/${product._id}-${i + 1}/500/500`);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/orders/myorders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) return <h2 className="status">Loading...</h2>;
  if (error) return <h2 className="status error">{error}</h2>;

  return (
    <div className="orders-container">
      <h1 className="title">Your Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet. Place an order from your cart.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <div>
                  <h3>Order #{order._id?.slice(-8) || 'Unknown'}</h3>
                  <p className="order-date">📅 {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown date'}</p>
                </div>
                <div className="order-badges">
                  <span className={`badge status-${(order.orderStatus || 'unknown').toLowerCase()}`}>{order.orderStatus || 'Unknown'}</span>
                  <span className={`badge payment-${(order.paymentStatus || 'unknown').toLowerCase()}`}>{order.paymentStatus || 'Unknown'}</span>
                </div>
              </div>
              <div className="order-summary">
                <p className="order-total">💰 Total: <strong>₹{order.totalPrice?.toFixed(2) || '0.00'}</strong></p>
              </div>

              <div className="order-items-label">Items in Order</div>
              <div className="order-items">
                {(order.items || []).map((item, index) => {
                  const product = item.product || {};
                  return (
                    <div
                      className="order-item"
                      key={product._id || index}
                      onClick={() => product._id && navigate(`/product/${product._id}`)}
                    >
                      <img
                        src={getOrderImages(product)[0] || 'https://via.placeholder.com/100'}
                        alt={product.name || 'Product image'}
                        className="order-item-image"
                        onError={(e) => {
                          e.currentTarget.src = `https://picsum.photos/seed/${product._id || 'unknown'}/150/150`;
                        }}
                      />
                      <div className="order-item-info">
                        <p className="order-item-name">{product.name || 'Unknown product'}</p>
                        <p className="order-item-details">Qty: {item.quantity} × ₹{item.price?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div className="order-item-total">₹{((item.price || 0) * item.quantity).toFixed(2)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;