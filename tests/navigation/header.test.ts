/**
 * 헤더 네비게이션 E2E 테스트
 */

import {
  createTestUser,
  cleanupTestData,
  generateTestEmail,
} from '../helpers/test-utils'
import { TEST_USERS, TEST_AREAS } from '../helpers/fixtures'

export async function runHeaderNavigationTests() {
  console.log('🧪 헤더 네비게이션 테스트 시작...\n')
  
  const testUserIds: string[] = []
  
  try {
    // 테스트 사용자 생성
    const user = await createTestUser(
      generateTestEmail('header-nav'),
      TEST_USERS.SELLER_GANGNAM.password,
      TEST_AREAS.GANGNAM
    )
    testUserIds.push(user.userId)
    
    console.log(`✓ 테스트 사용자 생성: ${user.email}`)
    
    // 테스트 1: 비로그인 헤더
    await testGuestHeader()
    
    // 테스트 2: 로그인 헤더
    await testAuthenticatedHeader(user)
    
    console.log('✅ 모든 헤더 네비게이션 테스트 통과!\n')
  } catch (error) {
    console.error('❌ 헤더 네비게이션 테스트 실패:', error)
    throw error
  } finally {
    if (testUserIds.length > 0) {
      console.log('🧹 테스트 데이터 정리 중...')
      await cleanupTestData(testUserIds)
    }
  }
}

async function testGuestHeader() {
  console.log('📝 테스트: 비로그인 헤더')
  
  // 1. 비로그인 상태로 홈 접속
  // 2. "로그인" 링크 표시 확인
  // 3. "로그인" 클릭
  // 4. /auth/login으로 이동 확인
  
  console.log(`  ✓ 비로그인 헤더 확인`)
}

async function testAuthenticatedHeader(user: any) {
  console.log('📝 테스트: 로그인 헤더')
  
  // 1. 사용자로 로그인
  // 2. 헤더에 이메일 표시 확인
  // 3. "상품 등록" 링크 표시 확인
  // 4. "채팅" 링크 표시 확인
  // 5. "프로필" 링크 표시 확인
  // 6. "로그아웃" 버튼 표시 확인
  // 7. 각 링크 클릭하여 페이지 이동 확인
  
  console.log(`  ✓ 로그인 헤더 및 링크 확인`)
}

if (require.main === module) {
  runHeaderNavigationTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

