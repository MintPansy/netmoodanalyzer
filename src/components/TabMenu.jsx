/**
 * NetMood Analyzer - 탭 메뉴 컴포넌트
 * 5개의 탭으로 각 섹션을 전환합니다.
 */

import React, { useState } from 'react';
import './TabMenu.css';

const TABS = [
  {
    id: 'overview',
    title: '개요',
    subtitle: '전체 현황 요약',
    icon: '📊',
  },
  {
    id: 'emotion',
    title: '감정 분석',
    subtitle: '상세 감정 분석',
    icon: '🧠',
  },
  {
    id: 'monitoring',
    title: '실시간 모니터링',
    subtitle: '실시간 상태 추적',
    icon: '📈',
  },
  {
    id: 'risk',
    title: '위험 감지',
    subtitle: '위험 상황 관리',
    icon: '⚠️',
  },
  {
    id: 'history',
    title: '이력 관리',
    subtitle: '과거 데이터 분석',
    icon: '🕐',
  },
];

/**
 * TabMenu 컴포넌트
 */
export default function TabMenu({ activeTab, onTabChange }) {
  return (
    <div className="tab-menu">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <div className="tab-icon">{tab.icon}</div>
          <div className="tab-content">
            <div className="tab-title">{tab.title}</div>
            <div className="tab-subtitle">{tab.subtitle}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

