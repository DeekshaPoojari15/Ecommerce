// admin/pages/Products.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductModal from "../components/ProductModal";

// import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const getProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get("http://localhost:5000/api/products/");
      setProducts(response.data.data);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const deleteProduct = async (id) => {
    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getProducts();

    } catch (error) {
      console.log(error);
    }
  };

  const filteredProducts = products.filter((item) =>
    item.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

   const [open, setOpen] = useState(false);

const [selectedProduct, setSelectedProduct] =useState(null);

const handleOpenCreate = () => {
  setSelectedProduct(null);
  setOpen(true);
};

const handleOpenEdit = (product) => {
  setSelectedProduct(product);
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};

  return (
    <div className="products-page">

      <div className="products-header">

        <h1>Products</h1>

        <button
  className="add-btn"
  onClick={handleOpenCreate}
>
  Add Product
</button>

      </div>

      <div className="search-box">

        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <table className="products-table">

          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredProducts.map((product) => (
              <tr key={product._id}>

                <td>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="product-image"
                  />
                </td>

                <td>{product.name}</td>

                <td>
                  ₹ {product.price}
                </td>

                <td>
                  {product.category}
                </td>

                <td>
                  {product.stock}
                </td>

                <td>

                  <button
  className="edit-btn"
  onClick={() =>
    handleOpenEdit(product)
  }
>
  Edit
</button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteProduct(product._id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>
     )} 
<ProductModal
  open={open}
  handleClose={handleClose}
  selectedProduct={selectedProduct}
  getProducts={getProducts}
/>
    </div>
  );
};

export default Products;


