import * as repo from '../database/watchRepository.js';

export const validateWatch = (data) => {
  const errors = [];

  if (!data.brand || data.brand.trim() === '')
    errors.push('Marka zorunludur.');
  if (!data.model || data.model.trim() === '')
    errors.push('Model zorunludur.');

  const currentYear = new Date().getFullYear();
  if (data.production_year !== undefined && data.production_year !== '') {
    const year = Number(data.production_year);
    if (isNaN(year) || year < 1800 || year > currentYear)
      errors.push(`Üretim yılı 1800 ile ${currentYear} arasında olmalıdır.`);
  }

  if (data.purchase_price !== undefined && data.purchase_price !== '') {
    if (Number(data.purchase_price) < 0)
      errors.push('Alış fiyatı negatif olamaz.');
  }
  if (data.current_market_value !== undefined && data.current_market_value !== '') {
    if (Number(data.current_market_value) < 0)
      errors.push('Piyasa değeri negatif olamaz.');
  }

  if (data.case_diameter !== undefined && data.case_diameter !== '') {
    const d = Number(data.case_diameter);
    if (isNaN(d) || d < 20 || d > 60)
      errors.push('Kasa çapı 20mm ile 60mm arasında olmalıdır.');
  }

  const validMovements = ['Automatic', 'Manual', 'Quartz', 'Mecha-Quartz'];
  if (data.movement_type && !validMovements.includes(data.movement_type))
    errors.push('Geçersiz mekanizma tipi.');

  const validMaterials = ['Steel', 'Gold', 'Titanium', 'Ceramic'];
  if (data.case_material && !validMaterials.includes(data.case_material))
    errors.push('Geçersiz kasa materyali.');

  return errors;
};

export const calculateCollectionMetrics = (watches) => {
  if (!watches || watches.length === 0) {
    return {
      watchCount: 0,
      totalPurchaseValue: 0,
      totalMarketValue: 0,
      totalGainLoss: 0,
      gainLossPercent: 0,
      mostValuable: null,
    };
  }

  const totalPurchaseValue = watches.reduce((sum, w) => sum + (w.purchase_price || 0), 0);
  const totalMarketValue = watches.reduce((sum, w) => sum + (w.current_market_value || 0), 0);
  const totalGainLoss = totalMarketValue - totalPurchaseValue;
  const gainLossPercent = totalPurchaseValue > 0
    ? ((totalGainLoss / totalPurchaseValue) * 100).toFixed(2)
    : 0;

  const mostValuable = watches.reduce((max, w) =>
    (w.current_market_value || 0) > (max.current_market_value || 0) ? w : max
  , watches[0]);

  return {
    watchCount: watches.length,
    totalPurchaseValue,
    totalMarketValue,
    totalGainLoss,
    gainLossPercent: Number(gainLossPercent),
    mostValuable,
  };
};

export const getBrandDistribution = (watches) => {
  const dist = {};
  watches.forEach(w => { dist[w.brand] = (dist[w.brand] || 0) + 1; });
  return Object.entries(dist)
    .sort((a, b) => b[1] - a[1])
    .map(([brand, count]) => ({ brand, count }));
};

export const getAllWatches = (userId, filters) => repo.findAll(userId, filters);

export const getWatchById = (id, userId) => {
  const watch = repo.findById(id, userId);
  if (!watch) throw new Error('Saat bulunamadı.');
  return watch;
};

export const createWatch = (data, userId) => {
  const errors = validateWatch(data);
  if (errors.length > 0) throw new Error(errors.join(' '));
  return repo.create(data, userId);
};

export const updateWatch = (id, userId, data) => {
  const existing = repo.findById(id, userId);
  if (!existing) throw new Error('Saat bulunamadı.');
  const errors = validateWatch(data);
  if (errors.length > 0) throw new Error(errors.join(' '));
  return repo.update(id, userId, data);
};

export const deleteWatch = (id, userId) => {
  const existing = repo.findById(id, userId);
  if (!existing) throw new Error('Saat bulunamadı.');
  repo.remove(id, userId);
  return { message: 'Saat silindi.' };
};

export const getStats = (userId) => {
  const watches = repo.findAll(userId);
  return {
    metrics: calculateCollectionMetrics(watches),
    brandDistribution: getBrandDistribution(watches),
  };
};