/**
 * NetMood Analyzer - 상수 정의
 */

// 색상 팔레트
export const COLORS = {
  // 5가지 감정 표현
  HAPPY: '#4CAF50',      // 😊 기쁨 - 초록색
  STRESS: '#FF6B6B',     // 😰 스트레스 - 빨간색
  ANGER: '#F44336',      // 😠 화남 - 진빨간색
  CALM: '#2196F3',       // 😌 평온 - 파란색
  ANXIETY: '#FFC107',    // 😟 불안 - 노란색
  
  // 하위 호환성 (기존 코드)
  HAPPINESS: '#4CAF50',  // 기쁨 - 초록색 (별칭)
  
  // 배경
  BG_PRIMARY: '#f0f8f0',   // 연한 초록 배경
  BG_CARD: '#ffffff',      // 카드 배경
  BG_SECONDARY: '#f5f5f5', // 보조 배경
  
  // 텍스트
  TEXT_PRIMARY: '#1f2120',
  TEXT_SECONDARY: '#666666',
  
  // 경계/구분선
  BORDER: '#e0e0e0',
  BORDER_LIGHT: '#f0f0f0',
};

// 5가지 감정 정보
export const EMOTIONS = {
  HAPPY: {
    name: '기쁨',
    emoji: '😊',
    color: COLORS.HAPPY,
    description: '네트워크 상태가 최적일 때',
  },
  STRESS: {
    name: '스트레스',
    emoji: '😰',
    color: COLORS.STRESS,
    description: '지연시간이 높을 때',
  },
  ANGER: {
    name: '화남',
    emoji: '😠',
    color: COLORS.ANGER,
    description: '네트워크가 불안정할 때',
  },
  CALM: {
    name: '평온',
    emoji: '😌',
    color: COLORS.CALM,
    description: '네트워크가 안정적일 때',
  },
  ANXIETY: {
    name: '불안',
    emoji: '😟',
    color: COLORS.ANXIETY,
    description: '속도가 느릴 때',
  },
};

// 임계값 상수
export const THRESHOLDS = {
  LATENCY: {
    EXCELLENT: 50,   // ms
    GOOD: 100,       // ms
    WARNING: 200,    // ms
  },
  SPEED: {
    EXCELLENT: 10,   // Mbps
    GOOD: 5,         // Mbps
    WARNING: 1,      // Mbps
  },
  PACKET_LOSS: {
    EXCELLENT: 1,    // %
    GOOD: 3,         // %
    WARNING: 10,     // %
  },
};

// 모니터링 설정
export const MONITORING_CONFIG = {
  INTERVAL: 5000,              // 5초마다 측정
  MAX_HISTORY_HOURS: 60,       // 최근 60분 데이터 유지
  MAX_DATA_POINTS: 720,        // 최대 데이터 포인트 (60분 * 12개/분)
  SPEED_TEST_SIZE: 1024,       // 속도 테스트 파일 크기 (bytes)
  LATENCY_TIMEOUT: 10000,      // 지연시간 측정 타임아웃 (ms)
  SPEED_TEST_TIMEOUT: 30000,   // 속도 테스트 타임아웃 (ms)
};

// API 엔드포인트
export const API_ENDPOINTS = {
  LATENCY_TEST: 'https://www.google.com/favicon.ico',
  SPEED_TEST: 'https://www.google.com/favicon.ico', // 1KB 파일로 대체 가능
};

// localStorage 키
export const STORAGE_KEYS = {
  NETWORK_DATA: 'netmood_network_data',
  SETTINGS: 'netmood_settings',
  HISTORY: 'netmood_history',
};

// 상태 레이블
export const STATUS_LABELS = {
  EXCELLENT: '양호',
  GOOD: '보통',
  WARNING: '주의',
  ERROR: '경고',
};

