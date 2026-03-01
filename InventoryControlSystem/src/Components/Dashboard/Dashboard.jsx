import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Paper,
} from "@mui/material";
import {
  Dashboard as DashIcon,
  Inventory,
  Category,
  Settings,
  ExitToApp,
  ReceiptLong,
  LocalShipping,
  History,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Product from "../Add Products/AddProducts";
import AvailableProducts from "../Available Products/AvailableProduct";
import Billing from "../Billing/Billing";
import ExitProduct from "../Exit Product/Exit";
import SaleHistory from "../SaleHistory/SaleHistory";
import Setting from "../Setting/Setting";
import "./Dashboard.css";
import EditProduct from "../Available Products/EditProduct";
const drawerWidth = 310;

function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [editingProducId, setEditingProductId] = useState(null);
  const [stats, setStats] = useState({
    totalStock: 0,
    lowStock: 0,
    todaySales: 48,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resTotal, resLow, resSales] = await Promise.all([
          axios.get("http://localhost:5000/api/stats/total-products"),
          axios.get("http://localhost:5000/api/stats/low-stock"),
          axios.get("http://localhost:5000/api/stats/today-sales")
        ]);

        setStats({
          totalStock: resTotal.data.total,
          lowStock: resLow.data.lowStockCount,
          todaySales: resSales.data.todayTotal || 0,
        });
      } catch (err) {
        console.error("Dashboard stats error:", err);
      }
    };

    if (activeTab === "Dashboard") {
      fetchStats();
    }
  },[activeTab]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const menuItems = [
    { text: "Dashboard", icon: <DashIcon /> },
    { text: "Add Products", icon: <Inventory /> },
    { text: "Available Products", icon: <Category /> },
    { text: "Billing", icon: <ReceiptLong /> },
    { text: "Exit Products", icon: <LocalShipping /> },
    { text: "Sale History", icon: <History /> },
    { text: "Setting", icon: <Settings /> },
  ];
  const handlLogout = () => {
    if (window.confirm("Are You sure you want to logout?")) {
      navigate("/");
    }
  };
  const startEditing = (id) =>{
    setEditingProductId(id);
    setActiveTab("Edit Product");
  };
  const stopEditing = () =>{
    setEditingProductId(null);
    setActiveTab("Available Products");
  }

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#1e293b",
        color: "white",
      }}
    >
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="800" className="cursive-text">
          STOCK MANAGER
        </Typography>
        <Typography variant="body2" sx={{ color: "#acccff" }}>
          Admin Panel
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
      <List sx={{ px: 2, mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              className={`menu-item ${activeTab === item.text ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.text);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text}></ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: "auto", p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<ExitToApp />}
          onClick={handlLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{ display: { md: "none" }, bgcolor: "#1e293b" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Stock Manager</Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth, border: "none" },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
      {/* image */}
      <Box
        component="main"
        className="main-area-with-img"
        sx={{ flexGrow: 1, p: 3, mt: { xs: 8, md: 0 }, height:"100vh",overflow:"auto" }}
      >
        <Box
          className="content-fade"
          sx={{ maxWidth: "1000px", margin: "auto" }}
        >
          {activeTab === "Dashboard" && (
            <Box>
              <Typography
                variant="h3"
                fontWeight="900"
                sx={{ mb: 5, textAlign: "center", color: "white" }}
              >
                System Overview
              </Typography>
              {/* card */}
              <Grid container spacing={3} justifyContent="center">
                {[
                  { label: "Total Stock", value: stats.totalStock, color: "#6366f1" },
                  { label: "Low Stock", value: stats.lowStock, color: "#ef4444" },
                  { label: "Today's Revenue", value: stats.todaySales, color: "#10b981" },
                ].map((item) => (
                  <Grid item xs={12} sm={4} key={item.label}>
                    <Paper elevation={4} className="stat-card">
                      <Typography fontWeight="bold" sx={{color: item.color, opacity:0.8, mb:1}}>
                        {item.label}
                      </Typography>
                      <Typography
                        variant="h4"
                        fontFamily="900"
                        sx={{ color: item.color, mt: 1 }}
                      >
                        {item.value}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          <Box className="content-fade">
            {activeTab === "Add Products" && <Product />}
            {activeTab === "Available Products" && <AvailableProducts onEdit={startEditing}/>}
            {activeTab === "Edit Product" && editingProducId && (
              <EditProduct id={editingProducId} onClose={stopEditing}/>
            )}
            {/* {activeTab === "Available Products" && <AvailableProducts />} */}
            {activeTab === "Billing" && <Billing />}
            {activeTab === "Exit Products" && <ExitProduct />}
            {activeTab === "Sale History" && <SaleHistory/>}
            {activeTab === "Setting" && <Setting />}

          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
