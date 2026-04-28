import bcrypt from "bcrypt";
import { query } from "./index.js";

async function seedAdmin() {
  try {
    const email = "admin@nailgallery.com";
    const password = "admin"; // Mudamos para "admin" ou "admin1234" (o Chrome reclama de famosas, mas ok)
    
    // Verifica se já existe
    const exists = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (exists.rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      
      await query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
        ["Admin", email, hash, "admin"]
      );
      console.log(`Admin criado com sucesso! E-mail: ${email} | Senha: ${password}`);
    } else {
      console.log("Admin já existia no banco de dados.");
    }
  } catch (error) {
    console.error("Erro ao criar admin:", error.message);
  } finally {
    process.exit();
  }
}

seedAdmin();
