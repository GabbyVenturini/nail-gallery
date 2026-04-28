import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const query = (text, params) => pool.query(text, params);

export const initDB = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf-8");
    
    await pool.query(schema);
    console.log("Banco de dados pronto! Tabelas carregadas do schema.sql.");
  } catch (error) {
    console.error("Erro ao inicializar tabelas:", error.message);
  }
};

export default pool;
