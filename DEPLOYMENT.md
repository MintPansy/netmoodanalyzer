# 🚀 NetMood Analyzer - Netlify 배포 가이드

## 배포 방법

### 방법 1: GitHub 연동 (권장) ⭐

#### Step 1: GitHub 레포지토리 생성
1. GitHub에 새 레포지토리 생성
2. 레포지토리 이름: `netmood-analyzer` (또는 원하는 이름)

#### Step 2: 로컬 프로젝트를 GitHub에 푸시
```bash
# Git 초기화 (이미 되어있다면 생략)
git init

# 원격 레포지토리 추가
git remote add origin https://github.com/YOUR_USERNAME/netmood-analyzer.git

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit: React migration"

# 메인 브랜치에 푸시
git branch -M main
git push -u origin main
```

#### Step 3: Netlify에서 GitHub 연동
1. [Netlify](https://app.netlify.com)에 로그인
2. "Add new site" → "Import an existing project" 클릭
3. GitHub 선택 및 레포지토리 연결
4. 빌드 설정 (자동 감지됨):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. "Deploy site" 클릭

#### Step 4: 환경 변수 설정 (필요시)
Netlify 대시보드 → Site settings → Environment variables
- 현재는 환경 변수가 필요 없습니다 (localStorage 사용)

---

### 방법 2: Netlify CLI로 배포

#### Step 1: Netlify CLI 설치
```bash
npm install -g netlify-cli
```

#### Step 2: 로그인
```bash
netlify login
```

#### Step 3: 배포
```bash
# 빌드
npm run build

# 배포
netlify deploy --prod
```

---

### 방법 3: 드래그 앤 드롭 (간단하지만 자동 배포 불가)

1. `npm run build` 실행
2. `dist` 폴더를 압축
3. [Netlify Drop](https://app.netlify.com/drop)에 드래그 앤 드롭

---

## 빌드 설정 확인

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"
```

### package.json
```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

### vite.config.js
```javascript
build: {
  outDir: 'dist',
  sourcemap: true
}
```

---

## 배포 후 확인 사항

### ✅ 체크리스트
- [ ] 사이트가 정상적으로 로드되는가?
- [ ] 5개 탭이 모두 작동하는가?
- [ ] 실시간 모니터링이 작동하는가?
- [ ] 로고 이미지가 표시되는가?
- [ ] localStorage가 정상 작동하는가?
- [ ] CSV 내보내기가 작동하는가?

---

## 문제 해결

### 빌드 실패
```bash
# 로컬에서 빌드 테스트
npm run build

# 빌드 결과 확인
npm run preview
```

### 이미지가 표시되지 않음
- `public/netmood-logo.webp` 파일이 있는지 확인
- 빌드 후 `dist/netmood-logo.webp` 파일이 있는지 확인

### 라우팅 문제
- `_redirects` 파일이 `dist` 폴더에 있는지 확인
- Netlify의 SPA 리다이렉트 설정 확인

---

## 자동 배포 설정

GitHub 연동 후:
- `main` 브랜치에 푸시하면 자동으로 배포됩니다
- Pull Request 생성 시 미리보기 배포가 생성됩니다

---

## 커스텀 도메인 설정

1. Netlify 대시보드 → Site settings → Domain management
2. "Add custom domain" 클릭
3. 도메인 입력 및 DNS 설정

---

## 성능 최적화

### 이미지 최적화
- 로고 이미지를 WebP 형식으로 사용 (이미 적용됨)
- 필요시 이미지 압축 도구 사용

### 코드 스플리팅
- Vite가 자동으로 코드 스플리팅 수행
- React, Chart.js는 별도 청크로 분리됨

---

## 보안 설정

### HTTPS
- Netlify는 기본적으로 HTTPS 제공
- SSL 인증서 자동 갱신

### 환경 변수
- 민감한 정보는 Netlify의 Environment variables에 저장
- 현재는 localStorage만 사용하므로 불필요

---

## 모니터링

### Netlify Analytics
- Netlify 대시보드에서 방문자 통계 확인
- 무료 플랜에서도 기본 통계 제공

---

## 업데이트 배포

### 자동 배포 (GitHub 연동 시)
```bash
git add .
git commit -m "Update: 기능 개선"
git push origin main
```
→ 자동으로 배포 시작

### 수동 배포 (CLI)
```bash
npm run build
netlify deploy --prod
```

---

**마지막 업데이트**: 2026년 1월 5일

