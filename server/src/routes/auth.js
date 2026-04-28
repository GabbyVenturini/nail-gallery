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

router.post("/register-admin", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Acesso negado. Apenas administradores podem criar outros administradores." });
    }

    const { name, email, password } = req.body;
    const userExists = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) return res.status(400).json({ error: "E-mail já está em uso." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const result = await query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'admin') RETURNING id, name, email, role",
      [name, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor ao criar administrador." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Busca usuário e seu endereço padrão
    const result = await query(`
      SELECT u.*, a.zip_code, a.street, a.number, a.complement, a.neighborhood, a.city, a.state
      FROM users u
      LEFT JOIN addresses a ON u.id = a.user_id AND a.is_default = TRUE
      WHERE u.email = $1
    `, [email]);
    
    const user = result.rows[0];

    if (!user) return res.status(400).json({ error: "E-mail não encontrado." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Senha inválida." });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, user: { 
      id: user.id, name: user.name, email: user.email, role: user.role,
      zip_code: user.zip_code, street: user.street, number: user.number, 
      complement: user.complement, neighborhood: user.neighborhood, 
      city: user.city, state: user.state
    } });
  } catch (error) {
    res.status(500).json({ error: "Erro interno." });
  }
});

router.get("/me", authenticate, async (req, res) => {
  try {
    const result = await query(`
      SELECT u.id, u.name, u.email, u.role, a.zip_code, a.street, a.number, a.complement, a.neighborhood, a.city, a.state
      FROM users u
      LEFT JOIN addresses a ON u.id = a.user_id AND a.is_default = TRUE
      WHERE u.id = $1
    `, [req.user.id]);
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dados do usuário." });
  }
});

// --- Gestão de Equipe (Admins) ---

// Listar todos os administradores
router.get("/admins", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Acesso negado." });
    const result = await query("SELECT id, name, email, role, created_at FROM users WHERE role = 'admin' ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar administradores." });
  }
});

// Atualizar um administrador
router.put("/admins/:id", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Acesso negado." });
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Se houver senha nova, faz o hash
    let result;
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      result = await query(
        "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 AND role = 'admin' RETURNING id, name, email",
        [name, email, hashedPassword, id]
      );
    } else {
      result = await query(
        "UPDATE users SET name = $1, email = $2 WHERE id = $3 AND role = 'admin' RETURNING id, name, email",
        [name, email, id]
      );
    }

    if (result.rows.length === 0) return res.status(404).json({ error: "Administrador não encontrado." });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar administrador." });
  }
});

// Remover um administrador
router.delete("/admins/:id", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Acesso negado." });
    const { id } = req.params;

    // Impedir que o admin logado se delete (prevenindo lockout)
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: "Você não pode excluir sua própria conta enquanto está logado." });
    }

    const result = await query("DELETE FROM users WHERE id = $1 AND role = 'admin' RETURNING id", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Administrador não encontrado." });
    
    res.json({ message: "Administrador removido com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover administrador." });
  }
});

// --- Gestão de Múltiplos Endereços ---

// Listar todos os endereços do usuário logado
router.get("/addresses", authenticate, async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC", 
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar endereços." });
  }
});

// Adicionar novo endereço
router.post("/addresses", authenticate, async (req, res) => {
  try {
    const { zip_code, street, number, complement, neighborhood, city, state, is_default } = req.body;
    const userId = req.user.id;

    if (is_default) {
      await query("UPDATE addresses SET is_default = FALSE WHERE user_id = $1", [userId]);
    }

    const result = await query(
      `INSERT INTO addresses (user_id, zip_code, street, number, complement, neighborhood, city, state, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [userId, zip_code, street, number, complement, neighborhood, city, state, is_default || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar endereço." });
  }
});

// Editar endereço
router.put("/addresses/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { zip_code, street, number, complement, neighborhood, city, state, is_default } = req.body;
    const userId = req.user.id;

    if (is_default) {
      await query("UPDATE addresses SET is_default = FALSE WHERE user_id = $1", [userId]);
    }

    const result = await query(
      `UPDATE addresses SET 
        zip_code = $1, street = $2, number = $3, complement = $4, 
        neighborhood = $5, city = $6, state = $7, is_default = $8
      WHERE id = $9 AND user_id = $10 RETURNING *`,
      [zip_code, street, number, complement, neighborhood, city, state, is_default, id, userId]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Endereço não encontrado." });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar endereço." });
  }
});

// Excluir endereço
router.delete("/addresses/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await query("DELETE FROM addresses WHERE id = $1 AND user_id = $2", [id, userId]);
    res.json({ message: "Endereço removido com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover endereço." });
  }
});

// Atualizar apenas dados básicos (Nome/Email)
router.put("/profile", authenticate, async (req, res) => {
  try {
    const { name, email } = req.body;
    await query("UPDATE users SET name = $1, email = $2 WHERE id = $3", [name, email, req.user.id]);
    res.json({ message: "Dados atualizados!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar perfil." });
  }
});

export default router;
