import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/home";
import SalesBill from "./pages/salesbill/salesbill";
import Usermaster from "./pages/master/usermaster/usermaster";
import StockMaster from "./pages/inventory/stock_inventory_master/stockmaster";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/salesbill" element={<SalesBill />} />
        <Route path="/master/usermaster" element={<Usermaster />} />
        <Route path="/inventory/stockMaster" element={<StockMaster />} />
      </Routes>
    </Router>
  );
};

export default App;
