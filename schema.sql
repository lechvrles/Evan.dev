CREATE TABLE IF NOT EXISTS signups (
    id              SERIAL PRIMARY KEY,
    full_name       VARCHAR(150)  NOT NULL,
    phone           VARCHAR(20)   NOT NULL,
    project_name    VARCHAR(150)  NOT NULL,
    location_lat    DOUBLE PRECISION NOT NULL,
    location_lng    DOUBLE PRECISION NOT NULL,
    preferred_days  TEXT[]        NOT NULL,
    preferred_slots TEXT[]        NOT NULL,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- برای دیدن ردیف‌های ثبت‌شده:
-- SELECT * FROM signups ORDER BY created_at DESC;
