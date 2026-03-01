import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import {ManageAccounts} from "@mui/icons-material"
import axios from "axios";
function Setting() {
  const [shopName, setShopName] = useState("My Inventory Shop");
  const [contact, setContact] = useState("2312453467");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSaveSetting = () =>{
    alert("Shop setting saved")
  };

  const handlePasswordChange = async () =>{
    if(!oldPassword || !newPassword) return alert("fill all fields");
    try{
      const res = await  axios.put("http://localhost:5000/api/change-password",{
      username:"pooja",
      oldPassword,
      newPassword
    });
    alert(res.data.message);
    setOldPassword("");
    setNewPassword("");
    }catch(err){
      alert(err.response?.data?.message || "somthing error");
    }
  };
  return (
    <Box sx={{ p: 3, width: "100%" }} className="content-fade">
      <Typography
        variant="h3"
        className="cursive-text"
        sx={{ textAlign: "center", mb: 4, color: "white" }}
      >
        Settings
      </Typography>
      <Paper sx={{ p: 4, borderRadius: "20px" }} elevation={6}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar sx={{ width:80, height:80, bgcolor: "#6366f1", mr: 2 }}>
            <ManageAccounts/>
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Admin User
            </Typography>
            <Typography color="textSecondary">
              admin@stockmanager.com
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <TextField
          fullWidth
          label="Shop Name"
          value={shopName}
          onChange={(e)=> setShopName(e.target.value)}
          // defaultValue="My Inventory Store"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Contact Number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          // defaultValue="8976543210"
          sx={{ mb: 2 }}
        />
        <Button variant="contained" sx={{ bgcolor: "#1e293b" }} onClick={handleSaveSetting}>
          Save Changes
        </Button>
        <Divider sx={{mb:3}}/>
        <Typography variant="h6" sx={{mb:2,color:"red"}}>Security(Change Password)</Typography>
        <Stack spacing={2}>
          <TextField fullWidth type="password" label="Old Password" value={oldPassword} onChange={(e)=> setOldPassword(e.target.value)}/>
            <TextField fullWidth type="password" label="New Password" value={newPassword} onChange={(e)=> setNewPassword(e.target.value)}/>
              <Button variant="contained" color="error" onClick={handlePasswordChange}>Update Password</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
export default Setting;
