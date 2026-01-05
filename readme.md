# 🌐 NetMood Analyzer

네트워크 트래픽을 AI로 분석해 **5가지 감정(😊기쁨, 😰스트레스, 😠화남, 😌평온, 😟불안)**으로 시각화하는 웹 대시보드

## ✨ 주요 기능

- 📊 **실시간 네트워크 모니터링**: 5초마다 네트워크 상태 자동 측정
- 😊 **5가지 감정 시각화**: 복잡한 네트워크 데이터를 감정 점수로 직관화
- 📈 **인터랙티브 차트**: Chart.js 기반 실시간 라인 차트
- ⚠️ **자동 진단 시스템**: 네트워크 문제 자동 감지 및 권장사항 제공
- 💾 **로컬 데이터 저장**: localStorage 기반 데이터 보관
- 📤 **데이터 내보내기**: CSV/JSON 형식으로 데이터 다운로드
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
│   │   ├── HealthBar.jsx    # 상단 건강도 바
│   │   ├── EmotionChart.jsx # 5가지 감정 차트
│   │   ├── EmotionBadges.jsx # 감정 배지
│   │   ├── MetricsPanel.jsx # 메트릭 패널
│   │   ├── DiagnosticPanel.jsx # 진단 패널
│   │   └── ...
│   ├── context/            # Context API
│   ├── hooks/              # Custom Hooks
│   ├── utils/              # 유틸리티 함수
│   └── types/              # TypeScript 타입
├── public/                 # 정적 자산
├── dist/                   # 빌드 출력 (배포용)
├── package.json
├── vite.config.js
└── netlify.toml           # Netlify 배포 설정
```

## 🚢 배포

### Netlify 배포 (권장)

#### 방법 1: GitHub 연동
1. GitHub 레포지토리에 푸시
2. Netlify에서 레포지토리 연결
3. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. 자동 배포 완료!

#### 방법 2: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod
```

자세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

## 🎨 디자인 시스템

### 5가지 감정 색상
- 😊 기쁨: `#4CAF50` (초록색)
- 😰 스트레스: `#FF6B6B` (빨간색)
- 😠 화남: `#F44336` (진빨간색)
- 😌 평온: `#2196F3` (파란색)
- 😟 불안: `#FFC107` (노란색)

## 📊 데이터 구조

### NetworkMetrics
```typescript
interface NetworkMetrics {
  timestamp: number;
  latency: number | null;
  downloadSpeed: number | null;
  emotions: {
    happy: number;
    stress: number;
    anger: number;
    calm: number;
    anxiety: number;
  };
  // ...
}
```

## 🔧 기술 스택

- **React** 18.3.1
- **TypeScript** 5.3.3
- **Vite** 5.0.0
- **Chart.js** 4.4.0
- **react-chartjs-2** 5.2.0

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
