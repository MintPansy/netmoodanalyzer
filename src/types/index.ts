/**
 * NetMood Analyzer - TypeScript 타입 정의
 */

/**
 * 네트워크 메트릭 데이터 구조
 */
/**
 * 5가지 감정 점수
 */
export interface EmotionScores {
  happy: number;      // 😊 기쁨 (0-100)
  stress: number;     // 😰 스트레스 (0-100)
  anger: number;      // 😠 화남 (0-100)
  calm: number;       // 😌 평온 (0-100)
  anxiety: number;    // 😟 불안 (0-100)
}

export interface NetworkMetrics {
  timestamp: number;           // 밀리초 단위 타임스탬프
  latency: number | null;      // 지연시간 (ms)
  downloadSpeed: number | null; // 다운로드 속도 (Mbps)
  uploadSpeed?: number | null;  // 업로드 속도 (Mbps)
  packetLoss: number;          // 패킷 손실율 (%)
  jitter: number;              // 지터 (ms)
  signalStrength: number;      // WiFi 신호 강도 (dBm)
  connectionType: string;      // "WiFi" | "4G" | "5G" | "Ethernet"
  isConnected: boolean;        // 연결 상태
  happiness: number;           // 기쁨 점수 (0-100) - 하위 호환성
  stress: number;              // 스트레스 점수 (0-100) - 하위 호환성
  connectionDropCount: number; // 연결 끊김 횟수
  // 5가지 감정 점수
  emotions: EmotionScores;     // 5가지 감정 점수
}

/**
 * 진단 결과 인터페이스
 */
export interface DiagnosticResult {
  id: string;
  severity: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  recommendation?: string;
  timestamp: number;
}

/**
 * 설정 인터페이스
 */
export interface Settings {
  monitoringInterval: number;  // 모니터링 간격 (ms)
  maxHistoryHours: number;    // 최대 히스토리 보관 시간 (시간)
  thresholds: {
    latency: {
      good: number;    // 좋음 기준 (ms)
      warning: number; // 경고 기준 (ms)
    };
    speed: {
      good: number;    // 좋음 기준 (Mbps)
      warning: number; // 경고 기준 (Mbps)
    };
    packetLoss: {
      good: number;    // 좋음 기준 (%)
      warning: number; // 경고 기준 (%)
    };
  };
  notifications: {
    enabled: boolean;
    onHighStress: boolean;
    onConnectionDrop: boolean;
  };
}

