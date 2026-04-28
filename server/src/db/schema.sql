-- Descomente a linha abaixo e rode manualmente se precisar zerar tudo
-- DROP TABLE IF EXISTS settings, order_items, orders, cart_items, carts, products, users CASCADE;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    zip_code VARCHAR(10),
    street VARCHAR(255),
    number VARCHAR(20),
    complement VARCHAR(255),
    neighborhood VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(2),
    is_default BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) DEFAULT 'Clássicas',
    description TEXT,
    colors TEXT, 
    sizes TEXT,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    color VARCHAR(100),
    size VARCHAR(100),
    quantity INTEGER DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(100) DEFAULT 'Recebido',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    color VARCHAR(100),
    size VARCHAR(100),
    quantity INTEGER DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    data JSONB NOT NULL
);

-- Insere as configurações padrão se a tabela estiver vazia
INSERT INTO settings (id, data)
SELECT 1, '{
  "heroTitle1": "Unhas postiças para deixar seu visual ainda mais",
  "heroTitle2": "lindo",
  "heroDescription": "Modelos delicados modernos.",
  "footerDescription": "E-commerce autoral de unhas postiças.",
  "instagramUrl": "https://instagram.com",
  "instagramText": "@nailgallery",
  "contactEmail": "contato@nailgallery.com",
  "contactSchedule": "Segunda a sexta",
  "primaryColor": "#111111",
  "secondaryColor": "#f7f7f7",
  "goldColor": "#a17c54"
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE id = 1);
