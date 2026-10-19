gsap.registerPlugin(ScrollTrigger);

// ۱. ساخت دینامیک بیش از ۱۵۰ ستاره پرتراکم در سراسر پس‌زمینه
const starsContainer = document.getElementById('dynamic-stars');
const starCount = 180;

if (starsContainer) {
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star-dot');
        
        // موقعیت تصادفی
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // سایز تصادفی
        const size = Math.random() * 2.5 + 1;
        
        // زمان‌بندی چشمک زدن تصادفی
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

// ۲. کلید تغییر تم
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

// ۴. انیمیشن اسکرول
const panels = gsap.utils.toArray('.panel');

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

function jumpToPanel(index) {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = (index / (panels.length - 1)) * totalScroll;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
}