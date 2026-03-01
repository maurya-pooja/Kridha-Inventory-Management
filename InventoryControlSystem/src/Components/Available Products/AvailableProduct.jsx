import React, {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import "./AvailableProduct.css";

function AvailableProduct({onEdit}) {
  const navigate = useNavigate();
  const [products,setProducts] = useState([]);

  const fetchProducts = async () =>{
    try{
      const res = await axios.get("http://localhost:5000/api/get-products");
      setProducts(res.data);
    }catch(err){
      console.error("Error fetching data:",err);
    }
  };
  useEffect(()=>{
    fetchProducts();
  },[]);

  const handleDelete = async(id)=>{
    if(window.confirm("Are you Sure You want to delete?")){
      try{
        await axios.delete(`http://localhost:5000/api/delete-product/${id}`);

        fetchProducts();
      }catch(err){
        console.error("Delete error:",err);
      }
    }
  };
  return (
    <Box
      className="inventory-wrapper content-fade"
      sx={{ width: "100%", mt: { xs: 2, md: 4 }, px: { xs: 1, md: 0 } }}
    >
      <Typography
        variant="h3"
        className="cursive-text"
        sx={{
          textAlign: "center",
          mb: 4,
          color: "white",
          fontWeight: "bold",
          fontSize: { xs: "2rem", md: "3rem" },
        }}
      >
        Available Inventory
      </Typography>
      <TableContainer
        component={Paper}
        elevation={5}
        sx={{
          borderRadius: "20px",
          overflow: "auto",
          width: "100%",
          maxWidth: "100vw",
          maxHeight:"70vh",
        }}
      >
        <Table stickyHeader sx={{ minWidth: 700 }} aria-label="responsive table">
          <TableHead sx={{ bgcolor: "#1e293b" }}>
            <TableRow>
              <TableCell
                sx={{
                  bgcolor:"#1e293b",
                  color: "white",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                Product Name
              </TableCell>
              <TableCell
                sx={{
                  bgcolor:"#1e293b",
                  color: "white",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                Brand
              </TableCell>
              <TableCell
                sx={{
                  bgcolor:"#1e293b",
                  color: "white",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                Category
              </TableCell>
              <TableCell
                sx={{
                  bgcolor:"#1e293b",
                  color: "white",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                Price
              </TableCell>
              <TableCell
                sx={{
                  bgcolor:"#1e293b",
                  color: "white",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                Stock
              </TableCell>
              <TableCell
                sx={{
                  bgcolor:"#1e293b",
                  color: "white",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  bgcolor:"#1e293b",
                  color: "white",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
                align="center"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={{ fontWeight: "600", whiteSpace: "nowrap" }}>
                  {row.product_name}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{row.brand_name}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {row.category}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{row.price}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{row.stock_quantity}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Chip
                    label={row.stock_quantity > 10 ? "In Stock" : "Low stock"}
                    color={row.stock_quantity > 10 ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  <IconButton color="info" size="small" onClick={()=> onEdit(row.id)}>
                    <Edit/>
                  </IconButton>
                  <IconButton color="error" size="small" onClick={()=> handleDelete(row.id)}>
                    <Delete/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AvailableProduct;
