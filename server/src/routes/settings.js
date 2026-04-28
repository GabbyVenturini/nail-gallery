import express from "express";
import { query } from "../db/index.js";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await query("SELECT data FROM settings WHERE id = 1");
    if (result.rows.length === 0) return res.json({});
    res.json(result.rows[0].data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar configurações." });
  }
});

router.put("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const payload = req.body;
    const result = await query(
      "UPDATE settings SET data = $1 WHERE id = 1 RETURNING data",
      [payload]
    );

    // Caso a tabela tenha sido zerada, garantimos o INSERT.
    if (result.rows.length === 0) {
      const inserted = await query(
        "INSERT INTO settings (id, data) VALUES (1, $1) RETURNING data",
        [payload]
      );
      return res.json(inserted.rows[0].data);
    }

    res.json(result.rows[0].data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar configurações." });
  }
});

export default router;
