/**
 * NetMood Analyzer - 상단 건강도 바 컴포넌트
 */

import React, { useMemo } from 'react';
import { useNetwork } from '../context/NetworkContext.jsx';
import { useEmotion } from '../context/EmotionContext.jsx';
import { calculateOverallHealth } from '../utils/networkCalculator.js';
import { COLORS, STATUS_LABELS, EMOTIONS } from '../utils/constants.js';
import './HealthBar.css';

/**
 * HealthBar 컴포넌트
 * 상단에 종합 건강도 점수와 상태를 표시합니다.
 */
export default function HealthBar() {
  const { metrics } = useNetwork();
  const { primaryEmotionInfo, currentEmotions } = useEmotion();

  const { healthScore, status, statusColor } = useMemo(() => {
    if (!metrics) {
      return {
        healthScore: 0,
        status: STATUS_LABELS.WARNING,
        statusColor: COLORS.TEXT_SECONDARY,
      };
    }

    const health = calculateOverallHealth(metrics.happiness, metrics.stress);
    
    // 주요 감정에 따라 상태 결정
    let status, statusColor;
    if (health >= 80) {
      status = `${primaryEmotionInfo.emoji} ${primaryEmotionInfo.name}`;
      statusColor = primaryEmotionInfo.color;
    } else if (health >= 60) {
      status = STATUS_LABELS.GOOD;
      statusColor = COLORS.CALM;
    } else if (health >= 40) {
      status = STATUS_LABELS.WARNING;
      statusColor = COLORS.ANXIETY;
    } else {
      status = STATUS_LABELS.ERROR;
      statusColor = COLORS.STRESS;
    }

    return {
      healthScore: health,
      status,
      statusColor,
    };
  }, [metrics, primaryEmotionInfo, currentEmotions]);

  return (
    <div className="health-bar">
      <div className="health-bar-content">
        <div className="health-bar-header">
          <h2>네트워크 건강도</h2>
          <span className="health-status" style={{ color: statusColor }}>
            {status}
          </span>
        </div>
        
        <div className="health-score-container">
          <div className="health-score-value">{healthScore}</div>
          <div className="health-score-bar">
            <div
              className="health-score-fill"
              style={{
                width: `${healthScore}%`,
                backgroundColor: statusColor,
              }}
            />
          </div>
        </div>

        {metrics && metrics.emotions && (
          <div className="health-metrics">
            <div className="health-metric">
              <span className="metric-label">{EMOTIONS.HAPPY.emoji} {EMOTIONS.HAPPY.name}</span>
              <span className="metric-value" style={{ color: EMOTIONS.HAPPY.color }}>
                {currentEmotions.happy}
              </span>
            </div>
            <div className="health-metric">
              <span className="metric-label">{EMOTIONS.STRESS.emoji} {EMOTIONS.STRESS.name}</span>
              <span className="metric-value" style={{ color: EMOTIONS.STRESS.color }}>
                {currentEmotions.stress}
              </span>
            </div>
            <div className="health-metric">
              <span className="metric-label">{EMOTIONS.ANGER.emoji} {EMOTIONS.ANGER.name}</span>
              <span className="metric-value" style={{ color: EMOTIONS.ANGER.color }}>
                {currentEmotions.anger}
              </span>
            </div>
            <div className="health-metric">
              <span className="metric-label">{EMOTIONS.CALM.emoji} {EMOTIONS.CALM.name}</span>
              <span className="metric-value" style={{ color: EMOTIONS.CALM.color }}>
                {currentEmotions.calm}
              </span>
            </div>
            <div className="health-metric">
              <span className="metric-label">{EMOTIONS.ANXIETY.emoji} {EMOTIONS.ANXIETY.name}</span>
              <span className="metric-value" style={{ color: EMOTIONS.ANXIETY.color }}>
                {currentEmotions.anxiety}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

