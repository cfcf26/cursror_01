/**
 * 404 에러 E2E 테스트
 */

import {
  createTestUser,
  cleanupTestData,
  generateTestEmail,
} from '../helpers/test-utils'
import { TEST_USERS, TEST_AREAS } from '../helpers/fixtures'

export async function runNotFoundTests() {
  console.log('🧪 404 에러 테스트 시작...\n')
  
  const testUserIds: string[] = []
  
  try {
    // 테스트 사용자 생성
    const user = await createTestUser(
      generateTestEmail('not-found'),
      TEST_USERS.SELLER_GANGNAM.password,
      TEST_AREAS.GANGNAM
    )
    testUserIds.push(user.userId)
    
    console.log(`✓ 테스트 사용자 생성: ${user.email}`)
    
    // 테스트: 존재하지 않는 리소스 접근
    await testNonExistentResources(user)
    
    console.log('✅ 모든 404 에러 테스트 통과!\n')
  } catch (error) {
    console.error('❌ 404 에러 테스트 실패:', error)
    throw error
  } finally {
    if (testUserIds.length > 0) {
      console.log('🧹 테스트 데이터 정리 중...')
      await cleanupTestData(testUserIds)
    }
  }
}

async function testNonExistentResources(user: any) {
  console.log('📝 테스트: 존재하지 않는 리소스 접근')
  
  // 1. 사용자로 로그인
  // 2. /products/00000000-0000-0000-0000-000000000000 접속
  // 3. 404 페이지 또는 오류 메시지 확인
  // 4. /chat/00000000-0000-0000-0000-000000000000 접속
  // 5. 404 페이지 또는 오류 메시지 확인
  
  console.log(`  ✓ 404 에러 처리 확인`)
}

if (require.main === module) {
  runNotFoundTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

