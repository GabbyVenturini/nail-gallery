import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../db/index.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) return res.status(400).json({ error: "E-mail já está em uso." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // O primeiro usuário pode ser setado como Admin via banco; aqui criamos customer
    const result = await query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'customer') RETURNING id, name, email, role",
      [name, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) return res.status(400).json({ error: "E-mail não encontrado." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Senha inválida." });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: "Erro interno." });
  }
});

router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
