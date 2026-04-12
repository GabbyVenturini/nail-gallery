import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { seededProducts } from "../data/seedProducts";
import { KEYS, readStorage, writeStorage } from "../lib/storage";
import { useAuth } from "./AuthContext";

import logoAsset from "../assets/logo.jpeg";
import bannerAsset from "../assets/banner.avif";

const StoreContext = createContext(null);

const defaultSettings = {
  logo: logoAsset,
  heroBanner: bannerAsset,
  heroTitle1: "Unhas postiças para deixar seu visual ainda mais",
  heroTitle2: "lindo",
  heroDescription: "Modelos delicados, modernos e cheios de charme para valorizar seu estilo em qualquer ocasião. Escolha suas favoritas e receba em casa com entrega para todo o Brasil.",
  footerDescription: "E-commerce autoral de unhas postiças personalizadas com proposta visual elegante e navegação leve.",
  instagramUrl: "https://www.instagram.com/nailgallery_oficial/",
  instagramText: "Instagram: @nailgallery_oficial",
  contactEmail: "contato@nailgallery.com",
  contactSchedule: "Segunda a sexta — 9h às 18h",
  primaryColor: "#111111",
  secondaryColor: "#f7f7f7",
  goldColor: "#a17c54",
};

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function StoreProvider({ children }) {
  const { user } = useAuth();

  const [products, setProducts] = useState(() => {
    const saved = readStorage(KEYS.PRODUCTS, []);
    return saved.length ? saved : seededProducts;
  });

  const [orders, setOrders] = useState(() => readStorage(KEYS.ORDERS, []));
  const [carts, setCarts] = useState(() => readStorage(KEYS.CARTS, {}));
  
  const [settings, setSettings] = useState(() => {
    const stored = readStorage(KEYS.SITE_SETTINGS, null);
    if (!stored) return defaultSettings;
    return { ...defaultSettings, ...stored };
  });

  useEffect(() => {
    writeStorage(KEYS.PRODUCTS, products);
  }, [products]);

  useEffect(() => {
    writeStorage(KEYS.ORDERS, orders);
  }, [orders]);

  useEffect(() => {
    writeStorage(KEYS.CARTS, carts);
  }, [carts]);

  useEffect(() => {
    writeStorage(KEYS.SITE_SETTINGS, settings);
  }, [settings]);

  const currentCart = user ? carts[user.id] || [] : [];

  const cartCount = currentCart.reduce((sum, item) => {
    return sum + Number(item.quantity || 0);
  }, 0);

  const cartTotal = currentCart.reduce((sum, item) => {
    return sum + Number(item.quantity || 0) * Number(item.price || 0);
  }, 0);

  function addToCart(product, customization) {
    if (!user) {
      throw new Error("Faça login para adicionar itens ao carrinho.");
    }

    setCarts((prev) => {
      const userCart = prev[user.id] || [];

      return {
        ...prev,
        [user.id]: [
          ...userCart,
          {
            id: `ci-${Date.now()}`,
            productId: product.id,
            name: product.name,
            image: product.image,
            price: Number(product.price),
            quantity: Math.max(1, Number(customization.quantity || 1)),
            color: customization.color,
            size: customization.size,
          },
        ],
      };
    });
  }

  function updateCartItem(itemId, quantity) {
    if (!user) return;

    setCarts((prev) => ({
      ...prev,
      [user.id]: (prev[user.id] || []).map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, Number(quantity)) }
          : item
      ),
    }));
  }

  function removeCartItem(itemId) {
    if (!user) return;

    setCarts((prev) => ({
      ...prev,
      [user.id]: (prev[user.id] || []).filter((item) => item.id !== itemId),
    }));
  }

  function checkout() {
    if (!user) {
      throw new Error("Faça login para finalizar o pedido.");
    }

    const userCart = carts[user.id] || [];

    if (!userCart.length) {
      throw new Error("Seu carrinho está vazio.");
    }

    const newOrder = {
      id: `o-${Date.now()}`,
      userId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      status: "Recebido",
      createdAt: new Date().toISOString(),
      total: userCart.reduce((sum, item) => {
        return sum + Number(item.quantity || 0) * Number(item.price || 0);
      }, 0),
      items: userCart,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCarts((prev) => ({ ...prev, [user.id]: [] }));
  }

  function createProduct(payload) {
    const newProduct = {
      id: `p-${Date.now()}`,
      slug: payload.slug,
      name: String(payload.name || "").trim(),
      category: String(payload.category || "Clássicas").trim(),
      price: Number(payload.price || 0),
      image: payload.image || "",
      description: String(payload.description || "").trim(),
      colors: normalizeArray(payload.colors),
      sizes: normalizeArray(payload.sizes),
      featured: Boolean(payload.featured ?? false),
    };

    setProducts((prev) => [newProduct, ...prev]);
  }

  function updateProduct(productId, payload) {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== productId) return product;

        return {
          ...product,
          slug: payload.slug ?? product.slug,
          name: String(payload.name ?? product.name).trim(),
          category: String(payload.category ?? product.category).trim(),
          price: Number(payload.price ?? product.price),
          image: payload.image ?? product.image,
          description: String(payload.description ?? product.description).trim(),
          colors: payload.colors ? normalizeArray(payload.colors) : product.colors,
          sizes: payload.sizes ? normalizeArray(payload.sizes) : product.sizes,
          featured: payload.featured ?? product.featured,
        };
      })
    );
  }

  function deleteProduct(productId) {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  }

  function updateOrderStatus(orderId, status) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  }

  function updateSettings(newSettings) {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }

  const myOrders = user
    ? orders.filter((order) => order.userId === user.id)
    : [];

  const value = useMemo(
    () => ({
      products,
      setProducts,
      orders,
      myOrders,
      currentCart,
      cartCount,
      cartTotal,
      settings,
      addToCart,
      updateCartItem,
      removeCartItem,
      checkout,
      createProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      updateSettings,
    }),
    [products, orders, myOrders, currentCart, cartCount, cartTotal, settings]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore deve ser usado dentro de StoreProvider.");
  }

  return context;
}