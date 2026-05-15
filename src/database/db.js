import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const db = new Database(process.env.DB_PATH || './watches.db');

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS watches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    reference_number TEXT,
    production_year INTEGER,
    movement_type TEXT CHECK(movement_type IN ('Automatic','Manual','Quartz','Mecha-Quartz')),
    caliber TEXT,
    power_reserve INTEGER,
    bph INTEGER,
    case_material TEXT CHECK(case_material IN ('Steel','Gold','Titanium','Ceramic')),
    case_diameter REAL,
    case_thickness REAL,
    lug_width INTEGER,
    water_resistance INTEGER,
    dial_color TEXT,
    index_type TEXT CHECK(index_type IN ('Roman','Arabic','Baton')),
    crystal_type TEXT CHECK(crystal_type IN ('Sapphire','Mineral','Hesalite')),
    luminescence INTEGER DEFAULT 0 CHECK(luminescence IN (0,1)),
    strap_material TEXT CHECK(strap_material IN ('Leather','Steel','Rubber','NATO')),
    buckle_type TEXT CHECK(buckle_type IN ('Buckle','Deployant')),
    purchase_price REAL,
    current_market_value REAL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

export default db;