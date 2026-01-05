# 🚀 NetMood Analyzer - Cursor 완벽 시작 프롬프트

**이 프롬프트를 Cursor의 Composer에 복사 & 붙여넣으세요.**

---

# NetMood Analyzer - 완벽한 React 마이그레이션 시작

## 프로젝트 개요

**NetMood Analyzer**는 개인의 네트워크 트래픽을 AI로 분석해 **감정(기쁨, 스트레스)**으로 시각화하는 웹 대시보드입니다.

**현재 상태:**
- ✅ Netlify에 정적 웹앱으로 배포 완료
- 🔄 React + GitHub 기반 프로젝트로 마이그레이션 중
- 📂 Netlify 배포 파일 모두 다운로드 완료

**목표:** 기존 UI/UX 유지하면서 React 기반 모던 아키텍처 구축

---

## 기술 스택

```json
{
  "language": "JavaScript + TypeScript",
  "framework": "React 18.3.1",
  "bundler": "Vite 5.0.0",
  "ui": "vanilla CSS (Figma 디자인 기반)",
  "visualization": "Chart.js + react-chartjs-2",
  "storage": "localStorage (Firebase 제거)",
  "deployment": "GitHub + Netlify 자동 배포"
}
```

---

## 디자인 시스템

### 색상 팔레트
```css
/* 감정 표현 */
--color-happiness: #4CAF50;  /* 기쁨 - 초록색 */
--color-stress: #F44336;     /* 스트레스 - 빨간색 */

/* 배경 */
--color-bg-primary: #f0f8f0;   /* 연한 초록 배경 */
--color-bg-card: #ffffff;      /* 카드 배경 */
--color-bg-secondary: #f5f5f5; /* 보조 배경 */

/* 텍스트 */
--color-text-primary: #1f2120;
--color-text-secondary: #666666;

/* 경계/구분선 */
--color-border: #e0e0e0;
--color-border-light: #f0f0f0;
```

### 컴포넌트 스타일 규칙
- 모든 카드: `border-radius: 12px, padding: 16px, box-shadow: 0 2px 8px rgba(0,0,0,0.08)`
- 모든 버튼: `border-radius: 8px, padding: 8-12px`
- 모든 입력: `border-radius: 8px, padding: 8px, border: 1px solid #e0e0e0`
- 폰트: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

---

## 현재 파일 구조

```
프로젝트 루트/
├── src/
│   ├── components/          ← React 컴포넌트 (생성 필요)
│   ├── context/             ← Context API (생성 필요)
│   ├── hooks/               ← Custom Hooks (생성 필요)
│   ├── types/               ← 타입 정의 (생성 필요)
│   ├── utils/               ← 유틸리티 (생성 필요)
│   └── styles/              ← CSS 파일 (생성 필요)
│
├── public/
│   ├── integrated-dashboard.html  ← 기존 Netlify 파일 (참고용)
│   ├── guide.html                 ← 기존 가이드
│   ├── terms.html                 ← 기존 약관
│   ├── css/                       ← 기존 CSS (참고용)
│   ├── js/                        ← 기존 JS (참고용)
│   └── images/                    ← 기존 이미지
│
├── package.json             ← 의존성 (파이어베이스 제거됨)
├── vite.config.js           ← Vite 설정 (생성 필요)
├── tsconfig.json            ← TypeScript 설정 (생성 필요)
├── index.html               ← React 진입점 (생성 필요)
└── .gitignore               ← Git 무시 규칙 (이미 설정됨)
```

---

## 필요한 파일 생성 목록

### 1️⃣ 기본 설정 파일

**vite.config.js**
- Vite 번들러 설정
- React 플러그인
- 개발 서버 포트 3000

**tsconfig.json**
- TypeScript 컴파일 옵션
- React JSX 설정
- 경로 별칭 (@ → src/)

**index.html** (프로젝트 루트)
- HTML 진입점
- React root 마운트 포인트
- 메타 태그 설정

### 2️⃣ React 핵심 파일

**src/main.jsx**
- 애플리케이션 진입점
- React.StrictMode 설정
- root 엘리먼트에 마운트

**src/App.jsx**
- 최상위 컴포넌트
- Context Provider 래핑
- 라우트 구조 (필요시)

**src/index.css**
- 글로벌 스타일
- CSS 변수 정의
- 기본 리셋 (body, html, * 선택자)

### 3️⃣ 컴포넌트 파일 (src/components/)

**Dashboard.jsx**
- 메인 대시보드 레이아웃
- 차트, 메트릭, 진단 섹션 통합
- 반응형 그리드

**HealthBar.jsx**
- 상단 종합 건강도 표시
- 실시간 점수 (0-100)
- 상태 배지 (양호/주의/경고)

**MetricsPanel.jsx**
- 우측 메트릭 요약 패널
- 4개 카드: 지연시간, 속도, 패킷손실, 신호
- 각 카드별 상태 아이콘

**Chart.jsx**
- Chart.js 통합
- 기쁨/스트레스 라인 차트
- 실시간 데이터 업데이트
- 60분 데이터 유지

**DiagnosticPanel.jsx**
- 진단 결과 표시
- 문제 감지 시 권장사항
- "진단 실행" 버튼

**SettingsPanel.jsx**
- 설정 옵션 (UI 또는 사이드바)
- 임계값 설정
- 데이터 내보내기/삭제

### 4️⃣ 훅 파일 (src/hooks/)

**useNetworkMetrics.js**
- 5초마다 네트워크 데이터 수집
- measureLatency() - 핑 측정
- measureSpeed() - 속도 테스트
- calculateEmotionScore() - 감정 점수 계산
- localStorage에 자동 저장

**useDiagnostics.js** (선택사항)
- 진단 규칙 실행
- 문제 감지
- 권장사항 생성

**useLocalStorage.js**
- localStorage 추상화
- 데이터 저장/조회/삭제
- JSON 직렬화/역직렬화

### 5️⃣ Context 파일 (src/context/)

**NetworkContext.jsx**
- 전역 네트워크 상태
- metrics 상태
- history 상태

**NotificationContext.jsx** (선택사항)
- 전역 알림 상태
- 알림 추가/삭제 함수

**SettingsContext.jsx** (선택사항)
- 전역 설정 상태
- 설정 저장/로드

### 6️⃣ 유틸리티 파일 (src/utils/)

**storageManager.js**
- localStorage 관리 클래스
- saveNetworkData()
- getAllNetworkData()
- exportAsCSV()
- clearAllData()

**networkCalculator.js**
- calculateHappiness(metrics)
- calculateStress(metrics)
- 가중치 기반 점수 계산

**diagnosticRules.js**
- DiagnosticRule 클래스 (기본)
- HighLatencyRule
- LowSpeedRule
- PacketLossRule

**constants.js**
- 임계값 상수
- 색상 정의
- API 엔드포인트

### 7️⃣ 타입 파일 (src/types/)

**index.ts**
- NetworkMetrics 인터페이스
- DiagnosticResult 인터페이스
- Settings 인터페이스

### 8️⃣ 스타일 파일 (src/styles/)

**global.css**
- 글로벌 리셋
- CSS 변수
- 반응형 브레이크포인트

**components.css**
- 컴포넌트별 스타일
- 박스형 카드 스타일
- 버튼 스타일

---

## 데이터 구조 & 알고리즘

### NetworkMetrics 인터페이스
```typescript
interface NetworkMetrics {
  timestamp: number;           // 밀리초 단위
  latency: number | null;      // 지연시간 (ms)
  speed: number | null;        // 다운로드 속도 (Mbps)
  packetLoss: number;          // 패킷 손실률 (%)
  signalStrength: number;      // WiFi 신호 강도 (dBm)
  isConnected: boolean;        // 연결 상태
  happiness: number;           // 기쁨 점수 (0-100)
  stress: number;              // 스트레스 점수 (0-100)
  connectionDropCount: number; // 연결 끊김 횟수
}
```

### 감정 점수 계산 알고리즘

**기쁨 (Happiness):**
```javascript
let happiness = 50; // 기본값

// 지연시간 (25% 가중치)
if (latency < 50) happiness += 25;
else if (latency < 100) happiness += 15;
else if (latency > 200) happiness -= 20;

// 다운로드 속도 (20% 가중치)
if (speed > 10) happiness += 20;
else if (speed < 1) happiness -= 15;

// 연결 안정성 (30% 가중치)
if (packetLoss < 1) happiness += 30;
else if (packetLoss > 5) happiness -= 20;

// 범위 제한
happiness = Math.max(0, Math.min(100, happiness));
```

**스트레스 (Stress):**
```javascript
let stress = 50; // 기본값

// 높은 지연시간 (35% 가중치)
if (latency > 200) stress += 35;
else if (latency > 100) stress += 15;

// 느린 속도 (30% 가중치)
if (speed < 1) stress += 30;
else if (speed < 5) stress += 10;

// 연결 불안정 (40% 가중치)
if (connectionDrops > 2) stress += 40;

// 범위 제한
stress = Math.max(0, Math.min(100, stress));
```

---

## 구현 순서 (권장)

### 단계 1: 기본 구조 (1-2일)
1. vite.config.js 작성
2. tsconfig.json 작성
3. index.html 작성
4. src/main.jsx, App.jsx, index.css 작성
5. `npm install` 및 `npm run dev` 테스트

### 단계 2: 핵심 훅 (1-2일)
1. useNetworkMetrics.js 구현
   - measureLatency() 함수
   - measureSpeed() 함수
   - calculateEmotionScore() 함수
   - 5초 인터벌 루프
2. 유틸리티 파일 (storageManager, networkCalculator)
3. 테스트: 콘솔에 실시간 데이터 출력

### 단계 3: 컴포넌트 (2-3일)
1. HealthBar.jsx (상단 건강도)
2. Chart.jsx (Chart.js 통합)
3. MetricsPanel.jsx (우측 요약)
4. Dashboard.jsx (통합)
5. 스타일 적용

### 단계 4: 기능 추가 (1주)
1. DiagnosticPanel.jsx
2. SettingsPanel.jsx
3. 알림 시스템
4. 데이터 내보내기

### 단계 5: 배포 (1-2일)
1. GitHub에 푸시
2. Netlify 자동 배포 설정
3. 배포 테스트

---

## 코드 품질 요구사항

### ✅ 필수 사항
- 함수 주석 작성 (JSDoc 또는 주석 블록)
- 오류 처리 (try-catch, 팴백)
- 성능 최적화 (useMemo, useCallback)
- 반응형 디자인 (모바일/태블릿/데스크톱)
- 접근성 (ARIA, 키보드 네비게이션)

### ✅ 코드 스타일
- 변수명: camelCase
- 함수명: camelCase
- 컴포넌트명: PascalCase
- 상수: UPPER_SNAKE_CASE
- 들여쓰기: 2 스페이스

### ✅ 에러 처리
- 네트워크 실패: 재시도 3회
- 타임아웃: 30초 이상 요청 자동 취소
- localStorage 초과: 오래된 데이터 자동 삭제
- 사용자 안내: 토스트 메시지로 알림

---

## 테스트 시나리오

### 1. 기본 기능
```
- 앱 시작 → 5초 후 첫 데이터 수집
- 실시간 차트 업데이트 (매 5초)
- 새로고침 후 localStorage에서 데이터 복원
```

### 2. 네트워크 시뮬레이션
```
- 정상 네트워크: 기쁨 80-100, 스트레스 0-20
- 느린 네트워크: 기쁨 40-60, 스트레스 60-80
- 불안정 네트워크: 연결 끊김 표시
```

### 3. 반응형
```
- 모바일 (< 480px): 세로 레이아웃
- 태블릿 (480-768px): 2열 레이아웃
- 데스크톱 (> 768px): 3영역 레이아웃
```

---

## 주의사항

### ⚠️ 제약사항
- localStorage: 최대 5-10MB (오래된 데이터 자동 삭제)
- CORS: 외부 API 요청 시 CORS 에러 가능 (CORS proxy 필요)
- 브라우저 호환성: Chrome/Safari/Firefox 최신 버전 (IE 미지원)
- 오프라인: 네트워크 요청 실패 시 이전 데이터 표시

### ⚠️ 성능 최적화
- 차트 업데이트 빈도: 최대 5초 (CPU 부하 고려)
- 히스토리 유지: 최근 60분만 (메모리 효율)
- 리렌더링 최소화: useCallback, useMemo 사용
- 이미지 최적화: 1KB 이하 (테스트 파일)

### ⚠️ 보안
- localStorage는 XSS 공격에 취약 → 민감 정보 저장 금지
- 입력값 검증: 모든 사용자 입력 확인
- HTTPS만 사용 (Netlify 기본 제공)

---

## 추가 개발 옵션

### Phase 1 완료 후 (선택사항)
1. **Electron 데스크톱 앱** - 네이티브 네트워크 접근
2. **머신러닝 예측** - TensorFlow.js로 미래 상태 예측
3. **고급 시각화** - 게이지, 히트맵, 토폴로지
4. **서버 백엔드** - Node.js + Express로 고급 분석

---

## 커서에게 요청

이 프롬프트를 바탕으로:

1. **vite.config.js, tsconfig.json, index.html 작성** (기본 설정)
2. **src/main.jsx, src/App.jsx, src/index.css 작성** (React 진입점)
3. **src/hooks/useNetworkMetrics.js 작성** (핵심 훅)
4. **src/utils 파일들 작성** (데이터 관리)
5. **src/components/Dashboard.jsx 작성** (메인 컴포넌트)

**깔끔한 주석과 함께 단계적으로 진행해주세요.**

코드 작성 시작!

---

마지막 업데이트: 2026년 1월 5일 20:00 KST
