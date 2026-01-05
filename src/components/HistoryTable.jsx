/**
 * NetMood Analyzer - 이력 테이블 컴포넌트
 */

import React, { useState, useMemo } from 'react';
import { useNetwork } from '../context/NetworkContext.jsx';
import { useEmotion } from '../context/EmotionContext.jsx';
import { EMOTIONS } from '../utils/constants.js';
import './HistoryTable.css';

const ITEMS_PER_PAGE = 10;

/**
 * HistoryTable 컴포넌트
 */
export default function HistoryTable({ filters = {} }) {
  const { history } = useNetwork();
  const { historyEmotions } = useEmotion();
  const [currentPage, setCurrentPage] = useState(1);

  // 필터링 및 정렬된 데이터
  const processedData = useMemo(() => {
    let data = historyEmotions.map((item, index) => {
      const networkData = history[index] || {};
      const emotions = item.emotions;
      const maxEmotion = Object.keys(emotions).reduce((a, b) => 
        emotions[a] > emotions[b] ? a : b
      );
      const emotionInfo = EMOTIONS[maxEmotion.toUpperCase()] || EMOTIONS.CALM;
      const strength = Math.round(emotions[maxEmotion] / 10);

      return {
        timestamp: item.timestamp,
        emotion: emotionInfo,
        strength,
        packets: networkData.packetLoss || 0,
        latency: networkData.latency || 0,
        bandwidth: networkData.downloadSpeed || 0,
      };
    });

    // 필터 적용
    if (filters.period && filters.period !== 'all') {
      const days = filters.period === '1d' ? 1 : filters.period === '7d' ? 7 : 30;
      const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
      data = data.filter(item => item.timestamp >= cutoff);
    }

    if (filters.detection && filters.detection !== 'all') {
      data = data.filter(item => item.emotion.key === filters.detection);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      data = data.filter(item => 
        item.emotion.name.toLowerCase().includes(searchLower)
      );
    }

    // 정렬
    if (filters.sort === 'oldest') {
      data.sort((a, b) => a.timestamp - b.timestamp);
    } else if (filters.sort === 'strength-high') {
      data.sort((a, b) => b.strength - a.strength);
    } else if (filters.sort === 'strength-low') {
      data.sort((a, b) => a.strength - b.strength);
    } else {
      // 최신순 (기본)
      data.sort((a, b) => b.timestamp - a.timestamp);
    }

    return data;
  }, [history, historyEmotions, filters]);

  // 페이지네이션
  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = processedData.slice(startIndex, endIndex);

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <div className="history-table-container">
      <div className="history-table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>시간</th>
              <th>감정</th>
              <th>강도</th>
              <th>패킷수</th>
              <th>지연시간</th>
              <th>대역폭</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="6" className="history-table-empty">
                  데이터가 없습니다
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item.timestamp}>
                  <td>{formatDateTime(item.timestamp)}</td>
                  <td>
                    <span className="emotion-cell">
                      <span className="emotion-emoji">{item.emotion.emoji}</span>
                      <span>{item.emotion.name}</span>
                    </span>
                  </td>
                  <td>{item.strength}/10</td>
                  <td>{item.packets.toFixed(1)}%</td>
                  <td>{item.latency ? `${item.latency}ms` : '-'}</td>
                  <td>{item.bandwidth ? `${item.bandwidth.toFixed(2)}Mbps` : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="history-table-pagination">
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <span className="pagination-info">
            페이지 {currentPage} / {totalPages}
          </span>
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

