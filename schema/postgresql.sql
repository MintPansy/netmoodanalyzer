-- NetMood Analyzer — PostgreSQL 세션·메트릭 로그
-- 적용: psql "$DATABASE_URL" -f schema/postgresql.sql
-- 또는 앱 기동 시 netmood_db.init_db_if_configured() 가 IF NOT EXISTS 로 생성

CREATE TABLE IF NOT EXISTS monitoring_sessions (
    id UUID PRIMARY KEY,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    meta JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS metric_logs (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES monitoring_sessions(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL,
    latency_ms DOUBLE PRECISION,
    download_mbps DOUBLE PRECISION,
    stress DOUBLE PRECISION,
    happiness DOUBLE PRECISION,
    emotions JSONB,
    is_anomaly BOOLEAN NOT NULL DEFAULT FALSE,
    anomaly_reason TEXT,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_metric_logs_session_time
    ON metric_logs (session_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_metric_logs_recorded
    ON metric_logs (recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_metric_logs_anomaly
    ON metric_logs (recorded_at DESC) WHERE is_anomaly = TRUE;
