// ─── MOBILE MENU ───
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ─── NAVBAR SCROLL EFFECT ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── SCROLL PROGRESS BAR ───
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// ─── FADE IN SECTIONS ───
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.section').forEach(sec => sectionObserver.observe(sec));

// ─── BEFORE/AFTER SLIDER ───
document.querySelectorAll('.ba-comparison').forEach(container => {
    const before = container.querySelector('.ba-before');
    const handle = container.querySelector('.ba-handle');
    let isActive = false;

    const setPosition = (clientX) => {
        const rect = container.getBoundingClientRect();
        let x = clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const percent = (x / rect.width) * 100;
        before.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        handle.style.left = percent + '%';
    };

    const handleMove = (e) => {
        if (!isActive) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        setPosition(clientX);
    };

    const handleEnd = () => {
        isActive = false;
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
    };

    const handleStart = (e) => {
        isActive = true;
        e.preventDefault();
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('touchend', handleEnd);
    };

    container.addEventListener('mousedown', handleStart);
    container.addEventListener('touchstart', handleStart, { passive: false });

    // Initialize at 50%
    before.style.clipPath = 'inset(0 50% 0 0)';
    handle.style.left = '50%';
});

// ─── LIGHTBOX ───
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightbox-caption');
const galleryImages = document.querySelectorAll('.gallery-grid img');

galleryImages.forEach(img => {
    img.addEventListener('click', () => {
        lightbox.style.display = 'block';
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.alt || '';
        document.body.style.overflow = 'hidden';
    });
});

function closeLightbox() {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
    lightboxCaption.textContent = '';
    document.body.style.overflow = '';
}
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

// ─── BACK TO TOP ───
const backToTopBtn = document.getElementById('backToTop');
function toggleBackToTop() {
    backToTopBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
}
window.addEventListener('scroll', toggleBackToTop);
backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
toggleBackToTop();

// ─── HERO PARTICLES (simple canvas) ───
const canvas = document.getElementById('heroCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    const particles = [];
    const maxParticles = 40;

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2.5 + 0.8;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201, 169, 110, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}