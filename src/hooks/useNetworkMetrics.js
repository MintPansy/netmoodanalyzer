/**
 * NetMood Analyzer - 네트워크 메트릭 수집 훅
 * 
 * 5초마다 네트워크 상태를 측정하고 감정 점수를 계산합니다.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateHappiness, calculateStress } from '../utils/networkCalculator.js';
import { calculateEmotions } from '../utils/emotionCalculator.js';
import { storageManager } from '../utils/storageManager.js';
import { MONITORING_CONFIG, API_ENDPOINTS } from '../utils/constants.js';

/**
 * 지연시간 측정 (핑 테스트)
 * 이미지 로딩을 사용하여 실제 네트워크 지연시간 측정
 * @returns {Promise<number|null>} 지연시간 (ms) 또는 null
 */
async function measureLatency() {
  return new Promise((resolve) => {
    try {
      const startTime = performance.now();
      const img = new Image();
      const timeoutId = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        resolve(null);
      }, MONITORING_CONFIG.LATENCY_TIMEOUT);

      img.onload = () => {
        clearTimeout(timeoutId);
        const endTime = performance.now();
        const latency = Math.round(endTime - startTime);
        resolve(latency > 0 ? latency : null);
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        // 에러가 발생해도 시간 측정은 가능
        const endTime = performance.now();
        const latency = Math.round(endTime - startTime);
        resolve(latency > 0 ? latency : null);
      };

      // 캐시 방지를 위한 타임스탬프 추가
      img.src = `${API_ENDPOINTS.LATENCY_TEST}?t=${Date.now()}`;
    } catch (error) {
      console.warn('지연시간 측정 실패:', error.message);
      resolve(null);
    }
  });
}

/**
 * 다운로드 속도 측정
 * @returns {Promise<number|null>} 다운로드 속도 (Mbps) 또는 null
 */
async function measureSpeed() {
  try {
    const testSize = MONITORING_CONFIG.SPEED_TEST_SIZE; // 1KB
    const iterations = 3; // 3회 평균
    const speeds = [];

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), MONITORING_CONFIG.SPEED_TEST_TIMEOUT);

      try {
        // 이미지 로딩을 사용한 속도 측정
        const response = await fetch(`${API_ENDPOINTS.SPEED_TEST}?t=${Date.now()}`, {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-cache',
        });

        clearTimeout(timeoutId);
        
        if (response.ok) {
          // 실제 다운로드된 데이터 크기 추정 (헤더에서)
          const contentLength = response.headers.get('content-length');
          const actualSize = contentLength ? parseInt(contentLength, 10) : testSize;
          
          const endTime = performance.now();
          const duration = (endTime - startTime) / 1000; // 초 단위
          const speedMbps = (actualSize * 8) / (duration * 1000000); // Mbps

          if (speedMbps > 0 && isFinite(speedMbps)) {
            speeds.push(speedMbps);
          }
        }
      } catch (error) {
        // CORS 에러 등으로 실패할 수 있음
        console.warn(`속도 측정 시도 ${i + 1} 실패:`, error.message);
      }
    }

    if (speeds.length === 0) return null;

    // 평균 속도 계산
    const avgSpeed = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
    return Math.round(avgSpeed * 100) / 100; // 소수점 2자리
  } catch (error) {
    console.warn('속도 측정 실패:', error.message);
    return null;
  }
}

/**
 * 네트워크 연결 정보 수집
 * @returns {Object} 연결 정보
 */
function getConnectionInfo() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (!connection) {
    return {
      connectionType: 'Unknown',
      signalStrength: -100, // 기본값
      isConnected: navigator.onLine,
    };
  }

  return {
    connectionType: connection.effectiveType || 'Unknown',
    signalStrength: connection.rssi || -100,
    isConnected: navigator.onLine,
  };
}

/**
 * useNetworkMetrics 훅
 * @returns {Object} 네트워크 메트릭 및 제어 함수
 */
export function useNetworkMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);
  const connectionDropCountRef = useRef(0);
  const lastConnectionStateRef = useRef(navigator.onLine);

  /**
   * 네트워크 데이터 수집 및 저장
   */
  const collectNetworkData = useCallback(async () => {
    try {
      // 연결 정보 수집
      const connectionInfo = getConnectionInfo();
      
      // 연결 끊김 감지
      if (!connectionInfo.isConnected && lastConnectionStateRef.current) {
        connectionDropCountRef.current += 1;
      }
      lastConnectionStateRef.current = connectionInfo.isConnected;

      // 지연시간 및 속도 측정 (병렬 실행)
      const [latency, downloadSpeed] = await Promise.all([
        measureLatency(),
        measureSpeed(),
      ]);

      // 기본 메트릭 객체 생성
      const baseMetrics = {
        timestamp: Date.now(),
        latency,
        downloadSpeed,
        uploadSpeed: null, // 브라우저 제한으로 측정 불가
        packetLoss: 0, // 브라우저 제한으로 측정 불가
        jitter: 0, // 브라우저 제한으로 측정 불가
        signalStrength: connectionInfo.signalStrength,
        connectionType: connectionInfo.connectionType,
        isConnected: connectionInfo.isConnected,
        connectionDropCount: connectionDropCountRef.current,
      };

      // 감정 점수 계산 (하위 호환성)
      const happiness = calculateHappiness(baseMetrics);
      const stress = calculateStress(baseMetrics);
      
      // 5가지 감정 점수 계산
      const emotions = calculateEmotions(baseMetrics);

      const newMetrics = {
        ...baseMetrics,
        happiness,
        stress,
        emotions, // 5가지 감정 점수
      };

      // 상태 업데이트
      setMetrics(newMetrics);

      // 히스토리 업데이트
      setHistory(prev => {
        const updated = [...prev, newMetrics];
        // 최근 60분 데이터만 유지
        const cutoffTime = Date.now() - (MONITORING_CONFIG.MAX_HISTORY_HOURS * 60 * 60 * 1000);
        return updated.filter(item => item.timestamp >= cutoffTime);
      });

      // localStorage에 저장
      storageManager.saveNetworkData(newMetrics);

      return newMetrics;
    } catch (error) {
      console.error('네트워크 데이터 수집 실패:', error);
      return null;
    }
  }, []);

  /**
   * 모니터링 시작
   */
  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;

    setIsMonitoring(true);
    
    // 즉시 첫 측정 실행
    collectNetworkData();

    // 주기적 측정 시작
    intervalRef.current = setInterval(() => {
      collectNetworkData();
    }, MONITORING_CONFIG.INTERVAL);

    console.log('네트워크 모니터링 시작');
  }, [isMonitoring, collectNetworkData]);

  /**
   * 모니터링 중지
   */
  const stopMonitoring = useCallback(() => {
    if (!isMonitoring) return;

    setIsMonitoring(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    console.log('네트워크 모니터링 중지');
  }, [isMonitoring]);

  /**
   * 히스토리 로드
   */
  const loadHistory = useCallback(() => {
    const recentData = storageManager.getRecentData(MONITORING_CONFIG.MAX_HISTORY_HOURS * 60);
    setHistory(recentData);
    
    // 최신 메트릭 설정
    if (recentData.length > 0) {
      setMetrics(recentData[recentData.length - 1]);
    }
  }, []);

  // 컴포넌트 마운트 시 히스토리 로드 및 모니터링 시작
  useEffect(() => {
    loadHistory();
    startMonitoring();

    // 컴포넌트 언마운트 시 정리
    return () => {
      stopMonitoring();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    metrics,
    history,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    collectNetworkData,
    loadHistory,
  };
}

