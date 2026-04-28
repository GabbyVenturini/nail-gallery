import express from "express";
import { query } from "../db/index.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Recupera ou cria um carrinho para o usuário logado
async function getOrCreateCart(userId) {
  let cart = await query("SELECT * FROM carts WHERE user_id = $1", [userId]);
  if (cart.rows.length === 0) {
    cart = await query("INSERT INTO carts (user_id) VALUES ($1) RETURNING *", [userId]);
  }
  return cart.rows[0];
}

router.get("/", authenticate, async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const items = await query(
      `SELECT c.id, c.color, c.size, c.quantity, c.price, p.name, p.image, p.id as product_id 
       FROM cart_items c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.cart_id = $1`,
      [cart.id]
    );

    res.json({ id: cart.id, items: items.rows });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar carrinho." });
  }
});

router.post("/add", authenticate, async (req, res) => {
  try {
    const { productId, color, size, price, quantity = 1 } = req.body;
    const cart = await getOrCreateCart(req.user.id);

    const result = await query(
      "INSERT INTO cart_items (cart_id, product_id, color, size, price, quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [cart.id, productId, color, size, price, quantity]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar item ao carrinho." });
  }
});

router.delete("/remove/:itemId", authenticate, async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await getOrCreateCart(req.user.id);
    
    await query("DELETE FROM cart_items WHERE id = $1 AND cart_id = $2", [itemId, cart.id]);
    res.json({ message: "Item removido com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover item." });
  }
});

export default router;
