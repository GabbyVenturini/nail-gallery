import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { toast } from "sonner";
import SectionHeading from "../components/SectionHeading";
import { currency } from "../lib/storage";
import { useStore } from "../store/StoreContext";

export default function ProductDetails() {
  const { slug } = useParams();
  const { products, addToCart } = useStore();

  const product = useMemo(
    () => products.find((item) => item.slug === slug),
    [products, slug]
  );

  const [color, setColor] = useState(product?.colors[0] || "");
  const [size, setSize] = useState(product?.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <section className="container-default py-16">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-8">
          Produto não encontrado.
        </div>
      </section>
    );
  }

  function handleAddToCart() {
    try {
      addToCart(product, {
        color,
        size,
        quantity,
      });
      toast.success(`${product.name} adicionado ao carrinho!`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="container-default py-16"
    >
      <Helmet>
        <title>{product.name} | Nail Gallery</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <Link
        to="/shop"
        className="mb-6 inline-block text-xs font-bold uppercase tracking-[0.20em] text-neutral-500 hover:text-black transition-colors"
      >
        ← Voltar para shop
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-soft"
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
          />
        </motion.div>

        <div className="card-surface p-7 md:p-9 shadow-lg">
          <SectionHeading
            eyebrow={product.category}
            title={product.name}
            description={product.description}
          />

          <div className="mt-10 space-y-7">
            <div>
              <p className="label-default">Preço</p>
              <p className="text-3xl font-bold text-neutral-900">{currency(product.price)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-default">Cor</label>
                <select
                  className="input-default"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                >
                  {product.colors.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-default">Tamanho</label>
                <select
                  className="input-default"
                  value={size}
                  onChange={(event) => setSize(event.target.value)}
                >
                  {product.sizes.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label-default">Quantidade</label>
              <input
                className="input-default max-w-32"
                min="1"
                type="number"
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              />
            </div>

            <button onClick={handleAddToCart} className="btn-primary w-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
