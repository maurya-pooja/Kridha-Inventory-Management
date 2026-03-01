import React,{useState,useEffect} from "react";
import { Box, Typography, Paper, TextField, Button, Grid, Autocomplete } from "@mui/material";
import axios from "axios";
function ExitProduct() {
  const [products,setProducts] = useState([]);
  const [selectedProduct,setselectedProduct] = useState(null);
  const [exitQty,setExitQty] = useState(1);
  const [reason,setReason] = useState("");

  useEffect(()=>{
    axios.get("http://localhost:5000/api/get-products")
    .then(res => setProducts(res.data))
    .catch(err => console.error(err));
  },[]);
  const handleConfirmExit = async () => {
    if(!selectedProduct) return alert("select product");
    if(exitQty > selectedProduct.stock_quantity) return alert("not have much product");

    try{
      await axios.post("http://localhost:5000/api/generate-bill",{
        customerName:`Stock Out: ${reason || "Damage/Return"}`,
        customerMobile : "000000001",
        cart:[{id:selectedProduct.id, qty:parseInt(exitQty), total:0}]
      });
      alert(`stock out successfully! Reason: ${reason}`);
      setselectedProduct(null);
      setExitQty(1);
      setReason("");
    }catch(err){
      alert("Error:" + (err.response?.data?.message || "server error"));
    }
  };
  return (
    <Box sx={{ p: 3, width: "100%" }} className="content-fade">
      <Typography
        variant="h3"
        className="cursive-text"
        sx={{ textAlign: "center", mb: 4, color: "white" }}
      >
        Exit Product/ Stock Out
      </Typography>
      <Paper sx={{ p: 4, borderRadius: "20px" }} elevation={6}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* <TextField fullWidth label="Scan Barcode or Enter ID" /> */}
            <Autocomplete options={products} getOptionLabel ={(option)=>`${option.product_name}(Current Stock: ${option.stock_quantity})`} onChange={(e,value)=> setselectedProduct(value)} renderInput={(params)=> <TextField {...params} label="Search Product name or ID"/>}/>
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <TextField fullWidth label="Product Name" disabled />
          </Grid> */}
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Quantity to Remove" type="number" value={exitQty} onChange={(e)=> setExitQty(e.target.value)}/>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Reason (Damage/Sale/Return)"
              multiline
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            {" "}
            <Button
              variant="contained"
              color="error"
              fullWidth
              size="large"
              sx={{ fontWeight: "bold" }}
              onClick={handleConfirmExit}
            >
              Confirm Stock Out
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
export default ExitProduct;
