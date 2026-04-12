import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Sobre from "./pages/Sobre";
import Medidas from "./pages/Medidas";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Pedidos from "./pages/Pedidos";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { useStore } from "./store/StoreContext";

export default function App() {
  const location = useLocation();
  const { settings } = useStore();

  return (
    <>
      <Helmet>
        <style type="text/css">{`
          :root {
            --color-primary: ${settings.primaryColor || "#111111"};
            --color-secondary: ${settings.secondaryColor || "#f7f7f7"};
            --color-gold: ${settings.goldColor || "#a17c54"};
          }
        `}</style>
      </Helmet>
      <Layout>
        <Toaster position="top-center" richColors />
        <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:slug" element={<ProductDetails />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/medidas" element={<Medidas />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Layout>
    </>
  );
}
