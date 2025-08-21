import { Route, Routes } from "react-router-dom";
import Profile from "./admin/profile/profile";
import NavBar from "./admin/layouts/navBar";
import Dashboard from "./admin/dashboard/dashboard";
import Products from "./admin/products/products";
import Services from "./admin/services/services";
import Clients from "./admin/clients/client";

function AdminApp() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="profile" element={<Profile />} />
        <Route path="products" element={<Products />} />
        <Route path="services" element={<Services />} />
      </Routes>
    </div>
  );
}

export default AdminApp;
