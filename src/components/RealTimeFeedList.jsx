/**
 * NetMood Analyzer - 실시간 감정 피드 리스트 컴포넌트
 */

import React, { useMemo } from 'react';
import { useEmotion } from '../context/EmotionContext.jsx';
import { EMOTIONS } from '../utils/constants.js';
import './RealTimeFeedList.css';

/**
 * RealTimeFeedList 컴포넌트
 */
export default function RealTimeFeedList() {
  const { historyEmotions } = useEmotion();

  // 최신 50개 기록 (역순)
  const feedItems = useMemo(() => {
    return historyEmotions
      .slice(-50)
      .reverse()
      .map(item => {
        // 가장 높은 감정 찾기
        const emotions = item.emotions;
        const maxEmotion = Object.keys(emotions).reduce((a, b) => 
          emotions[a] > emotions[b] ? a : b
        );
        
        const emotionInfo = EMOTIONS[maxEmotion.toUpperCase()] || EMOTIONS.CALM;
        const strength = Math.round(emotions[maxEmotion] / 10); // 0-10 스케일

        return {
          ...item,
          emotionKey: maxEmotion,
          emotionInfo,
          strength,
        };
      });
  }, [historyEmotions]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="realtime-feed">
      <h3 className="realtime-feed-title">실시간 감정 피드</h3>
      <div className="realtime-feed-list">
        {feedItems.length === 0 ? (
          <div className="realtime-feed-empty">
            <p>데이터를 수집 중입니다...</p>
          </div>
        ) : (
          feedItems.map((item, index) => (
            <div key={item.timestamp} className="realtime-feed-item">
              <div className="feed-item-emoji">{item.emotionInfo.emoji}</div>
              <div className="feed-item-content">
                <div className="feed-item-emotion">{item.emotionInfo.name}</div>
                <div className="feed-item-strength">강도: {item.strength}/10</div>
              </div>
              <div className="feed-item-time">{formatTime(item.timestamp)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

