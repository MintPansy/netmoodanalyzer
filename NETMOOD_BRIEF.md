# 🌐 NetMood Analyzer - 완벽한 프로젝트 개요 및 Cursor 프롬프트

---

## 📋 프로젝트 개요

### 프로젝트명
**NetMood Analyzer** - 네트워크 트래픽을 AI로 분석해 감정(기쁨, 스트레스)으로 시각화하는 웹 대시보드

### 목적
- 🌍 개인 네트워크 상태를 실시간으로 모니터링
- 😊 복잡한 네트워크 데이터를 "감정"으로 직관화
- 🔍 자동 진단으로 네트워크 문제 원인 파악
- 💡 초보자 친화적 UI로 누구나 쉽게 사용

### 개발 기간
- 2025년 9월 30일 ~ 진행 중
- 1인 개발 프로젝트

---

## 🏗️ 현재 프로젝트 상태

### 배포 현황
```
✅ 현재: Netlify에 정적 웹앱 배포 완료
   URL: https://netmoodanalyzer.netlify.app

🔄 전환 중: React + GitHub 기반 프로젝트로 마이그레이션
   - 로컬 파일 다운로드 완료
   - 새 GitHub 레포 생성 준비
   - React + TypeScript 스택 준비
```

### 기술 스택

#### 현재 (Netlify 배포)
```
- HTML5 / CSS3 / Vanilla JavaScript
- Chart.js (시각화)
- Netlify Functions (백엔드)
- 로컬 저장소: localStorage
```

#### 새 버전 (React)
```
- React 18.3.1
- TypeScript 5.3.3
- Vite (번들러)
- Chart.js + react-chartjs-2
- CSS-in-JS (Styled Components 또는 Tailwind)
- localStorage (데이터 저장)
```

### 주요 기능

#### ✅ 완료된 기능
1. **기본 대시보드**
   - 라인 차트 (기쁨 #4CAF50, 스트레스 #F44336)
   - 박스형 카드 레이아웃
   - #f0f8f0 배경 통일

2. **페이지 구조**
   - `integrated-dashboard.html` (메인)
   - `guide.html` (사용자 가이드)
   - `terms.html` (약관)

3. **UI/UX**
   - 초보자 친화적 디자인
   - "사용자 도움말" 팝업
   - 일관된 색상 스키마

#### 🚧 진행 중인 기능
1. **실시간 네트워크 모니터링** (Phase 1-1)
   - 핑 측정 (Google DNS)
   - 속도 테스트
   - 패킷 손실 추적

2. **감정 분석 고도화** (Phase 1-2)
   - 동적 기쁨/스트레스 점수 계산
   - 지연시간, 속도, 안정성 기반 가중치

3. **자동 진단 시스템** (Phase 3-1)
   - 네트워크 문제 자동 감지
   - 원인 분석
   - 사용자 친화적 권장사항

#### 📋 계획 중인 기능
1. **Electron 데스크톱 앱** (Phase 2)
   - 네이티브 네트워크 접근
   - 시스템 명령 (ping, nslookup)
   - 크로스 플랫폼 지원

2. **고급 시각화** (Phase 4)
   - 실시간 게이지 (지연, 속도, 신호)
   - 히트맵 (시간대별 패턴)
   - 네트워크 토폴로지

3. **머신러닝 예측** (Phase 3-2)
   - 다음 1시간 감정도 예측
   - 피크 시간대 감지
   - 이상 탐지

4. **설정 & 알림** (Phase 5)
   - 사용자 설정 패널
   - 임계값 설정
   - 브라우저/데스크톱 알림

---

## 📂 프로젝트 구조

### 현재 로컬 구조
```
netmood-analyzer/
├── src/
│   ├── components/           # React 컴포넌트
│   ├── context/              # Context API (상태 관리)
│   ├── hooks/                # Custom Hooks
│   ├── utils/                # 유틸리티 함수
│   │   ├── storageManager.js # localStorage 관리
│   │   └── networkMonitor.js # 네트워크 모니터링
│   ├── types/                # TypeScript 타입
│   ├── styles/               # CSS 파일
│   ├── App.jsx               # 메인 앱 컴포넌트
│   ├── main.jsx              # 진입점
│   └── index.css             # 글로벌 스타일
│
├── public/                   # 정적 자산
│   ├── index.html            # Netlify 배포 파일
│   ├── integrated-dashboard.html
│   ├── guide.html
│   ├── terms.html
│   ├── css/
│   ├── images/
│   └── js/
│
├── package.json              # 의존성 관리
├── vite.config.js            # Vite 설정
├── tsconfig.json             # TypeScript 설정
├── .gitignore                # Git 무시 규칙
└── README.md                 # 프로젝트 문서
```

### 새로 생성할 구조
```
src/
├── components/
│   ├── Dashboard.jsx         # 메인 대시보드
│   ├── HealthBar.jsx         # 상단 건강도 바
│   ├── MetricsPanel.jsx      # 우측 메트릭 요약
│   ├── Chart.jsx             # 차트 컴포넌트
│   ├── DiagnosticPanel.jsx   # 진단 섹션
│   ├── SettingsPanel.jsx     # 설정 패널
│   └── Notifications.jsx     # 알림 시스템
│
├── context/
│   ├── NetworkContext.jsx    # 네트워크 상태
│   ├── NotificationContext.jsx # 알림 상태
│   └── SettingsContext.jsx   # 설정 상태
│
├── hooks/
│   ├── useNetworkMetrics.js  # 네트워크 수집
│   ├── useDiagnostics.js     # 진단 로직
│   └── useLocalStorage.js    # localStorage 관리
│
├── utils/
│   ├── storageManager.js     # 데이터 저장/조회
│   ├── networkCalculator.js  # 감정 점수 계산
│   ├── diagnosticRules.js    # 진단 규칙
│   └── constants.js          # 상수 정의
│
├── types/
│   └── index.ts              # 타입 정의
│
├── styles/
│   ├── global.css            # 글로벌 스타일
│   ├── components.css        # 컴포넌트 스타일
│   └── variables.css         # CSS 변수
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🎨 디자인 시스템

### 색상 팔레트
```
기쁨: #4CAF50 (초록색)
스트레스: #F44336 (빨간색)
배경: #f0f8f0 (연한 초록)
텍스트 주요: #1f2120
텍스트 보조: #666666
카드 배경: #ffffff
카드 경계: #e0e0e0
```

### 타이포그래피
```
폰트: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
크기:
  - 제목 (h1): 24px
  - 소제목 (h2): 20px
  - 본문: 14px
  - 라벨: 12px
```

### 컴포넌트 패턴
```
- 박스형 카드 (padding: 16px, border-radius: 12px)
- 버튼 (padding: 8-12px, border-radius: 8px)
- 입력필드 (padding: 8px, border: 1px solid #e0e0e0)
- 상태 배지 (padding: 4px 8px, border-radius: 4px)
```

---

## 📊 데이터 구조

### NetworkMetrics 인터페이스
```typescript
interface NetworkMetrics {
  timestamp: number;           // 밀리초 단위 타임스탬프
  latency: number | null;      // 지연시간 (ms)
  downloadSpeed: number | null; // 다운로드 속도 (Mbps)
  uploadSpeed?: number | null;  // 업로드 속도 (Mbps)
  packetLoss: number;          // 패킷 손실율 (%)
  jitter: number;              // 지터 (ms)
  signalStrength: number;      // WiFi 신호 강도 (dBm)
  connectionType: string;      // "WiFi" | "4G" | "5G" | "Ethernet"
  isConnected: boolean;        // 연결 상태
  happiness: number;           // 기쁨 점수 (0-100)
  stress: number;              // 스트레스 점수 (0-100)
  connectionDropCount: number; // 연결 끊김 횟수
}
```

### 감정 점수 계산 알고리즘
```
기쁨 = 25% (지연도) + 30% (안정성) + 20% (속도) + 25% (연속시간)
스트레스 = 35% (지연도) + 40% (연결끊김) + 30% (느린속도) + 35% (DNS실패)

가중치:
- 지연시간 < 50ms: 100점 (기쁨)
- 지연시간 > 200ms: 0점 (기쁨), 100점 (스트레스)
- 속도 > 10Mbps: 100점 (기쁨)
- 속도 < 1Mbps: 0점 (기쁨), 100점 (스트레스)
- 패킷 손실 < 1%: 100점 (기쁨)
- 패킷 손실 > 10%: 0점 (기쁨), 100점 (스트레스)
```

---

## 🔄 데이터 흐름

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Event Loop                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  5초마다:                                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 1. measureLatency()                             │   │
│  │    → Fetch API로 구글 favicon 다운로드           │   │
│  │    → 왕복 시간 측정                              │   │
│  └─────────────────────────────────────────────────┘   │
│                          ↓                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 2. measureSpeed()                               │   │
│  │    → 1KB 파일 다운로드 (3회 평균)               │   │
│  │    → Mbps 계산                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                          ↓                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 3. calculateEmotionScore()                      │   │
│  │    → 기쁨 점수 계산                              │   │
│  │    → 스트레스 점수 계산                          │   │
│  └─────────────────────────────────────────────────┘   │
│                          ↓                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 4. updateMetrics()                              │   │
│  │    → React State 업데이트                        │   │
│  │    → localStorage에 저장                         │   │
│  └─────────────────────────────────────────────────┘   │
│                          ↓                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 5. updateUI()                                   │   │
│  │    → 차트 업데이트                               │   │
│  │    → 메트릭 패널 새로고침                        │   │
│  │    → 알림 확인                                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📱 반응형 디자인

### 브레이크포인트
```
- 모바일: < 480px
- 태블릿: 480px - 768px
- 데스크톱: > 768px
```

### 레이아웃 변경
```
모바일:
├─ 상단 건강도 바
├─ 메인 차트 (full width)
├─ 메트릭 카드 (세로 정렬)
└─ 진단/설정 (탭형)

태블릿:
├─ 상단 건강도 바
├─ 메인 차트 + 메트릭 (2열)
└─ 진단/설정 (탭형)

데스크톱:
├─ 상단 건강도 바
├─ 메인 차트 (좌측) + 메트릭 패널 (우측)
├─ 진단 섹션
└─ 설정 패널
```

---

## 🔐 보안 & 프라이버시

### 개인정보 처리
```
✅ 로컬 전용 분석:
   - 모든 데이터 localStorage에 저장
   - 서버 전송 없음
   - 사용자 계정 불필요

✅ 데이터 보호:
   - HTTPS 배포 (Netlify 기본)
   - 클라이언트 사이드 암호화 고려
   - 사용자 수동 삭제 기능

✅ 규정 준수:
   - GDPR: 데이터 저장소 제한 없음
   - CCPA: 개인정보 수집 없음
   - 개인정보처리방침 제공
```

---

## 🚀 배포 전략

### GitHub 레포 설정
```
1. GitHub 레포 생성
2. .gitignore 적용 (node_modules, .env, build 등)
3. README.md 작성
4. Netlify 연동
```

### Netlify 배포 자동화
```
트리거: GitHub main 브랜치 push
빌드 명령: npm run build
출력 디렉토리: dist/
배포 환경: Production
```

### 버전 관리
```
v1.0.0 - 기본 대시보드 (현재)
v1.1.0 - 실시간 네트워크 모니터링
v1.2.0 - 자동 진단 시스템
v2.0.0 - Electron 데스크톱 앱
v2.1.0 - 머신러닝 예측
```

---

## 📖 학습 자료 및 참고

### 네트워크 개념
- Latency (지연시간): 데이터 전송 왕복 시간
- Bandwidth (대역폭): 초당 전송 가능 데이터량
- Jitter (지터): 지연시간의 변동
- Packet Loss (패킷 손실): 손실된 패킷 비율

### 기술 스택
- React 공식 문서: https://react.dev
- Vite 가이드: https://vitejs.dev
- TypeScript 핸드북: https://www.typescriptlang.org/docs
- Chart.js 문서: https://www.chartjs.org/docs

---

## ✅ 체크리스트

### Phase 1 - 웹앱 마이그레이션
- [ ] React 프로젝트 구조 설정
- [ ] 기존 HTML/CSS/JS → React 컴포넌트로 전환
- [ ] useNetworkMetrics 훅 구현
- [ ] localStorage 기반 데이터 저장
- [ ] Chart.js 통합
- [ ] 반응형 디자인 적용
- [ ] GitHub에 푸시
- [ ] Netlify 자동 배포 설정

### Phase 2 - 실시간 모니터링
- [ ] 핑 측정 기능
- [ ] 속도 테스트 기능
- [ ] 감정 점수 계산 고도화
- [ ] 실시간 메트릭 패널 UI
- [ ] 상단 건강도 바
- [ ] 히스토리 관리

### Phase 3 - 진단 & 분석
- [ ] 자동 진단 시스템
- [ ] 권장사항 생성
- [ ] 진단 UI 컴포넌트
- [ ] 이상 탐지
- [ ] 패턴 분석

### Phase 4 - 고급 시각화
- [ ] 게이지 차트
- [ ] 히트맵
- [ ] 시계열 예측

### Phase 5 - 사용자 기능
- [ ] 설정 패널
- [ ] 알림 시스템
- [ ] 데이터 내보내기 (CSV)
- [ ] 사용자 설명서

---

이 문서는 NetMood Analyzer 프로젝트의 완벽한 참고자료입니다.
마지막 업데이트: 2026년 1월 5일 20:00 KST
