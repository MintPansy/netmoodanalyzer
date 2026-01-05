#!/bin/bash
# NetMood Analyzer - Netlify 배포 스크립트

echo "🚀 NetMood Analyzer 배포 시작..."

# 의존성 설치
echo "📦 의존성 설치 중..."
npm install

# 빌드
echo "🔨 빌드 중..."
npm run build

# 빌드 결과 확인
if [ -d "dist" ]; then
    echo "✅ 빌드 완료: dist 폴더 생성됨"
    echo "📊 빌드 결과:"
    ls -lh dist/
else
    echo "❌ 빌드 실패: dist 폴더가 생성되지 않았습니다"
    exit 1
fi

# _redirects 파일 복사
if [ -f "_redirects" ]; then
    cp _redirects dist/
    echo "✅ _redirects 파일 복사 완료"
fi

echo "✨ 배포 준비 완료!"
echo ""
echo "다음 단계:"
echo "1. GitHub에 푸시: git push origin main"
echo "2. 또는 Netlify CLI로 배포: netlify deploy --prod"

