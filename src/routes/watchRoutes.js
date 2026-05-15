import { Router } from 'express';
import * as watchService from '../services/watchService.js';

const router = Router();

// GET /api/watches — tüm koleksiyon (filtreleme destekli)
router.get('/', (req, res) => {
  try {
    const filters = {
      brand: req.query.brand,
      movement_type: req.query.movement_type,
      case_material: req.query.case_material,
    };
    const watches = watchService.getAllWatches(filters);
    res.json({ success: true, data: watches, count: watches.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/watches/stats — koleksiyon istatistikleri
router.get('/stats', (req, res) => {
  try {
    const stats = watchService.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/watches/:id — tek saat
router.get('/:id', (req, res) => {
  try {
    const watch = watchService.getWatchById(Number(req.params.id));
    res.json({ success: true, data: watch });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

// POST /api/watches — yeni saat ekle
router.post('/', (req, res) => {
  try {
    const watch = watchService.createWatch(req.body);
    res.status(201).json({ success: true, data: watch });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/watches/:id — güncelle
router.put('/:id', (req, res) => {
  try {
    const watch = watchService.updateWatch(Number(req.params.id), req.body);
    res.json({ success: true, data: watch });
  } catch (err) {
    const status = err.message === 'Saat bulunamadı.' ? 404 : 400;
    res.status(status).json({ success: false, error: err.message });
  }
});

// DELETE /api/watches/:id — sil
router.delete('/:id', (req, res) => {
  try {
    const result = watchService.deleteWatch(Number(req.params.id));
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

export default router;