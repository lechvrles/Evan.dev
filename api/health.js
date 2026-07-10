const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ ok: true, db: 'connected' });
  } catch (err) {
    console.error('خطا در اتصال به دیتابیس:', err.message);
    res.status(500).json({ ok: false, error: 'اتصال به دیتابیس برقرار نشد' });
  }
};
