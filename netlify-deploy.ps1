# NetMood Analyzer - Netlify 배포 스크립트 (PowerShell)

Write-Host "🚀 NetMood Analyzer 배포 시작..." -ForegroundColor Green

# 의존성 설치
Write-Host "📦 의존성 설치 중..." -ForegroundColor Yellow
npm install

# 빌드
Write-Host "🔨 빌드 중..." -ForegroundColor Yellow
npm run build

# 빌드 결과 확인
if (Test-Path "dist") {
    Write-Host "✅ 빌드 완료: dist 폴더 생성됨" -ForegroundColor Green
    Write-Host "📊 빌드 결과:" -ForegroundColor Cyan
    Get-ChildItem dist | Select-Object Name, Length
} else {
    Write-Host "❌ 빌드 실패: dist 폴더가 생성되지 않았습니다" -ForegroundColor Red
    exit 1
}

# _redirects 파일 복사
if (Test-Path "_redirects") {
    Copy-Item "_redirects" -Destination "dist\_redirects" -Force
    Write-Host "✅ _redirects 파일 복사 완료" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ 배포 준비 완료!" -ForegroundColor Green
Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Cyan
Write-Host "1. GitHub에 푸시: git push origin main"
Write-Host "2. 또는 Netlify CLI로 배포: netlify deploy --prod"

