/**
 * NetMood Analyzer - 진단 규칙 정의
 */

import { THRESHOLDS } from './constants.js';

/**
 * 진단 이슈 타입 정의
 * @typedef {Object} DiagnosticIssue
 * @property {string} id - 이슈 고유 ID
 * @property {number} timestamp - 생성 시간
 * @property {'critical'|'warning'|'info'} severity - 심각도
 * @property {string} title - 제목
 * @property {string} description - 설명
 * @property {string} recommendation - 권장사항
 * @property {string} icon - 아이콘
 * @property {boolean} resolved - 해결 여부
 */

/**
 * 진단 규칙 정의
 */
export const DIAGNOSTIC_RULES = {
  highLatency: {
    trigger: (metrics) => metrics.latency !== null && metrics.latency > THRESHOLDS.LATENCY.WARNING,
    severity: 'critical',
    title: '높은 지연시간 감지',
    description: `지연시간이 ${THRESHOLDS.LATENCY.WARNING}ms를 초과했습니다 (현재: ${metrics => metrics.latency}ms)`,
    recommendation: '네트워크 연결을 확인하거나 라우터를 재부팅해보세요',
    icon: '⚠️',
  },
  lowSpeed: {
    trigger: (metrics) => metrics.downloadSpeed !== null && metrics.downloadSpeed < THRESHOLDS.SPEED.WARNING,
    severity: 'critical',
    title: '느린 다운로드 속도',
    description: `다운로드 속도가 ${THRESHOLDS.SPEED.WARNING}Mbps 미만입니다 (현재: ${metrics => metrics.downloadSpeed?.toFixed(2)}Mbps)`,
    recommendation: 'WiFi를 다시 연결하거나 더 가까운 위치로 이동해보세요',
    icon: '🐌',
  },
  packetLoss: {
    trigger: (metrics) => metrics.packetLoss > THRESHOLDS.PACKET_LOSS.WARNING,
    severity: 'warning',
    title: '패킷 손실 감지',
    description: `${THRESHOLDS.PACKET_LOSS.WARNING}% 이상의 패킷이 손실되었습니다 (현재: ${metrics => metrics.packetLoss.toFixed(1)}%)`,
    recommendation: '라우터를 재부팅하거나 네트워크 케이블을 확인해보세요',
    icon: '📦',
  },
  connectionDrop: {
    trigger: (metrics) => metrics.connectionDropCount > 0,
    severity: 'warning',
    title: '연결 끊김 발생',
    description: `${metrics => metrics.connectionDropCount}회 연결이 끊겼습니다`,
    recommendation: '네트워크 안정성을 확인하고 라우터 설정을 점검하세요',
    icon: '🔌',
  },
  disconnected: {
    trigger: (metrics) => !metrics.isConnected,
    severity: 'critical',
    title: '네트워크 연결 끊김',
    description: '인터넷에 연결되어 있지 않습니다',
    recommendation: '네트워크 연결을 확인하고 WiFi 또는 이더넷 케이블을 점검하세요',
    icon: '❌',
  },
  lowSignal: {
    trigger: (metrics) => metrics.signalStrength < -80,
    severity: 'warning',
    title: '약한 신호 강도',
    description: `WiFi 신호가 약합니다 (현재: ${metrics => metrics.signalStrength}dBm)`,
    recommendation: '라우터에 더 가까이 이동하거나 신호 증폭기를 사용해보세요',
    icon: '📶',
  },
};

/**
 * 진단 실행
 * @param {Object} metrics - 네트워크 메트릭
 * @returns {Array} 진단 이슈 배열
 */
export function analyzeDiagnostics(metrics) {
  if (!metrics) {
    return [];
  }

  const issues = [];

  Object.keys(DIAGNOSTIC_RULES).forEach(ruleId => {
    const rule = DIAGNOSTIC_RULES[ruleId];
    
    if (rule.trigger(metrics)) {
      const issue = {
        id: `${ruleId}-${Date.now()}`,
        timestamp: Date.now(),
        severity: rule.severity,
        title: rule.title,
        description: typeof rule.description === 'function' 
          ? rule.description(metrics) 
          : rule.description,
        recommendation: rule.recommendation,
        icon: rule.icon,
        resolved: false,
      };
      issues.push(issue);
    }
  });

  // 심각도 순으로 정렬 (critical > warning > info)
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return issues;
}

/**
 * 권장사항 가져오기
 * @param {string} ruleId - 규칙 ID
 * @returns {string} 권장사항
 */
export function getRecommendation(ruleId) {
  const rule = DIAGNOSTIC_RULES[ruleId];
  return rule ? rule.recommendation : '';
}

