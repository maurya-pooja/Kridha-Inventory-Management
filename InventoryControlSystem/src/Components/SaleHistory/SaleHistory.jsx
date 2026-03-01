import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

function SaleHistory() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/get-sales");
        setSales(response.data);
      } catch (err) {
        console.error("Error fetching sales history:", err);
      }
    };
    fetchSales();
  }, []);


  const handlPrintBill = async (sale) => {
    try {

      const res = await axios.get(`http://localhost:5000/api/get-sale-items/${sale.id}`);
      const items = res.data;

      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
            <head>
                <title>Print Bill - ${sale.customer_name}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .total { text-align: right; margin-top: 20px; font-size: 1.2em; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>KRIDHA INVENTORY SHOP</h2>
                    <p>Bill ID: #${sale.id} | Date: ${new Date(sale.sale_date).toLocaleDateString()}</p>
                </div>
                <p><b>Customer Name:</b> ${sale.customer_name}</p>
                <p><b>Mobile:</b> ${sale.customer_mobile}</p>
                <hr>
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr>
                                <td>${item.product_name || "N/A"}</td>
                                <td>${item.quantity}</td>
                                <td>₹${item.price}</td>
                                <td>₹${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="total">Total Amount: ₹${parseFloat(sale.total_amount).toFixed(2)}</div>
                <p style="text-align:center; margin-top:40px;">Thank you for shopping!</p>
            </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } catch (err) {
      console.error("Print Error:", err);
      alert("Items fetch nahi ho paye. Backend check karein.");
    }
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          color: "white",
          fontWeight: "900",
          textAlign: "center",
          fontSize: { xs: "1.8rem", md: "2.5rem" },
        }}
      >
        Sales History
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          maxWidth: "100%",
          maxHeight: "70vh",
          overflow: "auto",
          background: "rgba(255,255,255,0.95)",
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: "#1e293b !important", color: "#acccff", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ bgcolor: "#1e293b !important", color: "#acccff", fontWeight: "bold" }}>Customer Name</TableCell>
              <TableCell sx={{ bgcolor: "#1e293b !important", color: "#acccff", fontWeight: "bold" }}>Mobile</TableCell>
              <TableCell sx={{ bgcolor: "#1e293b !important", color: "#acccff", fontWeight: "bold" }}>Total Amount</TableCell>
              <TableCell sx={{ bgcolor: "#1e293b !important", color: "#acccff", fontWeight: "bold" }}>Date & Time</TableCell>
              <TableCell sx={{ bgcolor: "#1e293b !important", color: "#acccff", fontWeight: "bold" }} align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id} hover>
                <TableCell>#{sale.id}</TableCell>
                <TableCell sx={{ fontWeight: "600" }}>{sale.customer_name}</TableCell>
                <TableCell>{sale.customer_mobile}</TableCell>
                <TableCell>
                  <Chip
                    label={`₹${parseFloat(sale.total_amount).toLocaleString("en-IN")}`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: "bold" }}
                  />
                </TableCell>
                <TableCell>
                  {new Date(sale.sale_date).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell align="center">
                  <IconButton color="success" onClick={() => handlPrintBill(sale)} title="Print Bill">
                    <PrintIcon />
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

export default SaleHistory;