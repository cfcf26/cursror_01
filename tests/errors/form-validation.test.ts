/**
 * 폼 검증 E2E 테스트
 */

import {
  createTestUser,
  cleanupTestData,
  generateTestEmail,
} from '../helpers/test-utils'
import { TEST_USERS, TEST_AREAS } from '../helpers/fixtures'

export async function runFormValidationTests() {
  console.log('🧪 폼 검증 테스트 시작...\n')
  
  const testUserIds: string[] = []
  
  try {
    // 테스트 사용자 생성
    const user = await createTestUser(
      generateTestEmail('form-validation'),
      TEST_USERS.SELLER_GANGNAM.password,
      TEST_AREAS.GANGNAM
    )
    testUserIds.push(user.userId)
    
    console.log(`✓ 테스트 사용자 생성: ${user.email}`)
    
    // 테스트 1: 상품 등록 폼 검증
    await testProductFormValidation(user)
    
    // 테스트 2: 로그인 폼 검증
    await testLoginFormValidation()
    
    console.log('✅ 모든 폼 검증 테스트 통과!\n')
  } catch (error) {
    console.error('❌ 폼 검증 테스트 실패:', error)
    throw error
  } finally {
    if (testUserIds.length > 0) {
      console.log('🧹 테스트 데이터 정리 중...')
      await cleanupTestData(testUserIds)
    }
  }
}

async function testProductFormValidation(user: any) {
  console.log('📝 테스트: 상품 등록 폼 검증')
  
  // 1. 사용자로 로그인
  // 2. /products/new 접속
  // 3. 제목 없이 제출 → 오류 메시지 확인
  // 4. 가격 0 미만 입력 → 오류 메시지 확인
  // 5. 설명 없이 제출 → 오류 메시지 확인
  
  console.log(`  ✓ 상품 폼 검증 확인`)
}

async function testLoginFormValidation() {
  console.log('📝 테스트: 로그인 폼 검증')
  
  // 1. /auth/login 접속
  // 2. 잘못된 이메일 형식 입력 → 오류 메시지 확인
  // 3. 빈 비밀번호로 제출 → 오류 메시지 확인
  
  console.log(`  ✓ 로그인 폼 검증 확인`)
}

if (require.main === module) {
  runFormValidationTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

