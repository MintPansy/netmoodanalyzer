/**
 * NetMood Analyzer - 메인 대시보드 컴포넌트
 */

import React, { useState } from 'react';
import HealthBar from './HealthBar.jsx';
import TabMenu from './TabMenu.jsx';
import EmotionChart from './EmotionChart.jsx';
import EmotionBadges from './EmotionBadges.jsx';
import MetricsPanel from './MetricsPanel.jsx';
import DiagnosticPanel from './DiagnosticPanel.jsx';
import SettingsPanel from './SettingsPanel.jsx';
import HelpPanel from './HelpPanel.jsx';
import RealTimeMonitoringPage from './RealTimeMonitoringPage.jsx';
import RiskDetectionPage from './RiskDetectionPage.jsx';
import HistoryPage from './HistoryPage.jsx';
import './Dashboard.css';

/**
 * Dashboard 컴포넌트
 * 모든 대시보드 섹션을 통합합니다.
 */
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // 탭별 콘텐츠 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* 상단 건강도 바 */}
            <HealthBar />

            {/* 메인 콘텐츠 영역 */}
            <div className="dashboard-content">
              {/* 좌측: 메트릭 패널 */}
              <div className="dashboard-metrics">
                <MetricsPanel />
              </div>

              {/* 우측: 감정 배지 */}
              <div className="dashboard-badges">
                <EmotionBadges />
              </div>
            </div>

            {/* 하단 영역 */}
            <div className="dashboard-bottom">
              {/* 하단 좌측: Settings */}
              <div className="dashboard-settings">
                <SettingsPanel />
              </div>
            </div>
          </>
        );
      case 'emotion':
        return (
          <>
            <EmotionBadges />
            <div className="dashboard-chart-full">
              <EmotionChart />
            </div>
          </>
        );
      case 'monitoring':
        return (
          <>
            <RealTimeMonitoringPage />
          </>
        );
      case 'risk':
        return (
          <>
            <RiskDetectionPage />
          </>
        );
      case 'history':
        return (
          <>
            <HistoryPage />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>NetMood Analyzer</h1>
        <p className="dashboard-subtitle">네트워크 상태를 5가지 감정으로 시각화</p>
      </header>

      <main className="dashboard-main">
        {/* 탭 메뉴 */}
        <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 탭별 콘텐츠 */}
        {renderTabContent()}
      </main>
    </div>
  );
}

