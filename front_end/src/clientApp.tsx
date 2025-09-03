import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./layouts/navBar/navBar";
import Footer from "./layouts/foter/footer";
import Home from "./pages/home/home";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useEffect, useRef } from "react";
import ContactPage from "./pages/contact/comps/concatc";
import { CardDemo } from "./pages/TestShadcn";
import Products from "./pages/products/products";
import SheetCart from "./pages/sheet/sheetCart";
import OrderDetails from "./pages/confirmeOrder/detailsOrders/detailsOrder";
import CheckoutForm from "./pages/confirmeOrder/clientInfo/clientInfo";
function ClientApp() {
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
        <SheetCart/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Products/>} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CardDemo/>} />
          <Route path="/order" element={<OrderDetails/>} />
          <Route path="/checkout" element={<CheckoutForm/>} />
        </Routes>
        <Footer />
      </LanguageProvider>
    </div>
  );
}

export default ClientApp;
