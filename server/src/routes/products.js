import express from "express";
import { query } from "../db/index.js";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await query("SELECT * FROM products ORDER BY created_at DESC");
    // Converter de string (texto CSV) para array no formato que o frontend espera
    const products = result.rows.map(p => ({
      ...p,
      colors: p.colors ? p.colors.split(',') : [],
      sizes: p.sizes ? p.sizes.split(',') : []
    }));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
});

router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, slug, price, category, description, colors, sizes, image } = req.body;
    const colorsStr = Array.isArray(colors) ? colors.join(",") : colors;
    const sizesStr = Array.isArray(sizes) ? sizes.join(",") : sizes;

    const result = await query(
      "INSERT INTO products (name, slug, price, category, description, colors, sizes, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [name, slug, price, category, description, colorsStr, sizesStr, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar produto." });
  }
});

router.put("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, price, category, description, colors, sizes, image } = req.body;
    const colorsStr = Array.isArray(colors) ? colors.join(",") : colors;
    const sizesStr = Array.isArray(sizes) ? sizes.join(",") : sizes;

    const result = await query(
      "UPDATE products SET name = $1, slug = $2, price = $3, category = $4, description = $5, colors = $6, sizes = $7, image = $8 WHERE id = $9 RETURNING *",
      [name, slug, price, category, description, colorsStr, sizesStr, image, id]
    );
    
    if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar produto." });
  }
});

router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query("DELETE FROM products WHERE id = $1 RETURNING id", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Produto deletado" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar produto." });
  }
});

export default router;
