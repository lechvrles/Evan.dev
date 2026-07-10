// ================= STEP 3 : CALL PREFERENCE =================
// قالب HTML + منطق انتخاب چندتایی روزها و بازه‌های زمانی

const STEP3_HTML = `
  <div class="form-shell">
    <div class="form-head">
      <span class="kicker mono">02 ·</span>
      <div class="form-title">بهترین زمان تماس با شما</div>
      <div class="form-desc"></div>
    </div>

    <div class="form-body">
      <div class="q-block">
        <div class="q-title">کدوم روزهای هفته براتون مناسب‌تره؟</div>
        <div class="q-sub">می‌تونید چند روز رو انتخاب کنید</div>
        <div class="chip-grid days" id="daysGrid">
          <div class="chip" data-val="شنبه">شنبه</div>
          <div class="chip" data-val="یکشنبه">یکشنبه</div>
          <div class="chip" data-val="دوشنبه">دوشنبه</div>
          <div class="chip" data-val="سه‌شنبه">سه‌شنبه</div>
          <div class="chip" data-val="چهارشنبه">چهارشنبه</div>
          <div class="chip" data-val="پنجشنبه">پنجشنبه</div>
          <div class="chip" data-val="جمعه">جمعه</div>
        </div>
      </div>

      <div class="q-block">
        <div class="q-title">کدوم بازه از روز رو ترجیح می‌دید؟</div>
        <div class="q-sub">می‌تونید چند بازه رو انتخاب کنید</div>
        <div class="chip-grid slots" id="slotsGrid">
          <div class="chip" data-val="صبح (۸ تا ۱۲)">صبح (۸ تا ۱۲)</div>
          <div class="chip" data-val="ظهر (۱۲ تا ۱۶)">ظهر (۱۲ تا ۱۶)</div>
          <div class="chip" data-val="عصر (۱۶ تا ۲۰)">عصر (۱۶ تا ۲۰)</div>
          <div class="chip" data-val="شب (۲۰ تا ۲۳)">شب (۲۰ تا ۲۳)</div>
        </div>
      </div>
    </div>

    <div class="form-footer">
      <button class="btn-primary" id="submitBtn" onclick="submitForm()" disabled>
        <span>ثبت اطلاعات</span>
      </button>
    </div>
  </div>
`;

function attachStep3Listeners(){
  document.querySelectorAll('#daysGrid .chip').forEach(chip=>{
    chip.addEventListener('click', ()=> toggleChip(chip, state.days));
  });
  document.querySelectorAll('#slotsGrid .chip').forEach(chip=>{
    chip.addEventListener('click', ()=> toggleChip(chip, state.slots));
  });
}

function toggleChip(el, set){
  const val = el.dataset.val;
  el.classList.toggle('selected');
  if(set.has(val)) set.delete(val); else set.add(val);
  checkStep3Ready();
}

function checkStep3Ready(){
  const ready = state.days.size > 0 && state.slots.size > 0;
  document.getElementById('submitBtn').disabled = !ready;
}

async function submitForm(){
  const btn = document.getElementById('submitBtn');
  const btnText = document.getElementById('submitBtnText');
  const errorBox = document.getElementById('submitError');

  errorBox.textContent = '';
  btn.disabled = true;
  btnText.textContent = 'در حال ثبت...';

  const payload = {
    name: state.name,
    phone: state.phone,
    project: state.project,
    location: state.location,
    days: Array.from(state.days),
    slots: Array.from(state.slots),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/signups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if(!res.ok || !data.ok){
      throw new Error(data.error || 'خطای نامشخص از سرور');
    }

    document.getElementById('sumName').textContent = state.name;
    document.getElementById('sumPhone').textContent = state.phone;
    document.getElementById('sumProject').textContent = state.project;
    document.getElementById('sumTime').textContent =
      payload.days.join('، ') + ' — ' + payload.slots.join('، ');

    goToStep(4);
  } catch (err) {
    console.error(err);
    errorBox.textContent = err.message.includes('fetch')
      ? 'اتصال به سرور برقرار نشد. مطمئن شوید بک‌اند روشنه.'
      : err.message;
    btn.disabled = false;
    btnText.textContent = 'ثبت اطلاعات';
  }
}
