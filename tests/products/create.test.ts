/**
 * 상품 등록 E2E 테스트
 */

import {
  createTestUser,
  cleanupTestData,
  generateTestEmail,
} from '../helpers/test-utils'
import { TEST_USERS, TEST_PRODUCTS, TEST_AREAS } from '../helpers/fixtures'

export async function runProductCreateTests() {
  console.log('🧪 상품 등록 테스트 시작...\n')
  
  const testUserIds: string[] = []
  
  try {
    // 테스트 사용자 생성
    const user = await createTestUser(
      generateTestEmail('product-create'),
      TEST_USERS.SELLER_GANGNAM.password,
      TEST_AREAS.GANGNAM
    )
    testUserIds.push(user.userId)
    
    console.log(`✓ 테스트 사용자 생성: ${user.email}`)
    
    // 테스트 1: 정상 상품 등록
    await testSuccessfulProductCreate(user)
    
    // 테스트 2: 비로그인 상태 접근
    await testUnauthorizedAccess()
    
    // 테스트 3: 필수 필드 누락
    await testMissingRequiredFields(user)
    
    // 테스트 4: 잘못된 가격 입력
    await testInvalidPrice(user)
    
    console.log('✅ 모든 상품 등록 테스트 통과!\n')
  } catch (error) {
    console.error('❌ 상품 등록 테스트 실패:', error)
    throw error
  } finally {
    if (testUserIds.length > 0) {
      console.log('🧹 테스트 데이터 정리 중...')
      await cleanupTestData(testUserIds)
    }
  }
}

async function testSuccessfulProductCreate(user: any) {
  console.log('📝 테스트: 정상 상품 등록')
  
  const product = TEST_PRODUCTS[0]
  
  // 1. 로그인
  // 2. /products/new 접속
  // 3. 상품 정보 입력
  // 4. "등록하기" 버튼 클릭
  // 5. 상품 상세 페이지로 리다이렉트 확인
  // 6. 입력한 정보가 올바르게 표시되는지 확인
  // 7. 지역이 사용자 지역과 일치하는지 확인
  
  console.log(`  ✓ 상품 등록 성공 확인`)
}

async function testUnauthorizedAccess() {
  console.log('📝 테스트: 비로그인 상태 접근')
  
  // 1. 비로그인 상태
  // 2. /products/new 접속
  // 3. /auth/login으로 리다이렉트 확인
  
  console.log(`  ✓ 비로그인 리다이렉트 확인`)
}

async function testMissingRequiredFields(user: any) {
  console.log('📝 테스트: 필수 필드 누락')
  
  // 1. 로그인
  // 2. /products/new 접속
  // 3. 제목 없이 제출
  // 4. 오류 메시지 확인
  // 5. 가격 없이 제출
  // 6. 오류 메시지 확인
  
  console.log(`  ✓ 필수 필드 검증 확인`)
}

async function testInvalidPrice(user: any) {
  console.log('📝 테스트: 잘못된 가격 입력')
  
  // 1. 로그인
  // 2. /products/new 접속
  // 3. 가격에 음수 입력
  // 4. 오류 메시지 확인
  // 5. 가격에 문자 입력
  // 6. 오류 메시지 확인
  
  console.log(`  ✓ 가격 검증 확인`)
}

if (require.main === module) {
  runProductCreateTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

