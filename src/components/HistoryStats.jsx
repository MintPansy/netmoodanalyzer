/**
 * NetMood Analyzer - 이력 통계 컴포넌트
 */

import React, { useMemo } from 'react';
import { useNetwork } from '../context/NetworkContext.jsx';
import { useEmotion } from '../context/EmotionContext.jsx';
import './HistoryStats.css';

/**
 * HistoryStats 컴포넌트
 */
export default function HistoryStats() {
  const { history } = useNetwork();
  const { historyEmotions } = useEmotion();

  const stats = useMemo(() => {
    const totalCodes = history.length;
    
    // 평균 강도 계산 (0-10 스케일)
    const avgStrength = historyEmotions.length > 0
      ? (historyEmotions.reduce((sum, item) => {
          const maxEmotion = Math.max(
            item.emotions.happy,
            item.emotions.stress,
            item.emotions.anger,
            item.emotions.calm,
            item.emotions.anxiety
          );
          return sum + (maxEmotion / 10);
        }, 0) / historyEmotions.length).toFixed(1)
      : '0.0';

    // 위험 이벤트 개수
    const riskEvents = historyEmotions.filter(item => {
      return item.emotions.stress > 50 || 
             item.emotions.anger > 50 || 
             item.emotions.anxiety > 50;
    }).length;

    // 데이터 기간 (일 단위)
    const dataPeriod = history.length > 0
      ? Math.round((Date.now() - history[0].timestamp) / (1000 * 60 * 60 * 24))
      : 0;

    return {
      totalCodes,
      avgStrength,
      riskEvents,
      dataPeriod,
    };
  }, [history, historyEmotions]);

  const cards = [
    {
      label: '총 코드',
      value: stats.totalCodes,
      icon: '📊',
    },
    {
      label: '평균 강도',
      value: stats.avgStrength,
      icon: '📈',
    },
    {
      label: '위험 이벤트',
      value: stats.riskEvents,
      icon: '⚠️',
    },
    {
      label: '데이터 기간',
      value: `${stats.dataPeriod}일`,
      icon: '⏱️',
    },
  ];

  return (
    <div className="history-stats">
      {cards.map((card, index) => (
        <div key={index} className="history-stat-card">
          <div className="history-stat-icon">{card.icon}</div>
          <div className="history-stat-content">
            <div className="history-stat-value">{card.value}</div>
            <div className="history-stat-label">{card.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

