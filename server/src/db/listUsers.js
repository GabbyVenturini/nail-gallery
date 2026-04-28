import { query } from "./index.js";

async function listUsers() {
  try {
    const res = await query("SELECT id, name, email, role FROM users");
    console.table(res.rows);
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    process.exit();
  }
}

listUsers();
