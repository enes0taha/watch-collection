import {
  validateWatch,
  calculateCollectionMetrics,
  getBrandDistribution,
} from '../src/services/watchService.js';

// ==================== VALİDASYON TESTLERİ ====================

describe('validateWatch', () => {
  test('marka ve model varsa hata dönmemeli', () => {
    const errors = validateWatch({ brand: 'Rolex', model: 'Submariner' });
    expect(errors).toHaveLength(0);
  });

  test('marka yoksa hata dönemli', () => {
    const errors = validateWatch({ brand: '', model: 'Submariner' });
    expect(errors).toContain('Marka zorunludur.');
  });

  test('model yoksa hata dönemli', () => {
    const errors = validateWatch({ brand: 'Rolex', model: '' });
    expect(errors).toContain('Model zorunludur.');
  });

  test('gelecek yıl üretim yılı hata vermeli', () => {
    const errors = validateWatch({
      brand: 'Rolex',
      model: 'Sub',
      production_year: 2099,
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  test('1800 öncesi üretim yılı hata vermeli', () => {
    const errors = validateWatch({
      brand: 'Rolex',
      model: 'Sub',
      production_year: 1700,
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  test('geçerli üretim yılı hata vermemeli', () => {
    const errors = validateWatch({
      brand: 'Rolex',
      model: 'Sub',
      production_year: 2020,
    });
    expect(errors).toHaveLength(0);
  });

  test('negatif alış fiyatı hata vermeli', () => {
    const errors = validateWatch({
      brand: 'Rolex',
      model: 'Sub',
      purchase_price: -100,
    });
    expect(errors).toContain('Alış fiyatı negatif olamaz.');
  });

  test('negatif piyasa değeri hata vermeli', () => {
    const errors = validateWatch({
      brand: 'Rolex',
      model: 'Sub',
      current_market_value: -500,
    });
    expect(errors).toContain('Piyasa değeri negatif olamaz.');
  });

  test('geçersiz kasa çapı hata vermeli', () => {
    const errors = validateWatch({
      brand: 'Rolex',
      model: 'Sub',
      case_diameter: 10,
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  test('geçersiz mekanizma tipi hata vermeli', () => {
    const errors = validateWatch({
      brand: 'Rolex',
      model: 'Sub',
      movement_type: 'GecersizTip',
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  test('geçerli mekanizma tipi hata vermemeli', () => {
    const errors = validateWatch({
      brand: 'Rolex',
      model: 'Sub',
      movement_type: 'Automatic',
    });
    expect(errors).toHaveLength(0);
  });
});

// ==================== METRİK TESTLERİ ====================

describe('calculateCollectionMetrics', () => {
  const mockWatches = [
    { brand: 'Rolex', model: 'Sub', purchase_price: 50000, current_market_value: 65000 },
    { brand: 'Omega', model: 'Speedy', purchase_price: 30000, current_market_value: 28000 },
    { brand: 'Rolex', model: 'GMT', purchase_price: 70000, current_market_value: 90000 },
  ];

  test('boş koleksiyonda sıfır dönemli', () => {
    const result = calculateCollectionMetrics([]);
    expect(result.watchCount).toBe(0);
    expect(result.totalMarketValue).toBe(0);
    expect(result.totalPurchaseValue).toBe(0);
  });

  test('saat sayısını doğru hesaplamalı', () => {
    const result = calculateCollectionMetrics(mockWatches);
    expect(result.watchCount).toBe(3);
  });

  test('toplam alış değerini doğru hesaplamalı', () => {
    const result = calculateCollectionMetrics(mockWatches);
    expect(result.totalPurchaseValue).toBe(150000);
  });

  test('toplam piyasa değerini doğru hesaplamalı', () => {
    const result = calculateCollectionMetrics(mockWatches);
    expect(result.totalMarketValue).toBe(183000);
  });

  test('kar/zarar doğru hesaplamalı', () => {
    const result = calculateCollectionMetrics(mockWatches);
    expect(result.totalGainLoss).toBe(33000);
  });

  test('en değerli saati doğru bulmalı', () => {
    const result = calculateCollectionMetrics(mockWatches);
    expect(result.mostValuable.model).toBe('GMT');
  });
});

// ==================== MARKA DAĞILIM TESTLERİ ====================

describe('getBrandDistribution', () => {
  test('marka dağılımını doğru hesaplamalı', () => {
    const watches = [
      { brand: 'Rolex' },
      { brand: 'Rolex' },
      { brand: 'Omega' },
    ];
    const result = getBrandDistribution(watches);
    expect(result[0].brand).toBe('Rolex');
    expect(result[0].count).toBe(2);
    expect(result[1].brand).toBe('Omega');
    expect(result[1].count).toBe(1);
  });

  test('boş dizide boş array dönemli', () => {
    const result = getBrandDistribution([]);
    expect(result).toHaveLength(0);
  });

  test('sıralama büyükten küçüğe olmalı', () => {
    const watches = [
      { brand: 'Omega' },
      { brand: 'Rolex' },
      { brand: 'Rolex' },
      { brand: 'Rolex' },
      { brand: 'Omega' },
      { brand: 'Tudor' },
    ];
    const result = getBrandDistribution(watches);
    expect(result[0].brand).toBe('Rolex');
    expect(result[1].brand).toBe('Omega');
    expect(result[2].brand).toBe('Tudor');
  });
});