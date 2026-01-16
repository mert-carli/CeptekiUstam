# 🚀 Web'e Deployment Rehberi - Cepteki Ustam

## ✅ Yapılan Düzeltmeler

### 1. API URL'leri Dinamik Hale Getirildi
- ✅ `login.js`, `admin.js`, `main.js` dosyalarında API URL otomatik algılanıyor
- Artık hem localhost'ta hem de web'de çalışır

### 2. Environment Variables Hazır
- ✅ `.env` dosyası mevcut
- ✅ `.gitignore` ile hassas bilgiler korunuyor

---

## 📋 Web'e Çıkmadan Önce Yapılması Gerekenler

### 1. **Gmail App Password Oluşturun**
   - Gmail hesabınızda 2FA (İki faktörlü doğrulama) aktif olmalı
   - https://myaccount.google.com/apppasswords adresine gidin
   - "Mail" için uygulama şifresi oluşturun
   - 16 haneli şifreyi `.env` dosyasındaki `GMAIL_PASSWORD` kısmına yazın

### 2. **Admin Şifresini Değiştirin**
   - `.env` dosyasında `ADMIN_PASSWORD=20034` yerine güçlü bir şifre belirleyin

---

## 🌐 Deployment Seçenekleri

### Seçenek 1: **Render.com** (ÜCRETSİZ + Kolay)

#### Adımlar:
1. **GitHub'a Yükleyin**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/KULLANICI_ADINIZ/cepteki-ustam.git
   git push -u origin main
   ```

2. **Render.com'a Gidin**
   - https://render.com adresine kaydolun
   - "New +" → "Web Service" seçin
   - GitHub reponuzu bağlayın

3. **Ayarları Yapın**
   - **Name**: cepteki-ustam
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Environment Variables Ekleyin**
   ```
   NODE_ENV=production
   PORT=3000
   ADMIN_USERNAME=MertYunus
   ADMIN_PASSWORD=güçlü_şifreniz
   GMAIL_USER=ceptekiustam@gmail.com
   GMAIL_PASSWORD=16_haneli_app_password
   ```

5. **Deploy Edin**
   - "Create Web Service" tıklayın
   - 5-10 dakika içinde siteniz hazır olacak!

---

### Seçenek 2: **Railway.app** (ÜCRETSİZ)

1. https://railway.app adresine gidin
2. GitHub ile giriş yapın
3. "New Project" → "Deploy from GitHub repo"
4. Environment variables ekleyin (yukardaki gibi)
5. Deploy!

---

### Seçenek 3: **Vercel** (Sadece Frontend için - Sunucu Değil)
❌ Bu proje Node.js sunucu kullandığı için Vercel uygun değil.

---

### Seçenek 4: **Kendi Sunucunuz** (VPS - Ücretli)

DigitalOcean, Hetzner, AWS, Azure gibi platformlarda VPS kiralayıp:

```bash
# Sunucuya bağlanın
ssh root@sunucu_ip

# Node.js kurun
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 kurun (process manager)
sudo npm install -g pm2

# Projeyi klonlayın
git clone https://github.com/KULLANICI_ADINIZ/cepteki-ustam.git
cd cepteki-ustam

# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun
nano .env
# (içeriği yapıştırın ve kaydedin)

# Sunucuyu başlatın
pm2 start server/server.js --name cepteki-ustam
pm2 save
pm2 startup

# Nginx kurarak HTTPS ekleyin
sudo apt install nginx certbot python3-certbot-nginx
```

---

## ⚙️ Production Kontrol Listesi

- [ ] `.env` dosyasında Gmail App Password ayarlandı
- [ ] Admin şifresi güçlü bir şifre ile değiştirildi
- [ ] `.gitignore` dosyası `.env` dosyasını kapsıyor
- [ ] GitHub'a yüklemeden önce `node_modules/` klasörü ignore edildi
- [ ] HTTPS sertifikası alındı (Let's Encrypt ücretsiz)
- [ ] Domain adı ayarlandı (opsiyonel)

---

## 🔒 Güvenlik Önerileri

1. **HTTPS Kullanın**: Let's Encrypt ile ücretsiz SSL sertifikası alın
2. **Rate Limiting**: API isteklerine limit koyun (örn: express-rate-limit)
3. **Helmet.js**: HTTP güvenlik başlıkları için
4. **CORS**: Sadece kendi domain'inizden istek kabul edin

---

## 📞 Destek

Deployment sırasında sorun yaşarsanız:
- Render.com için: https://render.com/docs
- Railway için: https://docs.railway.app

---

## 🎉 Sonuç

Artık projeniz web'e çıkmaya hazır! Düzeltmeler yapıldı:
- ✅ API URL'leri dinamik
- ✅ Environment variables hazır
- ✅ Production scripts mevcut

**Önerilen Platform**: Render.com (Ücretsiz, kolay, güvenilir)
