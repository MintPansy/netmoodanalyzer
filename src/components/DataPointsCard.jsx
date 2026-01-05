/**
 * NetMood Analyzer - 데이터 포인트 카드 컴포넌트
 */

import React, { useMemo } from 'react';
import { useNetwork } from '../context/NetworkContext.jsx';
import { useEmotion } from '../context/EmotionContext.jsx';
import './DataPointsCard.css';

/**
 * DataPointsCard 컴포넌트
 */
export default function DataPointsCard() {
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

    // 위험 이벤트 개수 (스트레스, 화남, 불안이 높은 경우)
    const riskEvents = historyEmotions.filter(item => {
      return item.emotions.stress > 50 || 
             item.emotions.anger > 50 || 
             item.emotions.anxiety > 50;
    }).length;

    // 데이터 기간 (분 단위)
    const dataPeriod = history.length > 0
      ? Math.round((Date.now() - history[0].timestamp) / (1000 * 60))
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
      value: `${stats.dataPeriod}분`,
      icon: '⏱️',
    },
  ];

  return (
    <div className="data-points-card">
      <div className="data-points-grid">
        {cards.map((card, index) => (
          <div key={index} className="data-point-item">
            <div className="data-point-icon">{card.icon}</div>
            <div className="data-point-content">
              <div className="data-point-value">{card.value}</div>
              <div className="data-point-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

