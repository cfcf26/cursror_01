#!/usr/bin/env node

/**
 * 인증 테스트만 실행하는 스크립트
 */

console.log('🧪 인증 테스트 실행\n');

const authTests = [
  './auth/signup.test.ts',
  './auth/login.test.ts',
  './auth/logout.test.ts',
];

authTests.forEach(test => {
  console.log(`📝 ${test} 실행 예정`);
});

console.log('\n✅ 인증 테스트 구성 완료\n');
console.log('Note: Playwright MCP를 통해 실제 브라우저 테스트를 실행합니다.\n');

