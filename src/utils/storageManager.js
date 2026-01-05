/**
 * NetMood Analyzer - localStorage 관리 유틸리티
 */

import { STORAGE_KEYS, MONITORING_CONFIG } from './constants.js';

/**
 * localStorage 관리 클래스
 */
class StorageManager {
  /**
   * 네트워크 데이터 저장
   * @param {Object} metrics - 네트워크 메트릭 데이터
   */
  saveNetworkData(metrics) {
    try {
      const existingData = this.getAllNetworkData();
      const newData = [...existingData, metrics];
      
      // 최대 데이터 포인트 제한 (오래된 데이터 자동 삭제)
      const maxPoints = MONITORING_CONFIG.MAX_DATA_POINTS;
      const trimmedData = newData.slice(-maxPoints);
      
      localStorage.setItem(STORAGE_KEYS.NETWORK_DATA, JSON.stringify(trimmedData));
      return true;
    } catch (error) {
      console.error('데이터 저장 실패:', error);
      // localStorage 용량 초과 시 오래된 데이터 삭제 후 재시도
      if (error.name === 'QuotaExceededError') {
        this.clearOldData();
        try {
          localStorage.setItem(STORAGE_KEYS.NETWORK_DATA, JSON.stringify([metrics]));
          return true;
        } catch (retryError) {
          console.error('재시도 실패:', retryError);
          return false;
        }
      }
      return false;
    }
  }

  /**
   * 모든 네트워크 데이터 조회
   * @returns {Array} 네트워크 메트릭 배열
   */
  getAllNetworkData() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NETWORK_DATA);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('데이터 조회 실패:', error);
      return [];
    }
  }

  /**
   * 최근 N분 데이터 조회
   * @param {number} minutes - 조회할 시간 (분)
   * @returns {Array} 네트워크 메트릭 배열
   */
  getRecentData(minutes = MONITORING_CONFIG.MAX_HISTORY_HOURS * 60) {
    const allData = this.getAllNetworkData();
    const cutoffTime = Date.now() - (minutes * 60 * 1000);
    return allData.filter(item => item.timestamp >= cutoffTime);
  }

  /**
   * 오래된 데이터 삭제
   * @param {number} hours - 보관할 시간 (시간)
   */
  clearOldData(hours = MONITORING_CONFIG.MAX_HISTORY_HOURS) {
    const allData = this.getAllNetworkData();
    const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
    const recentData = allData.filter(item => item.timestamp >= cutoffTime);
    localStorage.setItem(STORAGE_KEYS.NETWORK_DATA, JSON.stringify(recentData));
  }

  /**
   * 모든 데이터 삭제
   */
  clearAllData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.NETWORK_DATA);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      return true;
    } catch (error) {
      console.error('데이터 삭제 실패:', error);
      return false;
    }
  }

  /**
   * CSV 형식으로 데이터 내보내기
   * @returns {string} CSV 문자열
   */
  exportAsCSV() {
    const data = this.getAllNetworkData();
    if (data.length === 0) return '';

    // CSV 헤더
    const headers = [
      'Timestamp',
      'Latency (ms)',
      'Download Speed (Mbps)',
      'Upload Speed (Mbps)',
      'Packet Loss (%)',
      'Jitter (ms)',
      'Signal Strength (dBm)',
      'Connection Type',
      'Is Connected',
      'Happiness',
      'Stress',
      'Connection Drop Count'
    ];

    // CSV 데이터 행
    const rows = data.map(item => [
      new Date(item.timestamp).toISOString(),
      item.latency ?? '',
      item.downloadSpeed ?? '',
      item.uploadSpeed ?? '',
      item.packetLoss,
      item.jitter,
      item.signalStrength,
      item.connectionType,
      item.isConnected,
      item.happiness,
      item.stress,
      item.connectionDropCount
    ]);

    // CSV 문자열 생성
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  }

  /**
   * 설정 저장
   * @param {Object} settings - 설정 객체
   */
  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('설정 저장 실패:', error);
      return false;
    }
  }

  /**
   * 설정 조회
   * @returns {Object|null} 설정 객체
   */
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('설정 조회 실패:', error);
      return null;
    }
  }
}

// 싱글톤 인스턴스 생성
export const storageManager = new StorageManager();

