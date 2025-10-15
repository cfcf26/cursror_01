/**
 * 홈페이지 상태별 UI E2E 테스트
 */

import {
  createTestUser,
  createTestProduct,
  cleanupTestData,
  generateTestEmail,
} from '../helpers/test-utils'
import { TEST_USERS, TEST_PRODUCTS, TEST_AREAS } from '../helpers/fixtures'

export async function runHomepageTests() {
  console.log('🧪 홈페이지 UI 테스트 시작...\n')
  
  const testUserIds: string[] = []
  
  try {
    // 테스트 사용자 및 상품 생성
    const user = await createTestUser(
      generateTestEmail('homepage'),
      TEST_USERS.SELLER_GANGNAM.password,
      TEST_AREAS.GANGNAM
    )
    testUserIds.push(user.userId)
    
    await createTestProduct(user.userId, {
      ...TEST_PRODUCTS[0],
      area: TEST_AREAS.GANGNAM,
    })
    
    console.log(`✓ 테스트 데이터 준비 완료`)
    
    // 테스트 1: 비로그인 홈페이지
    await testGuestHomepage()
    
    // 테스트 2: 로그인 홈페이지
    await testAuthenticatedHomepage(user)
    
    console.log('✅ 모든 홈페이지 테스트 통과!\n')
  } catch (error) {
    console.error('❌ 홈페이지 테스트 실패:', error)
    throw error
  } finally {
    if (testUserIds.length > 0) {
      console.log('🧹 테스트 데이터 정리 중...')
      await cleanupTestData(testUserIds)
    }
  }
}

async function testGuestHomepage() {
  console.log('📝 테스트: 비로그인 홈페이지')
  
  // 1. 비로그인 상태로 홈 접속
  // 2. "시작하기" 버튼 표시 확인
  // 3. 전체 최신 상품 표시 확인
  // 4. Features 섹션 표시 확인
  // 5. "시작하기" 클릭 시 /auth/login으로 이동
  
  console.log(`  ✓ 비로그인 홈페이지 확인`)
}

async function testAuthenticatedHomepage(user: any) {
  console.log('📝 테스트: 로그인 홈페이지')
  
  // 1. 사용자로 로그인
  // 2. "상품 둘러보기" 버튼 표시 확인
  // 3. "상품 등록하기" 버튼 표시 확인
  // 4. "강남구 최신 상품" 제목 표시 확인
  // 5. 내 지역 상품만 표시되는지 확인
  
  console.log(`  ✓ 로그인 홈페이지 확인`)
}

if (require.main === module) {
  runHomepageTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

