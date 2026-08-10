const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const { name, phone, project, location, days, slots } = req.body || {};

  if (typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ ok: false, error: 'نام معتبر نیست' });
  }
  if (typeof phone !== 'string' || !/^09\d{9}$/.test(phone.trim())) {
    return res.status(400).json({ ok: false, error: 'شماره تماس معتبر نیست' });
  }
  if (typeof project !== 'string' || project.trim().length < 2) {
    return res.status(400).json({ ok: false, error: 'نام پروژه معتبر نیست' });
  }
  if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    return res.status(400).json({ ok: false, error: 'موقعیت پروژه انتخاب نشده' });
  }
  if (!Array.isArray(days) || days.length === 0) {
    return res.status(400).json({ ok: false, error: 'حداقل یک روز رو انتخاب کنید' });
  }
  if (!Array.isArray(slots) || slots.length === 0) {
    return res.status(400).json({ ok: false, error: 'حداقل یک بازه زمانی رو انتخاب کنید' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO signups (full_name, phone, project_name, location_lat, location_lng, preferred_days, preferred_slots)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [name.trim(), phone.trim(), project.trim(), location.lat, location.lng, days, slots]
    );

    const insertedId = result.rows[0].id;
    const bodyId = process.env.MELIPAYAMAK_SIGNUP_BODY_ID; 
    if (!process.env.MELIPAYAMAK_USERNAME || !process.env.MELIPAYAMAK_PASSWORD || !bodyId) {
      console.error('متغیرهای محیطی ملی‌پیامک تنظیم نشده‌اند (MELIPAYAMAK_USERNAME / MELIPAYAMAK_PASSWORD / MELIPAYAMAK_SIGNUP_BODY_ID)');
    } else {
      try {
        // ترتیب متغیرها با ; باید دقیقا با ترتیب متغیرهای تعریف‌شده تو پنل پترن ملی‌پیامک یکی باشه
        const patternText = `${name.trim()}`; // اگر پترنت متغیر بیشتری داره، مثلا `${name.trim()};${project.trim()}`

        const smsResponse = await fetch('https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: process.env.MELIPAYAMAK_USERNAME,
            password: process.env.MELIPAYAMAK_PASSWORD,
            to: phone.trim(),
            bodyId: Number(bodyId),
            text: patternText,
          }),
        });

        if (!smsResponse.ok) {
          console.error('خطای HTTP در ارسال پیامک ثبت‌نام:', smsResponse.status);
        } else {
          const smsResult = await smsResponse.json();
          // ملی‌پیامک در صورت موفقیت یک RecId عددی مثبت برمی‌گردونه؛ مقادیر منفی یعنی خطا
          if (!smsResult || !smsResult.Value || Number(smsResult.Value) <= 0) {
            console.error('ارسال پیامک ثبت‌نام ناموفق بود:', smsResult);
          }
        }
      } catch (smsErr) {
        console.error('خطا در ارتباط با ملی‌پیامک:', smsErr.message);
      }
    }

    res.status(201).json({ ok: true, id: insertedId });
  } catch (err) {
    console.error('خطا در ثبت اطلاعات:', err.message);
    res.status(500).json({ ok: false, error: 'ثبت اطلاعات با خطا مواجه شد' });
  }
};