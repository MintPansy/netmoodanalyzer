/**
 * NetMood Analyzer - 감정 분석 컴포넌트
 */

import React, { useMemo } from 'react';
import { useEmotion } from '../context/EmotionContext.jsx';
import { EMOTIONS } from '../utils/constants.js';
import './EmotionAnalysis.css';

/**
 * EmotionAnalysis 컴포넌트
 */
export default function EmotionAnalysis() {
  const { historyEmotions } = useEmotion();

  const emotionStats = useMemo(() => {
    const stats = {
      happy: 0,
      stress: 0,
      anger: 0,
      calm: 0,
      anxiety: 0,
    };

    historyEmotions.forEach(item => {
      const emotions = item.emotions;
      // 가장 높은 감정 찾기
      const maxEmotion = Object.keys(emotions).reduce((a, b) => 
        emotions[a] > emotions[b] ? a : b
      );
      stats[maxEmotion]++;
    });

    const total = historyEmotions.length || 1;
    
    return Object.keys(EMOTIONS).map(key => {
      const emotion = EMOTIONS[key];
      const count = stats[key.toLowerCase()] || 0;
      const percentage = ((count / total) * 100).toFixed(1);
      
      return {
        ...emotion,
        key: key.toLowerCase(),
        count,
        percentage,
      };
    });
  }, [historyEmotions]);

  return (
    <div className="emotion-analysis">
      <h3 className="emotion-analysis-title">감정 분석</h3>
      <div className="emotion-analysis-grid">
        {emotionStats.map((emotion, index) => (
          <div key={index} className="emotion-analysis-card">
            <div className="emotion-analysis-emoji">{emotion.emoji}</div>
            <div className="emotion-analysis-content">
              <div className="emotion-analysis-name">{emotion.name}</div>
              <div className="emotion-analysis-stats">
                <span className="emotion-analysis-count">{emotion.count}</span>
                <span className="emotion-analysis-percentage">({emotion.percentage}%)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

