/**
 * NetMood Analyzer - 감정 게이지 컴포넌트
 */

import React, { useMemo } from 'react';
import { useEmotion } from '../context/EmotionContext.jsx';
import { EMOTIONS } from '../utils/constants.js';
import './EmotionGauge.css';

/**
 * EmotionGauge 컴포넌트
 */
export default function EmotionGauge() {
  const { currentEmotions, primaryEmotionInfo } = useEmotion();

  // 주요 감정의 강도 계산 (0-10 스케일)
  const primaryStrength = useMemo(() => {
    const primaryKey = primaryEmotionInfo.name.toLowerCase();
    const emotionMap = {
      '기쁨': 'happy',
      '스트레스': 'stress',
      '화남': 'anger',
      '평온': 'calm',
      '불안': 'anxiety',
    };
    const key = emotionMap[primaryEmotionInfo.name] || 'calm';
    // 0-100을 0-10으로 변환
    return Math.round((currentEmotions[key] || 0) / 10);
  }, [currentEmotions, primaryEmotionInfo]);

  const gaugePercentage = (primaryStrength / 10) * 100;

  return (
    <div className="emotion-gauge">
      <div className="emotion-gauge-content">
        <div className="emotion-gauge-emoji">{primaryEmotionInfo.emoji}</div>
        <div className="emotion-gauge-info">
          <h2 className="emotion-gauge-name">{primaryEmotionInfo.name}</h2>
          <div className="emotion-gauge-strength">
            <span className="strength-value">{primaryStrength}</span>
            <span className="strength-max">/10</span>
          </div>
        </div>
      </div>
      <div className="emotion-gauge-bar">
        <div
          className="emotion-gauge-fill"
          style={{
            width: `${gaugePercentage}%`,
            backgroundColor: primaryEmotionInfo.color,
          }}
        />
      </div>
    </div>
  );
}

