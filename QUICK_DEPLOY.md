# 🚀 NetMood Analyzer - 빠른 배포 가이드

## ⚡ 3단계로 배포하기

### Step 1: GitHub에 푸시
```bash
# Git 초기화 (처음만)
git init
git add .
git commit -m "Initial commit: React migration"

# GitHub 레포지토리 생성 후
git remote add origin https://github.com/YOUR_USERNAME/netmood-analyzer.git
git branch -M main
git push -u origin main
```

### Step 2: Netlify에서 연결
1. [Netlify](https://app.netlify.com) 접속
2. "Add new site" → "Import an existing project"
3. GitHub 선택 → 레포지토리 선택
4. 빌드 설정 확인:
   - ✅ Build command: `npm run build`
   - ✅ Publish directory: `dist`
5. "Deploy site" 클릭

### Step 3: 완료! 🎉
- 배포 완료 후 자동으로 URL 생성
- `main` 브랜치에 푸시할 때마다 자동 배포

---

## 📋 배포 전 체크리스트

- [ ] `npm run build` 로컬에서 성공하는가?
- [ ] `dist` 폴더가 생성되는가?
- [ ] `public/netmood-logo.webp` 파일이 있는가?
- [ ] `netlify.toml` 파일이 올바른가?

---

## 🔧 문제 해결

### 빌드 실패
```bash
# 로컬에서 테스트
npm run build
npm run preview
```

### 이미지가 안 보임
```bash
# public 폴더에 로고 복사
copy "netmood-logo.webp" "public\netmood-logo.webp"
```

---

**자세한 내용은 [DEPLOYMENT.md](./DEPLOYMENT.md) 참고**

