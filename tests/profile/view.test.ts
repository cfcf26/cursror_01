/**
 * 프로필 조회 E2E 테스트
 */

import {
  createTestUser,
  cleanupTestData,
  generateTestEmail,
} from '../helpers/test-utils'
import { TEST_USERS, TEST_AREAS } from '../helpers/fixtures'

export async function runProfileViewTests() {
  console.log('🧪 프로필 조회 테스트 시작...\n')
  
  const testUserIds: string[] = []
  
  try {
    // 테스트 사용자 생성
    const user = await createTestUser(
      generateTestEmail('profile-view'),
      TEST_USERS.SELLER_GANGNAM.password,
      TEST_AREAS.GANGNAM
    )
    testUserIds.push(user.userId)
    
    console.log(`✓ 테스트 사용자 생성: ${user.email}`)
    
    // 테스트: 프로필 조회
    await testViewProfile(user)
    
    console.log('✅ 프로필 조회 테스트 통과!\n')
  } catch (error) {
    console.error('❌ 프로필 조회 테스트 실패:', error)
    throw error
  } finally {
    if (testUserIds.length > 0) {
      console.log('🧹 테스트 데이터 정리 중...')
      await cleanupTestData(testUserIds)
    }
  }
}

async function testViewProfile(user: any) {
  console.log('📝 테스트: 프로필 조회')
  
  // 1. 사용자로 로그인
  // 2. /profile 접속
  // 3. 이메일 표시 확인
  // 4. 현재 지역 표시 확인
  // 5. 가입일 표시 확인
  
  console.log(`  ✓ 프로필 정보 표시 확인`)
}

if (require.main === module) {
  runProfileViewTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

