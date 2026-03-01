import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  Grid,
} from "@mui/material";
import {
  Inventory,
  BrandingWatermark,
  AttachMoney,
  ProductionQuantityLimits,
} from "@mui/icons-material";

function Product() {
  const [formData, setFormData] = useState({
    product_name: "",
    brand_name: "",
    category: "",
    price: "",
    stock_quantity: "",
    description: "",
  });
  const categories = [
    "Electronic",
    "Pharmacy",
    "Stationery",
    "Furniture",
    "Grocery",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    if (!formData.product_name || !formData.price) {
      alert("Please fill Product Name and Price!");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/add-product",
        formData,
      );
      alert(response.data.message);
      setFormData({
        product_name: "",
        brand_name: "",
        category: "",
        price: "",
        stock_quantity: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error saving product!");
    }
  };
  return (
    <Box sx={{ width: "100%", maxWidth: "1000px", margin: "auto" }}>
      <Typography
        variant="h3"
        className="cursive-text"
        sx={{ textAlign: "center", mb: 4, color: "white" }}
      >
        Product Management
      </Typography>
      <Paper elevation={2} sx={{ p: 4, borderRadius: "20px" }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Add New Product
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Product Name"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Inventory color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Brand Name"
              name="brand_name"
              value={formData.brand_name}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BrandingWatermark color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField select fullWidth label="Category" name="category" value={formData.category} onChange={handleChange} defaultValue="">
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Stock Quantity"
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ProductionQuantityLimits color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Product Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "right" }}>
            <Button variant="contained" size="large" onClick={handleSave}>
              Save Product
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
export default Product;
