import React from "react";
import { BrowserRouter as Router,Routes, Route,Navigate} from "react-router-dom";
import Login from "./Components/Login/Login";
import Dashboard from "./Components/Dashboard/Dashboard";
import EditProduct from "./Components/Available Products/EditProduct";
import AvailableProduct from "./Components/Available Products/AvailableProduct";

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/available-products" element={<Dashboard/>}/>
        <Route path="/edit-product/:id" element={<EditProduct/>}/>
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </Router>
  );
}
export default App;