import React,{useState, useEffect} from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid,
  Autocomplete,
} from "@mui/material";
import { Delete, AddShoppingCart, Print, CheckCircle, Person } from "@mui/icons-material";

function Billing() {
  const [products,setProducts] = useState([]);
  const [selectedProduct, setselectedProduct] = useState(null);
  const [qty,setQty] = useState(1);
  const [cart,setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");


  useEffect(()=>{
    axios.get("http://localhost:5000/api/get-products")
    .then(res=> setProducts(res.data))
    .catch(err=> console.error(err));
  },[]);

   const handleCheckout = async() => {
    if(cart.length === 0) return alert("Empty Cart");
    if(!customerName || !customerMobile){
      return alert("Please Enter customer Name  mobile number");
    } 
    try{
      await axios.post("http://localhost:5000/api/generate-bill",{
        cart,
        customerName,
        customerMobile
      });
      alert("Bill Generated  stock Updated!");
      setCart([]);
      setCustomerName("");
      setCustomerMobile("");
    }catch(err){
      console.error(err);
      alert(err.response?.data?.message || "Billing Failed");
    }
  };

  const handleAddToBill=()=>{
    if(!selectedProduct) return alert("Please select product!");
    if(qty > selectedProduct.stock_quantity) return alert("There's not that much stock!");
    const newItem = {
      id: selectedProduct.id,
      product_name: selectedProduct.product_name,
      price : selectedProduct.price,
      qty: parseInt(qty),
      total : selectedProduct.price * qty
    };
  setCart([...cart,newItem]);
  setselectedProduct(null);
  setQty(1);
  };
  const removeIem = (id) =>{
    setCart(cart.filter(item=> item.id !== id));
  };
  
  return (
    <Box sx={{ p: 3, width: "100%" }} className="content-fade">
      <Typography
        variant="h3"
        className="cursive-text"
        sx={{ textAlign: "center", mb: 4, color: "white" }}
      >
        Billing System
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: "15PX" }} elevation={4}>
            <Typography variant="h6" sx ={{mb:2, display:'flex',alignItems:"center"}}>
              <Person sx={{mr:1}}/>Customer Details
            </Typography>
            <TextField fullWidth
              label="Customer Name"
              variant="outlined"
              value={customerName}
              onChange={(e)=>setCustomerName(e.target.value)}
              sx={{mb:2}}
            />
            <TextField fullWidth
              label="Mobile Number"
              variant="outlined"
              value={customerMobile}
              onChange={(e)=>setCustomerMobile(e.target.value)}
              sx={{mb:4}}
            />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Search Product
            </Typography>
            <Autocomplete
              options={products}
              value={selectedProduct}
              getOptionLabel={(options) => `${options.product_name} (Stock:${options.stock_quantity})`}
              onChange={(e,value) => setselectedProduct(value)}
              renderInput={(params) => <TextField {...params} label="Product Name" variant="outlined" fullWidth/>} sx={{mb:2}}            
            />
            {/* <TextField
              fullWidth
              label="Enter Product Id or name"
              variant="outlined"
              sx={{ mb: 2 }}
            /> */}
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddShoppingCart />}
              onClick={handleAddToBill}
              sx={{ bgcolor: "#6366f1", '&:hover': {bgcolor:'#4f46e5'} }}
            >
              Add to Bill
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <TableContainer
            component={Paper}
            sx={{ borderRadius: "15px" }}
            elevation={4}
          >
            <Table>
              <TableHead sx={{ bgcolor: "#1e293b" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Item
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Price
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Qty
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Total
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold" }}
                    align="center"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-IN").format(item.price)}
                    </TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-IN").format(item.total)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="error" onClick={() => removeIem(item.id)}>
                        <Delete/>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ p: 2, textAlign: "right", bgcolor: "#f8fafc" }}>
              <Typography variant="h5" fontWeight="bold">
                Grand Total:{cart.reduce((sum,i)=> sum + i.total,0)}               
              </Typography>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle/>}
                sx={{ mt: 2 }}
                onClick={handleCheckout}
              >
                Confirm & Update Stock
              </Button>
            </Box>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
export default Billing;
