/**
 * NetMood Analyzer - 위험 설정 컴포넌트
 */

import React, { useState } from 'react';
import './RiskSettings.css';

/**
 * RiskSettings 컴포넌트
 */
export default function RiskSettings() {
  const [thresholds, setThresholds] = useState({
    high: 9,
    medium: 7,
    low: 5,
  });

  const [notifications, setNotifications] = useState({
    realtime: true,
    email: false,
    sms: false,
  });

  const handleThresholdChange = (key, value) => {
    setThresholds(prev => ({ ...prev, [key]: parseInt(value) }));
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="risk-settings">
      <h3 className="risk-settings-title">임계값 설정</h3>
      
      <div className="risk-settings-thresholds">
        <div className="threshold-item">
          <label className="threshold-label">9미만 (높음)</label>
          <input
            type="range"
            min="5"
            max="10"
            value={thresholds.high}
            onChange={(e) => handleThresholdChange('high', e.target.value)}
            className="threshold-slider"
          />
          <span className="threshold-value">{thresholds.high}</span>
        </div>

        <div className="threshold-item">
          <label className="threshold-label">7-8 (중간)</label>
          <input
            type="range"
            min="5"
            max="10"
            value={thresholds.medium}
            onChange={(e) => handleThresholdChange('medium', e.target.value)}
            className="threshold-slider"
          />
          <span className="threshold-value">{thresholds.medium}</span>
        </div>

        <div className="threshold-item">
          <label className="threshold-label">5-6 (낮음)</label>
          <input
            type="range"
            min="1"
            max="6"
            value={thresholds.low}
            onChange={(e) => handleThresholdChange('low', e.target.value)}
            className="threshold-slider"
          />
          <span className="threshold-value">{thresholds.low}</span>
        </div>
      </div>

      <h3 className="risk-settings-title">알림 설정</h3>
      
      <div className="risk-settings-notifications">
        <label className="notification-item">
          <input
            type="checkbox"
            checked={notifications.realtime}
            onChange={() => handleNotificationChange('realtime')}
          />
          <span>실시간 알림</span>
        </label>
        <label className="notification-item">
          <input
            type="checkbox"
            checked={notifications.email}
            onChange={() => handleNotificationChange('email')}
          />
          <span>이메일 알림</span>
        </label>
        <label className="notification-item">
          <input
            type="checkbox"
            checked={notifications.sms}
            onChange={() => handleNotificationChange('sms')}
          />
          <span>SMS 알림</span>
        </label>
      </div>
    </div>
  );
}

