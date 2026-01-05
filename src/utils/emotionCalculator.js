/**
 * NetMood Analyzer - 5가지 감정 점수 계산 유틸리티
 */

import { THRESHOLDS } from './constants.js';

/**
 * 5가지 감정 점수 계산
 * @param {Object} metrics - 네트워크 메트릭
 * @returns {Object} 5가지 감정 점수 객체
 */
export function calculateEmotions(metrics) {
  const { latency, downloadSpeed, packetLoss, connectionDropCount, isConnected } = metrics;

  // 기본값 초기화
  const emotions = {
    happy: 0,
    stress: 0,
    anger: 0,
    calm: 0,
    anxiety: 0,
  };

  // 😊 기쁨 (Happy) - 네트워크 상태가 최적일 때
  // 조건: 낮은 지연시간 + 빠른 속도 + 낮은 패킷 손실 + 연결 안정
  if (latency !== null && latency < THRESHOLDS.LATENCY.EXCELLENT) {
    emotions.happy += 30;
  } else if (latency !== null && latency < THRESHOLDS.LATENCY.GOOD) {
    emotions.happy += 15;
  }

  if (downloadSpeed !== null && downloadSpeed > THRESHOLDS.SPEED.EXCELLENT) {
    emotions.happy += 30;
  } else if (downloadSpeed !== null && downloadSpeed > THRESHOLDS.SPEED.GOOD) {
    emotions.happy += 15;
  }

  if (packetLoss < THRESHOLDS.PACKET_LOSS.EXCELLENT) {
    emotions.happy += 25;
  } else if (packetLoss < THRESHOLDS.PACKET_LOSS.GOOD) {
    emotions.happy += 10;
  }

  if (isConnected && connectionDropCount === 0) {
    emotions.happy += 15;
  }

  // 😰 스트레스 (Stress) - 지연시간이 높을 때
  // 조건: 높은 지연시간
  if (latency !== null) {
    if (latency > THRESHOLDS.LATENCY.WARNING) {
      emotions.stress += 50;
    } else if (latency > THRESHOLDS.LATENCY.GOOD) {
      emotions.stress += 30;
    } else if (latency > THRESHOLDS.LATENCY.EXCELLENT) {
      emotions.stress += 15;
    }
  } else {
    emotions.stress += 20; // 측정 실패도 스트레스
  }

  // 😠 화남 (Anger) - 네트워크가 불안정할 때
  // 조건: 높은 패킷 손실 + 연결 끊김
  if (packetLoss > THRESHOLDS.PACKET_LOSS.WARNING) {
    emotions.anger += 40;
  } else if (packetLoss > THRESHOLDS.PACKET_LOSS.GOOD) {
    emotions.anger += 25;
  }

  if (connectionDropCount > 2) {
    emotions.anger += 40;
  } else if (connectionDropCount > 0) {
    emotions.anger += 20;
  }

  if (!isConnected) {
    emotions.anger += 20;
  }

  // 😌 평온 (Calm) - 네트워크가 안정적일 때
  // 조건: 중간 수준의 성능 + 안정적인 연결
  if (latency !== null && latency >= THRESHOLDS.LATENCY.EXCELLENT && latency <= THRESHOLDS.LATENCY.GOOD) {
    emotions.calm += 25;
  }

  if (downloadSpeed !== null && downloadSpeed >= THRESHOLDS.SPEED.GOOD && downloadSpeed <= THRESHOLDS.SPEED.EXCELLENT) {
    emotions.calm += 25;
  }

  if (packetLoss >= THRESHOLDS.PACKET_LOSS.EXCELLENT && packetLoss < THRESHOLDS.PACKET_LOSS.GOOD) {
    emotions.calm += 25;
  }

  if (isConnected && connectionDropCount === 0) {
    emotions.calm += 25;
  }

  // 😟 불안 (Anxiety) - 속도가 느릴 때
  // 조건: 느린 다운로드 속도
  if (downloadSpeed !== null) {
    if (downloadSpeed < THRESHOLDS.SPEED.WARNING) {
      emotions.anxiety += 50;
    } else if (downloadSpeed < THRESHOLDS.SPEED.GOOD) {
      emotions.anxiety += 30;
    } else if (downloadSpeed < THRESHOLDS.SPEED.EXCELLENT) {
      emotions.anxiety += 15;
    }
  } else {
    emotions.anxiety += 25; // 측정 실패도 불안
  }

  // 범위 제한 (0-100)
  Object.keys(emotions).forEach(key => {
    emotions[key] = Math.max(0, Math.min(100, Math.round(emotions[key])));
  });

  return emotions;
}

/**
 * 주요 감정 결정 (가장 높은 점수)
 * @param {Object} emotions - 감정 점수 객체
 * @returns {string} 주요 감정 키 ('happy', 'stress', 'anger', 'calm', 'anxiety')
 */
export function getPrimaryEmotion(emotions) {
  let maxScore = -1;
  let primaryEmotion = 'calm'; // 기본값

  Object.keys(emotions).forEach(key => {
    if (emotions[key] > maxScore) {
      maxScore = emotions[key];
      primaryEmotion = key;
    }
  });

  return primaryEmotion;
}

/**
 * 감정 점수를 기존 happiness/stress 형식으로 변환 (하위 호환성)
 * @param {Object} emotions - 감정 점수 객체
 * @returns {Object} { happiness, stress }
 */
export function convertToLegacyFormat(emotions) {
  return {
    happiness: emotions.happy,
    stress: emotions.stress,
  };
}

