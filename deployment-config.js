// 배포 설정 (클라이언트에서 호출할 수 있는 공개 엔드포인트)
// 실제 배포는 GitHub Actions, Netlify Build Hook, Vercel Deploy Hook, 또는 사내 서버의 /deploy 웹훅으로 요청하세요.
// 민감한 토큰은 절대 여기에 넣지 마세요. 필요 시 서버 측에서 보관 후 이 엔드포인트만 노출합니다.

window.DEPLOYMENT_CONFIG = {
  // provider: 'netlify' | 'vercel' | 'aws' | 'custom'
  provider: 'vercel',


  // deployEndpoint/webhookUrl: 서버 측 프록시 혹은 빌드 훅 URL (예: Netlify build hook)
  // 예시) Netlify: https://api.netlify.com/build_hooks/xxxxxxxxxxxxxxxxxxxx
  // 예시) 사내 서버 프록시: https://your-server.example.com/deploy
  webhookUrl: 'https://special-spoon-cyan.vercel.app/',

  // 선택: 요청 헤더 (사내 프록시 엔드포인트가 인증을 요구하는 경우)
  headers: {},

  // 선택: 브랜치/레퍼런스
  ref: 'main'
};


