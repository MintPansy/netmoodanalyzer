# 🎨 NetMood Analyzer - B2C 친화적 UI/UX 설계 문서

## 📋 개요

NetMood Analyzer의 B2C 친화적 UI/UX 설계 문서입니다. 일반 사용자가 쉽게 이해하고 사용할 수 있는 직관적인 인터페이스를 제공합니다.

## 🎯 핵심 설계 원칙

### 1. **직관성 우선**
- 복잡한 네트워크 데이터를 감정 기반으로 단순화
- 큰 이모지와 명확한 텍스트로 상태 표시
- 전문 용어 대신 일상 언어 사용

### 2. **점진적 정보 공개**
- 메인 화면: 핵심 상태만 표시
- 상세 화면: 전문적인 분석 도구 제공
- 필요에 따른 정보 접근

### 3. **모바일 퍼스트**
- 터치 친화적 인터페이스
- 반응형 디자인
- 작은 화면에서도 사용성 확보

## 🏗️ UI 컴포넌트 구조

### 1. **메인 화면 (B2C 친화적)**

#### 주요 감정 상태 표시
```html
<div class="primary-mood">
  <div class="mood-emoji-large">😌</div>
  <div class="mood-status-text">네트워크가 평온한 상태입니다</div>
  <div class="mood-confidence">신뢰도: 85%</div>
</div>
```

**특징:**
- 8rem 크기의 큰 이모지
- 명확한 상태 메시지
- 신뢰도 표시로 신뢰성 강화

#### 빠른 통계 정보
```html
<div class="quick-stats">
  <div class="stat-item">
    <span class="stat-label">전체 분석</span>
    <span class="stat-value">15</span>
    <span class="stat-unit">건</span>
  </div>
  <!-- 안전도, 마지막 업데이트 -->
</div>
```

**특징:**
- 핵심 지표만 간단히 표시
- 큰 숫자로 가독성 확보
- 단위 명시로 이해도 향상

#### 액션 버튼
```html
<div class="action-buttons">
  <button class="action-btn primary">📊 상세 분석 보기</button>
  <button class="action-btn secondary">📄 보고서 다운로드</button>
</div>
```

**특징:**
- 명확한 액션 유도
- 이모지로 기능 직관화
- 주요/보조 액션 구분

### 2. **감정 요약 카드**

```html
<div class="emotion-card calm">
  <div class="emotion-icon">😌</div>
  <div class="emotion-info">
    <div class="emotion-name">평온</div>
    <div class="emotion-count">6</div>
  </div>
</div>
```

**특징:**
- 5가지 감정별 색상 구분
- 이모지 + 숫자로 직관적 표시
- 호버 효과로 인터랙션 강화

### 3. **상세 분석 모달**

#### 모달 헤더
```html
<div class="modal-header">
  <h2>📊 상세 감정 분석</h2>
  <button class="close-btn">&times;</button>
</div>
```

#### 차트 컨트롤
```html
<div class="chart-controls">
  <div class="time-filter-group">
    <label>시간 단위:</label>
    <div class="time-filter-buttons">
      <button class="time-filter-btn active" data-period="1d">1일</button>
      <!-- 1달, 3달 -->
    </div>
  </div>
  
  <div class="emotion-toggle-group">
    <label>감정 선택:</label>
    <div class="emotion-toggles">
      <label class="emotion-toggle">
        <input type="checkbox" checked data-emotion="calm">
        <span class="toggle-indicator calm"></span>
        <span>평온</span>
      </label>
      <!-- 다른 감정들 -->
    </div>
  </div>
</div>
```

## 🎨 시각적 디자인 시스템

### 색상 팔레트

```css
/* 감정별 색상 */
.calm    { background: linear-gradient(135deg, #28a745, #20c997); }  /* 평온 - 초록 */
.happy   { background: linear-gradient(135deg, #17a2b8, #20c997); }  /* 기쁨 - 청록 */
.anxious { background: linear-gradient(135deg, #ffc107, #fd7e14); }  /* 불안 - 노랑 */
.angry   { background: linear-gradient(135deg, #dc3545, #e83e8c); }  /* 화남 - 빨강 */
.sad     { background: linear-gradient(135deg, #6f42c1, #e83e8c); }  /* 슬픔 - 보라 */
```

### 타이포그래피

```css
.mood-status-text {
  font-size: 2rem;        /* 데스크톱 */
  font-weight: 600;
  color: #333;
}

.mood-emoji-large {
  font-size: 8rem;        /* 큰 이모지 */
  animation: pulse 2s infinite;
}
```

### 애니메이션

```css
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.emotion-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
```

## 📱 반응형 디자인

### 브레이크포인트

```css
/* 태블릿 */
@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: stretch;
  }
}

/* 모바일 */
@media (max-width: 480px) {
  .mood-emoji-large {
    font-size: 5rem;      /* 모바일에서 축소 */
  }
  
  .emotion-cards {
    grid-template-columns: repeat(2, 1fr);  /* 2열 그리드 */
  }
}
```

### 모바일 최적화

- **터치 타겟**: 최소 44px 크기 보장
- **스크롤**: 수직 스크롤 최소화
- **텍스트**: 작은 화면에서도 읽기 쉬운 크기
- **버튼**: 전체 너비 활용으로 터치 용이성 향상

## 🔄 사용자 인터랙션 플로우

### 1. **초기 접근 플로우**

```
CSV 업로드 → 분석 진행 → 메인 상태 표시 → 감정 요약 표시
```

**사용자 경험:**
1. CSV 파일 업로드 (드래그 앤 드롭 또는 클릭)
2. 분석 진행 상태 시각적 표시
3. 주요 감정 상태를 큰 이모지로 표시
4. 감정별 요약 카드로 상세 정보 제공

### 2. **상세 분석 플로우**

```
상세 분석 버튼 클릭 → 모달 표시 → 시간 단위 선택 → 감정 토글
```

**사용자 경험:**
1. "📊 상세 분석 보기" 버튼 클릭
2. 모달 창으로 상세 차트 표시
3. 시간 단위 버튼으로 기간 조정
4. 감정 토글로 원하는 감정만 표시

### 3. **보고서 다운로드 플로우**

```
보고서 다운로드 버튼 클릭 → JSON 파일 생성 → 자동 다운로드
```

## 🎯 5가지 감정 시스템

### 감정 매핑

| 감정 | 이모지 | 색상 | 의미 |
|------|--------|------|------|
| **평온** | 😌 | 초록 | 안정적, 정상적인 네트워크 상태 |
| **기쁨** | 😊 | 청록 | 활발하고 건강한 통신 활동 |
| **불안** | 😰 | 노랑 | 비정상적 패턴 감지, 주의 필요 |
| **화남** | 😡 | 빨강 | 위험한 패턴, 보안 조치 필요 |
| **슬픔** | 😢 | 보라 | 저조한 활동, 성능 이슈 가능성 |

### 감정별 메시지

```javascript
const emotionConfig = {
  calm: { 
    emoji: '😌', 
    message: '네트워크가 평온한 상태입니다',
    color: '#28a745' 
  },
  happy: { 
    emoji: '😊', 
    message: '네트워크가 활발하고 건강합니다',
    color: '#17a2b8' 
  },
  anxious: { 
    emoji: '😰', 
    message: '네트워크에 불안한 패턴이 감지되었습니다',
    color: '#ffc107' 
  },
  angry: { 
    emoji: '😡', 
    message: '네트워크에 위험한 패턴이 발견되었습니다',
    color: '#dc3545' 
  },
  sad: { 
    emoji: '😢', 
    message: '네트워크 활동이 저조한 상태입니다',
    color: '#6f42c1' 
  }
};
```

## 🛠️ 고급 차트 기능

### 감정별 토글 시스템

```javascript
function updateEmotionVisibility(emotion, isVisible) {
  const emotionIndex = {
    'calm': 0, 'happy': 1, 'anxious': 2, 
    'angry': 3, 'sad': 4
  };
  
  const datasetIndex = emotionIndex[emotion];
  if (datasetIndex !== undefined) {
    moodChart.setDatasetVisibility(datasetIndex, isVisible);
    moodChart.update();
  }
}
```

### 시간 단위별 데이터 그룹화

```javascript
switch(period) {
  case '1d':  // 시간별 그룹화
    groupKey = `${date.getHours().toString().padStart(2, '0')}:00`;
    break;
  case '1m':  // 일별 그룹화
    groupKey = `${date.getMonth() + 1}/${date.getDate()}`;
    break;
  case '3m':  // 주별 그룹화
    const weekNumber = Math.ceil(date.getDate() / 7);
    groupKey = `${date.getMonth() + 1}월 ${weekNumber}주`;
    break;
}
```

## 📊 CSV 데이터 처리

### 업로드된 CSV 구조

```csv
Timestamp,SourceIP,DestinationIP,Protocol,Bytes,PacketRate,ProtocolEntropy,Emotion
2025-10-03 10:00:00,192.168.0.1,8.8.8.8,TCP,23456,120,0.62,평온
2025-10-03 10:01:00,192.168.0.2,10.0.0.5,UDP,34000,780,0.85,화남
```

### 실시간 반영

```javascript
function uploadFile() {
  const reader = new FileReader();
  reader.onload = function(e) {
    const csvText = e.target.result;
    analyzeCSVData(csvText);  // 즉시 분석 및 UI 업데이트
  };
  reader.readAsText(file);
}
```

## 🎨 접근성 고려사항

### 색상 접근성
- 색맹 사용자를 위한 패턴과 텍스트 보완
- 충분한 색상 대비 (WCAG 2.1 AA 준수)
- 색상 외의 시각적 구분 요소 제공

### 키보드 내비게이션
- 모든 인터랙티브 요소에 키보드 접근 가능
- Tab 순서 논리적 배치
- Enter/Space 키로 버튼 활성화

### 스크린 리더 지원
- 의미있는 HTML 시맨틱 태그 사용
- 적절한 ARIA 레이블 제공
- 상태 변화 시 스크린 리더 알림

## 📱 모바일 UX 최적화

### 터치 인터랙션
- 최소 44px 터치 타겟 크기
- 충분한 간격으로 오타 방지
- 스와이프 제스처 지원

### 성능 최적화
- 이미지 지연 로딩
- CSS 애니메이션 GPU 가속
- 불필요한 리플로우 최소화

### 배터리 효율성
- 애니메이션 감소 옵션
- 백그라운드 처리 최소화
- 효율적인 이벤트 리스너 관리

## 🔮 향후 개선 계획

### 사용자 경험 개선
- [ ] 개인화된 대시보드 설정
- [ ] 알림 및 푸시 메시지
- [ ] 다국어 지원

### 기능 확장
- [ ] 실시간 모니터링
- [ ] 예측 분석 기능
- [ ] 커스텀 감정 타입 추가

### 성능 최적화
- [ ] PWA (Progressive Web App) 지원
- [ ] 오프라인 모드
- [ ] 캐싱 전략 개선

---

이 설계를 통해 복잡한 네트워크 분석을 일반 사용자도 쉽게 이해하고 활용할 수 있는 직관적인 인터페이스를 제공합니다.
