import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { LayoutDashboard, ShoppingBag, Palette } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../store/AuthContext";

import ProductForm from "../components/admin/ProductForm";
import ProductList from "../components/admin/ProductList";
import OrderList from "../components/admin/OrderList";
import SiteSettingsForm from "../components/admin/SiteSettingsForm";
import AdminUserForm from "../components/admin/AdminUserForm";
import { Shield } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("pedidos"); // "pedidos", "catalogo", "config"

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  function handleEditProduct(product) {
    setActiveTab("catalogo");
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleClearEdit() {
    setEditingProduct(null);
  }

  return (
    <div className="bg-neutral-50/50 min-h-screen">
      <Helmet>
        <title>Dashboard | Nail Gallery</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <section className="container-default py-12">
        <div className="mb-8 border-b border-neutral-200 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard Gerencial</h1>
          <p className="text-neutral-500 mt-2">Visão geral do negócio, catálogo e aparência</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr] items-start">
          {/* Sidebar Menu */}
          <aside className="sticky top-28 flex flex-col gap-2">
            <button
               onClick={() => setActiveTab("pedidos")}
               className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[12px] font-bold uppercase tracking-[0.1em] transition-all duration-300 ${activeTab === "pedidos" ? "bg-primary text-white shadow-md translate-x-2" : "text-neutral-600 hover:bg-white hover:shadow-sm"}`}
            >
              <LayoutDashboard size={18} /> Pedidos
            </button>
            <button
               onClick={() => setActiveTab("catalogo")}
               className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[12px] font-bold uppercase tracking-[0.1em] transition-all duration-300 ${activeTab === "catalogo" ? "bg-primary text-white shadow-md translate-x-2" : "text-neutral-600 hover:bg-white hover:shadow-sm"}`}
            >
              <ShoppingBag size={18} /> Catálogo
            </button>
            <button
               onClick={() => setActiveTab("config")}
               className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[12px] font-bold uppercase tracking-[0.1em] transition-all duration-300 ${activeTab === "config" ? "bg-primary text-white shadow-md translate-x-2" : "text-neutral-600 hover:bg-white hover:shadow-sm"}`}
            >
              <Palette size={18} /> Aparência (CMS)
            </button>
            <button
               onClick={() => setActiveTab("usuarios")}
               className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[12px] font-bold uppercase tracking-[0.1em] transition-all duration-300 ${activeTab === "usuarios" ? "bg-primary text-white shadow-md translate-x-2" : "text-neutral-600 hover:bg-white hover:shadow-sm"}`}
            >
              <Shield size={18} /> Equipe / Admins
            </button>
          </aside>

          {/* Area Central (Work Area) */}
          <main className="min-h-[60vh]">
            {activeTab === "pedidos" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <OrderList />
              </div>
            )}

            {activeTab === "catalogo" && (
              <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl">
                <ProductForm
                  editingProduct={editingProduct}
                  onClearEdit={handleClearEdit}
                />
                <ProductList onEditProduct={handleEditProduct} />
              </div>
            )}

            {activeTab === "config" && (
              <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SiteSettingsForm />
              </div>
            )}

            {activeTab === "usuarios" && (
              <div className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <AdminUserForm />
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}