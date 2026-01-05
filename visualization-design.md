# 📈 NetMood Analyzer - 고급 시각화 컴포넌트 설계

## 🎯 개요

네트워크 감정 상태 변화를 위한 인터랙티브 시각화 시스템의 상세 설계 문서입니다.

## 🏗️ 컴포넌트 구조

### 1. 차트 헤더 섹션
```html
<div class="chart-header">
  <h3 class="chart-title">📈 감정 변화 추이</h3>
  <div class="time-filter-buttons">
    <button class="time-filter-btn active" data-period="3h">3시간</button>
    <button class="time-filter-btn" data-period="1d">1일</button>
    <button class="time-filter-btn" data-period="1m">1달</button>
    <button class="time-filter-btn" data-period="3m">3달</button>
  </div>
</div>
```

**기능:**
- 차트 제목 표시
- 시간 단위 선택 버튼 그룹
- 활성 상태 시각적 피드백

### 2. 차트 컨트롤 섹션
```html
<div class="chart-controls">
  <div class="chart-info">
    <span>총 데이터 포인트: <strong id="dataPointCount">0</strong>개</span>
    <span>시간 범위: <strong id="timeRangeText">-</strong></span>
  </div>
  <div class="chart-legend">
    <div class="legend-item">
      <div class="legend-color calm"></div>
      <span>평온</span>
    </div>
    <!-- 다른 감정들... -->
  </div>
</div>
```

**기능:**
- 실시간 데이터 통계 표시
- 감정별 색상 범례
- 차트 정보 업데이트

### 3. 메인 차트 영역
```html
<canvas id="moodChart"></canvas>
```

**기능:**
- Chart.js 기반 인터랙티브 라인 차트
- 선명한 마커와 호버 효과
- 동적 데이터 업데이트

## 🎨 시각적 디자인 시스템

### 색상 팔레트
```css
/* 감정별 색상 */
.calm    { background: linear-gradient(45deg, #28a745, #20c997); }  /* 평온 - 초록 */
.happy   { background: linear-gradient(45deg, #17a2b8, #20c997); }  /* 기쁨 - 청록 */
.anxious { background: linear-gradient(45deg, #ffc107, #fd7e14); }  /* 불안 - 노랑 */
.angry   { background: linear-gradient(45deg, #dc3545, #e83e8c); }  /* 화남 - 빨강 */
```

### 마커 디자인
```javascript
pointBackgroundColor: '#28a745',    // 메인 색상
pointBorderColor: '#ffffff',        // 흰색 테두리
pointBorderWidth: 2,                // 테두리 두께
pointRadius: 6,                     // 기본 크기
pointHoverRadius: 8,                // 호버 시 크기
```

## 🔄 UX 흐름 설계

### 1. 초기 로딩 플로우
```
CSV 업로드 → 데이터 파싱 → 기본 차트 생성 (3시간) → UI 표시
```

### 2. 시간 필터 인터랙션 플로우
```
버튼 클릭 → active 상태 변경 → 데이터 재그룹화 → 차트 업데이트 → 정보 업데이트
```

### 3. 호버 인터랙션 플로우
```
마우스 오버 → 툴팁 표시 → 마커 강조 → 관련 데이터 하이라이트
```

## 🛠️ 기술 스택 및 라이브러리

### 차트 라이브러리: Chart.js
**선택 이유:**
- 가벼우면서도 강력한 기능
- 인터랙티브 기능 내장
- 커스터마이징 용이
- 모바일 친화적

### 핵심 기능
```javascript
// 고급 차트 설정
{
  type: 'line',
  interaction: {
    intersect: false,
    mode: 'index'
  },
  animation: {
    duration: 1500,
    easing: 'easeInOutQuart',
    delay: function(context) {
      return context.dataIndex * 50;
    }
  }
}
```

## 📊 시간 단위별 데이터 처리

### 3시간 (3h)
- **그룹화**: 분 단위 (HH:MM)
- **데이터 포인트**: 10-30개
- **용도**: 단기 트렌드 분석

### 1일 (1d)
- **그룹화**: 시간 단위 (HH:00)
- **데이터 포인트**: 24개
- **용도**: 일일 패턴 분석

### 1달 (1m)
- **그룹화**: 일 단위 (M/D)
- **데이터 포인트**: 30개
- **용도**: 주간/월간 트렌드

### 3달 (3m)
- **그룹화**: 주 단위 (M월 W주)
- **데이터 포인트**: 12개
- **용도**: 장기 트렌드 분석

## 🎯 인터랙션 패턴

### 1. 버튼 상태 관리
```javascript
// 활성 버튼 시각적 피드백
.time-filter-btn.active {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

// 호버 효과
.time-filter-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  transform: translateY(-1px);
}
```

### 2. 차트 애니메이션
```javascript
// 순차적 데이터 로딩
animation: {
  duration: 1500,
  easing: 'easeInOutQuart',
  delay: function(context) {
    return context.dataIndex * 50;
  }
}
```

### 3. 반응형 디자인
```css
/* 모바일 최적화 */
@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .time-filter-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }
}
```

## 📱 사용자 인터랙션 방식

### 1. 시간 필터 선택
- **방식**: 버튼 클릭
- **피드백**: 즉시 차트 업데이트
- **애니메이션**: 버튼 스케일 효과

### 2. 차트 데이터 탐색
- **방식**: 마우스 호버
- **피드백**: 툴팁 표시, 마커 강조
- **정보**: 시간, 감정별 값

### 3. 반응형 조작
- **터치**: 모바일에서 터치 인터랙션
- **키보드**: 접근성 지원
- **스크롤**: 차트 영역 확대/축소

## 🎨 시각적 개선사항

### 1. 선명한 마커 디자인
- **크기**: 6px 기본, 8px 호버
- **테두리**: 2px 흰색 테두리
- **그림자**: 미묘한 그림자 효과

### 2. 색상 대비 최적화
- **배경**: 그라데이션 배경
- **그리드**: 연한 회색 그리드
- **텍스트**: 고대비 색상

### 3. 애니메이션 효과
- **로딩**: 순차적 데이터 표시
- **전환**: 부드러운 차트 업데이트
- **호버**: 자연스러운 마커 확대

## 🔧 성능 최적화

### 1. 데이터 처리
- **그룹화**: 클라이언트 사이드 그룹화
- **캐싱**: 전역 변수로 데이터 저장
- **지연 로딩**: 필요한 시점에 차트 생성

### 2. 렌더링 최적화
- **Canvas**: 하드웨어 가속 활용
- **애니메이션**: GPU 가속 애니메이션
- **메모리**: 차트 인스턴스 재사용

## 📈 확장 가능성

### 1. 새로운 감정 타입 추가
```javascript
// 감정 매핑 확장
emotion_mapping = {
  '평온': 'calm',
  '기쁨': 'happy',
  '불안': 'anxious',
  '화남': 'angry',
  '슬픔': 'sad',      // 새로 추가
  '놀람': 'surprise'  // 새로 추가
}
```

### 2. 추가 시간 단위
```javascript
// 새로운 시간 단위 지원
case '1w': return '주 단위';
case '6m': return '6개월 단위';
case '1y': return '연 단위';
```

### 3. 차트 타입 확장
- **막대 그래프**: 감정별 비교
- **파이 차트**: 비율 시각화
- **히트맵**: 시간대별 패턴

## 🎯 사용자 경험 목표

### 1. 직관성
- **한눈에 파악**: 색상과 이모지로 즉시 이해
- **직관적 조작**: 명확한 버튼과 피드백

### 2. 반응성
- **즉시 반응**: 클릭 시 즉시 차트 업데이트
- **부드러운 전환**: 자연스러운 애니메이션

### 3. 정보성
- **상세 정보**: 툴팁과 범례로 충분한 정보 제공
- **통계 표시**: 데이터 포인트와 시간 범위 표시

---

이 설계를 통해 사용자는 다양한 시간 단위에서 네트워크 감정 상태의 변화를 직관적이고 인터랙티브하게 분석할 수 있습니다.
