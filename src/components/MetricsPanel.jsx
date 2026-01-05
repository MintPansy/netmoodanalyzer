/**
 * NetMood Analyzer - 메트릭 패널 컴포넌트
 * 네트워크 메트릭을 카드 형태로 표시합니다.
 */

import React, { useMemo } from 'react';
import { useNetwork } from '../context/NetworkContext.jsx';
import { THRESHOLDS, COLORS } from '../utils/constants.js';
import './MetricsPanel.css';

/**
 * 메트릭 카드 컴포넌트
 */
function MetricCard({ title, value, unit, status, icon }) {
  const statusColor = useMemo(() => {
    switch (status) {
      case 'excellent':
        return COLORS.HAPPINESS;
      case 'good':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'error':
        return COLORS.STRESS;
      default:
        return COLORS.TEXT_SECONDARY;
    }
  }, [status]);

  return (
    <div className="metric-card">
      <div className="metric-header">
        <span className="metric-icon" style={{ color: statusColor }}>
          {icon}
        </span>
        <h3 className="metric-title">{title}</h3>
      </div>
      <div className="metric-value-container">
        <span className="metric-value" style={{ color: statusColor }}>
          {value !== null && value !== undefined ? value : '--'}
        </span>
        {unit && (
          <span className="metric-unit">{unit}</span>
        )}
      </div>
    </div>
  );
}

/**
 * MetricsPanel 컴포넌트
 */
export default function MetricsPanel() {
  const { metrics } = useNetwork();

  const metricCards = useMemo(() => {
    if (!metrics) {
      return [];
    }

    // 지연시간 상태 판단
    const latencyStatus = metrics.latency === null
      ? 'unknown'
      : metrics.latency < THRESHOLDS.LATENCY.EXCELLENT
      ? 'excellent'
      : metrics.latency < THRESHOLDS.LATENCY.GOOD
      ? 'good'
      : metrics.latency < THRESHOLDS.LATENCY.WARNING
      ? 'warning'
      : 'error';

    // 속도 상태 판단
    const speedStatus = metrics.downloadSpeed === null
      ? 'unknown'
      : metrics.downloadSpeed > THRESHOLDS.SPEED.EXCELLENT
      ? 'excellent'
      : metrics.downloadSpeed > THRESHOLDS.SPEED.GOOD
      ? 'good'
      : metrics.downloadSpeed > THRESHOLDS.SPEED.WARNING
      ? 'warning'
      : 'error';

    // 패킷 손실 상태 판단
    const packetLossStatus = metrics.packetLoss < THRESHOLDS.PACKET_LOSS.EXCELLENT
      ? 'excellent'
      : metrics.packetLoss < THRESHOLDS.PACKET_LOSS.GOOD
      ? 'good'
      : metrics.packetLoss < THRESHOLDS.PACKET_LOSS.WARNING
      ? 'warning'
      : 'error';

    // 연결 상태
    const connectionStatus = metrics.isConnected ? 'excellent' : 'error';

    return [
      {
        title: '지연시간',
        value: metrics.latency,
        unit: 'ms',
        status: latencyStatus,
        icon: '⏱️',
      },
      {
        title: '다운로드 속도',
        value: metrics.downloadSpeed,
        unit: 'Mbps',
        status: speedStatus,
        icon: '⬇️',
      },
      {
        title: '패킷 손실',
        value: metrics.packetLoss,
        unit: '%',
        status: packetLossStatus,
        icon: '📦',
      },
      {
        title: '연결 상태',
        value: metrics.isConnected ? '연결됨' : '끊김',
        unit: '',
        status: connectionStatus,
        icon: metrics.isConnected ? '✅' : '❌',
      },
    ];
  }, [metrics]);

  return (
    <div className="metrics-panel">
      <h2 className="metrics-panel-title">네트워크 메트릭</h2>
      <div className="metrics-grid">
        {metricCards.map((card, index) => (
          <MetricCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
}

