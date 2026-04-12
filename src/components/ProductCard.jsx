import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { currency } from "../lib/storage";

export default function ProductCard({ product }) {
  return (
    <motion.article 
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <div className="aspect-[4/4.2] overflow-hidden bg-neutral-100 relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">
            {product.category}
          </p>
          <h3 className="text-xl font-bold text-neutral-900">{product.name}</h3>
          <p className="text-sm leading-relaxed text-neutral-500 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="text-[15px] font-bold uppercase tracking-[0.1em] text-neutral-900">
            {currency(product.price)}
          </span>
          <Link to={`/shop/${product.slug}`} className="btn-secondary">
            Ver detalhes
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
