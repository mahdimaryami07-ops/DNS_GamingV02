gsap.registerPlugin(ScrollTrigger);

// ۱. تولید ستاره‌های پویای پس‌زمینه
const starsContainer = document.getElementById('dynamic-stars');
const starCount = 180;

if (starsContainer) {
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

// ۲. سوئیچ تم تاریک و روشن
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    themeToggle.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
});

// ۳. تولید ذرات نوری لوگو
const dustGroup = document.getElementById('dust-group');
const colors = ['#00e5ff', '#3b82f6', '#ffffff', '#6366f1'];

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

// ۴. ساختار اسکرول GSAP + روشن شدن دقیق آیتم منو
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

// ۵. پرش دقیق صدم‌ثانیه‌ای به مرکز هر پنل با کلیک روی منو
function jumpToPanel(index) {
    const totalPanels = panels.length;
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
    const searchInput = document.getElementById('gameSearch').value.toLowerCase();
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
    btn.classList.add('active');

    const cards = document.querySelectorAll('.cyber-game-card');

    cards.forEach(card => {
        const categories = card.getAttribute('data-category');
        if (category === 'all' || categories.includes(category)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// ==================== پایگاه داده توضیحات اختصاصی بازی‌ها ====================
const gamesData = {
    warzone: {
        title: "Call of Duty: Warzone 2.0",
        genre: "Shooter / Battle Royale",
        icon: "🎯",
        dev: "Raven Software / Infinity Ward",
        publisher: "Activision",
        players: "+450,000 روزانه",
        ping: "32 ms (بدون Packet Loss)",
        desc: "وارزون ۲ یکی از سنگین‌ترین بازی‌های آنلاین از نظر ترافیک شبکه است. سرورهای Gaming DNS با حذف کامل گره‌های واسطه دیتاسنترهای خاورمیانه و متصل کردن مستقیم سیستم شما به سرورهای فرانكفورت آلمان، پینگ را تا ۳۲ میلی‌ثانیه کاهش داده و تحریم‌های اکتیویژن را کاملاً بی‌اثر می‌سازند."
    },
    eafc24: {
        title: "EA Sports FC 24 / FIFA",
        genre: "Sports / Football Simulator",
        icon: "⚽",
        dev: "EA Vancouver / EA Romania",
        publisher: "EA Sports",
        players: "+600,000 روزانه",
        ping: "28 ms (تأخیر کلیک صفر)",
        desc: "در رقابت‌های آنلاین کلاب و آلتیمیت تیم FC 24، حتی ۵ میلی‌ثانیه دلی (Delay) می‌تواند سرنوشت مسابقه را تغییر دهد. زیرساخت اختصاصی ما دلی هاردکور سرورهای EA را از بین برده و روان‌ترین تجربه پاس‌کاری و شوت‌زنی را برای شما به ارمغان می‌آورد."
    },
    valorant: {
        title: "Valorant",
        genre: "Tactical Shooter / FPS",
        icon: "🔫",
        dev: "Riot Games",
        publisher: "Riot Games",
        players: "+800,000 روزانه",
        ping: "35 ms (ثابت و بدون نوسان)",
        desc: "بازی ولورانت نسبت به تغییرات لحظه‌ای پینگ و چَک‌پکت‌ها بسیار حساس است. سرورهای ترکیبی استانبول و فرانکفورت Gaming DNS پینگ شما را بدون ذره‌ای Packet Loss روی ۳۵ میلی‌ثانیه قفل می‌کنند تا ریجستر تیرها کاملاً دقیق انجام شود."
    },
    pubg: {
        title: "PUBG Mobile",
        genre: "Mobile Battle Royale",
        icon: "📱",
        dev: "LIGHTSPEED & QUANTUM",
        publisher: "Tencent Games",
        players: "+2,500,000 روزانه",
        ping: "40 ms (سازگار با ایمولاتور و موبایل)",
        desc: "پشتیبانی کامل از شبیه‌سازهای PC (GameLoop) و گوشی‌های اندروید و iOS. رفع کامل ارورهای اتصال به سرورهای پینگی اروپا و ثبت پینگ پایدار ۴۰ms بدون قطعی صدای دیسکورد و ویس‌چت بازی."
    },
    apex: {
        title: "Apex Legends",
        genre: "Hero Shooter / Battle Royale",
        icon: "🛡️",
        dev: "Respawn Entertainment",
        publisher: "Electronic Arts",
        players: "+300,000 روزانه",
        ping: "38 ms (بدون قطع لابی)",
        desc: "کاهش چشمگیر ارورهای قطعی کد لابی (Code: Leaf / Code: Net) در اپکس لجندز. مسیردهی شبکه به‌صورت اختصاصی به نزدیک‌ترین دیتاسنترهای بلژیک و آلمان انجام می‌شود."
    },
    lol: {
        title: "League of Legends",
        genre: "MOBA / Strategy",
        icon: "⚔️",
        dev: "Riot Games",
        publisher: "Riot Games",
        players: "+1,200,000 روزانه",
        ping: "42 ms (مستقیم به EU West)",
        desc: "حذف تحریم‌های لابی لول و کاهش لَگ در مبارزات تیمی (Team Fights). متصل به دیتاسنتر EU West با کمترین زمان پاسخ‌دهی جهت کلیک‌ها و استفاده از اسکیل‌ها."
    },
    rainbow: {
        title: "Rainbow Six Siege",
        genre: "Tactical FPS / Action",
        icon: "💥",
        dev: "Ubisoft Montreal",
        publisher: "Ubisoft",
        players: "+200,000 روزانه",
        ping: "34 ms (تأییدشده شوترهای تاکتیکال)",
        desc: "پاسخ‌دهی سریع شبکه در نبردهای نزدیک و زاویه‌گیری‌های صدم‌ثانیه‌ای در رینبو سیکس. عبور کامل از تحریم‌های یوبی‌سافت کلاینت (Ubisoft Connect)."
    },
    rocket: {
        title: "Rocket League",
        genre: "Action / Sports",
        icon: "🚗",
        dev: "Psyonix",
        publisher: "Epic Games",
        players: "+350,000 روزانه",
        ping: "29 ms (بدون Rubberbanding)",
        desc: "حذف کامل افکت پرش توپ و ماشین (Rubberbanding) در سرورهای اپیک گیمز. پینگ فوق‌العاده پایین و اتصال ۱۰۰٪ پایدار."
    }
};

// ==================== مدیریت مودال اطلاعات اختصاصی بازی‌ها ====================
const gameModal = document.getElementById('gameModal');
const closeGameBtn = document.getElementById('closeGameBtn');

// باز شدن مودال بازی با کلیک روی کارت
document.querySelectorAll('.cyber-game-card').forEach(card => {
    card.addEventListener('click', () => {
        const gameId = card.getAttribute('data-id');
        const data = gamesData[gameId];

        if (data) {
            document.getElementById('gTitle').textContent = data.title;
            document.getElementById('gGenre').textContent = data.genre;
            document.getElementById('gIcon').textContent = data.icon;
            document.getElementById('gDev').textContent = data.dev;
            document.getElementById('gPublisher').textContent = data.publisher;
            document.getElementById('gPlayers').textContent = data.players;
            document.getElementById('gPing').textContent = data.ping;
            document.getElementById('gDesc').textContent = data.desc;

            gameModal.classList.add('active');
        }
    });
});

closeGameBtn.addEventListener('click', () => gameModal.classList.remove('active'));
gameModal.addEventListener('click', (e) => {
    if (e.target === gameModal) gameModal.classList.remove('active');
});

// ==================== مدیریت پنجره مودال ورود / ثبت‌نام ====================
const authModal = document.getElementById('authModal');
const openAuthBtn = document.getElementById('openAuthBtn');
const closeAuthBtn = document.getElementById('closeAuthBtn');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

openAuthBtn.addEventListener('click', () => authModal.classList.add('active'));
closeAuthBtn.addEventListener('click', () => authModal.classList.remove('active'));

authModal.addEventListener('click', (e) => {
    if (e.target === authModal) authModal.classList.remove('active');
});

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

// ==================== سنجش زنده سختی رمز عبور ====================
const regPassword = document.getElementById('regPassword');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

const ruleLength = document.getElementById('ruleLength');
const ruleLower = document.getElementById('ruleLower');
const ruleUpper = document.getElementById('ruleUpper');
const ruleSymbol = document.getElementById('ruleSymbol');

regPassword.addEventListener('input', () => {
    const val = regPassword.value;
    let score = 0;

    const isLengthValid = val.length >= 8;
    updateRuleState(ruleLength, isLengthValid);
    if (isLengthValid) score++;

    const isLowerValid = /[a-z]/.test(val);
    updateRuleState(ruleLower, isLowerValid);
    if (isLowerValid) score++;

    const isUpperValid = /[A-Z]/.test(val);
    updateRuleState(ruleUpper, isUpperValid);
    if (isUpperValid) score++;

    const isSymbolValid = /[0-9!@#$%^&*(),.?":{}|<>]/.test(val);
    updateRuleState(ruleSymbol, isSymbolValid);
    if (isSymbolValid) score++;

    switch (score) {
        case 0:
            strengthBar.style.width = '0%';
            strengthBar.style.backgroundColor = '#ff4757';
            strengthText.textContent = 'خیلی ضعیف';
            strengthText.style.color = '#ff4757';
            break;
        case 1:
            strengthBar.style.width = '25%';
            strengthBar.style.backgroundColor = '#ff4757';
            strengthText.textContent = 'ضعیف';
            strengthText.style.color = '#ff4757';
            break;
        case 2:
            strengthBar.style.width = '50%';
            strengthBar.style.backgroundColor = '#ffa502';
            strengthText.textContent = 'متوسط';
            strengthText.style.color = '#ffa502';
            break;
        case 3:
            strengthBar.style.width = '75%';
            strengthBar.style.backgroundColor = '#2ed573';
            strengthText.textContent = 'خوب';
            strengthText.style.color = '#2ed573';
            break;
        case 4:
            strengthBar.style.width = '100%';
            strengthBar.style.backgroundColor = '#00ffaa';
            strengthText.textContent = 'عالی و فوق‌العاده قوی';
            strengthText.style.color = '#00ffaa';
            break;
    }
});

function updateRuleState(element, isValid) {
    const icon = element.querySelector('.rule-icon');
    if (isValid) {
        element.classList.add('valid');
        icon.textContent = '✓';
    } else {
        element.classList.remove('valid');
        icon.textContent = '✕';
    }
}