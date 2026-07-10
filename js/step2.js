// ================= STEP 2 : INFO FORM =================
// قالب HTML + منطق اعتبارسنجی مرحله دوم (نام، تلفن، نام پروژه)

const STEP2_HTML = `
  <div class="form-shell">
    <div class="form-head">
      <span class="kicker mono">01 ·</span>
      <div class="form-title">ثبت اطلاعات</div>
      <div class="form-desc">این اطلاعات فقط برای هماهنگی تماس و شناسایی پروژه‌ شما استفاده می‌شود.</div>
    </div>

    <div class="form-body">
      <div class="field" id="f-name">
        <label>نام و نام خانوادگی</label>
        <input type="text" name="name" id="inputName" placeholder="علی رضایی">
        <span class="err">لطفاً نام‌تون رو وارد کنید</span>
      </div>
      <div class="field" id="f-phone">
        <label>شماره تماس</label>
        <input type="tel" name="phone" class="tel" id="inputPhone" placeholder="09xxxxxxxxx" maxlength="11">
        <span class="err">شماره تماس معتبر نیست</span>
      </div>
      <div class="field" id="f-project">
        <label>نام پروژه</label>
        <input type="text" name="project" id="inputProject" placeholder="ویلا نیاوران">
        <span class="err">لطفاً نام پروژه رو وارد کنید</span>
      </div>
      <div class="field" id="f-location">
        <label>موقعیت مکانی پروژه</label>
        <div class="map-hint">روی نقشه کلیک کن یا پین رو جابه‌جا کن تا موقعیت دقیق انتخاب بشه</div>
        <div class="location-map" id="map"></div>
        <script>
        const myMap = new L.Map("map", {
            key: "web.400796962174496b8dc3a28dccdce0e2",
            maptype: "standard-night",
            center: [35.699756, 51.338076],
            zoom: 14,
        });
        </script>
        <span class="err">لطفاً موقعیت پروژه رو روی نقشه انتخاب کنید</span>
        <div class="coords-display" id="coordsDisplay">هنوز موقعیتی انتخاب نشده</div>
      </div>
    </div>
    <div class="form-footer">
      <button class="btn-primary" onclick="validateStep2()">
        <span>ادامه</span>
      </button>
    </div>
  </div>
`;

function validateStep2(){
  const name = document.getElementById('inputName').value.trim();
  const phone = document.getElementById('inputPhone').value.trim();
  const project = document.getElementById('inputProject').value.trim();

  const nameOk = name.length >= 2;
  const phoneOk = /^09\d{9}$/.test(phone);
  const projectOk = project.length >= 2;
  const locationOk = !!state.location;

  setFieldError('f-name', !nameOk);
  setFieldError('f-phone', !phoneOk);
  setFieldError('f-project', !projectOk);
  setFieldError('f-location', !locationOk);

  if(nameOk && phoneOk && projectOk && locationOk){
    state.name = name; state.phone = phone; state.project = project;
    goToStep(3);
  }
}
// ---------- نشان مپ (Leaflet-based): انتخاب موقعیت پروژه با کلیک/درگ روی نقشه ----------
let map, marker;
let mapInitialized = false;

const NESHAN_API_KEY = 'web.400796962174496b8dc3a28dccdce0e2';
function initLocationMap(){
  if(mapInitialized) return;
  if(typeof L === 'undefined'){
    setTimeout(initLocationMap, 300);
    return;
  }
  mapInitialized = true;

  const defaultPos = [36.250503, 59.605122]; // مشهد، فقط برای مرکز اولیه نقشه

  map = new L.Map('map', {
    key: NESHAN_API_KEY,
    maptype: 'dreamy',
    center: defaultPos,
    zoom: 13,
  });

  marker = L.marker(defaultPos, { draggable: true }).addTo(map);

  function updateCoords(latlng){
    state.location = { lat: latlng.lat, lng: latlng.lng };
    document.getElementById('coordsDisplay').textContent =
      'عرض: ' + latlng.lat.toFixed(6) + '  —  طول: ' + latlng.lng.toFixed(6);
    setFieldError('f-location', false);
  }

  marker.on('dragend', () => updateCoords(marker.getLatLng()));

  map.on('click', (e) => {
    marker.setLatLng(e.latlng);
    updateCoords(e.latlng);
  });
}