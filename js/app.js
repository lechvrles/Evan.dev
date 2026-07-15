// ================= APP.JS =================
const API_BASE_URL = '';

const state = {
  name:'', phone:'', project:'', location:null,
  days:new Set(), slots:new Set()
};
let currentStep = 1;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('step1').innerHTML = STEP1_HTML;
  document.getElementById('step2').innerHTML = STEP2_HTML;
  document.getElementById('step3').innerHTML = STEP3_HTML;
  document.getElementById('step4').innerHTML = STEP4_HTML;
  attachStep3Listeners();
});

function updateStepper(step){
  const stepper = document.getElementById('stepper');
  const label = document.getElementById('stepLabel');
  if(step === 1){ stepper.classList.remove('show'); return; }
  stepper.classList.add('show');
  const idx = step - 1;
  label.textContent = 'STEP 0' + idx + '/03';
  document.querySelectorAll('.dot').forEach(d=>{
    const i = parseInt(d.dataset.i);
    d.classList.toggle('active', i === idx);
    d.classList.toggle('done', i < idx);
  });
}

function goToStep(step){
  const from = document.getElementById('step'+currentStep);
  const to = document.getElementById('step'+step);
  from.classList.add('exit-right');
  setTimeout(()=>{
    from.classList.add('hidden-step');
    from.classList.remove('exit-right');
    to.classList.remove('hidden-step');
    to.classList.add('enter-from-right');
    if(step === 2 && typeof initLocationMap === 'function'){
      initLocationMap();
    }
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{ to.classList.remove('enter-from-right'); });
    });
    currentStep = step;
    updateStepper(step);
  }, 380);
}

function setFieldError(id, isInvalid){
  document.getElementById(id).classList.toggle('invalid', isInvalid);
}
