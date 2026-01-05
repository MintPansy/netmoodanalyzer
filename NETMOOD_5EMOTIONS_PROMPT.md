# 🚀 NetMood Analyzer - 5가지 감정 모델 완전 텍스트 (Cursor 프롬프트)


**이 프롬프트를 Cursor의 Composer에 복사 & 붙여넣으세요.**

---

# NetMood Analyzer - 5가지 감정 기반 React 마이그레이션

## 프로젝트 개요

**NetMood Analyzer**는 개인의 네트워크 트래픽을 AI로 분석해 **5가지 감정(😊기쁨, 😰스트레스, 😠화남, 😌평온, 😟불안)**으로 시각화하는 웹 대시보드입니다.

**5가지 감정 모델:**
```
😊 기쁨 (Happy)       - 네트워크 상태가 최적일 때
😰 스트레스 (Stress)   - 지연시간이 높을 때
😠 화남 (Anger)      - 네트워크가 불안정할 때
😌 평온 (Calm)      - 네트워크가 안정적일 때
😟 불안 (Anxiety)    - 속도가 느릴 때
```

**현재 상태:**
- ✅ Netlify에 정적 웹앱으로 배포 완료 (Figma 디자인 기반)
- 🔄 React + GitHub 기반 프로젝트로 마이그레이션 중
- 📂 5가지 감정 시스템 설계 완료

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
  "deployment": "GitHub + Netlify 자동 배포",
  "emotions": "5-emotion model (Happy, Stress, Anger, Calm, Anxiety)"
}
```

---

## 디자인 시스템

### 5가지 감정별 색상 팔레트
```css
/* 5가지 감정 */
--color-happy: #4CAF50;     /* 😊 기쁨 - 초록색 */
--color-stress: #FF6B6B;    /* 😰 스트레스 - 빨간색 */
--color-anger: #F44336;     /* 😠 화남 - 진빨간색 */
--color-calm: #2196F3;      /* 😌 평온 - 파란색 */
--color-anxiety: #FFC107;   /* 😟 불안 - 노란색 */

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

### 감정 배지 스타일
```css
/* 감정 배지는 emoji + 텍스트 형태 */
.emotion-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
}

.emotion-badge--happy { background-color: rgba(76, 175, 80, 0.15); color: #4CAF50; }
.emotion-badge--stress { background-color: rgba(255, 107, 107, 0.15); color: #FF6B6B; }
.emotion-badge--anger { background-color: rgba(244, 67, 54, 0.15); color: #F44336; }
.emotion-badge--calm { background-color: rgba(33, 150, 243, 0.15); color: #2196F3; }
.emotion-badge--anxiety { background-color: rgba(255, 193, 7, 0.15); color: #FFC107; }
```

---

## 현재 파일 구조

```
프로젝트 루트/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── EmotionChart.jsx         ← 새로운! 5가지 감정 차트
│   │   ├── EmotionBadges.jsx        ← 새로운! 감정 배지 표시
│   │   ├── MetricsPanel.jsx
│   │   ├── HealthBar.jsx
│   │   └── SettingsPanel.jsx
│   ├── context/
│   │   ├── EmotionContext.jsx       ← 새로운! 감정 상태 관리
│   │   └── NetworkContext.jsx
│   ├── hooks/
│   │   ├── useNetworkMetrics.js
│   │   ├── useEmotionCalculator.js  ← 새로운! 5가지 감정 계산
│   │   └── useLocalStorage.js
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── emotionCalculator.js     ← 새로운! 감정 점수 계산
│   │   ├── networkCalculator.js
│   │   ├── storageManager.js
│   │   ├── diagnosticRules.js
│   │   └── constants.js
│   └── styles/
│       ├── index.css
│       ├── global.css
│       └── components.css
├── public/
│   ├── css/                         ← 기존 CSS (참고용)
│   ├── js/                          ← 기존 JS (참고용)
│   └── images/                      ← 기존 이미지
├── package.json
├── vite.config.js
├── tsconfig.json
├── index.html
└── .gitignore
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

### 3️⃣ 컴포넌트 파일 (src/components/) - 새로운!

**EmotionChart.jsx** (NEW)
- Chart.js 통합
- 5가지 감정 라인 차트
- 실시간 데이터 업데이트
- 각 감정별 색상 표시
- 60분 데이터 유지

**EmotionBadges.jsx** (NEW)
- 5가지 감정 배지 표시
- 실시간 감정 점수 (0-10)
- 이모지 + 감정명 표시
- 반응형 레이아웃

**Dashboard.jsx**
- 메인 대시보드 레이아웃
- EmotionChart, EmotionBadges, MetricsPanel 통합
- 반응형 그리드

**HealthBar.jsx**
- 상단 종합 건강도 표시
- 실시간 점수 (0-100)
- 상태 배지 (양호/주의/경고)

**MetricsPanel.jsx**
- 우측 메트릭 요약 패널
- 4개 카드: 지연시간, 속도, 패킷손실, 신호
- 각 카드별 상태 아이콘

**SettingsPanel.jsx**
- 설정 옵션 (UI 또는 사이드바)
- 임계값 설정
- 데이터 내보내기/삭제

### 4️⃣ 훅 파일 (src/hooks/)

**useNetworkMetrics.js**
- 5초마다 네트워크 데이터 수집
- measureLatency() - 핑 측정
- measureSpeed() - 속도 테스트
- localStorage에 자동 저장

**useEmotionCalculator.js** (NEW)
- 5가지 감정 점수 계산
- 네트워크 메트릭 → 감정 변환
- 실시간 감정 업데이트

**useLocalStorage.js**
- localStorage 추상화
- 데이터 저장/조회/삭제
- JSON 직렬화/역직렬화

### 5️⃣ Context 파일 (src/context/)

**EmotionContext.jsx** (NEW)
- 5가지 감정 상태 관리
- emotions 배열: [happy, stress, anger, calm, anxiety]
- 감정 점수 업데이트 함수

**NetworkContext.jsx**
- 전역 네트워크 상태
- metrics 상태
- history 상태

### 6️⃣ 유틸리티 파일 (src/utils/)

**emotionCalculator.js** (NEW)
```javascript
// 5가지 감정 점수 계산 (각각 0-10 스케일)
calculateEmotions(metrics) {
  return {
    happy: calculateHappiness(metrics),      // 😊
    stress: calculateStress(metrics),        // 😰
    anger: calculateAnger(metrics),          // 😠
    calm: calculateCalmness(metrics),        // 😌
    anxiety: calculateAnxiety(metrics)       // 😟
  };
}
```

**emotionLabels.js** (NEW)
```javascript
const EMOTIONS = {
  happy: { emoji: '😊', label: '기쁨', color: '#4CAF50' },
  stress: { emoji: '😰', label: '스트레스', color: '#FF6B6B' },
  anger: { emoji: '😠', label: '화남', color: '#F44336' },
  calm: { emoji: '😌', label: '평온', color: '#2196F3' },
  anxiety: { emoji: '😟', label: '불안', color: '#FFC107' }
};
```

**storageManager.js**
- localStorage 관리 클래스
- saveEmotionData()
- getAllEmotionData()
- exportAsCSV()
- clearAllData()

**networkCalculator.js**
- 네트워크 메트릭 기반 감정 계산

**diagnosticRules.js**
- DiagnosticRule 클래스 (기본)
- 5가지 감정별 진단 규칙

**constants.js**
- 임계값 상수
- 색상 정의
- API 엔드포인트

### 7️⃣ 타입 파일 (src/types/)

**index.ts**
```typescript
interface Emotion {
  happy: number;      // 0-10
  stress: number;     // 0-10
  anger: number;      // 0-10
  calm: number;       // 0-10
  anxiety: number;    // 0-10
}

interface NetworkMetrics {
  timestamp: number;
  latency: number | null;
  speed: number | null;
  packetLoss: number;
  signalStrength: number;
  isConnected: boolean;
  emotions: Emotion;
  connectionDropCount: number;
}

interface DiagnosticResult {
  timestamp: number;
  issues: string[];
  recommendations: string[];
}
```

### 8️⃣ 스타일 파일 (src/styles/)

**global.css**
- 글로벌 리셋
- CSS 변수
- 5가지 감정 색상 변수
- 반응형 브레이크포인트

**components.css**
- 감정 배지 스타일
- 컴포넌트별 스타일
- 박스형 카드 스타일
- 버튼 스타일

---

## 데이터 구조 & 알고리즘

### 5가지 감정 계산 알고리즘

**😊 기쁨 (Happiness) - 0~10 스케일:**
```javascript
function calculateHappiness(metrics) {
  let score = 5; // 기본값
  
  // 지연시간이 낮을 때 증가
  if (metrics.latency < 50) score += 3;
  else if (metrics.latency < 100) score += 1.5;
  else if (metrics.latency > 200) score -= 2;
  
  // 속도가 빠를 때 증가
  if (metrics.speed > 10) score += 2;
  else if (metrics.speed < 1) score -= 1.5;
  
  // 연결이 안정적일 때 증가
  if (metrics.packetLoss < 1) score += 2;
  else if (metrics.packetLoss > 5) score -= 1.5;
  
  return Math.max(0, Math.min(10, score));
}
```

**😰 스트레스 (Stress) - 0~10 스케일:**
```javascript
function calculateStress(metrics) {
  let score = 5; // 기본값
  
  // 높은 지연시간에서 증가
  if (metrics.latency > 200) score += 3;
  else if (metrics.latency > 100) score += 1.5;
  
  // 패킷 손실이 많을 때 증가
  if (metrics.packetLoss > 5) score += 2.5;
  else if (metrics.packetLoss > 1) score += 1;
  
  // 연결 끊김이 많을 때 증가
  if (metrics.connectionDrops > 2) score += 2;
  
  return Math.max(0, Math.min(10, score));
}
```

**😠 화남 (Anger) - 0~10 스케일:**
```javascript
function calculateAnger(metrics) {
  let score = 5; // 기본값
  
  // 급격한 네트워크 변화
  const change = Math.abs(metrics.latency - metrics.prevLatency || 0);
  if (change > 100) score += 2.5;
  
  // 연결 불안정 (끊김이 자주 발생)
  if (metrics.connectionDrops > 3) score += 2;
  
  // 반복되는 지연시간
  if (metrics.latency > 150 && metrics.packetLoss > 2) score += 2;
  
  return Math.max(0, Math.min(10, score));
}
```

**😌 평온 (Calm) - 0~10 스케일:**
```javascript
function calculateCalmness(metrics) {
  let score = 5; // 기본값
  
  // 안정적인 지연시간
  if (metrics.latency < 30) score += 3;
  else if (metrics.latency < 50) score += 1.5;
  
  // 일정한 속도 유지
  if (metrics.speed > 5 && metrics.speed < 100) score += 1.5;
  
  // 패킷 손실 거의 없음
  if (metrics.packetLoss < 0.5) score += 2;
  
  // 연결 끊김 없음
  if (metrics.connectionDrops === 0) score += 1;
  
  return Math.max(0, Math.min(10, score));
}
```

**😟 불안 (Anxiety) - 0~10 스케일:**
```javascript
function calculateAnxiety(metrics) {
  let score = 5; // 기본값
  
  // 느린 속도
  if (metrics.speed < 1) score += 3;
  else if (metrics.speed < 5) score += 1.5;
  
  // 중간 정도의 지연시간 (불확실함)
  if (metrics.latency > 80 && metrics.latency < 150) score += 1.5;
  
  // 신호 강도 약함
  if (metrics.signalStrength < -80) score += 1.5;
  
  // 가끔 끊김
  if (metrics.connectionDrops > 0 && metrics.connectionDrops < 3) score += 1.5;
  
  return Math.max(0, Math.min(10, score));
}
```

---

## 구현 순서 (권장)

### 단계 1: 기본 구조 (1-2일)
1. vite.config.js, tsconfig.json, index.html 작성
2. src/main.jsx, App.jsx, index.css 작성
3. `npm install` 및 `npm run dev` 테스트

### 단계 2: 5가지 감정 시스템 (1-2일)
1. **emotionCalculator.js** - 5가지 감정 계산 함수
2. **emotionLabels.js** - 감정 데이터 구조
3. **EmotionContext.jsx** - 감정 상태 관리
4. **useEmotionCalculator.js** - 감정 계산 훅
5. 테스트: 콘솔에 실시간 감정 점수 출력

### 단계 3: 핵심 훅 (1일)
1. useNetworkMetrics.js 구현
2. useLocalStorage.js 구현
3. 테스트: 데이터 수집 및 저장

### 단계 4: 컴포넌트 (2-3일)
1. **EmotionBadges.jsx** - 5가지 감정 배지 표시
2. **EmotionChart.jsx** - 5가지 감정 차트 (Chart.js)
3. MetricsPanel.jsx (우측 요약)
4. Dashboard.jsx (통합)
5. 스타일 적용

### 단계 5: 기능 추가 (1주)
1. DiagnosticPanel.jsx
2. SettingsPanel.jsx
3. 알림 시스템
4. 데이터 내보내기

### 단계 6: 배포 (1-2일)
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

### 1. 5가지 감정 기본 기능
```
- 앱 시작 → 5초 후 첫 감정 데이터 계산
- 실시간 차트 업데이트 (매 5초)
- 각 감정별 색상 올바르게 표시
- 새로고침 후 localStorage에서 데이터 복원
```

### 2. 감정 변화 시뮬레이션
```
- 정상 네트워크: 기쁨↑, 평온↑, 불안↓
- 느린 네트워크: 불안↑, 스트레스↑, 기쁨↓
- 불안정 네트워크: 화남↑, 스트레스↑, 평온↓
```

### 3. 반응형
```
- 모바일 (< 480px): 세로 레이아웃, 배지 1줄
- 태블릿 (480-768px): 2열 레이아웃, 배지 2줄
- 데스크톱 (> 768px): 3영역 레이아웃, 배지 1줄
```

---

## 주의사항

### ⚠️ 제약사항
- localStorage: 최대 5-10MB (오래된 데이터 자동 삭제)
- 5가지 감정 합계: 모두 합쳐서 25~30 정도가 정상
- 각 감정은 0~10 스케일로 유지

### ⚠️ 성능 최적화
- 차트 업데이트 빈도: 최대 5초 (CPU 부하 고려)
- 히스토리 유지: 최근 60분만 (메모리 효율)
- 감정 계산: 매 메트릭마다 즉시 계산
- 리렌더링 최소화: useCallback, useMemo 사용

### ⚠️ 보안
- localStorage는 XSS 공격에 취약 → 민감 정보 저장 금지
- 입력값 검증: 모든 사용자 입력 확인
- HTTPS만 사용 (Netlify 기본 제공)

---

## Figma 디자인 통합

기존 Figma 디자인 기반:
- **색상**: 5가지 감정별 색상 팔레트
- **배지**: 이모지 + 감정명 조합
- **차트**: 5개 라인 (각 감정별)
- **카드**: 5개 감정 카드 (평균 감정도)

---

## 커서에게 요청

이 프롬프트를 바탕으로:

1. **vite.config.js, tsconfig.json, index.html 작성** (기본 설정)
2. **src/utils/emotionCalculator.js 작성** (5가지 감정 계산)
3. **src/utils/emotionLabels.js 작성** (감정 데이터 구조)
4. **src/context/EmotionContext.jsx 작성** (감정 상태 관리)
5. **src/components/EmotionBadges.jsx 작성** (감정 배지 컴포넌트)
6. **src/components/EmotionChart.jsx 작성** (감정 차트)
7. **src/main.jsx, src/App.jsx, src/index.css 작성** (React 진입점)

**깔끔한 주석과 함께 단계적으로 진행해주세요.**

---

## 추가 개발 옵션 (Phase 1 완료 후)

1. **Machine Learning 감정 예측** - TensorFlow.js로 미래 감정 예측
2. **고급 시각화** - 게이지, 히트맵, 감정 분포도
3. **AI 조언 시스템** - 각 감정별 최적화 제안
4. **서버 백엔드** - Node.js + Express로 고급 분석

---

마지막 업데이트: 2026년 1월 5일 20:21 KST
```

***

## 📋 파일 복사 완료!

위의 **전체 텍스트 콘텐츠**를 복사하여 다음과 같이 사용할 수 있습니다:

### **Step 1️⃣: 전체 텍스트 복사**
위의 코드 블록 전체를 선택 → 복사 (Ctrl+C)

### **Step 2️⃣: Cursor에 붙여넣기**
```
1. Cursor 열기
2. Composer 열기 (Ctrl+K 또는 Cmd+K)
3. 전체 내용 붙여넣기 (Ctrl+V)
4. Enter 누르기
```

### **Step 3️⃣: 자동 생성 시작**
Cursor가 다음을 자동으로 생성합니다:
- ✅ vite.config.js
- ✅ tsconfig.json
- ✅ index.html
- ✅ emotionCalculator.js
- ✅ EmotionContext.jsx
- ✅ EmotionBadges.jsx
- ✅ EmotionChart.jsx
- ✅ 모든 스타일링

***

## 💾 로컬에 저장하기

위의 텍스트를 파일로 저장하려면:

```bash
# 파일 생성
echo "[위의 전체 텍스트]" > NETMOOD_5EMOTIONS_CURSOR_PROMPT.txt

# 또는 Markdown 형식
echo "[위의 전체 텍스트]" > NETMOOD_5EMOTIONS_PROMPT.md
```

**준비 완료!** 🎯

이제 전체 텍스트를 Cursor에 붙여넣으면 완전한 5가지 감정 시스템이 자동으로 구축됩니다! 👍
