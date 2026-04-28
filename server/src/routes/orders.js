import express from "express";
import { query } from "../db/index.js";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/checkout", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ error: "Endereço e forma de pagamento são obrigatórios." });
    }

    const cart = await query("SELECT id FROM carts WHERE user_id = $1", [userId]);
    if (cart.rows.length === 0) return res.status(400).json({ error: "Carrinho vazio." });
    
    const cartId = cart.rows[0].id;
    const items = await query("SELECT * FROM cart_items WHERE cart_id = $1", [cartId]);
    if (items.rows.length === 0) return res.status(400).json({ error: "Nenhum item no carrinho." });

    const total = items.rows.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);

    // Salva o pedido já como "Pago" e status "Pago" conforme solicitado
    const orderResult = await query(
      "INSERT INTO orders (user_id, total, status, shipping_address, payment_method, payment_status) VALUES ($1, $2, 'Pago', $3, $4, 'Pago') RETURNING id",
      [userId, total, JSON.stringify(shippingAddress), paymentMethod]
    );
    const orderId = orderResult.rows[0].id;

    for (let item of items.rows) {
      await query(
        "INSERT INTO order_items (order_id, product_id, color, size, quantity, price) VALUES ($1, $2, $3, $4, $5, $6)",
        [orderId, item.product_id, item.color, item.size, item.quantity, item.price]
      );
    }

    // Limpar o carrinho após fechamento
    await query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);

    res.status(201).json({ message: "Pedido criado com sucesso", orderId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no checkout." });
  }
});

// Acesso a pedidos - Cliente vê os seus, Admin vê todos
router.get("/", authenticate, async (req, res) => {
  try {
    let ordersQuery;
    let ordersData;

    if (req.user.role === "admin") {
      ordersQuery = `
        SELECT o.*, u.name as customerName, u.email as customerEmail 
        FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC
      `;
      ordersData = await query(ordersQuery);
    } else {
      ordersQuery = "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC";
      ordersData = await query(ordersQuery, [req.user.id]);
    }

    // Processamento otimizado seria num JOIN, mas por praticidade no JSON de retorno:
    const finalOrders = [];
    for (let order of ordersData.rows) {
      const items = await query("SELECT * FROM order_items WHERE order_id = $1", [order.id]);
      finalOrders.push({
        ...order,
        customerName: order.customername || req.user.name,
        customerEmail: order.customeremail || req.user.email,
        items: items.rows
      });
    }

    res.json(finalOrders);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pedidos." });
  }
});

// Atualizar status do pedido (Somente Admin)
router.put("/:id/status", authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await query("UPDATE orders SET status = $1 WHERE id = $2 RETURNING *", [status, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Pedido não encontrado." });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar status." });
  }
});

export default router;
