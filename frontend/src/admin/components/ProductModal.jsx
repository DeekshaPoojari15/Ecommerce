// // admin/components/ProductModal.jsx

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   Modal,
//   Box,
//   TextField,
//   Button,
// } from "@mui/material";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 500,
//   bgcolor: "white",
//   borderRadius: 2,
//   p: 4,
// };

// const ProductModal = ({
//   open,
//   handleClose,
//   selectedProduct,
//   getProducts,
// }) => {

//   const [formData, setFormData] =
//     useState({
//       name: "",
//       price: "",
//       category: "",
//       stock: "",
//       images: "",
//       description: "",
//     });

//   useEffect(() => {

//     if (selectedProduct) {
//       setFormData(selectedProduct);
//     } else {
//       setFormData({
//         name: "",
//         price: "",
//         category: "",
//         stock: "",
//         images: "",
//         description: "",
//       });
//     }

//   }, [selectedProduct]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async () => {

//     try {

//       const token =
//         localStorage.getItem("token");

//       if (selectedProduct) {

//         await axios.put(
//           `http://localhost:5000/api/products/${selectedProduct._id}`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//       } else {

//         await axios.post(
//           "http://localhost:5000/api/products",
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//       }

//       getProducts();

//       handleClose();

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <Modal
//       open={open}
//       onClose={handleClose}
//     >

//       <Box sx={style}>

//         <h2>
//           {selectedProduct
//             ? "Edit Product"
//             : "Create Product"}
//         </h2>

//         <Box
//           display="flex"
//           flexDirection="column"
//           gap={2}
//           mt={2}
//         >

//           <TextField
//             label="Name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             fullWidth
//           />

//           <TextField
//             label="Price"
//             name="price"
//             value={formData.price}
//             onChange={handleChange}
//             fullWidth
//           />

//           <TextField
//             label="Category"
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             fullWidth
//           />

//           <TextField
//             label="Stock"
//             name="stock"
//             value={formData.stock}
//             onChange={handleChange}
//             fullWidth
//           />

//           <TextField
//             label="Image URL"
//             name="image"
//             value={formData.images}
//             onChange={handleChange}
//             fullWidth
//           />

//           <TextField
//             label="Description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             multiline
//             rows={4}
//             fullWidth
//           />

//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//           >
//             {selectedProduct
//               ? "Update Product"
//               : "Create Product"}
//           </Button>

//         </Box>

//       </Box>

//     </Modal>
//   );
// };

// export default ProductModal;



import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Modal,
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import Grid from "@mui/material/Grid";

const categories = [
  "Electronics",
  "Accessories",
  "Wearables",
  "Audio",
  "Photography",
  "Fashion",
  "Furniture",
  "Vehicles",
  "Home Appliances",
  "Other",
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 1000,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const ProductModal = ({
  open,
  handleClose,
  selectedProduct,
  getProducts,
}) => {
  const initialState = {
    name: "",
    sku: "",
    description: "",
    longDescription: "",
    price: "",
    category: "Other",
    stock: 0,
    countInStock: 0,
    rating: 0,
    numReviews: 0,
    tags: "",
    images: "",
    specifications: "{}",
    isFeatured: false,
    isActive: true,
  };

  const [formData, setFormData] =
    useState(initialState);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        ...selectedProduct,
        tags:
          selectedProduct.tags?.join(", ") ||
          "",
        images:
          selectedProduct.images?.join(", ") ||
          "",
        specifications: JSON.stringify(
          selectedProduct.specifications || {},
          null,
          2
        ),
      });
    } else {
      setFormData(initialState);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const payload = {
        ...formData,

        price: Number(formData.price),
        stock: Number(formData.stock),
        countInStock: Number(
          formData.countInStock
        ),
        rating: Number(formData.rating),
        numReviews: Number(
          formData.numReviews
        ),

        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],

        images: formData.images
          ? formData.images
              .split(",")
              .map((img) => img.trim())
              .filter(Boolean)
          : [],

        specifications:
          formData.specifications
            ? JSON.parse(
                formData.specifications
              )
            : {},
      };

      if (selectedProduct) {
        await axios.put(
          `http://localhost:5000/api/products/${selectedProduct._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/products",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      getProducts();
      handleClose();
    } catch (error) {
      console.error(error);
      alert(
        "Please verify Specifications JSON"
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={style}>
        <Typography
          variant="h5"
          gutterBottom
        >
          {selectedProduct
            ? "Edit Product"
            : "Create Product"}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography
          variant="h6"
          gutterBottom
        >
          Product Information
        </Typography>

        <Grid
          container
          spacing={2}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>

          {/* <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
            />
          </Grid> */}

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map(
                (category) => (
                  <MenuItem
                    key={category}
                    value={category}
                  >
                    {category}
                  </MenuItem>
                )
              )}
            </TextField>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="h6"
          gutterBottom
        >
          Inventory
        </Typography>

        <Grid
          container
          spacing={2}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Stock"
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
            />
          </Grid>

          {/* <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Count In Stock"
              type="number"
              name="countInStock"
              value={formData.countInStock}
              onChange={handleChange}
            />
          </Grid> */}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="h6"
          gutterBottom
        >
          Description
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Short Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <Box mt={2}>
          <TextField
            fullWidth
            multiline
            rows={5}
            label="Long Description"
            name="longDescription"
            value={formData.longDescription}
            onChange={handleChange}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="h6"
          gutterBottom
        >
          Media
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={2}
          label="Image URLs (comma separated)"
          name="images"
          value={formData.images}
          onChange={handleChange}
        />

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="h6"
          gutterBottom
        >
          Reviews
        </Typography>

        <Grid
          container
          spacing={2}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Rating"
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Number of Reviews"
              type="number"
              name="numReviews"
              value={formData.numReviews}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="h6"
          gutterBottom
        >
          Metadata
        </Typography>

        <TextField
          fullWidth
          label="Tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="gaming, laptop, intel"
        />

        <Box mt={2}>
          <TextField
            fullWidth
            multiline
            rows={8}
            label="Specifications JSON"
            name="specifications"
            value={formData.specifications}
            onChange={handleChange}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid
          container
          spacing={2}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    formData.isFeatured
                  }
                  onChange={
                    handleChange
                  }
                  name="isFeatured"
                />
              }
              label="Featured Product"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    formData.isActive
                  }
                  onChange={
                    handleChange
                  }
                  name="isActive"
                />
              }
              label="Active Product"
            />
          </Grid>
        </Grid>

        <Box mt={4}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
          >
            {selectedProduct
              ? "Update Product"
              : "Create Product"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProductModal;