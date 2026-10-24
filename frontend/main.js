// ۱. تولید ستاره‌های پویای پس‌زمینه (در صفحه اصلی و داشبورد)
function initDynamicStars() {
    const starsContainer = document.getElementById('dynamic-stars');
    const starCount = 180;

    if (starsContainer) {
        starsContainer.innerHTML = '';
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star-dot');
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 2.5 + 1;
            const duration = Math.random() * 3 + 1.5;
            const delay = Math.random() * 3;

            star.style.left = `${x}vw`;
            star.style.top = `${y}vh`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.setProperty('--duration', `${duration}s`);
            star.style.animationDelay = `${delay}s`;

            starsContainer.appendChild(star);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initDynamicStars();
});

// ۲. سوئیچ تم تاریک و روشن
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        themeToggle.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
    });
}

// ۳. تولید ذرات نوری لوگوی صفحه اصلی
const dustGroup = document.getElementById('dust-group');
if (dustGroup) {
    const colors = ['#00ff66', '#ff5500', '#ffffff', '#00e5ff'];

    for (let i = 0; i < 90; i++) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 150 + 20;
        const cx = 200 + Math.cos(angle) * radius;
        const cy = 200 + Math.sin(angle) * radius;
        const r = Math.random() * 3 + 1;
        const color = colors[Math.floor(Math.random() * colors.length)];

        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", r);
        circle.setAttribute("fill", color);
        circle.setAttribute("class", "dust-p");

        dustGroup.appendChild(circle);
    }
}

// ۴. ساختار اسکرول GSAP
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const panels = gsap.utils.toArray('.panel');
    const navLinks = document.querySelectorAll('.nav-menu a');

    function updateActiveNav(activeIndex) {
        navLinks.forEach(link => {
            const linkIndex = parseInt(link.getAttribute('data-index'));
            if (linkIndex === activeIndex) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    if (panels.length > 0) {
        panels.forEach((panel, i) => {
            gsap.set(panel, {
                z: -i * 2000,
                opacity: i === 0 ? 1 : 0
            });
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".scroll-container",
                start: "top top",
                end: `+=${panels.length * 100}%`,
                pin: true,
                scrub: 1,
                onUpdate: (self) => {
                    const activeIndex = Math.round(self.progress * (panels.length - 1));
                    updateActiveNav(activeIndex);
                }
            }
        });

        tl.to('.pulse-ring', { scale: 0.1, rotate: 180, opacity: 0, transformOrigin: "200px 200px", duration: 0.8 }, 0)
          .to('.energy-core', { scale: 0.1, opacity: 0, transformOrigin: "200px 200px", duration: 0.7 }, 0)
          .to('.lightning-bolt', { scale: 0, rotate: -90, opacity: 0, transformOrigin: "200px 200px", duration: 0.6 }, 0)
          .to('.dust-p', { cx: 200, cy: 200, r: 0, opacity: 0, duration: 0.8, stagger: 0.004 }, 0);

        panels.forEach((panel, i) => {
            if (i > 0) {
                tl.to(panels[i - 1], { opacity: 0, z: 1000, duration: 1 }, `step-${i}`)
                  .to(panel, { opacity: 1, z: 0, duration: 1 }, `step-${i}`);
            }
        });
    }
}

// ۵. پرش به پنل با کلیک منو
function jumpToPanel(index) {
    const panels = document.querySelectorAll('.panel');
    const totalPanels = panels.length;
    if (totalPanels === 0) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    const stepRatio = index / (totalPanels - 1);
    const targetScroll = stepRatio * maxScroll;

    window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
    });
}

// ۶. جستجوی زنده بازی‌ها
function filterGames() {
    const searchInputElem = document.getElementById('gameSearch');
    if (!searchInputElem) return;
    const searchInput = searchInputElem.value.toLowerCase();
    const cards = document.querySelectorAll('.cyber-game-card');

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const genre = card.querySelector('.genre').textContent.toLowerCase();

        if (title.includes(searchInput) || genre.includes(searchInput)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// ۷. فیلتر دسته‌بندی بازی‌ها
function filterCategory(category, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const cards = document.querySelectorAll('.cyber-game-card');

    cards.forEach(card => {
        const categories = card.getAttribute('data-category');
        if (category === 'all' || (categories && categories.includes(category))) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// ۸. تعاملات درخت FAQ (باز و بسته شدن کامل شاخه‌ها و سوالات)
function toggleBranch(element) {
    const branch = element.parentElement;
    if (branch) {
        branch.classList.toggle('open');
        const icon = branch.querySelector('.branch-toggle-icon');
        if (icon) {
            icon.textContent = branch.classList.contains('open') ? '−' : '+';
        }
    }
}

function toggleAnswer(element) {
    const nodeItem = element.parentElement;
    if (nodeItem) {
        nodeItem.classList.toggle('active');
    }
}

// ==================== پایگاه داده اطلاعات بازی‌ها ====================
const gamesData = {
    warzone: {
        title: "Call of Duty: Warzone 2.0",
        genre: "Shooter / Battle Royale",
        icon: "🎯",
        dev: "Raven Software / Infinity Ward",
        publisher: "Activision",
        players: "+450,000 روزانه",
        ping: "32 ms (بدون Packet Loss)",
        desc: "وارزون ۲ یکی از سنگین‌ترین بازی‌های آنلاین از نظر ترافیک شبکه است. سرورهای Gaming DNS پینگ را تا ۳۲ میلی‌ثانیه کاهش داده و تحریم‌های اکتیویژن را کاملاً بی‌اثر می‌سازند."
    },
    eafc24: {
        title: "EA Sports FC 24 / FIFA",
        genre: "Sports / Football Simulator",
        icon: "⚽",
        dev: "EA Vancouver / EA Romania",
        publisher: "EA Sports",
        players: "+600,000 روزانه",
        ping: "28 ms (تأخیر کلیک صفر)",
        desc: "در رقابت‌های آنلاین آلتیمیت تیم FC 24، زیرساخت اختصاصی ما دلی سرورهای EA را از بین برده و روان‌ترین تجربه پاس‌کاری را به ارمغان می‌آورد."
    },
    valorant: {
        title: "Valorant",
        genre: "Tactical Shooter / FPS",
        icon: "🔫",
        dev: "Riot Games",
        publisher: "Riot Games",
        players: "+800,000 روزانه",
        ping: "35 ms (ثابت و بدون نوسان)",
        desc: "سرورهای ترکیبی استانبول و فرانکفورت Gaming DNS پینگ شما را بدون ذره‌ای Packet Loss روی ۳۵ میلی‌ثانیه قفل می‌کنند."
    },
    pubg: {
        title: "PUBG Mobile",
        genre: "Mobile Battle Royale",
        icon: "📱",
        dev: "LIGHTSPEED & QUANTUM",
        publisher: "Tencent Games",
        players: "+2,500,000 روزانه",
        ping: "40 ms (سازگار با ایمولاتور و موبایل)",
        desc: "پشتیبانی کامل از شبیه‌سازهای PC و گوشی‌های موبایل با رفع کامل ارورهای اتصال به سرورهای اروپا."
    },
    apex: {
        title: "Apex Legends",
        genre: "Hero Shooter / Battle Royale",
        icon: "🛡️",
        dev: "Respawn Entertainment",
        publisher: "Electronic Arts",
        players: "+300,000 روزانه",
        ping: "38 ms (بدون قطع لابی)",
        desc: "کاهش چشمگیر ارورهای قطعی کد لابی در اپکس لجندز با مسیردهی اختصاصی به دیتاسنترهای بلژیک و آلمان."
    },
    lol: {
        title: "League of Legends",
        genre: "MOBA / Strategy",
        icon: "⚔️",
        dev: "Riot Games",
        publisher: "Riot Games",
        players: "+1,200,000 روزانه",
        ping: "42 ms (مستقیم به EU West)",
        desc: "حذف تحریم‌های لابی لول و کاهش لَگ در مبارزات تیمی با اتصال مستقیم به دیتاسنتر EU West."
    },
    rainbow: {
        title: "Rainbow Six Siege",
        genre: "Tactical FPS / Action",
        icon: "💥",
        dev: "Ubisoft Montreal",
        publisher: "Ubisoft",
        players: "+200,000 روزانه",
        ping: "34 ms (تأییدشده شوترهای تاکتیکال)",
        desc: "پاسخ‌دهی سریع شبکه در نبردهای نزدیک و عبور کامل از تحریم‌های یوبی‌سافت کلاینت."
    },
    rocket: {
        title: "Rocket League",
        genre: "Action / Sports",
        icon: "🚗",
        dev: "Psyonix",
        publisher: "Epic Games",
        players: "+350,000 روزانه",
        ping: "29 ms (بدون Rubberbanding)",
        desc: "حذف کامل افکت پرش ماشین در سرورهای اپیک گیمز با پینگ فوق‌العاده پایین."
    }
};

// ==================== مدیریت مودال توضیحات بازی ====================
const gameModal = document.getElementById('gameModal');
const closeGameBtn = document.getElementById('closeGameBtn');

if (gameModal) {
    document.querySelectorAll('.cyber-game-card').forEach(card => {
        card.addEventListener('click', () => {
            const gameId = card.getAttribute('data-id');
            const data = gamesData[gameId];

            if (data) {
                const gTitle = document.getElementById('gTitle');
                const gGenre = document.getElementById('gGenre');
                const gIcon = document.getElementById('gIcon');
                const gDev = document.getElementById('gDev');
                const gPublisher = document.getElementById('gPublisher');
                const gPlayers = document.getElementById('gPlayers');
                const gPing = document.getElementById('gPing');
                const gDesc = document.getElementById('gDesc');

                if (gTitle) gTitle.textContent = data.title;
                if (gGenre) gGenre.textContent = data.genre;
                if (gIcon) gIcon.textContent = data.icon;
                if (gDev) gDev.textContent = data.dev;
                if (gPublisher) gPublisher.textContent = data.publisher;
                if (gPlayers) gPlayers.textContent = data.players;
                if (gPing) gPing.textContent = data.ping;
                if (gDesc) gDesc.textContent = data.desc;

                gameModal.classList.add('active');
            }
        });
    });

    if (closeGameBtn) {
        closeGameBtn.addEventListener('click', () => gameModal.classList.remove('active'));
    }
    
    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) gameModal.classList.remove('active');
    });
}

// ==================== مدیریت مودال ورود و انتقال به داشبورد ====================
const authModal = document.getElementById('authModal');
const openAuthBtn = document.getElementById('openAuthBtn');
const closeAuthBtn = document.getElementById('closeAuthBtn');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (openAuthBtn && authModal) {
    openAuthBtn.addEventListener('click', () => authModal.classList.add('active'));
    if (closeAuthBtn) {
        closeAuthBtn.addEventListener('click', () => authModal.classList.remove('active'));
    }

    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) authModal.classList.remove('active');
    });

    if (loginTab && registerTab && loginForm && registerForm) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        });

        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.href = 'dashboard.html';
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.href = 'dashboard.html';
    });
}