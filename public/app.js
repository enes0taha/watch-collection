const API = 'http://localhost:3000/api/watches';

let currentStep = 1;
const totalSteps = 6;
let editingId = null;

// ==================== SAYFA YÖNETİMİ ====================

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.getElementById(`page-${name}`).classList.remove('hidden');
  if (name === 'list') loadWatches();
  if (name === 'stats') loadStats();
  if (name === 'add') {
    editingId = null;
    document.getElementById('form-title').textContent = 'Yeni Saat Ekle';
    resetForm();
  }
}

// ==================== FORM ADIM YÖNETİMİ ====================

function goToStep(step) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.add('hidden'));
  document.getElementById(`step-${step}`).classList.remove('hidden');

  document.querySelectorAll('.step').forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.step) === step);
  });

  document.getElementById('btn-prev').classList.toggle('hidden', step === 1);
  document.getElementById('btn-next').classList.toggle('hidden', step === totalSteps);
  document.getElementById('btn-submit').classList.toggle('hidden', step !== totalSteps);
}

function nextStep() {
  if (!validateStep(currentStep)) return;
  if (currentStep < totalSteps) {
    currentStep++;
    goToStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    goToStep(currentStep);
  }
}

function validateStep(step) {
  const errorDiv = document.getElementById('form-error');
  errorDiv.classList.add('hidden');

  if (step === 1) {
    const brand = document.getElementById('f-brand').value.trim();
    const model = document.getElementById('f-model').value.trim();
    const year = document.getElementById('f-production_year').value;

    if (!brand) return showError('Marka zorunludur.');
    if (!model) return showError('Model zorunludur.');
    if (year && (year < 1800 || year > new Date().getFullYear()))
      return showError(`Üretim yılı 1800 ile ${new Date().getFullYear()} arasında olmalıdır.`);
  }

  if (step === 3) {
    const d = document.getElementById('f-case_diameter').value;
    if (d && (d < 20 || d > 60))
      return showError('Kasa çapı 20mm ile 60mm arasında olmalıdır.');
  }

  if (step === 6) {
    const pp = document.getElementById('f-purchase_price').value;
    const mv = document.getElementById('f-current_market_value').value;
    if (pp && pp < 0) return showError('Alış fiyatı negatif olamaz.');
    if (mv && mv < 0) return showError('Piyasa değeri negatif olamaz.');
  }

  return true;
}

function showError(msg) {
  const errorDiv = document.getElementById('form-error');
  errorDiv.textContent = msg;
  errorDiv.classList.remove('hidden');
  return false;
}

function resetForm() {
  const fields = [
    'brand','model','reference_number','production_year',
    'movement_type','caliber','power_reserve','bph',
    'case_material','case_diameter','case_thickness','lug_width','water_resistance',
    'dial_color','index_type','crystal_type','luminescence',
    'strap_material','buckle_type','purchase_price','current_market_value'
  ];
  fields.forEach(f => {
    const el = document.getElementById(`f-${f}`);
    if (el) el.value = '';
  });
  document.getElementById('f-luminescence').value = '0';
  document.getElementById('form-error').classList.add('hidden');
  currentStep = 1;
  goToStep(1);
}

function getFormData() {
  return {
    brand: document.getElementById('f-brand').value.trim(),
    model: document.getElementById('f-model').value.trim(),
    reference_number: document.getElementById('f-reference_number').value.trim(),
    production_year: document.getElementById('f-production_year').value || null,
    movement_type: document.getElementById('f-movement_type').value || null,
    caliber: document.getElementById('f-caliber').value.trim() || null,
    power_reserve: document.getElementById('f-power_reserve').value || null,
    bph: document.getElementById('f-bph').value || null,
    case_material: document.getElementById('f-case_material').value || null,
    case_diameter: document.getElementById('f-case_diameter').value || null,
    case_thickness: document.getElementById('f-case_thickness').value || null,
    lug_width: document.getElementById('f-lug_width').value || null,
    water_resistance: document.getElementById('f-water_resistance').value || null,
    dial_color: document.getElementById('f-dial_color').value.trim() || null,
    index_type: document.getElementById('f-index_type').value || null,
    crystal_type: document.getElementById('f-crystal_type').value || null,
    luminescence: parseInt(document.getElementById('f-luminescence').value),
    strap_material: document.getElementById('f-strap_material').value || null,
    buckle_type: document.getElementById('f-buckle_type').value || null,
    purchase_price: document.getElementById('f-purchase_price').value || null,
    current_market_value: document.getElementById('f-current_market_value').value || null,
  };
}

// ==================== API ÇAĞRILARI ====================

async function loadWatches() {
  const brand = document.getElementById('filter-brand').value;
  const movement = document.getElementById('filter-movement').value;
  const material = document.getElementById('filter-material').value;

  let url = API + '?';
  if (brand) url += `brand=${encodeURIComponent(brand)}&`;
  if (movement) url += `movement_type=${encodeURIComponent(movement)}&`;
  if (material) url += `case_material=${encodeURIComponent(material)}&`;

  const res = await fetch(url);
  const json = await res.json();
  renderWatches(json.data || []);
}

async function submitForm() {
  if (!validateStep(currentStep)) return;
  const data = getFormData();
  const url = editingId ? `${API}/${editingId}` : API;
  const method = editingId ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) return showError(json.error || 'Bir hata oluştu.');

  showPage('list');
}

async function deleteWatch(id) {
  if (!confirm('Bu saati silmek istediğinizden emin misiniz?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  loadWatches();
}

async function loadStats() {
  const res = await fetch(`${API}/stats`);
  const json = await res.json();
  renderStats(json.data);
}

async function editWatch(id) {
  const res = await fetch(`${API}/${id}`);
  const json = await res.json();
  const w = json.data;

  editingId = id;
  document.getElementById('form-title').textContent = 'Saati Düzenle';
  showPage('add');

  // Forma doldur
  const fields = [
    'brand','model','reference_number','production_year',
    'movement_type','caliber','power_reserve','bph',
    'case_material','case_diameter','case_thickness','lug_width','water_resistance',
    'dial_color','index_type','crystal_type','luminescence',
    'strap_material','buckle_type','purchase_price','current_market_value'
  ];
  fields.forEach(f => {
    const el = document.getElementById(`f-${f}`);
    if (el && w[f] !== null && w[f] !== undefined) el.value = w[f];
  });
}

// ==================== RENDER ====================

function renderWatches(watches) {
  const container = document.getElementById('watch-list');
  if (watches.length === 0) {
    container.innerHTML = '<div class="empty-state">⌚ Henüz saat eklenmedi.<br>+ Yeni Saat butonuna tıklayın.</div>';
    return;
  }

  container.innerHTML = watches.map(w => `
    <div class="watch-card">
      <h3>${w.brand} ${w.model}</h3>
      <div class="ref">${w.reference_number || ''} ${w.production_year ? '• ' + w.production_year : ''}</div>
      ${w.movement_type ? `<span class="badge">${w.movement_type}</span>` : ''}
      ${w.case_material ? `<span class="badge">${w.case_material}</span>` : ''}
      ${w.case_diameter ? `<span class="badge">${w.case_diameter}mm</span>` : ''}
      ${w.crystal_type ? `<span class="badge">${w.crystal_type}</span>` : ''}
      ${w.current_market_value ? `<div class="price">₺${Number(w.current_market_value).toLocaleString('tr-TR')}</div>` : ''}
      <div class="card-actions">
        <button class="btn-edit" onclick="editWatch(${w.id})">✏️ Düzenle</button>
        <button class="btn-delete" onclick="deleteWatch(${w.id})">🗑️</button>
      </div>
    </div>
  `).join('');
}

function renderStats(data) {
  if (!data) return;
  const m = data.metrics;
  const gainClass = m.totalGainLoss >= 0 ? 'gain' : 'loss';
  const gainSign = m.totalGainLoss >= 0 ? '+' : '';

  document.getElementById('stats-content').innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${m.watchCount}</div>
        <div class="stat-label">Toplam Saat</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">₺${Number(m.totalMarketValue).toLocaleString('tr-TR')}</div>
        <div class="stat-label">Toplam Piyasa Değeri</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">₺${Number(m.totalPurchaseValue).toLocaleString('tr-TR')}</div>
        <div class="stat-label">Toplam Alış Değeri</div>
      </div>
      <div class="stat-card">
        <div class="stat-value ${gainClass}">${gainSign}₺${Number(m.totalGainLoss).toLocaleString('tr-TR')}</div>
        <div class="stat-label">Toplam Kar/Zarar</div>
      </div>
      <div class="stat-card">
        <div class="stat-value ${gainClass}">${gainSign}${m.gainLossPercent}%</div>
        <div class="stat-label">Getiri Oranı</div>
      </div>
      ${m.mostValuable ? `
      <div class="stat-card">
        <div class="stat-value" style="font-size:1rem">${m.mostValuable.brand} ${m.mostValuable.model}</div>
        <div class="stat-label">En Değerli Saat</div>
      </div>` : ''}
    </div>

    <h3 style="color:#c9a84c; margin-bottom:1rem;">Marka Dağılımı</h3>
    <div class="brand-list">
      ${data.brandDistribution.map(b => `
        <div class="brand-item">
          <span>${b.brand}</span>
          <span style="color:#c9a84c; font-weight:600">${b.count} saat</span>
        </div>
      `).join('')}
    </div>
  `;
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

// ==================== BAŞLANGIÇ ====================
showPage('list');