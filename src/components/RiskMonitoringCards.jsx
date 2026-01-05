/**
 * NetMood Analyzer - 위험 모니터링 카드 컴포넌트
 */

import React, { useMemo } from 'react';
import { useDiagnostics } from '../hooks/useDiagnostics.js';
import './RiskMonitoringCards.css';

/**
 * RiskMonitoringCards 컴포넌트
 */
export default function RiskMonitoringCards() {
  const { issues } = useDiagnostics();

  const riskCounts = useMemo(() => {
    const critical = issues.filter(i => i.severity === 'critical' && !i.resolved).length;
    const warning = issues.filter(i => i.severity === 'warning' && !i.resolved).length;
    const info = issues.filter(i => i.severity === 'info' && !i.resolved).length;
    const resolved = issues.filter(i => i.resolved).length;
    
    // 중간은 warning과 info의 합
    const medium = warning + info;

    return {
      critical,
      high: critical, // 높음 = 심각
      medium,
      low: info,
      resolved,
    };
  }, [issues]);

  const cards = [
    {
      label: '심각',
      count: riskCounts.critical,
      icon: '🔴',
      color: '#F44336',
    },
    {
      label: '높음',
      count: riskCounts.high,
      icon: '🟠',
      color: '#FF9800',
    },
    {
      label: '중간',
      count: riskCounts.medium,
      icon: '🟡',
      color: '#FFC107',
    },
    {
      label: '낮음',
      count: riskCounts.low,
      icon: '🟢',
      color: '#4CAF50',
    },
    {
      label: '해결',
      count: riskCounts.resolved,
      icon: '✅',
      color: '#2196F3',
    },
  ];

  return (
    <div className="risk-monitoring-cards">
      {cards.map((card, index) => (
        <div key={index} className="risk-card">
          <div className="risk-card-icon" style={{ color: card.color }}>
            {card.icon}
          </div>
          <div className="risk-card-content">
            <div className="risk-card-label">{card.label}</div>
            <div className="risk-card-count">{card.count}건</div>
          </div>
        </div>
      ))}
    </div>
  );
}

