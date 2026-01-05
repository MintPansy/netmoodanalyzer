/**
 * NetMood Analyzer - 위험 감지 페이지
 */

import React from 'react';
import RiskMonitoringCards from './RiskMonitoringCards.jsx';
import RiskFilters from './RiskFilters.jsx';
import RiskSettings from './RiskSettings.jsx';
import CustomerSupport from './CustomerSupport.jsx';
import DiagnosticPanel from './DiagnosticPanel.jsx';
import './RiskDetectionPage.css';

/**
 * RiskDetectionPage 컴포넌트
 */
export default function RiskDetectionPage() {
  return (
    <div className="risk-page">
      {/* 위험도 카드 */}
      <RiskMonitoringCards />

      {/* 필터 UI */}
      <RiskFilters />

      {/* 위험 상태 목록 */}
      <div className="risk-status-list">
        <DiagnosticPanel />
      </div>

      {/* 임계값 설정 */}
      <RiskSettings />

      {/* 고객 지원 */}
      <CustomerSupport />
    </div>
  );
}

