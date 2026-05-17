import React, { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import "./ProductsPage.css";

const ProductsPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [previewIndex, setPreviewIndex] = useState({});

  const getImages = (product) => {
    if (product.images && product.images.length) return product.images.slice(0, 5);
    // generate up to 5 real images using picsum with product id seed
    return Array.from({ length: 5 }).map((_, i) => `https://picsum.photos/seed/${product._id}-${i + 1}/500/500`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products/");
        setProducts(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const fetchCart = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(data.data?.items || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();

    const handleCartUpdate = () => {
      fetchCart();
    };
    window.addEventListener('cart:updated', handleCartUpdate);
    return () => window.removeEventListener('cart:updated', handleCartUpdate);
  }, [token]);

  const handleAddToCart = async (productId) => {
    if (!token) {
      navigate('/login');
      return;
    }

    setMessage("");

    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Product added to cart.");
      // refresh global cart count and local cart
      fetchCart();
      try { const event = new CustomEvent('cart:updated'); window.dispatchEvent(event); } catch(e){}
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not add product to cart.");
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.put(
        `http://localhost:5000/api/cart/${productId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCart();
      try { window.dispatchEvent(new CustomEvent('cart:updated')); } catch(e){}
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not update quantity.");
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCart();
      try { window.dispatchEvent(new CustomEvent('cart:updated')); } catch(e){}
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not remove item.");
    }
  };

  const getCartItemQuantity = (productId) => {
    const item = cart.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  if (loading) return <h2 className="status">Loading...</h2>;
  if (error) return <h2 className="status error">{error}</h2>;

  return (
    <div className="products-container">
      <h1 className="title">Our Products</h1>
      {message && <p className="status info">{message}</p>}

      <div className="products-grid">
        {products.map((product) => {
          const images = getImages(product);
          const active = previewIndex[product._id] ?? 0;
          return (
            <div className="product-card" key={product._id}>
              <div className="product-image-wrap">
                  <Link to={`/product/${product._id}`}>
                    <img src={images[active]} alt={product.name} className="product-image" />
                  </Link>
                  <div className="product-thumbs">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${product.name}-${idx}`}
                      className={`thumb ${idx === active ? 'active' : ''}`}
                      onMouseEnter={() => setPreviewIndex((s) => ({ ...s, [product._id]: idx }))}
                      onClick={() => setPreviewIndex((s) => ({ ...s, [product._id]: idx }))}
                    />
                  ))}
                </div>
              </div>

              <h3><Link to={`/product/${product._id}`}>{product.name}</Link></h3>
              <p className="price">₹{product.price}</p>
              <p className="desc">{product.description}</p>

              {getCartItemQuantity(product._id) === 0 ? (
                <button className="btn" onClick={() => handleAddToCart(product._id)}>
                  Add to Cart
                </button>
              ) : (
                <div className="cart-controls">
                  <button className="qty-minus" onClick={() => handleQuantityChange(product._id, getCartItemQuantity(product._id) - 1)}>−</button>
                  <span className="qty-display">{getCartItemQuantity(product._id)}</span>
                  <button className="qty-plus" onClick={() => handleQuantityChange(product._id, getCartItemQuantity(product._id) + 1)}>+</button>
                  <button className="qty-delete" onClick={() => handleRemoveFromCart(product._id)}>🗑️</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsPage;