import { Route, Routes, useLocation } from "react-router-dom";
import Profile from "./admin/profile/profile";
import NavBar from "./admin/layouts/navBar";
import Dashboard from "./admin/dashboard/dashboard";
import Products from "./admin/products/products";
import Services from "./admin/services/services";
import Clients from "./admin/clients/client";
import { useEffect, useRef } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";

function AdminApp() {
  const Xref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const current = Xref.current;
    if (current) {
      current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [location.pathname]);
  return (
    <div ref={Xref} style={{ height: "100vh", overflowY: "auto" }}>
      <LanguageProvider>
        <NavBar />
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="profile" element={<Profile />} />
          <Route path="products" element={<Products />} />
          <Route path="services" element={<Services />} />
        </Routes>
      </LanguageProvider>
    </div>
  );
}

export default AdminApp;
