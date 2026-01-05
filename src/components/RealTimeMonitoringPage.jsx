/**
 * NetMood Analyzer - 실시간 모니터링 페이지
 */

import React from 'react';
import { useNetwork } from '../context/NetworkContext.jsx';
import { useEmotion } from '../context/EmotionContext.jsx';
import EmotionGauge from './EmotionGauge.jsx';
import RealTimeFeedList from './RealTimeFeedList.jsx';
import DataPointsCard from './DataPointsCard.jsx';
import './RealTimeMonitoringPage.css';

/**
 * RealTimeMonitoringPage 컴포넌트
 */
export default function RealTimeMonitoringPage() {
  const { metrics, history, isMonitoring } = useNetwork();
  const { currentEmotions, primaryEmotionInfo } = useEmotion();

  return (
    <div className="realtime-page">
      {/* 상태 헤더 */}
      <div className="realtime-header">
        <div className="realtime-status">
          <span className={`status-indicator ${isMonitoring ? 'online' : 'offline'}`}>
            {isMonitoring ? '●' : '○'}
          </span>
          <span>연결: {isMonitoring ? '온라인' : '오프라인'}</span>
        </div>
        <div className="realtime-data-count">
          <span>데이터: {history.length}</span>
        </div>
      </div>

      {/* 현재 감정 게이지 */}
      <EmotionGauge />

      {/* 통계 카드 */}
      <DataPointsCard />

      {/* 실시간 감정 피드 */}
      <RealTimeFeedList />
    </div>
  );
}

