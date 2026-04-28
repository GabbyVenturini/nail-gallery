import { query } from "./index.js";
import { fileURLToPath } from "url";
import path from "path";

// Simples simulador de slugify
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

const baseProducts = [
  {
    name: "Coleção Clássica Rosé",
    category: "Clássicas",
    price: 39.9,
    description: "Kit delicado com acabamento elegante e proposta minimalista para uso diário.",
    colors: ["Rosé", "Branco", "Nude"],
    sizes: ["Curta", "Média", "Longa"],
    image: "/src/assets/banner.avif"
  },
  {
    name: "Coleção Pérola Francesa",
    category: "Decoradas",
    price: 44.9,
    description: "Modelo com toque clássico e detalhes refinados para ocasiões especiais.",
    colors: ["Branco", "Off White", "Champagne"],
    sizes: ["Curta", "Média", "Longa"],
    image: "/src/assets/banner.avif"
  },
  {
    name: "Coleção Noir Elegance",
    category: "Luxo",
    price: 52.9,
    description: "Unhas sofisticadas com contraste marcante e visual editorial.",
    colors: ["Preto", "Nude", "Vinho"],
    sizes: ["Média", "Longa"],
    image: "/src/assets/banner.avif"
  },
  {
    name: "Coleção Blush Romance",
    category: "Decoradas",
    price: 47.9,
    description: "Composição romântica com paleta suave e acabamento delicado.",
    colors: ["Rosa Claro", "Nude", "Branco"],
    sizes: ["Curta", "Média"],
    image: "/src/assets/banner.avif"
  },
  {
    name: "Coleção Dourada Atelier",
    category: "Luxo",
    price: 58.9,
    description: "Peça com presença premium, ideal para eventos e ensaios.",
    colors: ["Dourado", "Rosé", "Champagne"],
    sizes: ["Média", "Longa"],
    image: "/src/assets/banner.avif"
  },
  {
    name: "Coleção Soft Nude",
    category: "Clássicas",
    price: 36.9,
    description: "Acabamento clean e versátil para um visual elegante e discreto.",
    colors: ["Nude", "Rosé", "Pêssego"],
    sizes: ["Curta", "Média", "Longa"],
    image: "/src/assets/banner.avif"
  }
];

async function seedProducts() {
  try {
    for (const product of baseProducts) {
      const slug = slugify(product.name);
      
      const exists = await query("SELECT id FROM products WHERE slug = $1", [slug]);
      if (exists.rows.length === 0) {
        await query(
          "INSERT INTO products (name, slug, price, category, description, colors, sizes, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
          [
            product.name,
            slug,
            product.price,
            product.category,
            product.description,
            product.colors.join(","),
            product.sizes.join(","),
            product.image
          ]
        );
        console.log(`Product inserted: ${product.name}`);
      } else {
        console.log(`Product already exists: ${product.name}`);
      }
    }
    console.log("Seed complete.");
  } catch (error) {
    console.error("Error seeding products:", error.message);
  } finally {
    process.exit();
  }
}

seedProducts();
