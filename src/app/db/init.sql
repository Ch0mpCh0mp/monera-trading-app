-- db/init.sql

-- 1️⃣ Users-Tabelle
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    balance NUMERIC(10,2) DEFAULT 10000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2️⃣ Products-Tabelle
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3️⃣ Orders-Tabelle
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    total NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4️⃣ Trades-Tabelle
CREATE TABLE IF NOT EXISTS trades (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    amount NUMERIC(10,2) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'buy' oder 'sell'
    pnl NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5️⃣ Trigger-Funktion für Balance-Update bei Trades
CREATE OR REPLACE FUNCTION update_user_balance_pnl() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'buy' THEN
        -- Bei Kauf: Balance verringern, PNL = 0
        UPDATE users
        SET balance = balance - NEW.amount
        WHERE id = NEW.user_id;

        NEW.pnl := 0;

    ELSIF NEW.type = 'sell' THEN
        -- Bei Verkauf: Balance erhöhen, PNL = Betrag (Demo)
        UPDATE users
        SET balance = balance + NEW.amount
        WHERE id = NEW.user_id;

        NEW.pnl := NEW.amount;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6️⃣ Trigger auf Trades-Tabelle
DROP TRIGGER IF EXISTS trg_update_balance_pnl ON trades;
CREATE TRIGGER trg_update_balance_pnl
BEFORE INSERT ON trades
FOR EACH ROW
EXECUTE FUNCTION update_user_balance_pnl();

-- 7️⃣ Demo-User (Passwort ist intern dokumentiert, nicht im Repo)
-- Login: demo@user.com
INSERT INTO users (username, email, password_hash, balance)
VALUES (
    'Demo User',
    'demo@user.com',
    '$2b$10$wS3ORP/AaRov4e9PqbJDOuVvxRjIf0L2IuR2LRfqMi8axDw/.mQoC',
    10000
)
ON CONFLICT (email) DO NOTHING;



INSERT INTO users (username, email, password_hash, balance)
VALUES 
('Test User', 'test@test.de', '$2b$10$G9/FMVE5ibVGAF5m9l/gF.K/QeZ4RtVmnB7g97NbJJA0rhVPX8tJy', 10000)
ON CONFLICT (email) DO NOTHING;

-- 8️⃣ Beispiel-Produkt einfügen
INSERT INTO products (name, description, price)
VALUES 
('Demo Product', 'This is a demo product.', 49.99)
ON CONFLICT (name) DO NOTHING;
