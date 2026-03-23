# -*- coding: utf-8 -*-
"""
NetMood Analyzer — PostgreSQL 세션/메트릭 저장 및 집계
환경 변수 DATABASE_URL 이 없으면 API 레이어에서 비활성화됩니다.
"""

from __future__ import annotations

import json
import logging
import os
import uuid
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

try:
    import psycopg
    from psycopg.rows import dict_row
except ImportError:  # pragma: no cover
    psycopg = None
    dict_row = None

_SCHEMA_STATEMENTS = [
    """
    CREATE TABLE IF NOT EXISTS monitoring_sessions (
        id UUID PRIMARY KEY,
        started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ended_at TIMESTAMPTZ,
        meta JSONB NOT NULL DEFAULT '{}'::jsonb
    );
    """,
    """
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
    """,
    """
    CREATE INDEX IF NOT EXISTS idx_metric_logs_session_time
    ON metric_logs (session_id, recorded_at DESC);
    """,
    """
    CREATE INDEX IF NOT EXISTS idx_metric_logs_recorded
    ON metric_logs (recorded_at DESC);
    """,
    """
    CREATE INDEX IF NOT EXISTS idx_metric_logs_anomaly
    ON metric_logs (recorded_at DESC) WHERE is_anomaly = TRUE;
    """,
]


def database_url() -> Optional[str]:
    raw = os.environ.get("DATABASE_URL", "").strip()
    return raw or None


def is_enabled() -> bool:
    return bool(database_url() and psycopg)


def ensure_schema(conn: "psycopg.Connection") -> None:
    with conn.cursor() as cur:
        for stmt in _SCHEMA_STATEMENTS:
            cur.execute(stmt)
    conn.commit()


@contextmanager
def get_connection():
    if not is_enabled():
        raise RuntimeError("PostgreSQL이 설정되지 않았습니다. DATABASE_URL과 psycopg를 확인하세요.")
    url = database_url()
    with psycopg.connect(url, row_factory=dict_row) as conn:
        yield conn


def init_db_if_configured() -> Tuple[bool, Optional[str]]:
    """앱 기동 시 스키마 보장. 실패 시 (False, message)."""
    if not database_url():
        return False, None
    if psycopg is None:
        return False, "psycopg 미설치: pip install psycopg[binary]"
    try:
        with psycopg.connect(database_url(), autocommit=True) as conn:
            ensure_schema(conn)
        logger.info("PostgreSQL 스키마 확인 완료 (monitoring_sessions, metric_logs)")
        return True, None
    except Exception as e:  # pragma: no cover
        logger.error("PostgreSQL 초기화 실패: %s", e)
        return False, str(e)


def _primary_emotion(emotions: Optional[Dict[str, Any]]) -> Optional[str]:
    if not emotions or not isinstance(emotions, dict):
        return None
    try:
        return max(emotions.items(), key=lambda kv: float(kv[1] or 0))[0]
    except (TypeError, ValueError):
        return None


def _evaluate_anomaly(
    latency_ms: Optional[float],
    stress: Optional[float],
    is_connected: bool,
    connection_drop_count: int,
) -> Tuple[bool, Optional[str]]:
    reasons: List[str] = []
    if latency_ms is not None and latency_ms > 350:
        reasons.append("high_latency")
    if stress is not None and stress > 72:
        reasons.append("high_stress")
    if not is_connected:
        reasons.append("offline")
    if connection_drop_count and connection_drop_count > 2:
        reasons.append("unstable_connection")
    return (len(reasons) > 0, ",".join(reasons) if reasons else None)


def create_session(meta: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    sid = uuid.uuid4()
    meta = meta if isinstance(meta, dict) else {}
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO monitoring_sessions (id, meta)
                VALUES (%s, %s::jsonb)
                RETURNING id, started_at, ended_at, meta
                """,
                (str(sid), json.dumps(meta)),
            )
            row = cur.fetchone()
        conn.commit()
    return _session_row_to_api(row)


def end_session(session_id: str) -> Optional[Dict[str, Any]]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE monitoring_sessions
                SET ended_at = NOW()
                WHERE id = %s AND ended_at IS NULL
                RETURNING id, started_at, ended_at, meta
                """,
                (session_id,),
            )
            row = cur.fetchone()
        conn.commit()
    return _session_row_to_api(row) if row else None


def _session_row_to_api(row: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": str(row["id"]),
        "started_at": row["started_at"].isoformat() if row.get("started_at") else None,
        "ended_at": row["ended_at"].isoformat() if row.get("ended_at") else None,
        "meta": row.get("meta") if isinstance(row.get("meta"), dict) else {},
    }


def insert_metric(session_id: str, body: Dict[str, Any]) -> Dict[str, Any]:
    """프론트 useNetworkMetrics 메트릭 객체와 동일한 키를 수용합니다."""
    ts_ms = body.get("timestamp")
    if ts_ms is None:
        recorded = datetime.now(timezone.utc)
    else:
        recorded = datetime.fromtimestamp(float(ts_ms) / 1000.0, tz=timezone.utc)

    latency = body.get("latency")
    download = body.get("downloadSpeed")
    stress = body.get("stress")
    happiness = body.get("happiness")
    emotions = body.get("emotions")
    is_connected = bool(body.get("isConnected", True))
    drops = int(body.get("connectionDropCount") or 0)

    is_anomaly, reason = _evaluate_anomaly(
        float(latency) if latency is not None else None,
        float(stress) if stress is not None else None,
        is_connected,
        drops,
    )

    payload = json.dumps(body, default=str)

    emotions_json = json.dumps(emotions) if emotions is not None else None

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO metric_logs (
                    session_id, recorded_at, latency_ms, download_mbps,
                    stress, happiness, emotions, is_anomaly, anomaly_reason, payload
                )
                VALUES (
                    %s, %s, %s, %s, %s, %s, %s::jsonb, %s, %s, %s::jsonb
                )
                RETURNING id, session_id, recorded_at, is_anomaly, anomaly_reason
                """,
                (
                    session_id,
                    recorded,
                    latency,
                    download,
                    stress,
                    happiness,
                    emotions_json,
                    is_anomaly,
                    reason,
                    payload,
                ),
            )
            row = cur.fetchone()
        conn.commit()

    return {
        "id": row["id"],
        "session_id": str(row["session_id"]),
        "recorded_at": row["recorded_at"].isoformat(),
        "is_anomaly": row["is_anomaly"],
        "anomaly_reason": row["anomaly_reason"],
        "primary_emotion": _primary_emotion(emotions if isinstance(emotions, dict) else None),
    }


def hourly_pattern(days: int, tz_name: str, session_id: Optional[str]) -> List[Dict[str, Any]]:
    days = max(1, min(int(days), 90))
    session_filter = ""
    params: List[Any] = [tz_name, days]
    if session_id:
        session_filter = " AND session_id = %s::uuid"
        params.append(session_id)

    sql = f"""
        SELECT
            EXTRACT(HOUR FROM (recorded_at AT TIME ZONE %s))::int AS hour,
            COUNT(*)::bigint AS sample_count,
            AVG(latency_ms) AS avg_latency_ms,
            AVG(stress) AS avg_stress,
            AVG(happiness) AS avg_happiness
        FROM metric_logs
        WHERE recorded_at >= NOW() - make_interval(days => %s)
        {session_filter}
        GROUP BY 1
        ORDER BY 1
    """
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            rows = cur.fetchall()

    by_hour = {r["hour"]: r for r in rows}
    out = []
    for h in range(24):
        r = by_hour.get(h)
        out.append(
            {
                "hour": h,
                "sample_count": int(r["sample_count"]) if r else 0,
                "avg_latency_ms": float(r["avg_latency_ms"]) if r and r["avg_latency_ms"] is not None else None,
                "avg_stress": float(r["avg_stress"]) if r and r["avg_stress"] is not None else None,
                "avg_happiness": float(r["avg_happiness"]) if r and r["avg_happiness"] is not None else None,
            }
        )
    return out


def list_anomalies(limit: int, session_id: Optional[str]) -> List[Dict[str, Any]]:
    limit = max(1, min(int(limit), 200))
    session_filter = ""
    params: List[Any] = [limit]
    if session_id:
        session_filter = " AND session_id = %s::uuid"
        params.insert(0, session_id)

    sql = f"""
        SELECT id, session_id, recorded_at, latency_ms, stress, happiness,
               anomaly_reason, payload
        FROM metric_logs
        WHERE is_anomaly = TRUE
        {session_filter}
        ORDER BY recorded_at DESC
        LIMIT %s
    """
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            rows = cur.fetchall()

    result = []
    for r in rows:
        payload = r.get("payload")
        if isinstance(payload, str):
            try:
                payload = json.loads(payload)
            except json.JSONDecodeError:
                payload = {}
        primary = _primary_emotion((payload or {}).get("emotions"))
        result.append(
            {
                "id": r["id"],
                "session_id": str(r["session_id"]),
                "recorded_at": r["recorded_at"].isoformat(),
                "latency_ms": r["latency_ms"],
                "stress": r["stress"],
                "happiness": r["happiness"],
                "anomaly_reason": r["anomaly_reason"],
                "primary_emotion": primary,
            }
        )
    return result


def _window_stats(conn, start, end, session_id: Optional[str]) -> Dict[str, Any]:
    session_filter = ""
    params: List[Any] = [start, end]
    if session_id:
        session_filter = " AND session_id = %s::uuid"
        params.append(session_id)

    sql = f"""
        SELECT
            COUNT(*)::bigint AS samples,
            AVG(latency_ms) AS avg_latency_ms,
            AVG(stress) AS avg_stress,
            AVG(happiness) AS avg_happiness,
            COUNT(*) FILTER (WHERE is_anomaly)::bigint AS anomalies
        FROM metric_logs
        WHERE recorded_at >= %s AND recorded_at < %s
        {session_filter}
    """
    with conn.cursor() as cur:
        cur.execute(sql, params)
        row = cur.fetchone()
    return {
        "samples": int(row["samples"] or 0),
        "avg_latency_ms": float(row["avg_latency_ms"]) if row["avg_latency_ms"] is not None else None,
        "avg_stress": float(row["avg_stress"]) if row["avg_stress"] is not None else None,
        "avg_happiness": float(row["avg_happiness"]) if row["avg_happiness"] is not None else None,
        "anomalies": int(row["anomalies"] or 0),
    }


def _peak_stress_hour(conn, start, end, tz_name: str, session_id: Optional[str]) -> Optional[int]:
    session_filter = ""
    params: List[Any] = [tz_name, start, end]
    if session_id:
        session_filter = " AND session_id = %s::uuid"
        params.append(session_id)

    sql = f"""
        SELECT
            EXTRACT(HOUR FROM (recorded_at AT TIME ZONE %s))::int AS hour,
            AVG(stress) AS avg_stress
        FROM metric_logs
        WHERE recorded_at >= %s AND recorded_at < %s
        {session_filter}
        GROUP BY 1
        ORDER BY AVG(stress) DESC NULLS LAST
        LIMIT 1
    """
    with conn.cursor() as cur:
        cur.execute(sql, params)
        row = cur.fetchone()
    if not row or row["hour"] is None:
        return None
    return int(row["hour"])


def report_7d_compare(tz_name: str, session_id: Optional[str]) -> Dict[str, Any]:
    now = datetime.now(timezone.utc)
    cur_start = now - timedelta(days=7)
    prev_start = now - timedelta(days=14)
    prev_end = cur_start

    with get_connection() as conn:
        current = _window_stats(conn, cur_start, now, session_id)
        previous = _window_stats(conn, prev_start, prev_end, session_id)
        peak_cur = _peak_stress_hour(conn, cur_start, now, tz_name, session_id)
        peak_prev = _peak_stress_hour(conn, prev_start, prev_end, tz_name, session_id)

    def delta(key: str) -> Optional[float]:
        a, b = current.get(key), previous.get(key)
        if a is None or b is None:
            return None
        return round(float(a) - float(b), 4)

    return {
        "timezone": tz_name,
        "current_window": {"start": cur_start.isoformat(), "end": now.isoformat(), **current},
        "previous_window": {"start": prev_start.isoformat(), "end": prev_end.isoformat(), **previous},
        "deltas": {
            "avg_latency_ms": delta("avg_latency_ms"),
            "avg_stress": delta("avg_stress"),
            "avg_happiness": delta("avg_happiness"),
            "samples": (current["samples"] - previous["samples"]),
            "anomalies": (current["anomalies"] - previous["anomalies"]),
        },
        "peak_stress_hour": {"current": peak_cur, "previous": peak_prev},
    }
