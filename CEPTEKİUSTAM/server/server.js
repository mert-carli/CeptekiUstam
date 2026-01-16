const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // Token oluşturmak için
const nodemailer = require('nodemailer'); // Mail göndermek için
require('dotenv').config(); // Environment variables yükleme

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://cepteki-ustam.vercel.app',
        'https://www.cepteki-ustam.vercel.app'
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/img', express.static(path.join(__dirname, '../img')));

// Data dosyalarının yolları
const DATA_DIR = path.join(__dirname, '../data');
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');

// Admin Şifresi ve Token Saklama
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'MertYunus';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '20034';
const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000; // 24 saat
let adminSessions = new Map(); // Token -> timestamp mapping

// Süresi dolmuş tokenları temizle
setInterval(() => {
    const now = Date.now();
    for (const [token, timestamp] of adminSessions.entries()) {
        if (now - timestamp > TOKEN_EXPIRATION) {
            adminSessions.delete(token);
        }
    }
}, 60 * 60 * 1000); // Her saat kontrol et

// Mail Ayarları (Gmail Transporter)
// .env dosyasında ayarlanan Gmail credentials kullan
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || 'ceptekiustam@gmail.com',
        pass: process.env.GMAIL_PASSWORD || 'BURAYA_GMAIL_UYGULAMA_SIFRENIZI_YAZIN'
    }
});

// Data klasörünü oluştur
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Dosyaları başlat
if (!fs.existsSync(REPORTS_FILE)) {
    fs.writeFileSync(REPORTS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(STATS_FILE)) {
    const initialStats = {
        totalVisits: 0,
        dailyVisits: {},
        weeklyVisits: {},
        monthlyVisits: {}
    };
    fs.writeFileSync(STATS_FILE, JSON.stringify(initialStats, null, 2));
}

// Veri okuma fonksiyonları
const readReports = () => {
    try {
        const data = fs.readFileSync(REPORTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const readStats = () => {
    try {
        const data = fs.readFileSync(STATS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {
            totalVisits: 0,
            dailyVisits: {},
            weeklyVisits: {},
            monthlyVisits: {}
        };
    }
};

// Veri yazma fonksiyonları
const writeReports = (data) => {
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(data, null, 2));
};

const writeStats = (data) => {
    fs.writeFileSync(STATS_FILE, JSON.stringify(data, null, 2));
};

// Tarih formatları için yardımcı fonksiyonlar (Türkiye Saati - Europe/Istanbul)
const getLocalDate = () => {
    const now = new Date();
    // Sistemin timezone'una bakmadan, Europe/Istanbul'a göre kesin tarih üret
    const istanbulDate = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
    const y = istanbulDate.getFullYear();
    const m = String(istanbulDate.getMonth() + 1).padStart(2, '0');
    const d = String(istanbulDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`; // YYYY-MM-DD
};

const getDateKey = () => {
    return getLocalDate();
};

const getWeekKey = () => {
    const localDateStr = getLocalDate();
    const [year, month, day] = localDateStr.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    const weekNumber = getWeekNumber(localDate);
    return `${year}-W${String(weekNumber).padStart(2, '0')}`;
};

const getMonthKey = () => {
    const localDateStr = getLocalDate();
    const [year, month] = localDateStr.split('-');
    return `${year}-${month}`;
};

const getWeekNumber = (date) => {
    // ISO 8601 haftası hesapla
    const d = new Date(date);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNumber;
};

// Authentication Middleware
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || !adminSessions.has(token)) {
        return res.status(401).json({ success: false, error: 'Yetkisiz erişim. Lütfen giriş yapın.' });
    }

    // Token süresini kontrol et
    const tokenTimestamp = adminSessions.get(token);
    if (Date.now() - tokenTimestamp > TOKEN_EXPIRATION) {
        adminSessions.delete(token);
        return res.status(401).json({ success: false, error: 'Oturum süresi doldu. Lütfen yeniden giriş yapın.' });
    }

    next();
};

// API Endpoints

// Login Endpoint
app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Kullanıcı adı ve şifre gereklidir' });
        }

        console.log('Giriş denemesi:');
        console.log('  Gelen username:', username, '(type:', typeof username, ', length:', username.length, ')');
        console.log('  Beklenen username:', ADMIN_USERNAME, '(type:', typeof ADMIN_USERNAME, ', length:', ADMIN_USERNAME.length, ')');
        console.log('  Gelen password:', password, '(type:', typeof password, ', length:', password.length, ')');
        console.log('  Beklenen password:', ADMIN_PASSWORD, '(type:', typeof ADMIN_PASSWORD, ', length:', ADMIN_PASSWORD.length, ')');
        console.log('  Username eşleşme:', username === ADMIN_USERNAME);
        console.log('  Password eşleşme:', password === ADMIN_PASSWORD);

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            const token = crypto.randomBytes(16).toString('hex');
            adminSessions.set(token, Date.now()); // Token ve oluşturulma zamanını sakla
            
            console.log(`✅ Admin giriş başarılı: ${username} at ${new Date().toISOString()}`);
            
            res.json({ 
                success: true, 
                token, 
                expiresIn: TOKEN_EXPIRATION,
                message: 'Giriş başarılı'
            });
        } else {
            console.log(`❌ Başarısız giriş denemesi: ${username}`);
            res.status(401).json({ success: false, error: 'Hatalı kullanıcı adı veya şifre!' });
        }
    } catch (error) {
        console.error('Login endpoint hatası:', error);
        res.status(500).json({ success: false, error: 'Sunucu hatası' });
    }
});

// Ziyaretçi sayısını artır (Public)
app.post('/api/track-visit', (req, res) => {
    try {
        const stats = readStats();
        const dateKey = getDateKey();
        const weekKey = getWeekKey();
        const monthKey = getMonthKey();

        stats.totalVisits++;
        stats.dailyVisits[dateKey] = (stats.dailyVisits[dateKey] || 0) + 1;
        stats.weeklyVisits[weekKey] = (stats.weeklyVisits[weekKey] || 0) + 1;
        stats.monthlyVisits[monthKey] = (stats.monthlyVisits[monthKey] || 0) + 1;

        writeStats(stats);
        res.json({ success: true, totalVisits: stats.totalVisits });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// İstatistikleri getir (PROTECTED)
app.get('/api/stats', authenticate, (req, res) => {
    try {
        const stats = readStats();
        const dateKey = getDateKey();
        const weekKey = getWeekKey();
        const monthKey = getMonthKey();

        const response = {
            totalVisits: stats.totalVisits,
            todayVisits: stats.dailyVisits[dateKey] || 0,
            weekVisits: stats.weeklyVisits[weekKey] || 0,
            monthVisits: stats.monthlyVisits[monthKey] || 0,
            dailyVisits: stats.dailyVisits,
            weeklyVisits: stats.weeklyVisits,
            monthlyVisits: stats.monthlyVisits
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Yeni arıza bildirimi oluştur (Public - herkes bildirim yapabilir)
app.post('/api/reports', (req, res) => {
    try {
        const { name, phone, serviceType, description, address } = req.body;

        // Validasyon
        if (!name || !phone || !serviceType || !description || !address) {
            return res.status(400).json({
                success: false,
                error: 'Tüm alanlar zorunludur!'
            });
        }

        const reports = readReports();
        const newReport = {
            id: Date.now(),
            name,
            phone,
            serviceType,
            description,
            address,
            status: 'Yeni',
            createdAt: new Date().toISOString()
        };

        reports.push(newReport);
        writeReports(reports);

        // Yöneticiye Mail Gönder
        const mailOptions = {
            from: '"Cepteki Ustam" <ceptekiustam@gmail.com>',
            to: 'ceptekiustam@gmail.com',
            subject: `🔔 Yeni Arıza Bildirimi: ${serviceType}`,
            html: `
                <h2>Yeni Arıza Talebi</h2>
                <p><strong>Ad Soyad:</strong> ${name}</p>
                <p><strong>Telefon:</strong> ${phone}</p>
                <p><strong>Hizmet:</strong> ${serviceType}</p>
                <p><strong>Adres:</strong> ${address}</p>
                <p><strong>Açıklama:</strong> ${description}</p>
                <hr>
                <p><small>Bu mail Cepteki Ustam sisteminden otomatik gönderilmiştir.</small></p>
            `
        };

        // Mail gönder (Gmail şifresi ayarlanmışsa)
        if (process.env.GMAIL_PASSWORD && process.env.GMAIL_PASSWORD !== 'buraya_16_haneli_uygulama_sifrenizi_yazin') {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Mail gönderme hatası:', error.message);
                } else {
                    console.log('Mail gönderildi:', info.response);
                }
            });
        } else {
            console.log('Gmail şifresi ayarlanmadığı için mail gönderilmedi.');
        }

        res.json({
            success: true,
            message: 'Arıza bildiriminiz başarıyla alındı!',
            report: newReport
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Tüm arıza bildirimlerini getir (PROTECTED)
app.get('/api/reports', authenticate, (req, res) => {
    try {
        const reports = readReports();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Belirli bir arıza bildirimini getir (PROTECTED)
app.get('/api/reports/:id', authenticate, (req, res) => {
    try {
        const reports = readReports();
        const report = reports.find(r => r.id === parseInt(req.params.id));

        if (!report) {
            return res.status(404).json({ success: false, error: 'Bildirim bulunamadı!' });
        }

        res.json(report);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Arıza bildirimini güncelle (PROTECTED)
app.put('/api/reports/:id', authenticate, (req, res) => {
    try {
        const reports = readReports();
        const index = reports.findIndex(r => r.id === parseInt(req.params.id));

        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Bildirim bulunamadı!' });
        }

        reports[index] = { ...reports[index], ...req.body, updatedAt: new Date().toISOString() };
        writeReports(reports);

        res.json({ success: true, report: reports[index] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Arıza bildirimini sil (PROTECTED)
app.delete('/api/reports/:id', authenticate, (req, res) => {
    try {
        const reports = readReports();
        const filteredReports = reports.filter(r => r.id !== parseInt(req.params.id));

        if (reports.length === filteredReports.length) {
            return res.status(404).json({ success: false, error: 'Bildirim bulunamadı!' });
        }

        writeReports(filteredReports);
        res.json({ success: true, message: 'Bildirim silindi!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin paneli için rotalar
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Server başlat
app.listen(PORT, () => {
    console.log(`🚀 Cepteki Ustam sunucusu ${PORT} portunda çalışıyor!`);
    console.log(`📱 Ana sayfa: http://localhost:${PORT}`);
    console.log(`⚙️  Admin paneli: http://localhost:${PORT}/admin`);
});

