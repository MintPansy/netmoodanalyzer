/**
 * NetMood Analyzer - 네트워크 실시간 모니터링 시스템
 * 현재 컴퓨터의 네트워크 상태를 실시간으로 감지하고 감정 분석을 수행합니다.
 */

class NetworkMonitor {
  constructor() {
    this.isMonitoring = false;
    this.monitoringInterval = null;
    this.dataPoints = [];
    this.maxDataPoints = 1000;
    this.emotionAnalysis = new EmotionAnalyzer();
    this.callbacks = {
      onDataUpdate: null,
      onEmotionChange: null,
      onThreatDetected: null
    };
    
    this.init();
  }

  init() {
    console.log('네트워크 모니터가 초기화되었습니다.');
    this.startMonitoring();
  }

  // 모니터링 시작
  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('네트워크 모니터링을 시작합니다...');
    
    // 1초마다 네트워크 상태 수집
    this.monitoringInterval = setInterval(() => {
      this.collectNetworkData();
    }, 1000);
  }

  // 모니터링 중지
  stopMonitoring() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('네트워크 모니터링을 중지했습니다.');
  }

  // 네트워크 데이터 수집
  async collectNetworkData() {
    try {
      const networkData = await this.getNetworkMetrics();
      const timestamp = new Date().toISOString();
      
      // 데이터 포인트 추가
      const dataPoint = {
        timestamp,
        ...networkData,
        id: Date.now() + Math.random()
      };
      
      this.dataPoints.push(dataPoint);
      
      // 최대 데이터 포인트 수 제한
      if (this.dataPoints.length > this.maxDataPoints) {
        this.dataPoints = this.dataPoints.slice(-this.maxDataPoints);
      }
      
      // 감정 분석 수행
      const emotionResult = this.emotionAnalysis.analyzeEmotion(networkData);
      
      // 콜백 실행
      if (this.callbacks.onDataUpdate) {
        this.callbacks.onDataUpdate(dataPoint, emotionResult);
      }
      
      // 위험 감지 확인
      if (emotionResult.threatLevel > 0.7) {
        if (this.callbacks.onThreatDetected) {
          this.callbacks.onThreatDetected(emotionResult);
        }
      }
      
    } catch (error) {
      console.error('네트워크 데이터 수집 실패:', error);
    }
  }

  // 네트워크 메트릭 수집
  async getNetworkMetrics() {
    const metrics = {
      // 연결 상태
      isOnline: navigator.onLine,
      
      // 페이지 로드 성능
      pageLoadTime: this.getPageLoadTime(),
      
      // 네트워크 연결 정보
      connectionType: this.getConnectionType(),
      
      // 가상 네트워크 지표 (실제 네트워크 API 제한으로 시뮬레이션)
      latency: this.simulateLatency(),
      bandwidth: this.simulateBandwidth(),
      packetLoss: this.simulatePacketLoss(),
      jitter: this.simulateJitter(),
      
      // 시스템 리소스
      cpuUsage: this.simulateCpuUsage(),
      memoryUsage: this.simulateMemoryUsage(),
      
      // 네트워크 활동
      activeConnections: this.simulateActiveConnections(),
      dataTransferred: this.simulateDataTransferred(),
      
      // 보안 지표
      securityScore: this.simulateSecurityScore(),
      threatLevel: this.simulateThreatLevel()
    };
    
    return metrics;
  }

  // 페이지 로드 시간 측정
  getPageLoadTime() {
    if (performance && performance.timing) {
      const timing = performance.timing;
      return timing.loadEventEnd - timing.navigationStart;
    }
    return Math.random() * 2000 + 500; // 시뮬레이션
  }

  // 연결 타입 감지
  getConnectionType() {
    if (navigator.connection) {
      return navigator.connection.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  // 지연시간 시뮬레이션 (실제 네트워크 상태 반영)
  simulateLatency() {
    const baseLatency = 20;
    const variation = Math.random() * 50;
    const timeOfDay = this.getTimeOfDayFactor();
    return Math.round(baseLatency + variation + timeOfDay);
  }

  // 대역폭 시뮬레이션
  simulateBandwidth() {
    const baseBandwidth = 100;
    const variation = Math.random() * 200;
    const timeOfDay = this.getTimeOfDayFactor() * 10;
    return Math.round(baseBandwidth + variation - timeOfDay);
  }

  // 패킷 손실 시뮬레이션
  simulatePacketLoss() {
    const baseLoss = 0.1;
    const variation = Math.random() * 0.5;
    return Math.round((baseLoss + variation) * 100) / 100;
  }

  // 지터 시뮬레이션
  simulateJitter() {
    const baseJitter = 5;
    const variation = Math.random() * 20;
    return Math.round(baseJitter + variation);
  }

  // CPU 사용률 시뮬레이션
  simulateCpuUsage() {
    const baseUsage = 30;
    const variation = Math.random() * 40;
    return Math.round(baseUsage + variation);
  }

  // 메모리 사용률 시뮬레이션
  simulateMemoryUsage() {
    const baseUsage = 50;
    const variation = Math.random() * 30;
    return Math.round(baseUsage + variation);
  }

  // 활성 연결 수 시뮬레이션
  simulateActiveConnections() {
    const baseConnections = 10;
    const variation = Math.floor(Math.random() * 20);
    return baseConnections + variation;
  }

  // 전송된 데이터량 시뮬레이션
  simulateDataTransferred() {
    const baseData = 1000;
    const variation = Math.random() * 5000;
    return Math.round(baseData + variation);
  }

  // 보안 점수 시뮬레이션
  simulateSecurityScore() {
    const baseScore = 80;
    const variation = Math.random() * 20;
    return Math.round(baseScore + variation);
  }

  // 위험 수준 시뮬레이션
  simulateThreatLevel() {
    const baseThreat = 0.1;
    const variation = Math.random() * 0.3;
    return Math.round((baseThreat + variation) * 100) / 100;
  }

  // 시간대별 요인 계산
  getTimeOfDayFactor() {
    const hour = new Date().getHours();
    // 오후 2-6시는 네트워크 사용량이 많아 지연 증가
    if (hour >= 14 && hour <= 18) {
      return 20;
    }
    // 새벽 2-6시는 네트워크 사용량이 적어 지연 감소
    if (hour >= 2 && hour <= 6) {
      return -10;
    }
    return 0;
  }

  // 콜백 설정
  onDataUpdate(callback) {
    this.callbacks.onDataUpdate = callback;
  }

  onEmotionChange(callback) {
    this.callbacks.onEmotionChange = callback;
  }

  onThreatDetected(callback) {
    this.callbacks.onThreatDetected = callback;
  }

  // 현재 데이터 포인트 반환
  getCurrentData() {
    return this.dataPoints[this.dataPoints.length - 1] || null;
  }

  // 모든 데이터 포인트 반환
  getAllData() {
    return [...this.dataPoints];
  }

  // 최근 N개 데이터 포인트 반환
  getRecentData(count = 10) {
    return this.dataPoints.slice(-count);
  }

  // 데이터 초기화
  clearData() {
    this.dataPoints = [];
    console.log('네트워크 데이터가 초기화되었습니다.');
  }
}

/**
 * 감정 분석 엔진
 */
class EmotionAnalyzer {
  constructor() {
    this.emotionHistory = [];
    this.currentEmotion = 'calm';
    this.emotionIntensity = 0;
    this.threatLevel = 0;
  }

  // 네트워크 데이터를 기반으로 감정 분석
  analyzeEmotion(networkData) {
    const emotion = this.calculateEmotion(networkData);
    const intensity = this.calculateIntensity(networkData);
    const threatLevel = this.calculateThreatLevel(networkData);
    
    const result = {
      emotion,
      intensity,
      threatLevel,
      timestamp: new Date().toISOString(),
      confidence: this.calculateConfidence(networkData),
      factors: this.getEmotionFactors(networkData)
    };
    
    // 감정 히스토리 업데이트
    this.emotionHistory.push(result);
    if (this.emotionHistory.length > 100) {
      this.emotionHistory = this.emotionHistory.slice(-100);
    }
    
    // 현재 감정 업데이트
    this.currentEmotion = emotion;
    this.emotionIntensity = intensity;
    this.threatLevel = threatLevel;
    
    return result;
  }

  // 감정 계산
  calculateEmotion(networkData) {
    const { latency, packetLoss, jitter, cpuUsage, memoryUsage, threatLevel } = networkData;
    
    // 지연시간이 높으면 불안
    if (latency > 200) return 'anxious';
    
    // 패킷 손실이 높으면 화남
    if (packetLoss > 0.5) return 'angry';
    
    // 지터가 높으면 스트레스
    if (jitter > 30) return 'stressed';
    
    // CPU/메모리 사용률이 높으면 불안
    if (cpuUsage > 80 || memoryUsage > 90) return 'anxious';
    
    // 위험 수준이 높으면 화남
    if (threatLevel > 0.7) return 'angry';
    
    // 모든 지표가 양호하면 평온
    if (latency < 50 && packetLoss < 0.1 && jitter < 10 && cpuUsage < 50 && memoryUsage < 70) {
      return 'calm';
    }
    
    // 기본적으로 기쁨 (정상 상태)
    return 'happy';
  }

  // 감정 강도 계산
  calculateIntensity(networkData) {
    const { latency, packetLoss, jitter, cpuUsage, memoryUsage, threatLevel } = networkData;
    
    let intensity = 0;
    
    // 지연시간 기반 강도
    intensity += Math.min(latency / 100, 1) * 0.3;
    
    // 패킷 손실 기반 강도
    intensity += Math.min(packetLoss * 2, 1) * 0.2;
    
    // 지터 기반 강도
    intensity += Math.min(jitter / 50, 1) * 0.2;
    
    // 시스템 리소스 기반 강도
    intensity += Math.min(cpuUsage / 100, 1) * 0.15;
    intensity += Math.min(memoryUsage / 100, 1) * 0.15;
    
    // 위험 수준 기반 강도
    intensity += threatLevel * 0.2;
    
    return Math.min(Math.max(intensity, 0), 1);
  }

  // 위험 수준 계산
  calculateThreatLevel(networkData) {
    const { latency, packetLoss, jitter, threatLevel, securityScore } = networkData;
    
    let threat = 0;
    
    // 네트워크 지연이 심각하면 위험
    if (latency > 500) threat += 0.3;
    
    // 패킷 손실이 심각하면 위험
    if (packetLoss > 0.8) threat += 0.3;
    
    // 지터가 심각하면 위험
    if (jitter > 50) threat += 0.2;
    
    // 보안 점수가 낮으면 위험
    if (securityScore < 60) threat += 0.2;
    
    // 기존 위험 수준
    threat += threatLevel * 0.5;
    
    return Math.min(Math.max(threat, 0), 1);
  }

  // 신뢰도 계산
  calculateConfidence(networkData) {
    const factors = this.getEmotionFactors(networkData);
    const totalFactors = Object.keys(factors).length;
    const positiveFactors = Object.values(factors).filter(f => f > 0).length;
    
    return positiveFactors / totalFactors;
  }

  // 감정 요인 분석
  getEmotionFactors(networkData) {
    const { latency, packetLoss, jitter, cpuUsage, memoryUsage, securityScore } = networkData;
    
    return {
      latency: latency < 100 ? 1 : latency < 200 ? 0.5 : 0,
      packetLoss: packetLoss < 0.1 ? 1 : packetLoss < 0.3 ? 0.5 : 0,
      jitter: jitter < 20 ? 1 : jitter < 40 ? 0.5 : 0,
      cpuUsage: cpuUsage < 50 ? 1 : cpuUsage < 80 ? 0.5 : 0,
      memoryUsage: memoryUsage < 70 ? 1 : memoryUsage < 90 ? 0.5 : 0,
      security: securityScore > 80 ? 1 : securityScore > 60 ? 0.5 : 0
    };
  }

  // 현재 감정 반환
  getCurrentEmotion() {
    return {
      emotion: this.currentEmotion,
      intensity: this.emotionIntensity,
      threatLevel: this.threatLevel
    };
  }

  // 감정 히스토리 반환
  getEmotionHistory() {
    return [...this.emotionHistory];
  }
}

// 전역 네트워크 모니터 인스턴스
window.networkMonitor = new NetworkMonitor();

// 대시보드와 연동
if (window.dashboard) {
  // 네트워크 데이터 업데이트 시 대시보드 업데이트
  window.networkMonitor.onDataUpdate((dataPoint, emotionResult) => {
    // 실시간 모니터링 페이지 업데이트
    if (window.dashboard.currentTab === 'monitoring') {
      window.dashboard.updateRealtimeMonitoring(dataPoint, emotionResult);
    }
    
    // 감정 분석 페이지 업데이트
    if (window.dashboard.currentTab === 'emotions') {
      window.dashboard.updateEmotionAnalysis(emotionResult);
    }
    
    // 개요 페이지 업데이트
    if (window.dashboard.currentTab === 'overview') {
      window.dashboard.updateOverviewWithNetworkData(dataPoint, emotionResult);
    }
  });

  // 위험 감지 시 알림
  window.networkMonitor.onThreatDetected((emotionResult) => {
    window.dashboard.showThreatAlert(emotionResult);
  });
}

console.log('네트워크 모니터링 시스템이 로드되었습니다.');
