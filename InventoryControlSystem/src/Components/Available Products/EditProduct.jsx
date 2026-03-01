import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Typography, Paper } from "@mui/material";
import "./EditProduct.css";
import { Description } from "@mui/icons-material";

function EditProduct({ id, onClose }) {
  const [product, setProduct] = useState({
    product_name: "",
    brand_name: "",
    category: "",
    price: "",
    stock_quantity: "",
    description: "",
  });
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/get-product/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));
  }, [id]);
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/update-product/${id}`,
        product,
      );
      alert("Product updated successfully");
      onClose();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="edit-container">
      <Paper className="edit-card">
        <Typography variant="h4" className="form-title">
          Edit Product Details
        </Typography>
        <form onSubmit={handleUpdate}>
          <TextField
            fullWidth
            className="input-field"
            label="Product Name"
            name="product_name"
            value={product.product_name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            className="input_field"
            label="Brand"
            name="brand_name"
            value={product.brand_name}
            onChange={handleChange}
          />
          <div style={{ display: "flex", gap: "15px" }}>
            <TextField
              fullWidth
              className="input-field"
              label="Price"
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              className="input_field"
              label="Category"
              name="category"
              value={product.category}
              onChange={handleChange}
            />
          </div>
          <TextField
            fullWidth
            className="input-field"
            label="Description"
            name="description"
            multiline
            rows={3}
            value={product.description}
            onChange={handleChange}
          />
          <Button
            fullWidth
            variant="contained"
            className="update-btn"
            type="submit"
            sx={{ mb: 2 }}
          >
            Update Product
          </Button>
          <Button
            fullWidth
            variant="outlined"
            className="cancel-btn"
            color="error"
            onClick={onClose}
          >
            Cancel
          </Button>
        </form>
      </Paper>
    </div>
  );
}
export default EditProduct;
