// ================= STEP 1 : HERO =================
// این فایل فقط قالب HTML مرحله اول رو نگه می‌داره.
// چون همه دکمه‌ها از توابع سراسری goToStep/validateStep2/... در app.js و بقیه فایل‌ها استفاده می‌کنن،
// نیازی به منطق جداگانه‌ای اینجا نیست.

const STEP1_HTML = `
  <div class="hero-bg">
    <img src="img/pic1.jpg" alt="هوشمندسازی خانه" class="hero-img">
    <div class="hero-tint"></div>
  </div>
  <div class="hero-top">
    <img src="img/logo.webp" alt="لوگو" class="hero-logo">
  </div>
  <div class="hero-bottom">
    <div class="glass-panel">
        <div class="glass-shine"></div>
        <div class="headline">خانه‌تان، هوشمندتر از همیشه</div>
        <div class="subtext">به پنل هوشمند مشتری اِوان خوش آمدید. برای دسترسی بیشتر وارد شوید</div>
      <button class="btn-primary" onclick="goToStep(2)">
        <span>ورود / ثبت‌نام</span>
      </button>
    </dive
  </div>
`;
