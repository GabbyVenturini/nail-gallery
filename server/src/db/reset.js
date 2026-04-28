import { query, initDB } from "./index.js";

async function resetDatabase() {
  try {
    console.log("--- INICIANDO RESET DO BANCO DE DADOS ---");
    
    // 1. Apagar todas as tabelas existentes (Ordem importa por causa das foreign keys)
    console.log("Apagando tabelas antigas...");
    await query(`
      DROP TABLE IF EXISTS settings, order_items, orders, cart_items, carts, products, users CASCADE;
    `);
    console.log("✅ Tabelas apagadas.");

    // 2. Criar tabelas novamente usando o initDB que já lê o schema.sql
    console.log("Recriando tabelas a partir do schema.sql...");
    await initDB();
    console.log("✅ Tabelas recriadas com sucesso!");

    console.log("\n--- BANCO DE DADOS PRONTO E LIMPO! ---");
  } catch (error) {
    console.error("❌ Erro ao resetar banco:", error.message);
  } finally {
    process.exit();
  }
}

resetDatabase();
