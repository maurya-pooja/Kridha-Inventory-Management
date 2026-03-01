import "./Login.css";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useState } from "react";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });
      if (res.status === 200) {
        navigate("./dashboard");
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };
  return (
    <Box className="login-container">
      <Box className="login-box">
        <Box className="login-left">
          <Box className="left-overlay-text">
            <Typography variant="h3" sx={{ fontWeight: 900 }}>
              "Build, Manage, and Grow....."
            </Typography>
          </Box>
        </Box>
        <Box className="login-right">
          <Box className="login-form-container">
            <Typography variant="h4" className="welcome-title">
              Inventry control system.
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField fullWidth placeholder="username" sx={{ mb: 2 }} value={username} onChange={(e)=> setUsername(e.target.value)}/>
              <TextField
                fullWidth
                type="password"
                placeholder="Password"
                sx={{ mb: 4 }}
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                className="login-btn-green"
                endIcon={<ArrowForward />}
              >
                Login
              </Button>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
export default Login;
