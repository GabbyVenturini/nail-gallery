import banner from "../assets/banner.avif";
import { slugify } from "../lib/storage";

const baseProducts = [
  {
    id: "p1",
    name: "Coleção Clássica Rosé",
    category: "Clássicas",
    price: 39.9,
    image: banner,
    description:
      "Kit delicado com acabamento elegante e proposta minimalista para uso diário.",
    colors: ["Rosé", "Branco", "Nude"],
    sizes: ["Curta", "Média", "Longa"],
    featured: true,
  },
  {
    id: "p2",
    name: "Coleção Pérola Francesa",
    category: "Decoradas",
    price: 44.9,
    image: banner,
    description:
      "Modelo com toque clássico e detalhes refinados para ocasiões especiais.",
    colors: ["Branco", "Off White", "Champagne"],
    sizes: ["Curta", "Média", "Longa"],
    featured: true,
  },
  {
    id: "p3",
    name: "Coleção Noir Elegance",
    category: "Luxo",
    price: 52.9,
    image: banner,
    description:
      "Unhas sofisticadas com contraste marcante e visual editorial.",
    colors: ["Preto", "Nude", "Vinho"],
    sizes: ["Média", "Longa"],
    featured: false,
  },
  {
    id: "p4",
    name: "Coleção Blush Romance",
    category: "Decoradas",
    price: 47.9,
    image: banner,
    description:
      "Composição romântica com paleta suave e acabamento delicado.",
    colors: ["Rosa Claro", "Nude", "Branco"],
    sizes: ["Curta", "Média"],
    featured: false,
  },
  {
    id: "p5",
    name: "Coleção Dourada Atelier",
    category: "Luxo",
    price: 58.9,
    image: banner,
    description:
      "Peça com presença premium, ideal para eventos e ensaios.",
    colors: ["Dourado", "Rosé", "Champagne"],
    sizes: ["Média", "Longa"],
    featured: true,
  },
  {
    id: "p6",
    name: "Coleção Soft Nude",
    category: "Clássicas",
    price: 36.9,
    image: banner,
    description:
      "Acabamento clean e versátil para um visual elegante e discreto.",
    colors: ["Nude", "Rosé", "Pêssego"],
    sizes: ["Curta", "Média", "Longa"],
    featured: false,
  },
];

export const seededProducts = baseProducts.map((item) => ({
  ...item,
  slug: slugify(item.name),
}));
