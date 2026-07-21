// ================= STEP 4 : SUCCESS =================
// قالب HTML انیمیشن تاییدیه + کارت خلاصه اطلاعات.
// مقداردهی sumName/sumPhone/... در تابع submitForm (step3.js) انجام می‌شه.
//      <div class="summary-row"><span class="k">زمان تماس</span><span class="v rtl-v" id="sumTime">—</span></div>

const STEP4_HTML = `
  <div class="success-wrap">
    <div class="check-ring">
      <div class="ring-glow"></div>
      <svg viewBox="0 0 120 120">
        <circle class="circle-path" cx="60" cy="60" r="48"/>
        <path class="check-path" d="M40,62 L54,76 L82,46"/>
      </svg>
    </div>
    <div class="success-title">اطلاعات شما ثبت شد</div>
    <div class="success-sub">به‌زودی کارشناسان ما در بهترین زمان ممکن با شما تماس خواهند گرفت.</div>
    <div class="summary-card">
      <div class="summary-row"><span class="k">نام</span><span class="v rtl-v" id="sumName">—</span></div>
      <div class="summary-row"><span class="k">تلفن</span><span class="v" id="sumPhone">—</span></div>
      <div class="summary-row"><span class="k">پروژه</span><span class="v rtl-v" id="sumProject">—</span></div>
      <div class="summary-row"><span class="k">بازه</span><span class="v rtl-v" id="sumProject">—</span></div>
    </div>
  </div>
`;
