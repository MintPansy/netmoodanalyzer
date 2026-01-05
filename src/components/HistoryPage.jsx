/**
 * NetMood Analyzer - 이력 감지 페이지
 */

import React, { useState } from 'react';
import HistoryStats from './HistoryStats.jsx';
import HistoryFilters from './HistoryFilters.jsx';
import EmotionAnalysis from './EmotionAnalysis.jsx';
import HistoryTable from './HistoryTable.jsx';
import './HistoryPage.css';

/**
 * HistoryPage 컴포넌트
 */
export default function HistoryPage() {
  const [filters, setFilters] = useState({
    period: '30d',
    detection: 'all',
    sort: 'newest',
    search: '',
  });

  return (
    <div className="history-page">
      {/* 통계 헤더 */}
      <HistoryStats />

      {/* 필터 UI */}
      <HistoryFilters onFilterChange={setFilters} />

      {/* 감정 분석 카드 */}
      <EmotionAnalysis />

      {/* 데이터 테이블 */}
      <HistoryTable filters={filters} />
    </div>
  );
}

