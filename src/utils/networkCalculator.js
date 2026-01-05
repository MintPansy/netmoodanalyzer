/**
 * NetMood Analyzer - 감정 점수 계산 유틸리티
 */

import { THRESHOLDS } from './constants.js';

/**
 * 기쁨 점수 계산
 * @param {Object} metrics - 네트워크 메트릭
 * @param {number|null} metrics.latency - 지연시간 (ms)
 * @param {number|null} metrics.downloadSpeed - 다운로드 속도 (Mbps)
 * @param {number} metrics.packetLoss - 패킷 손실율 (%)
 * @param {number} metrics.connectionDropCount - 연결 끊김 횟수
 * @returns {number} 기쁨 점수 (0-100)
 */
export function calculateHappiness(metrics) {
  let happiness = 50; // 기본값

  const { latency, downloadSpeed, packetLoss, connectionDropCount } = metrics;

  // 지연시간 점수 (25% 가중치)
  if (latency !== null && latency !== undefined) {
    if (latency < THRESHOLDS.LATENCY.EXCELLENT) {
      happiness += 25;
    } else if (latency < THRESHOLDS.LATENCY.GOOD) {
      happiness += 15;
    } else if (latency < THRESHOLDS.LATENCY.WARNING) {
      happiness += 5;
    } else {
      happiness -= 20;
    }
  }

  // 다운로드 속도 점수 (20% 가중치)
  if (downloadSpeed !== null && downloadSpeed !== undefined) {
    if (downloadSpeed > THRESHOLDS.SPEED.EXCELLENT) {
      happiness += 20;
    } else if (downloadSpeed > THRESHOLDS.SPEED.GOOD) {
      happiness += 10;
    } else if (downloadSpeed > THRESHOLDS.SPEED.WARNING) {
      happiness += 5;
    } else {
      happiness -= 15;
    }
  }

  // 연결 안정성 점수 (30% 가중치)
  if (packetLoss < THRESHOLDS.PACKET_LOSS.EXCELLENT) {
    happiness += 30;
  } else if (packetLoss < THRESHOLDS.PACKET_LOSS.GOOD) {
    happiness += 15;
  } else if (packetLoss < THRESHOLDS.PACKET_LOSS.WARNING) {
    happiness += 5;
  } else {
    happiness -= 20;
  }

  // 연결 끊김 감점 (25% 가중치)
  if (connectionDropCount > 0) {
    happiness -= Math.min(25, connectionDropCount * 5);
  }

  // 범위 제한 (0-100)
  return Math.max(0, Math.min(100, Math.round(happiness)));
}

/**
 * 스트레스 점수 계산
 * @param {Object} metrics - 네트워크 메트릭
 * @param {number|null} metrics.latency - 지연시간 (ms)
 * @param {number|null} metrics.downloadSpeed - 다운로드 속도 (Mbps)
 * @param {number} metrics.packetLoss - 패킷 손실율 (%)
 * @param {number} metrics.connectionDropCount - 연결 끊김 횟수
 * @returns {number} 스트레스 점수 (0-100)
 */
export function calculateStress(metrics) {
  let stress = 0; // 기본값

  const { latency, downloadSpeed, packetLoss, connectionDropCount } = metrics;

  // 높은 지연시간 (35% 가중치)
  if (latency !== null && latency !== undefined) {
    if (latency > THRESHOLDS.LATENCY.WARNING) {
      stress += 35;
    } else if (latency > THRESHOLDS.LATENCY.GOOD) {
      stress += 15;
    } else if (latency > THRESHOLDS.LATENCY.EXCELLENT) {
      stress += 5;
    }
  }

  // 느린 속도 (30% 가중치)
  if (downloadSpeed !== null && downloadSpeed !== undefined) {
    if (downloadSpeed < THRESHOLDS.SPEED.WARNING) {
      stress += 30;
    } else if (downloadSpeed < THRESHOLDS.SPEED.GOOD) {
      stress += 15;
    } else if (downloadSpeed < THRESHOLDS.SPEED.EXCELLENT) {
      stress += 5;
    }
  }

  // 연결 불안정 (40% 가중치)
  if (packetLoss > THRESHOLDS.PACKET_LOSS.WARNING) {
    stress += 40;
  } else if (packetLoss > THRESHOLDS.PACKET_LOSS.GOOD) {
    stress += 20;
  } else if (packetLoss > THRESHOLDS.PACKET_LOSS.EXCELLENT) {
    stress += 10;
  }

  // 연결 끊김 (35% 가중치)
  if (connectionDropCount > 2) {
    stress += 35;
  } else if (connectionDropCount > 0) {
    stress += connectionDropCount * 10;
  }

  // 범위 제한 (0-100)
  return Math.max(0, Math.min(100, Math.round(stress)));
}

/**
 * 종합 건강도 점수 계산
 * @param {number} happiness - 기쁨 점수
 * @param {number} stress - 스트레스 점수
 * @returns {number} 종합 건강도 (0-100)
 */
export function calculateOverallHealth(happiness, stress) {
  // 기쁨 70%, 스트레스 30% 가중치
  const health = (happiness * 0.7) - (stress * 0.3);
  return Math.max(0, Math.min(100, Math.round(health)));
}

