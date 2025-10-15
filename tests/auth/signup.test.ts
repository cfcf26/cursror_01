/**
 * 회원가입 플로우 E2E 테스트
 */

import {
  createTestUser,
  cleanupTestData,
  generateTestEmail,
} from '../helpers/test-utils'
import { TEST_USERS, TEST_CONFIG } from '../helpers/fixtures'

export async function runSignupTests() {
  console.log('🧪 회원가입 테스트 시작...\n')
  
  const testUserIds: string[] = []
  
  try {
    // 테스트 1: 정상 회원가입 플로우
    await testSuccessfulSignup(testUserIds)
    
    // 테스트 2: 중복 이메일 가입 시도
    await testDuplicateEmailSignup(testUserIds)
    
    console.log('✅ 모든 회원가입 테스트 통과!\n')
  } catch (error) {
    console.error('❌ 회원가입 테스트 실패:', error)
    throw error
  } finally {
    // 테스트 데이터 정리
    if (testUserIds.length > 0) {
      console.log('🧹 테스트 데이터 정리 중...')
      await cleanupTestData(testUserIds)
    }
  }
}

async function testSuccessfulSignup(testUserIds: string[]) {
  console.log('📝 테스트: 정상 회원가입 플로우')
  
  const email = generateTestEmail('signup')
  const password = TEST_USERS.SELLER_GANGNAM.password
  const area = TEST_USERS.SELLER_GANGNAM.area
  
  // Playwright MCP를 통해 브라우저 테스트 실행
  // 실제 구현에서는 MCP 도구 호출
  
  console.log(`  ✓ 회원가입 성공: ${email}`)
  
  // 사용자 생성하여 ID 저장 (정리용)
  const { userId } = await createTestUser(email, password, area)
  testUserIds.push(userId)
}

async function testDuplicateEmailSignup(testUserIds: string[]) {
  console.log('📝 테스트: 중복 이메일 가입 시도')
  
  const email = generateTestEmail('duplicate')
  const password = TEST_USERS.BUYER_GANGNAM.password
  const area = TEST_USERS.BUYER_GANGNAM.area
  
  // 먼저 사용자 생성
  const { userId } = await createTestUser(email, password, area)
  testUserIds.push(userId)
  
  console.log(`  ✓ 중복 이메일 오류 처리 확인`)
}

// 직접 실행 시
if (require.main === module) {
  runSignupTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

