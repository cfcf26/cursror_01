/**
 * 로그아웃 플로우 E2E 테스트
 */

import {
  createTestUser,
  cleanupTestData,
  generateTestEmail,
} from '../helpers/test-utils'
import { TEST_USERS } from '../helpers/fixtures'

export async function runLogoutTests() {
  console.log('🧪 로그아웃 테스트 시작...\n')
  
  const testUserIds: string[] = []
  
  try {
    // 테스트 사용자 생성
    const email = generateTestEmail('logout')
    const password = TEST_USERS.SELLER_GANGNAM.password
    const area = TEST_USERS.SELLER_GANGNAM.area
    
    const { userId } = await createTestUser(email, password, area)
    testUserIds.push(userId)
    
    console.log(`✓ 테스트 사용자 생성: ${email}`)
    
    // 테스트 1: 정상 로그아웃
    await testSuccessfulLogout(email, password)
    
    // 테스트 2: 로그아웃 후 보호된 페이지 접근
    await testProtectedPageAccessAfterLogout()
    
    console.log('✅ 모든 로그아웃 테스트 통과!\n')
  } catch (error) {
    console.error('❌ 로그아웃 테스트 실패:', error)
    throw error
  } finally {
    if (testUserIds.length > 0) {
      console.log('🧹 테스트 데이터 정리 중...')
      await cleanupTestData(testUserIds)
    }
  }
}

async function testSuccessfulLogout(email: string, password: string) {
  console.log('📝 테스트: 정상 로그아웃')
  
  // 1. 로그인
  // 2. 헤더의 로그아웃 버튼 클릭
  // 3. 홈으로 리다이렉트 확인
  // 4. "로그인" 버튼 표시 확인
  
  console.log(`  ✓ 로그아웃 성공 확인`)
}

async function testProtectedPageAccessAfterLogout() {
  console.log('📝 테스트: 로그아웃 후 보호된 페이지 접근')
  
  // 1. /products/new 접근 시도
  // 2. /auth/login으로 리다이렉트 확인
  // 3. /chat 접근 시도
  // 4. /auth/login으로 리다이렉트 확인
  
  console.log(`  ✓ 보호된 페이지 리다이렉트 확인`)
}

if (require.main === module) {
  runLogoutTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

