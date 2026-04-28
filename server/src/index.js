import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./db/index.js";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import settingsRoutes from "./routes/settings.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Limite alto para suportar uploads de imagens em Base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Tratador global de erros base
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Ocorreu um erro inesperado no servidor." });
});

// Inicializar DB e Servidor
(async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
})();
