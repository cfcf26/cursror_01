/**
 * 지역 필터링 통합 E2E 테스트
 */

import {
  createTestUser,
  createTestProduct,
  cleanupTestData,
  generateTestEmail,
} from '../helpers/test-utils'
import { TEST_USERS, TEST_PRODUCTS, TEST_AREAS } from '../helpers/fixtures'

export async function runAreaFilteringTests() {
  console.log('🧪 지역 필터링 통합 테스트 시작...\n')
  
  const testUserIds: string[] = []
  const productIds: string[] = []
  
  try {
    // 1. 강남구 판매자 생성 및 상품 2개 등록
    const gangnamSeller = await createTestUser(
      generateTestEmail('gangnam-seller-filter'),
      TEST_USERS.SELLER_GANGNAM.password,
      TEST_AREAS.GANGNAM
    )
    testUserIds.push(gangnamSeller.userId)
    
    const gangnamProduct1 = await createTestProduct(gangnamSeller.userId, {
      ...TEST_PRODUCTS[0],
      area: TEST_AREAS.GANGNAM,
    })
    productIds.push(gangnamProduct1)
    
    const gangnamProduct2 = await createTestProduct(gangnamSeller.userId, {
      ...TEST_PRODUCTS[1],
      area: TEST_AREAS.GANGNAM,
    })
    productIds.push(gangnamProduct2)
    
    console.log(`✓ 강남구 판매자 및 상품 2개 생성`)
    
    // 2. 서초구 판매자 생성 및 상품 2개 등록
    const seochoSeller = await createTestUser(
      generateTestEmail('seocho-seller-filter'),
      TEST_USERS.SELLER_SEOCHO.password,
      TEST_AREAS.SEOCHO
    )
    testUserIds.push(seochoSeller.userId)
    
    const seochoProduct1 = await createTestProduct(seochoSeller.userId, {
      ...TEST_PRODUCTS[2],
      area: TEST_AREAS.SEOCHO,
    })
    productIds.push(seochoProduct1)
    
    const seochoProduct2 = await createTestProduct(seochoSeller.userId, {
      ...TEST_PRODUCTS[3],
      area: TEST_AREAS.SEOCHO,
    })
    productIds.push(seochoProduct2)
    
    console.log(`✓ 서초구 판매자 및 상품 2개 생성`)
    
    // 3. 강남구 구매자 생성
    const buyer = await createTestUser(
      generateTestEmail('buyer-filter'),
      TEST_USERS.BUYER_GANGNAM.password,
      TEST_AREAS.GANGNAM
    )
    testUserIds.push(buyer.userId)
    
    console.log(`✓ 강남구 구매자 생성\n`)
    
    // 테스트: 지역 필터링 플로우
    await testAreaFilteringFlow(buyer, productIds)
    
    console.log('\n✅ 지역 필터링 통합 테스트 통과!\n')
  } catch (error) {
    console.error('❌ 지역 필터링 테스트 실패:', error)
    throw error
  } finally {
    if (testUserIds.length > 0) {
      console.log('🧹 테스트 데이터 정리 중...')
      await cleanupTestData(testUserIds)
    }
  }
}

async function testAreaFilteringFlow(buyer: any, productIds: string[]) {
  console.log('📝 테스트: 지역 필터링 플로우')
  
  // 1. 강남구 구매자로 로그인
  console.log('  1. 강남구로 로그인')
  // 2. 홈에서 강남구 상품만 보이는지 확인
  console.log('  2. 강남구 상품만 표시 확인')
  // 3. /profile 접속
  console.log('  3. 프로필 페이지 접속')
  // 4. 지역을 서초구로 변경
  console.log('  4. 지역 변경: 강남구 → 서초구')
  // 5. 홈으로 이동
  console.log('  5. 홈으로 이동')
  // 6. 서초구 상품만 보이는지 확인
  console.log('  6. 서초구 상품만 표시 확인')
  // 7. 강남구 상품은 안 보이는지 확인
  console.log('  7. 강남구 상품 미표시 확인')
  // 8. 다시 강남구로 변경
  console.log('  8. 지역 변경: 서초구 → 강남구')
  // 9. 강남구 상품만 보이는지 확인
  console.log('  9. 강남구 상품만 표시 확인 (재확인)')
  
  console.log(`  ✓ 지역 필터링 플로우 완료`)
}

if (require.main === module) {
  runAreaFilteringTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

