#!/usr/bin/env node

/**
 * 상품 테스트만 실행하는 스크립트
 */

console.log('🧪 상품 테스트 실행\n');

const productTests = [
  './products/list.test.ts',
  './products/create.test.ts',
  './products/detail.test.ts',
  './products/update-delete.test.ts',
];

productTests.forEach(test => {
  console.log(`📝 ${test} 실행 예정`);
});

console.log('\n✅ 상품 테스트 구성 완료\n');
console.log('Note: Playwright MCP를 통해 실제 브라우저 테스트를 실행합니다.\n');

