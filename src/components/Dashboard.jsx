/**
 * NetMood Analyzer - 메인 대시보드 컴포넌트
 */

import React, { useState } from 'react';
import HealthBar from './HealthBar.jsx';
import TabMenu from './TabMenu.jsx';
import EmotionChart from './EmotionChart.jsx';
import EmotionBadges from './EmotionBadges.jsx';
import MetricsPanel from './MetricsPanel.jsx';
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

              {/* 중앙: 5가지 감정 차트 */}
              <div className="dashboard-chart">
                <EmotionChart />
              </div>
            </div>

            {/* 하단 영역 */}
            <div className="dashboard-bottom">
              {/* 하단 좌측: Settings (추후 구현) */}
              <div className="dashboard-settings">
                {/* SettingsPanel 컴포넌트는 추후 추가 */}
              </div>

              {/* 하단 우측: 감정 배지 */}
              <div className="dashboard-badges">
                <EmotionBadges />
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
            <HealthBar />
            <div className="dashboard-content">
              <div className="dashboard-metrics">
                <MetricsPanel />
              </div>
              <div className="dashboard-chart">
                <EmotionChart />
              </div>
            </div>
          </>
        );
      case 'risk':
        return (
          <div className="dashboard-placeholder">
            <h2>위험 감지</h2>
            <p>위험 상황 관리 기능은 추후 구현 예정입니다.</p>
          </div>
        );
      case 'history':
        return (
          <div className="dashboard-placeholder">
            <h2>이력 관리</h2>
            <p>과거 데이터 분석 기능은 추후 구현 예정입니다.</p>
          </div>
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

