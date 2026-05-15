import db from './db.js';

export const findAll = (filters = {}) => {
  let query = 'SELECT * FROM watches WHERE 1=1';
  const params = [];

  if (filters.brand) {
    query += ' AND brand LIKE ?';
    params.push(`%${filters.brand}%`);
  }
  if (filters.movement_type) {
    query += ' AND movement_type = ?';
    params.push(filters.movement_type);
  }
  if (filters.case_material) {
    query += ' AND case_material = ?';
    params.push(filters.case_material);
  }

  query += ' ORDER BY created_at DESC';
  return db.prepare(query).all(...params);
};

export const findById = (id) => {
  return db.prepare('SELECT * FROM watches WHERE id = ?').get(id);
};

export const create = (data) => {
  const stmt = db.prepare(`
    INSERT INTO watches (
      brand, model, reference_number, production_year,
      movement_type, caliber, power_reserve, bph,
      case_material, case_diameter, case_thickness, lug_width, water_resistance,
      dial_color, index_type, crystal_type, luminescence,
      strap_material, buckle_type,
      purchase_price, current_market_value
    ) VALUES (
      @brand, @model, @reference_number, @production_year,
      @movement_type, @caliber, @power_reserve, @bph,
      @case_material, @case_diameter, @case_thickness, @lug_width, @water_resistance,
      @dial_color, @index_type, @crystal_type, @luminescence,
      @strap_material, @buckle_type,
      @purchase_price, @current_market_value
    )
  `);
  const result = stmt.run(data);
  return findById(result.lastInsertRowid);
};

export const update = (id, data) => {
  const stmt = db.prepare(`
    UPDATE watches SET
      brand = @brand, model = @model,
      reference_number = @reference_number, production_year = @production_year,
      movement_type = @movement_type, caliber = @caliber,
      power_reserve = @power_reserve, bph = @bph,
      case_material = @case_material, case_diameter = @case_diameter,
      case_thickness = @case_thickness, lug_width = @lug_width,
      water_resistance = @water_resistance, dial_color = @dial_color,
      index_type = @index_type, crystal_type = @crystal_type,
      luminescence = @luminescence, strap_material = @strap_material,
      buckle_type = @buckle_type, purchase_price = @purchase_price,
      current_market_value = @current_market_value,
      updated_at = datetime('now')
    WHERE id = @id
  `);
  stmt.run({ ...data, id });
  return findById(id);
};

export const remove = (id) => {
  return db.prepare('DELETE FROM watches WHERE id = ?').run(id);
};