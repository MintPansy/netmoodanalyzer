/**
 * NetMood Analyzer - 위험 필터 컴포넌트
 */

import React, { useState } from 'react';
import { exportToCSV, generateFilename } from '../utils/exportManager.js';
import { useNetwork } from '../context/NetworkContext.jsx';
import { useNotification } from '../hooks/useNotification.js';
import './RiskFilters.css';

/**
 * RiskFilters 컴포넌트
 */
export default function RiskFilters() {
  const { history } = useNetwork();
  const { showSuccess, showError } = useNotification();
  const [filters, setFilters] = useState({
    severity: 'all',
    timeRange: 'all',
    emotion: 'all',
    search: '',
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExportCSV = () => {
    try {
      const filename = generateFilename('csv');
      exportToCSV(history, filename);
      showSuccess('CSV 파일이 다운로드되었습니다');
    } catch (error) {
      showError('내보내기 실패: ' + error.message);
    }
  };

  return (
    <div className="risk-filters">
      <div className="risk-filters-grid">
        <div className="filter-item">
          <label className="filter-label">위험도</label>
          <select
            className="filter-select"
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
          >
            <option value="all">전체</option>
            <option value="critical">심각</option>
            <option value="warning">주의</option>
            <option value="info">정보</option>
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-label">시간 범위</label>
          <select
            className="filter-select"
            value={filters.timeRange}
            onChange={(e) => handleFilterChange('timeRange', e.target.value)}
          >
            <option value="all">전체</option>
            <option value="1h">최근 1시간</option>
            <option value="24h">최근 24시간</option>
            <option value="7d">최근 7일</option>
            <option value="30d">최근 30일</option>
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-label">감정</label>
          <select
            className="filter-select"
            value={filters.emotion}
            onChange={(e) => handleFilterChange('emotion', e.target.value)}
          >
            <option value="all">전체</option>
            <option value="happy">기쁨</option>
            <option value="stress">스트레스</option>
            <option value="anger">화남</option>
            <option value="calm">평온</option>
            <option value="anxiety">불안</option>
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-label">검색</label>
          <input
            type="text"
            className="filter-input"
            placeholder="검색..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
      </div>

      <div className="risk-filters-actions">
        <button className="filter-button filter-button--export" onClick={handleExportCSV}>
          CSV 다운로드
        </button>
      </div>
    </div>
  );
}

