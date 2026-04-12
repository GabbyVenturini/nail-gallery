import { motion } from "framer-motion";

export default function FeatureCard({ title, text }) {
  return (
    <motion.article 
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.05)" }}
      transition={{ duration: 0.3 }}
      className="card-surface p-8 transition-colors hover:border-neutral-300"
    >
      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
        Diferencial
      </p>
      <h3 className="mb-4 text-xl font-bold tracking-tight text-neutral-900">{title}</h3>
      <p className="text-sm leading-relaxed text-neutral-500">{text}</p>
    </motion.article>
  );
}
