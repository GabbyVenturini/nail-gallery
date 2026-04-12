import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import ProductCard from "../components/ProductCard";
import FeatureCard from "../components/FeatureCard";
import { useStore } from "../store/StoreContext";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Home() {
  const { products, settings } = useStore();
  const featured = products.filter((item) => item.featured).slice(0, 3);

  return (
    <motion.div initial="hidden" animate="visible" exit={{ opacity: 0 }}>
      <Helmet>
        <title>Nail Gallery | Unhas postiças exclusivas e delicadas</title>
        <meta name="description" content="Descubra a Nail Gallery. Unhas postiças modernas, com modelos delicados, e envio para todo o Brasil. Escolha as suas!" />
      </Helmet>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
        {/* Imagem de Fundo (Preenchendo a tela toda) */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings.heroBanner}
            alt="Coleção de unhas postiças da Nail Gallery"
            className="h-full w-full object-cover"
          />
          {/* Overlay escuro para garantir que o texto fique legível */}
          <div className="absolute inset-0 bg-neutral-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Conteúdo centralizado/sobreposto */}
        <div className="container-default relative z-10 w-full flex items-center justify-center md:justify-start">
          <motion.div variants={fadeUpVariant} className="max-w-2xl text-center md:text-left text-white mt-10">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.32em] text-white/80">
              Nail Gallery
            </p>

            <h1 className="text-5xl font-bold leading-[1.1] text-white md:text-6xl lg:text-7xl tracking-tight drop-shadow-md">
              {settings.heroTitle1} <span className="text-gold italic pr-2 drop-shadow-lg">{settings.heroTitle2}</span>
            </h1>

            <p className="mt-6 max-w-xl text-sm md:text-base leading-relaxed text-white/90 drop-shadow mx-auto md:mx-0">
              {settings.heroDescription}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center md:justify-start">
              <Link to="/shop" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-black shadow-lg transition-transform hover:scale-105 hover:bg-neutral-100">
                Ver produtos
              </Link>
              <Link to="/sobre" className="inline-flex items-center justify-center rounded-full border border-white px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur transition-all hover:bg-white hover:text-black">
                Conheça a marca
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Selos flutuantes independentes na tela */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden md:block absolute bottom-12 right-12 z-20"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="rounded-full border border-white/40 bg-white/20 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl backdrop-blur-md"
          >
            Envio Nacional 🇧🇷
          </motion.div>
        </motion.div>
      </section>

      <section className="container-default py-24">
        <SectionHeading
          eyebrow="Destaques"
          title="Escolhas perfeitas para combinar com você"
          center
        />

        <motion.div 
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="mt-14 grid gap-8 md:grid-cols-3"
        >
          {featured.map((product) => (
            <motion.div key={product.id} variants={fadeUpVariant}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="bg-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/5" />
        <div className="container-default relative z-10">
          <SectionHeading
            eyebrow="Por que escolher a Nail Gallery"
            title="Praticidade, beleza e estilo em cada detalhe"
            description="Aqui você encontra unhas postiças pensadas para quem ama se sentir bonita, com opções cheias de personalidade e uma experiência de compra simples e encantadora."
          />

          <motion.div 
             variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-100px" }}
             className="mt-14 grid gap-6 md:grid-cols-3"
          >
            <motion.div variants={fadeUpVariant}>
              <FeatureCard
                title="Modelos encantadores"
                text="Unhas postiças com estilos delicados, modernos e elegantes para diferentes gostos e ocasiões especiais ou dia-a-dia."
              />
            </motion.div>
            <motion.div variants={fadeUpVariant}>
              <FeatureCard
                title="Mais praticidade"
                text="Tenha unhas bonitas de forma rápida e simples, sem complicar sua rotina corrida. Fácil de aplicar e remover."
              />
            </motion.div>
            <motion.div variants={fadeUpVariant}>
              <FeatureCard
                title="Compra online segura"
                text="Escolha seus modelos favoritos com total conforto, segurança e receba tudo muito bem embalado na sua casa."
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}