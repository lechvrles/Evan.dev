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

  let insertedId, createdAt;

  try {
    const result = await pool.query(
      `INSERT INTO signups (full_name, phone, project_name, location_lat, location_lng, preferred_days, preferred_slots)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [name.trim(), phone.trim(), project.trim(), location.lat, location.lng, days, slots]
    );
    insertedId = result.rows[0].id;
    createdAt = result.rows[0].created_at;
  } catch(err) {
    console.error('خطا در ثبت اطلاعات:', err.message);
    return res.status(500).json({ ok: false, error: 'ثبت اطلاعات با خطا مواجه شد'});
  }
    const n8nWebhookUrl = 'https://evantech.runflare.run/webhook/new_data';
    try{
      await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: insertedId,
          name: name.trim(),
          phone: phone.trim(),
          project: project.trim(),
          location,
          days,
          slots,
          created_at: createdAt,
        }),
      });
    } catch (err) {
      console.error('خطا در ارسال اطلاعات به اتوماسیون:', err.message);
    }

    res.status(201).json({ ok: true, id: insertedId });
  };