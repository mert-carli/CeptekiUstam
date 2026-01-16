// ========================================
// Configuration
// ========================================

// API URL'yi otomatik belirle (production veya development)
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : 'https://BURAYA_RENDER_URL_YAZIN/api'; // Örn: https://cepteki-ustam.onrender.com/api
const WHATSAPP_NUMBER = '905515065704';
const REPORT_WHATSAPP_NUMBER = '905515065704';

// ========================================
// DOM Elements
// ========================================

const reportForm = document.getElementById('reportForm');
const successModal = document.getElementById('successModal');
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav__menu');
const contactWhatsAppForm = document.getElementById('contactWhatsAppForm');
const contactNameInput = document.getElementById('contactName');
const contactIssueInput = document.getElementById('contactIssue');

// ========================================
// Track Page Visit
// ========================================

async function trackVisit() {
    try {
        await fetch(`${API_URL}/track-visit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Ziyaret kaydedilemedi:', error);
    }
}

// ========================================
// Form Handling
// ========================================

if (reportForm) {
    reportForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = reportForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        // Button loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Gönderiliyor...';

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            serviceType: document.getElementById('serviceType').value,
            description: document.getElementById('description').value,
            address: document.getElementById('address').value
        };

        // WhatsApp mesajı hazırla
        const message = `🔧 ARIZA BİLDİRİMİ

👤 Ad Soyad: ${formData.name}
☎️ Telefon: ${formData.phone}
🔨 Hizmet Türü: ${formData.serviceType}
📍 Adres: ${formData.address}
📋 Açıklama:
${formData.description}`;
        
        // WhatsApp'a yönlendir
        const waUrl = `https://wa.me/${REPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');

        // API'ye gönder (arka planda, başarısız olsa bile devam et)
        try {
            await fetch(`${API_URL}/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        } catch (error) {
            console.error('API hatası (yok sayılacak):', error);
        }

        // Show success modal
        showModal();

        // Reset form
        reportForm.reset();
        
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    });
}

// Contact WhatsApp form
if (contactWhatsAppForm) {
    contactWhatsAppForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = (contactNameInput?.value || '').trim();
        const issue = (contactIssueInput?.value || '').trim();

        if (!name || !issue) {
            alert('Lütfen ad soyad ve arıza açıklamasını girin.');
            return;
        }

        const message = `Merhaba, ben ${name}. Arıza bildirimi: ${issue}`;
        const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        window.open(waUrl, '_blank');
        contactWhatsAppForm.reset();
    });
}

// ========================================
// Modal Functions
// ========================================

function showModal() {
    if (successModal) {
        successModal.classList.add('active');
    }
}

function closeModal() {
    if (successModal) {
        successModal.classList.remove('active');
    }
}

// Close modal when clicking outside
if (successModal) {
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeModal();
        }
    });
}

// ========================================
// Mobile Navigation
// ========================================

if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
        console.log('Hamburger menu clicked');
        e.stopPropagation();
        navMenu.classList.toggle('active');
        console.log('Menu active:', navMenu.classList.contains('active'));
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ========================================
// Smooth Scroll
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Header Scroll Effect
// ========================================

let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }

    lastScroll = currentScroll;
});

// ========================================
// Form Validation Enhancement
// ========================================

const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        // Remove non-numeric characters
        let value = e.target.value.replace(/\D/g, '');

        // Format phone number (05XX XXX XX XX)
        if (value.length > 0) {
            if (value.length <= 4) {
                value = value;
            } else if (value.length <= 7) {
                value = value.slice(0, 4) + ' ' + value.slice(4);
            } else if (value.length <= 9) {
                value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7);
            } else {
                value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7, 9) + ' ' + value.slice(9, 11);
            }
        }

        e.target.value = value;
    });
}

// ========================================
// Intersection Observer for Animations
// ========================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const animatedElements = [
    // General & Services
    { selector: '.service-card', class: 'animate-fade-up', stagger: true },
    { selector: '.section__title', class: 'animate-fade-up', stagger: false },
    { selector: '.section__description', class: 'animate-fade-up', stagger: false },

    // Report Section (Has different class naming)
    { selector: '.section-title', class: 'animate-fade-up', stagger: false },
    { selector: '.section-subtitle', class: 'animate-fade-up', stagger: false },
    { selector: '.badge--orange', class: 'animate-fade-up', stagger: false },
    { selector: '.trust-item', class: 'animate-fade-left', stagger: true },
    { selector: '.report-card', class: 'animate-fade-up', stagger: false },

    // Contact & Footer
    { selector: '.contact-card', class: 'animate-scale', stagger: true },
    { selector: '.whatsapp-card', class: 'animate-scale', stagger: false },
    { selector: '.footer-col', class: 'animate-fade-up', stagger: true }
];

animatedElements.forEach(item => {
    const elements = document.querySelectorAll(item.selector);
    elements.forEach((el, index) => {
        el.classList.add('animate-ready', item.class);

        // Add stagger delay if needed
        if (item.stagger) {
            const delay = (index % 3) * 100 + 100; // 100ms, 200ms, 300ms...
            el.style.transitionDelay = `${delay}ms`;
        }

        observer.observe(el);
    });
});

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Track page visit
    trackVisit();

    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
});

// ========================================
// Error Handling
// ========================================

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// ========================================
// Performance Monitoring
// ========================================

if ('performance' in window) {
    window.addEventListener('load', () => {
        // Calculate load time
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        const loadTime = navigationEntry ? (navigationEntry.loadEventEnd - navigationEntry.startTime) : 0;

        console.log(`Sayfa yüklenme süresi: ${loadTime}ms`);
    });
}

// ========================================
// Number Counter Animation
// ========================================

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        // Add + or % if needed
        const hasPlus = obj.textContent.includes('+');
        const hasPercent = obj.textContent.includes('%');

        const value = Math.floor(progress * (end - start) + start);
        obj.textContent = (hasPercent ? '%' : '') + value + (hasPlus ? '+' : '');

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const text = el.textContent;
            // Extract number
            const target = parseInt(text.replace(/[^0-9]/g, ''));

            if (!isNaN(target) && target > 0) {
                animateValue(el, 0, target, 2000);
            }

            statsObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat__number').forEach(stat => {
    statsObserver.observe(stat);
});

// ========================================
// 3D Tilt Effect
// ========================================

document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg
        const rotateY = ((x - centerX) / centerX) * 5;  // Max 5 deg

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ========================================
// Scroll Spy (Active Link Highlighter)
// ========================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100; // Offset for header
        const sectionId = current.getAttribute('id');
        const sectionLink = document.querySelector(`.nav__menu a[href*=${sectionId}]`);

        if (sectionLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                sectionLink.classList.add('active-link');
            } else {
                sectionLink.classList.remove('active-link');
            }
        }
    });
}

window.addEventListener('scroll', scrollActive);
// Initial check
scrollActive();
