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

  // 마지막 업데이트 시간
  const lastUpdateTime = useMemo(() => {
    if (!metrics) return '';
    const date = new Date(metrics.timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `오늘 ${hours}:${minutes}:${seconds}`;
  }, [metrics]);

  return (
    <div className="health-bar">
      <div className="health-bar-content">
        <div className="health-bar-header">
          <div className="health-bar-title-section">
            <span className="health-bar-icon">🔊</span>
            <h2>네트워크 건강도</h2>
          </div>
          <div className="health-bar-status-section">
            <span className="health-status" style={{ color: statusColor }}>
              {status}
            </span>
            {lastUpdateTime && (
              <span className="health-update-time">{lastUpdateTime}</span>
            )}
          </div>
        </div>
        
        <div className="health-score-container">
          <div className="health-score-value">{healthScore}/10</div>
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

      </div>
    </div>
  );
}

