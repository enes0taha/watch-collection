import db from './db.js';

export const findAll = (userId, filters = {}) => {
  let query = 'SELECT * FROM watches WHERE user_id = ?';
  const params = [userId];

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

export const findById = (id, userId) => {
  return db.prepare('SELECT * FROM watches WHERE id = ? AND user_id = ?').get(id, userId);
};

export const create = (data, userId) => {
  const stmt = db.prepare(`
    INSERT INTO watches (
      user_id,
      brand, model, reference_number, production_year,
      movement_type, caliber, power_reserve, bph,
      case_material, case_diameter, case_thickness, lug_width, water_resistance,
      dial_color, index_type, crystal_type, luminescence,
      strap_material, buckle_type,
      purchase_price, current_market_value
    ) VALUES (
      @user_id,
      @brand, @model, @reference_number, @production_year,
      @movement_type, @caliber, @power_reserve, @bph,
      @case_material, @case_diameter, @case_thickness, @lug_width, @water_resistance,
      @dial_color, @index_type, @crystal_type, @luminescence,
      @strap_material, @buckle_type,
      @purchase_price, @current_market_value
    )
  `);
  const result = stmt.run({ ...data, user_id: userId });
  return findById(result.lastInsertRowid, userId);
};

export const update = (id, userId, data) => {
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
    WHERE id = @id AND user_id = @user_id
  `);
  stmt.run({ ...data, id, user_id: userId });
  return findById(id, userId);
};

export const remove = (id, userId) => {
  return db.prepare('DELETE FROM watches WHERE id = ? AND user_id = ?').run(id, userId);
};