gsap.registerPlugin(ScrollTrigger);

const panels = gsap.utils.toArray('.panel');

// تنظیم لایه‌ها در عمق ۳ بعدی (Z-axis)
panels.forEach((panel, i) => {
    gsap.set(panel, {
        z: -i * 2000, // هر بخش ۲۰۰۰ پیکسل در عمق عقب‌تر قرار می‌گیرد
        opacity: i === 0 ? 1 : 0
    });
});

// انیمیشن زوم هنگام اسکرول
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: `+=${panels.length * 100}%`,
        pin: true,
        scrub: 1, // حرکت روان انیمیشن متناسب با اسکرول
    }
});

panels.forEach((panel, i) => {
    if (i > 0) {
        // آوردن لایه بعدی به جلو (Zoom In)
        tl.to(panels[i - 1], { opacity: 0, z: 1000, duration: 1 }, `step-${i}`)
          .to(panel, { opacity: 1, z: 0, duration: 1 }, `step-${i}`);
    }
});