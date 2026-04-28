import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { apiFetch } from "../lib/api";

import logoAsset from "../assets/logo.jpeg";
import bannerAsset from "../assets/banner.avif";

const StoreContext = createContext(null);

const defaultSettings = {
  logo: logoAsset,
  heroBanner: bannerAsset,
  heroTitle1: "Unhas postiças para deixar seu visual ainda mais",
  heroTitle2: "lindo",
  heroDescription: "Modelos delicados, modernos e cheios de charme.",
  footerDescription: "E-commerce autoral de unhas postiças personalizadas com proposta visual elegante e navegação leve.",
  instagramUrl: "https://www.instagram.com/nailgallery_oficial/",
  instagramText: "Instagram: @nailgallery_oficial",
  contactEmail: "contato@nailgallery.com",
  contactSchedule: "Segunda a sexta — 9h às 18h",
  primaryColor: "#111111",
  secondaryColor: "#f7f7f7",
  goldColor: "#a17c54",
};

export function StoreProvider({ children }) {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentCart, setCurrentCart] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);

  // Inicialização (Global Data)
  useEffect(() => {
    async function initData() {
      try {
        const [prodData, settData] = await Promise.all([
          apiFetch("/products"),
          apiFetch("/settings")
        ]);
        setProducts(prodData);
        if (settData && Object.keys(settData).length > 0) {
          setSettings({ ...defaultSettings, ...settData });
        }
      } catch (err) {
        console.error("Erro ao carregar dados do servidor:", err);
      }
    }
    initData();
  }, []);

  // Dados do Usuário (Cart e Orders)
  useEffect(() => {
    async function loadUserData() {
      if (!user) {
        setCurrentCart([]);
        setOrders([]);
        return;
      }
      try {
        const [cartData, ordersData] = await Promise.all([
          apiFetch("/cart"),
          apiFetch("/orders")
        ]);
        setCurrentCart(cartData.items || []);
        setOrders(ordersData || []);
      } catch (err) {
        console.error("Erro ao carregar os dados do usuário", err);
      }
    }
    loadUserData();
  }, [user]);

  const cartCount = currentCart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const cartTotal = currentCart.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.price || 0)), 0);

  async function addToCart(product, customization) {
    if (!user) throw new Error("Faça login para adicionar itens ao carrinho.");
    const body = {
      productId: product.id,
      color: customization.color,
      size: customization.size,
      price: product.price,
      quantity: customization.quantity || 1
    };
    const saved = await apiFetch("/cart/add", { method: "POST", body: JSON.stringify(body) });
    // Inserimos localmente para refletir na UI sem recarregar o get todo (se preferir)
    setCurrentCart(prev => [...prev, { ...saved, name: product.name, image: product.image, product_id: product.id }]);
  }

  async function removeCartItem(itemId) {
    if (!user) return;
    await apiFetch(`/cart/remove/${itemId}`, { method: "DELETE" });
    setCurrentCart(prev => prev.filter((item) => item.id !== itemId));
  }

  function updateCartItem(itemId, quantity) {
    // Por simplicidade sem refatorar a interface que já exigia update local: local mutation
    setCurrentCart(prev => prev.map((item) => item.id === itemId ? { ...item, quantity: Math.max(1, Number(quantity)) } : item));
  }

  async function checkout(payload) {
    if (!user) throw new Error("Faça login para finalizar o pedido.");
    if (!currentCart.length) throw new Error("Seu carrinho está vazio.");

    // payload deve conter { shippingAddress, paymentMethod }
    await apiFetch("/orders/checkout", { 
      method: "POST", 
      body: JSON.stringify(payload) 
    });
    
    // Recarregar os dados para limpar local e dar refresh em orders real
    const ordersData = await apiFetch("/orders");
    setOrders(ordersData || []);
    setCurrentCart([]);
  }

  async function updateProfile(data) {
    if (!user) return;
    const updated = await apiFetch("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data)
    });
    // Opcional: atualizar o usuário no AuthContext se necessário, 
    // mas aqui o backend já responde o novo perfil.
    return updated;
  }

  async function createProduct(payload) {
    const saved = await apiFetch("/products", { method: "POST", body: JSON.stringify(payload) });
    // O backend retorna CSV, adaptamos arrays para a view igual o GET
    saved.colors = saved.colors ? saved.colors.split(',') : [];
    saved.sizes = saved.sizes ? saved.sizes.split(',') : [];
    setProducts(prev => [saved, ...prev]);
  }

  async function updateProduct(productId, payload) {
    const saved = await apiFetch(`/products/${productId}`, { method: "PUT", body: JSON.stringify(payload) });
    saved.colors = saved.colors ? saved.colors.split(',') : [];
    saved.sizes = saved.sizes ? saved.sizes.split(',') : [];
    setProducts(prev => prev.map((p) => p.id === productId ? saved : p));
  }

  async function deleteProduct(productId) {
    await apiFetch(`/products/${productId}`, { method: "DELETE" });
    setProducts(prev => prev.filter((product) => product.id !== productId));
  }

  async function updateOrderStatus(orderId, status) {
    const updated = await apiFetch(`/orders/${orderId}/status`, { method: "PUT", body: JSON.stringify({ status }) });
    setOrders(prev => prev.map((order) => order.id === orderId ? { ...order, status: updated.status } : order));
  }

  async function updateSettings(newSettings) {
    // Mescla o estado local com os novos dados antes de enviar
    const merged = { ...settings, ...newSettings };
    // Lança o erro para o componente caller exibir o toast correto
    const saved = await apiFetch("/settings", { method: "PUT", body: JSON.stringify(merged) });
    setSettings(saved);
  }

  // Usa == (coerção) para evitar mismatch de tipos: user_id do DB é number, user.id do JWT pode ser string
  const myOrders = user ? orders.filter((order) => order.user_id == user.id) : [];

  const value = useMemo(
    () => ({
      products, setProducts,
      orders, myOrders,
      currentCart, cartCount, cartTotal,
      settings,
      addToCart, updateCartItem, removeCartItem, checkout,
      createProduct, updateProduct, deleteProduct,
      updateOrderStatus, updateSettings, updateProfile
    }),
    [products, orders, myOrders, currentCart, cartCount, cartTotal, settings, user]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore deve ser usado dentro de StoreProvider.");
  return context;
}