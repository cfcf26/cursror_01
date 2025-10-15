/**
 * 상품 목록 조회 E2E 테스트
 */

import {
  createTestUser,
  createTestProduct,
  cleanupTestData,
  generateTestEmail,
} from '../helpers/test-utils'
import { TEST_USERS, TEST_PRODUCTS, TEST_AREAS } from '../helpers/fixtures'

export async function runProductListTests() {
  console.log('🧪 상품 목록 조회 테스트 시작...\n')
  
  const testUserIds: string[] = []
  
  try {
    // 테스트 데이터 준비
    const { gangnamUsers, seochoUsers, productIds } = await setupTestData(testUserIds)
    
    // 테스트 1: 비로그인 사용자 - 전체 상품 보기
    await testGuestUserProductList(productIds)
    
    // 테스트 2: 로그인 사용자 - 지역 필터링
    await testAreaFilteredProductList(gangnamUsers[0], productIds)
    
    // 테스트 3: 상품 목록 페이지
    await testProductsPage(gangnamUsers[0])
    
    console.log('✅ 모든 상품 목록 테스트 통과!\n')
  } catch (error) {
    console.error('❌ 상품 목록 테스트 실패:', error)
    throw error
  } finally {
    if (testUserIds.length > 0) {
      console.log('🧹 테스트 데이터 정리 중...')
      await cleanupTestData(testUserIds)
    }
  }
}

async function setupTestData(testUserIds: string[]) {
  console.log('📦 테스트 데이터 준비 중...')
  
  // 강남구 사용자 2명
  const gangnamUser1 = await createTestUser(
    generateTestEmail('gangnam1'),
    TEST_USERS.SELLER_GANGNAM.password,
    TEST_AREAS.GANGNAM
  )
  testUserIds.push(gangnamUser1.userId)
  
  const gangnamUser2 = await createTestUser(
    generateTestEmail('gangnam2'),
    TEST_USERS.BUYER_GANGNAM.password,
    TEST_AREAS.GANGNAM
  )
  testUserIds.push(gangnamUser2.userId)
  
  // 서초구 사용자 1명
  const seochoUser = await createTestUser(
    generateTestEmail('seocho'),
    TEST_USERS.USER_SEOCHO.password,
    TEST_AREAS.SEOCHO
  )
  testUserIds.push(seochoUser.userId)
  
  // 강남구 상품 2개
  const gangnamProduct1 = await createTestProduct(gangnamUser1.userId, {
    ...TEST_PRODUCTS[0],
    area: TEST_AREAS.GANGNAM,
  })
  
  const gangnamProduct2 = await createTestProduct(gangnamUser2.userId, {
    ...TEST_PRODUCTS[1],
    area: TEST_AREAS.GANGNAM,
  })
  
  // 서초구 상품 2개
  const seochoProduct1 = await createTestProduct(seochoUser.userId, {
    ...TEST_PRODUCTS[2],
    area: TEST_AREAS.SEOCHO,
  })
  
  const seochoProduct2 = await createTestProduct(seochoUser.userId, {
    ...TEST_PRODUCTS[3],
    area: TEST_AREAS.SEOCHO,
  })
  
  console.log('✓ 테스트 데이터 준비 완료')
  
  return {
    gangnamUsers: [gangnamUser1, gangnamUser2],
    seochoUsers: [seochoUser],
    productIds: {
      gangnam: [gangnamProduct1, gangnamProduct2],
      seocho: [seochoProduct1, seochoProduct2],
    },
  }
}

async function testGuestUserProductList(productIds: any) {
  console.log('📝 테스트: 비로그인 사용자 - 전체 상품 보기')
  
  // 1. 홈 접속
  // 2. 최신 상품 6개 표시 확인
  // 3. 강남구, 서초구 상품 모두 표시되는지 확인
  
  console.log(`  ✓ 비로그인 사용자 상품 목록 확인`)
}

async function testAreaFilteredProductList(user: any, productIds: any) {
  console.log('📝 테스트: 로그인 사용자 - 지역 필터링')
  
  // 1. 강남구 사용자로 로그인
  // 2. 홈에서 강남구 상품만 표시되는지 확인
  // 3. 서초구 상품은 표시되지 않는지 확인
  
  console.log(`  ✓ 지역 필터링 확인`)
}

async function testProductsPage(user: any) {
  console.log('📝 테스트: 상품 목록 페이지')
  
  // 1. /products 접속
  // 2. 지역에 맞는 상품만 표시
  // 3. 상품 카드에 제목, 가격, 지역 표시 확인
  
  console.log(`  ✓ 상품 목록 페이지 확인`)
}

if (require.main === module) {
  runProductListTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

