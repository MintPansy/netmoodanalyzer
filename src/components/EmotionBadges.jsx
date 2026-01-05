/**
 * NetMood Analyzer - 감정 배지 컴포넌트
 * 5가지 감정을 배지 형태로 표시합니다.
 */

import React from 'react';
import { useEmotion } from '../context/EmotionContext.jsx';
import { EMOTIONS } from '../utils/constants.js';
import './EmotionBadges.css';

/**
 * 개별 감정 배지 컴포넌트
 */
function EmotionBadge({ emotionKey, score, isPrimary = false }) {
  const emotion = EMOTIONS[emotionKey.toUpperCase()];
  
  if (!emotion) return null;

  const badgeClass = `emotion-badge emotion-badge--${emotionKey} ${isPrimary ? 'emotion-badge--primary' : ''}`;

  return (
    <div className={badgeClass} style={{ '--emotion-color': emotion.color }}>
      <span className="emotion-badge-emoji">{emotion.emoji}</span>
      <span className="emotion-badge-name">{emotion.name}</span>
      <span className="emotion-badge-score">{score}</span>
    </div>
  );
}

/**
 * EmotionBadges 컴포넌트
 */
export default function EmotionBadges() {
  const { currentEmotions, primaryEmotion } = useEmotion();

  const emotionList = [
    { key: 'happy', score: currentEmotions.happy },
    { key: 'stress', score: currentEmotions.stress },
    { key: 'anger', score: currentEmotions.anger },
    { key: 'calm', score: currentEmotions.calm },
    { key: 'anxiety', score: currentEmotions.anxiety },
  ];

  // 점수 순으로 정렬
  const sortedEmotions = [...emotionList].sort((a, b) => b.score - a.score);

  return (
    <div className="emotion-badges-container">
      <h3 className="emotion-badges-title">현재 감정 상태</h3>
      <div className="emotion-badges-grid">
        {sortedEmotions.map(({ key, score }) => (
          <EmotionBadge
            key={key}
            emotionKey={key}
            score={score}
            isPrimary={key === primaryEmotion}
          />
        ))}
      </div>
    </div>
  );
}

