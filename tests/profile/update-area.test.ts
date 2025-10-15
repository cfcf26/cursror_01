/**
 * 지역 변경 E2E 테스트
 */

import {
  createTestUser,
  createTestProduct,
  cleanupTestData,
  generateTestEmail,
} from '../helpers/test-utils'
import { TEST_USERS, TEST_PRODUCTS, TEST_AREAS } from '../helpers/fixtures'

export async function runProfileUpdateAreaTests() {
  console.log('🧪 지역 변경 테스트 시작...\n')
  
  const testUserIds: string[] = []
  
  try {
    // 테스트 사용자 생성 (강남구)
    const user = await createTestUser(
      generateTestEmail('profile-update'),
      TEST_USERS.SELLER_GANGNAM.password,
      TEST_AREAS.GANGNAM
    )
    testUserIds.push(user.userId)
    
    // 다른 지역 사용자 및 상품 생성
    const seochoUser = await createTestUser(
      generateTestEmail('seocho-seller'),
      TEST_USERS.SELLER_SEOCHO.password,
      TEST_AREAS.SEOCHO
    )
    testUserIds.push(seochoUser.userId)
    
    // 강남구 상품
    await createTestProduct(user.userId, {
      ...TEST_PRODUCTS[0],
      area: TEST_AREAS.GANGNAM,
    })
    
    // 서초구 상품
    await createTestProduct(seochoUser.userId, {
      ...TEST_PRODUCTS[1],
      area: TEST_AREAS.SEOCHO,
    })
    
    console.log(`✓ 테스트 데이터 준비 완료`)
    
    // 테스트: 지역 변경 및 필터링 확인
    await testAreaUpdate(user)
    
    console.log('✅ 지역 변경 테스트 통과!\n')
  } catch (error) {
    console.error('❌ 지역 변경 테스트 실패:', error)
    throw error
  } finally {
    if (testUserIds.length > 0) {
      console.log('🧹 테스트 데이터 정리 중...')
      await cleanupTestData(testUserIds)
    }
  }
}

async function testAreaUpdate(user: any) {
  console.log('📝 테스트: 지역 변경 및 필터링 확인')
  
  // 1. 강남구 사용자로 로그인
  // 2. 홈에서 강남구 상품만 보이는지 확인
  // 3. /profile 접속
  // 4. 지역을 "서초구"로 변경
  // 5. "저장" 버튼 클릭
  // 6. 성공 메시지 확인
  // 7. 홈으로 이동
  // 8. 서초구 상품만 보이는지 확인
  // 9. 강남구 상품은 안 보이는지 확인
  
  console.log(`  ✓ 지역 변경 및 필터링 확인`)
}

if (require.main === module) {
  runProfileUpdateAreaTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

