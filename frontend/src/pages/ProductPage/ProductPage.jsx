import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [active, setActive] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const fetchCart = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(data.data?.items || []);
    } catch (err) {
      console.error('Failed to load cart', err);
    }
  };

  useEffect(() => {
    fetchCart();
    const handleCartUpdate = () => fetchCart();
    window.addEventListener('cart:updated', handleCartUpdate);
    return () => window.removeEventListener('cart:updated', handleCartUpdate);
  }, [token]);

  const getImages = (product) => {
    if (!product) return [];
    if (product.images && product.images.length) return product.images.slice(0,5);
    return Array.from({ length: 5 }).map((_, i) => `https://picsum.photos/seed/${product._id}-${i+1}/800/800`);
  };

  const handlePrevImage = () => {
    const images = getImages(product);
    setActive(active === 0 ? images.length - 1 : active - 1);
  };

  const handleNextImage = () => {
    const images = getImages(product);
    setActive(active === images.length - 1 ? 0 : active + 1);
  };

  const getProductSpecs = (product) => {
    return [
      { label: 'Category', value: product.category },
      { label: 'Stock Available', value: `${product.stock} units` },
      { label: 'Rating', value: `${product.rating}/5 (${product.reviews} reviews)` },
      { label: 'SKU', value: product.sku || 'N/A' },
      { label: 'Tags', value: product.tags?.join(', ') || 'None' },
    ];
  };

  const getCartItemQuantity = () => {
    const item = cart.find((entry) => entry.product._id === product?._id);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = async () => {
    if (!token) return navigate('/login');
    try {
      await axios.post(
        'http://localhost:5000/api/cart',
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
      window.dispatchEvent(new CustomEvent('cart:updated'));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add to cart');
    }
  };

  const handleQuantityChange = async (newQuantity) => {
    if (!token) return navigate('/login');
    if (newQuantity < 1) {
      return await handleRemoveFromCart();
    }
    try {
      await axios.put(
        `http://localhost:5000/api/cart/${product._id}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
      window.dispatchEvent(new CustomEvent('cart:updated'));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update cart quantity');
    }
  };

  const handleRemoveFromCart = async () => {
    if (!token) return navigate('/login');
    try {
      await axios.delete(`http://localhost:5000/api/cart/${product._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCart();
      window.dispatchEvent(new CustomEvent('cart:updated'));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not remove item from cart');
    }
  };

  if (loading) return <h2 className="status">Loading...</h2>;
  if (error) return <h2 className="status error">{error}</h2>;

  const images = getImages(product);
  const specs = getProductSpecs(product);

  return (
    <div className="product-page">
      <button className="back-arrow-fixed" onClick={() => navigate(-1)}>←</button>

      <div className="gallery">
        <div className="image-container">
          <button className="nav-arrow prev" onClick={handlePrevImage}>❮</button>
          <img src={images[active]} alt={product.name} className="main-image" />
          <button className="nav-arrow next" onClick={handleNextImage}>❯</button>
          <span className="image-counter">{active + 1}/{images.length}</span>
        </div>
        <div className="thumbs">
          {images.map((img, idx) => (
            <img key={idx} src={img} className={`thumb ${idx===active?'active':''}`} onMouseEnter={() => setActive(idx)} onClick={() => setActive(idx)} alt={`${product.name}-${idx}`} />
          ))}
        </div>
      </div>

      <div className="details">
        <h1>{product.name}</h1>
        <p className="price">₹{product.price}</p>
        <p className="stock-status">{product.stock>0?`✓ In stock (${product.stock} units)`:'✗ Out of stock'}</p>

        <div className="description-section">
          <h2>Description</h2>
          <p className="desc">{product.description}</p>
          <p className="extended-desc">This premium product is carefully crafted with attention to detail and quality. Each unit undergoes rigorous quality control to ensure it meets our high standards. Whether you're a beginner or an experienced user, this product offers excellent value for money.</p>
          <p className="features-title"><strong>Key Features:</strong></p>
          <ul className="features-list">
            <li>High-quality materials and durable construction</li>
            <li>Easy to use and maintain</li>
            <li>Exceptional performance and reliability</li>
            <li>Comprehensive warranty support</li>
            <li>Professional-grade design</li>
          </ul>
        </div>

        <div className="specs-section">
          <h2>Specifications</h2>
          <ul className="specs-list">
            {specs.map((spec, idx) => (
              <li key={idx}>
                <strong>{spec.label}:</strong> {spec.value}
              </li>
            ))}
          </ul>
        </div>

        <div className="actions">
          {getCartItemQuantity() === 0 ? (
            <button className="btn small" onClick={handleAddToCart}>Add to Cart</button>
          ) : (
            <div className="cart-controls">
              <button className="qty-minus" onClick={() => handleQuantityChange(getCartItemQuantity() - 1)}>−</button>
              <span className="qty-display">{getCartItemQuantity()}</span>
              <button className="qty-plus" onClick={() => handleQuantityChange(getCartItemQuantity() + 1)}>+</button>
              <button className="qty-delete" onClick={handleRemoveFromCart}>🗑️</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
