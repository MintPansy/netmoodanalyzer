# 🌐 NetMood Analyzer

네트워크 트래픽을 AI로 분석해 **감정(기쁨, 스트레스)**으로 시각화하는 웹 대시보드

## ✨ 주요 기능

- 📊 **실시간 네트워크 모니터링**: 5초마다 네트워크 상태 자동 측정
- 😊 **감정 기반 시각화**: 복잡한 네트워크 데이터를 기쁨/스트레스 점수로 직관화
- 📈 **인터랙티브 차트**: Chart.js 기반 실시간 라인 차트
- 💾 **로컬 데이터 저장**: localStorage 기반 데이터 보관
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
netmood-analyzer/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── Dashboard.jsx   # 메인 대시보드
│   │   ├── HealthBar.jsx   # 상단 건강도 바
│   │   ├── Chart.jsx       # 차트 컴포넌트
│   │   └── MetricsPanel.jsx # 메트릭 패널
│   ├── context/            # Context API
│   │   └── NetworkContext.jsx
│   ├── hooks/              # Custom Hooks
│   │   └── useNetworkMetrics.js
│   ├── utils/              # 유틸리티 함수
│   │   ├── constants.js
│   │   ├── networkCalculator.js
│   │   └── storageManager.js
│   ├── types/              # TypeScript 타입
│   │   └── index.ts
│   ├── App.jsx             # 최상위 컴포넌트
│   ├── main.jsx            # 진입점
│   └── index.css           # 글로벌 스타일
├── public/                 # 정적 자산
├── package.json
├── vite.config.js
└── tsconfig.json
```

## 🎨 디자인 시스템

### 색상 팔레트

- **기쁨**: `#4CAF50` (초록색)
- **스트레스**: `#F44336` (빨간색)
- **배경**: `#f0f8f0` (연한 초록)
- **카드**: `#ffffff` (흰색)

### 컴포넌트 스타일

- 카드: `border-radius: 12px`, `padding: 16px`
- 버튼: `border-radius: 8px`
- 그림자: `0 2px 8px rgba(0, 0, 0, 0.08)`

## 📊 데이터 구조

### NetworkMetrics

```typescript
interface NetworkMetrics {
  timestamp: number;           // 밀리초 단위
  latency: number | null;      // 지연시간 (ms)
  downloadSpeed: number | null; // 다운로드 속도 (Mbps)
  packetLoss: number;          // 패킷 손실율 (%)
  happiness: number;           // 기쁨 점수 (0-100)
  stress: number;              // 스트레스 점수 (0-100)
  // ... 기타 필드
}
```

### 감정 점수 계산

- **기쁨**: 지연시간(25%) + 속도(20%) + 안정성(30%) + 연결(25%)
- **스트레스**: 지연시간(35%) + 속도(30%) + 불안정(40%) + 끊김(35%)

## 🔧 기술 스택

- **React** 18.3.1
- **TypeScript** 5.3.3
- **Vite** 5.0.0
- **Chart.js** 4.4.0
- **react-chartjs-2** 5.2.0

## 📝 개발 가이드

### 코드 스타일

- 변수명: `camelCase`
- 컴포넌트명: `PascalCase`
- 상수: `UPPER_SNAKE_CASE`
- 들여쓰기: 2 스페이스

### 주요 훅

#### `useNetworkMetrics()`

네트워크 메트릭을 수집하고 관리하는 훅입니다.

```javascript
const { metrics, history, isMonitoring } = useNetworkMetrics();
```

#### `useNetwork()`

Context에서 네트워크 상태를 가져오는 훅입니다.

```javascript
const { metrics, history } = useNetwork();
```

## 🚢 배포

### Netlify 배포

1. GitHub 레포지토리에 푸시
2. Netlify에서 레포지토리 연결
3. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `dist`

### 환경 변수

현재 환경 변수는 필요하지 않습니다. 모든 데이터는 localStorage에 저장됩니다.

## 🔒 보안 & 프라이버시

- ✅ 모든 데이터는 로컬에만 저장 (localStorage)
- ✅ 서버 전송 없음
- ✅ 사용자 계정 불필요
- ✅ HTTPS 배포 (Netlify 기본 제공)

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.

## 🤝 기여

이슈 및 풀 리퀘스트를 환영합니다!

---

**마지막 업데이트**: 2026년 1월 5일
