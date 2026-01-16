# Cepteki Ustam - Profesyonel Arıza Çözüm Platformu

Modern, kullanıcı dostu ve mobil uyumlu web tabanlı arıza bildirimi platformu. Ev ve iş yerlerindeki arızalar için hızlı ve güvenilir usta bulma hizmeti.

## 🚀 Özellikler

### Kullanıcı Tarafı
- ✅ Modern ve kullanıcı dostu arayüz
- ✅ Responsive tasarım (mobil, tablet, masaüstü)
- ✅ 5 farklı hizmet kategorisi
  - Sıhhi Tesisat
  - Elektrik
  - Parke
  - Tadilat
  - Sanayi Hizmetleri
- ✅ Kolay arıza bildirimi formu
- ✅ Telefon numarası otomatik formatlama
- ✅ Başarı bildirimi modalı
- ✅ Smooth scroll ve animasyonlar
- ✅ SEO uyumlu yapı

### Admin Paneli
- ✅ Gerçek zamanlı ziyaretçi istatistikleri
  - Toplam ziyaretçi sayısı
  - Günlük ziyaretçi
  - Haftalık ziyaretçi
  - Aylık ziyaretçi
- ✅ Arıza bildirimleri yönetimi
  - Tüm bildirimleri listeleme
  - Filtreleme ve arama
  - Detaylı görüntüleme
  - Silme işlemleri
- ✅ Dashboard görünümü
- ✅ Otomatik yenileme (30 saniye)

## 📁 Proje Yapısı

```
CeptekiUstam/
├── public/                 # Frontend dosyaları
│   ├── index.html         # Ana sayfa
│   ├── admin.html         # Admin paneli
│   ├── styles.css         # Ana stil dosyası
│   ├── admin.css          # Admin paneli stilleri
│   ├── main.js            # Ana JavaScript
│   └── admin.js           # Admin paneli JavaScript
├── server/                # Backend dosyaları
│   └── server.js          # Express.js server
├── data/                  # Veri dosyaları (otomatik oluşturulur)
│   ├── reports.json       # Arıza bildirimleri
│   └── stats.json         # Ziyaretçi istatistikleri
├── package.json           # Proje bağımlılıkları
└── README.md              # Dokümantasyon
```

## 🛠️ Teknolojiler

### Frontend
- **HTML5** - Semantik ve erişilebilir markup
- **CSS3** - Modern styling, CSS Grid, Flexbox
- **JavaScript (ES6+)** - Vanilla JavaScript, Fetch API
- **Google Fonts** - Inter font ailesi

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **CORS** - Cross-Origin Resource Sharing
- **File System (fs)** - JSON tabanlı veri depolama

## 📦 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm (Node Package Manager)

### Adımlar

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Environment Değişkenlerini Ayarlayın**

`.env.example` dosyasını `.env` olarak kopyalayın ve değerleri güncelleyin:

```bash
cp .env.example .env
```

`.env` dosyasını açıp gerekli değerleri doldurun:

```env
# Gmail Ayarları
GMAIL_USER=ceptekiustam@gmail.com
GMAIL_PASSWORD=buraya_16_haneli_uygulama_sifrenizi_yazin

# Admin Kimlik Bilgileri
ADMIN_USERNAME=EylülSıla
ADMIN_PASSWORD=20034

# Server Port
PORT=3000

# Node Environment
NODE_ENV=development
```

**Gmail Setup:**
- [Google Account Security](https://myaccount.google.com/security) sayfasına gidin
- "App passwords" bölümünde 16 haneli şifre oluşturun
- `GMAIL_PASSWORD` alanına yapıştırın

3. **Sunucuyu başlatın:**
```bash
npm start
```

Geliştirme modu için (otomatik yeniden başlatma):
```bash
npm run dev
```

4. **Tarayıcıda açın:**
- Ana Sayfa: http://localhost:3000
- Admin Paneli: http://localhost:3000/admin

## 🎯 Kullanım

### Kullanıcı İşlemleri

1. **Ana Sayfayı Ziyaret Edin**
   - Otomatik olarak ziyaretçi sayımı yapılır

2. **Hizmet Kategorilerine Göz Atın**
   - 5 farklı hizmet kategorisi mevcuttur

3. **Arıza Bildirimi Oluşturun**
   - "Hemen Arıza Bildirimi Yap" butonuna tıklayın
   - Formu doldurun:
     - Ad Soyad
     - Telefon (otomatik formatlanır)
     - Hizmet Türü
     - Adres
     - Arıza Açıklaması
   - "Arıza Bildirimi Gönder" butonuna tıklayın
   - Başarı mesajını görün

### Admin İşlemleri

1. **Admin Paneline Giriş**
   - Tarayıcıda `/admin` adresine gidin
   - http://localhost:3000/admin

2. **Dashboard**
   - Ziyaretçi istatistiklerini görüntüleyin
   - Son 5 arıza bildirimini inceleyin

3. **Arıza Bildirimleri**
   - Tüm bildirimleri listeleyin
   - Hizmet türüne göre filtreleyin
   - İsim, telefon veya adrese göre arayın
   - Detayları görüntüleyin
   - Bildirimleri silin

## 🔌 API Endpoints

### Ziyaretçi Takibi
- `POST /api/track-visit` - Ziyaretçi sayısını artır
- `GET /api/stats` - İstatistikleri getir

### Arıza Bildirimleri
- `POST /api/reports` - Yeni bildirim oluştur
- `GET /api/reports` - Tüm bildirimleri listele
- `GET /api/reports/:id` - Belirli bildirimi getir
- `PUT /api/reports/:id` - Bildirimi güncelle
- `DELETE /api/reports/:id` - Bildirimi sil

## 🎨 Tasarım Özellikleri

### Renk Paleti
- **Primary:** #2563eb (Mavi)
- **Secondary:** #10b981 (Yeşil)
- **Accent:** #f59e0b (Turuncu)
- **Text:** #1f2937 (Koyu Gri)
- **Background:** #ffffff (Beyaz)

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Animasyonlar
- Fade in animations
- Hover effects
- Smooth scrolling
- Modal transitions

## 🔒 Güvenlik

- ✅ CORS yapılandırması
- ✅ Input validation
- ✅ XSS koruması (HTML escaping)
- ✅ Sanitized user inputs
- ✅ Admin authentication (Bearer token)
- ✅ Token expiration (24 saat)
- ✅ Environment variables (şifreleri gizleme)
- ✅ Session timeout (otomatik logout)

## 📈 SEO Optimizasyonu

- ✅ Semantic HTML5 yapısı
- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph tags
- ✅ Alt text for images
- ✅ Proper heading hierarchy (H1, H2, H3)
- ✅ Fast loading times
- ✅ Mobile-friendly design
- ✅ Clean URL structure

### Anahtar Kelimeler
- tesisatçı
- elektrik ustası
- tadilat
- parke
- sıhhi tesisat
- arıza bildirimi
- usta bulma
- tamirat

## 🚀 Production Deployment

### Öneriler

1. **Environment Variables**
   - API URL'lerini environment variable olarak ayarlayın
   - Port numarasını konfigüre edin

2. **Database**
   - Production'da JSON yerine gerçek veritabanı kullanın
   - MongoDB, PostgreSQL veya MySQL önerilir

3. **Security**
   - HTTPS kullanın
   - Rate limiting ekleyin
   - Authentication ekleyin (admin paneli için)
   - Input validation güçlendirin

4. **Performance**
   - CSS/JS minification
   - Image optimization
   - CDN kullanımı
   - Gzip compression

5. **Monitoring**
   - Error logging
   - Analytics
   - Uptime monitoring

## 📝 Lisans

MIT License - Bu projeyi istediğiniz gibi kullanabilirsiniz.

## 👨‍💻 Geliştirici Notları

### Gelecek Özellikler
- [ ] Kullanıcı authentication sistemi
- [ ] E-posta bildirimleri
- [ ] SMS entegrasyonu
- [ ] Usta profilleri ve değerlendirmeleri
- [ ] Online ödeme sistemi
- [ ] Randevu yönetimi
- [ ] Mobil uygulama (React Native)
- [ ] Gerçek zamanlı chat sistemi
- [ ] Fotoğraf yükleme (arıza görselleri)
- [ ] Konum bazlı usta eşleştirme

### Bilinen Sorunlar
- ✅ Admin paneli authentication - EKLENDI ✓
- ✅ Session management ve token expiration - EKLENDI ✓
- ✅ Environment variables - EKLENDI ✓
- JSON dosya bazlı depolama (production için uygun değil) - veritabanına geçiş gerekli

## 📞 Destek

Sorularınız veya önerileriniz için:
- E-posta: info@ceptekiustam.com
- Telefon: 0850 XXX XX XX

---

**Cepteki Ustam** - Arızanız mı var? Biz çözüyoruz! 🔧
