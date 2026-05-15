# ⌚ Watch Collection

Saat koleksiyonu yönetim sistemi. Node.js, Express ve SQLite ile geliştirilmiş full-stack CRUD uygulaması.

## Teknolojiler

- **Backend:** Node.js, Express
- **Veritabanı:** SQLite (better-sqlite3)
- **Frontend:** Vanilla JavaScript (SPA)
- **API Dokümantasyonu:** Swagger / OpenAPI 3.0
- **Test:** Jest

## Kurulum

### Gereksinimler

- Node.js v18+
- Git

### Adımlar

1. Repoyu klonla

        git clone https://github.com/KULLANICI_ADIN/watch-collection.git
        cd watch-collection

2. Bağımlılıkları yükle

        npm install

3. .env dosyasını oluştur

        PORT=3000
        DB_PATH=./watches.db

4. Geliştirme sunucusunu başlat

        npm run dev

Tarayıcıda aç: http://localhost:3000

## Çalıştırma

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu (nodemon) |
| `npm start` | Production sunucusu |
| `npm test` | Unit testleri çalıştır |

## API Kullanımı

Swagger UI: http://localhost:3000/api-docs

### Endpoint'ler

| Metot | Path | Açıklama |
|---|---|---|
| GET | /api/watches | Tüm saatleri listele |
| GET | /api/watches/:id | Tek saat getir |
| POST | /api/watches | Yeni saat ekle |
| PUT | /api/watches/:id | Saati güncelle |
| DELETE | /api/watches/:id | Saati sil |
| GET | /api/watches/stats | Koleksiyon istatistikleri |

### Filtreleme

    GET /api/watches?brand=Rolex
    GET /api/watches?movement_type=Automatic
    GET /api/watches?case_material=Steel

### Örnek İstek

    POST /api/watches
    Content-Type: application/json

    {
      "brand": "Rolex",
      "model": "Submariner",
      "reference_number": "126610LN",
      "production_year": 2021,
      "movement_type": "Automatic",
      "caliber": "Cal. 3235",
      "power_reserve": 70,
      "case_material": "Steel",
      "case_diameter": 41,
      "water_resistance": 300,
      "dial_color": "Black",
      "crystal_type": "Sapphire",
      "purchase_price": 50000,
      "current_market_value": 65000
    }

## Proje Yapısı

    watch-collection/
    ├── src/
    │   ├── database/
    │   │   ├── db.js              # SQLite bağlantısı ve şema
    │   │   └── watchRepository.js # SQL sorguları
    │   ├── routes/
    │   │   └── watchRoutes.js     # HTTP endpoint'leri
    │   ├── services/
    │   │   └── watchService.js    # İş mantığı ve validasyon
    │   └── app.js                 # Express kurulumu
    ├── public/                    # Vanilla JS frontend
    │   ├── index.html
    │   ├── app.js
    │   └── style.css
    ├── test/
    │   └── watchService.test.js   # Unit testler
    ├── swagger.yaml               # API dokümantasyonu
    ├── server.js                  # Giriş noktası
    └── README.md

## Yeniden Üretim

    git clone https://github.com/KULLANICI_ADIN/watch-collection.git
    cd watch-collection
    npm install
    npm run dev

Tarayıcıda http://localhost:3000 adresini aç.