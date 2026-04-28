import bcrypt from "bcrypt";
import { query } from "./index.js";

async function updateAdminPassword() {
  try {
    const email = "admin@nailgallery.com";
    const newPassword = "12345699";
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    
    await query("UPDATE users SET password = $1 WHERE email = $2", [hash, email]);
    console.log(`Senha atualizada com sucesso para ${email}! Nova senha: ${newPassword}`);
  } catch (error) {
    console.error("Erro:", error.message);
  } finally {
    process.exit();
  }
}

updateAdminPassword();
