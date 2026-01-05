/**
 * NetMood Analyzer - 이력 필터 컴포넌트
 */

import React, { useState } from 'react';
import { exportToCSV, generateFilename } from '../utils/exportManager.js';
import { useNetwork } from '../context/NetworkContext.jsx';
import { useNotification } from '../hooks/useNotification.js';
import './HistoryFilters.css';

/**
 * HistoryFilters 컴포넌트
 */
export default function HistoryFilters({ onFilterChange }) {
  const { history } = useNetwork();
  const { showSuccess, showError } = useNotification();
  const [filters, setFilters] = useState({
    period: '30d',
    detection: 'all',
    sort: 'newest',
    search: '',
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
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
    <div className="history-filters">
      <div className="history-filters-grid">
        <div className="filter-item">
          <label className="filter-label">기간</label>
          <select
            className="filter-select"
            value={filters.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
          >
            <option value="1d">최근 1일</option>
            <option value="7d">최근 7일</option>
            <option value="30d">최근 30일</option>
            <option value="all">전체</option>
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-label">감지</label>
          <select
            className="filter-select"
            value={filters.detection}
            onChange={(e) => handleFilterChange('detection', e.target.value)}
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
          <label className="filter-label">정렬</label>
          <select
            className="filter-select"
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            <option value="newest">최신순</option>
            <option value="oldest">과거순</option>
            <option value="strength-high">강도 높은순</option>
            <option value="strength-low">강도 낮은순</option>
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

      <div className="history-filters-actions">
        <button className="filter-button filter-button--export" onClick={handleExportCSV}>
          CSV 다운로드
        </button>
      </div>
    </div>
  );
}

