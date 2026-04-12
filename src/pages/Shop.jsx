import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";
import { useStore } from "../store/StoreContext";

export default function Shop() {
  const { products } = useStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");

  const categories = ["Todas", ...new Set(products.map((item) => item.category))];

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "Todas" || product.category === category;

      const target = `${product.name} ${product.description} ${product.category}`.toLowerCase();
      const matchesSearch = target.includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="container-default py-16"
    >
      <Helmet>
        <title>Shop - Coleções de Unhas | Nail Gallery</title>
        <meta name="description" content="Explore todas as opções de unhas postiças premium na Nail Gallery. Clássicas, decoradas ou luxuosas." />
      </Helmet>

      <SectionHeading
        eyebrow="Shop"
        title="Escolha sua coleção"
        description="Filtre por categoria e busca por texto para encontrar a unha perfeita para você."
      />

      <div className="mt-10 grid gap-4 rounded-[32px] border border-neutral-200 bg-white/70 backdrop-blur p-6 md:grid-cols-[1fr_220px] shadow-sm">
        <input
          className="input-default bg-white"
          placeholder="Buscar por nome, categoria ou descrição"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className="input-default bg-white"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <motion.div 
        layout
        className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {filtered.map((product) => (
          <motion.div 
            layout 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            key={product.id}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {!filtered.length && (
        <div className="mt-10 rounded-[32px] border border-dashed border-neutral-300 bg-neutral-50/50 p-12 text-center text-sm text-neutral-500">
          Nenhum produto encontrado para esse filtro.
        </div>
      )}
    </motion.section>
  );
}

