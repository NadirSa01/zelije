import { Route, Routes, useLocation } from "react-router-dom";
import Profile from "./admin/profile/profile";
import NavBar from "./admin/layouts/navBar";
import Dashboard from "./admin/dashboard/dashboard";
import Products from "./admin/products/products";
import Services from "./admin/services/services";
import Clients from "./admin/clients/client";
import { useEffect, useRef } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AddProduct from "./admin/products/components/modal/addProduct";
import UpdatedProduct from "./admin/products/components/update/updateProduct";
import AddService from "./admin/services/components/add/addService";
import UpdateService from "./admin/services/components/update/updateService";
import ClientUpdateProvider from "./contexts/common/provider";
import Messages from "./admin/message/message";
import MessageDetail from "./admin/message/components/detail/messageDetail";
import OrderDetail from "./admin/dashboard/components/detailsOrder/orderDetail";

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
        <ClientUpdateProvider>
        <NavBar />
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/order/:id" element={<OrderDetail />} />
          <Route path="clients" element={<Clients />} />
          <Route path="profile" element={<Profile />} />
          <Route path="products" element={<Products />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/detail/:id" element={<MessageDetail />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/detail/:id" element={<UpdatedProduct />} />
          <Route path="services" element={<Services />} />
          <Route path="services/add" element={<AddService />} />
          <Route path="services/update/:id" element={<UpdateService />} />
        </Routes>
        </ClientUpdateProvider>
      </LanguageProvider>
    </div>
  );
}

export default AdminApp;
