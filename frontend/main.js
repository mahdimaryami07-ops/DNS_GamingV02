gsap.registerPlugin(ScrollTrigger);

// ۱. کلید تغییر تم
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    themeToggle.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
});

// ۲. تولید ذرات نوری
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

// ۳. انیمیشن اسکرول
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

// تابعی برای اسکرول سریع به بخش مورد نظر از طریق منو
function jumpToPanel(index) {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = (index / (panels.length - 1)) * totalScroll;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
}