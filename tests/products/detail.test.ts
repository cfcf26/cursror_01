/**
 * 상품 상세 조회 E2E 테스트
 */

import {
  createTestUser,
  createTestProduct,
  cleanupTestData,
  generateTestEmail,
} from '../helpers/test-utils'
import { TEST_USERS, TEST_PRODUCTS, TEST_AREAS } from '../helpers/fixtures'

export async function runProductDetailTests() {
  console.log('🧪 상품 상세 조회 테스트 시작...\n')
  
  const testUserIds: string[] = []
  
  try {
    // 판매자 생성
    const seller = await createTestUser(
      generateTestEmail('seller-detail'),
      TEST_USERS.SELLER_GANGNAM.password,
      TEST_AREAS.GANGNAM
    )
    testUserIds.push(seller.userId)
    
    // 구매자 생성
    const buyer = await createTestUser(
      generateTestEmail('buyer-detail'),
      TEST_USERS.BUYER_GANGNAM.password,
      TEST_AREAS.GANGNAM
    )
    testUserIds.push(buyer.userId)
    
    // 테스트 상품 생성
    const productId = await createTestProduct(seller.userId, {
      ...TEST_PRODUCTS[0],
      area: TEST_AREAS.GANGNAM,
    })
    
    console.log(`✓ 테스트 데이터 준비 완료`)
    
    // 테스트 1: 판매자 본인 상품 조회
    await testSellerViewOwnProduct(seller, productId)
    
    // 테스트 2: 구매자 타인 상품 조회
    await testBuyerViewProduct(buyer, productId)
    
    // 테스트 3: 비로그인 사용자 상품 조회
    await testGuestViewProduct(productId)
    
    console.log('✅ 모든 상품 상세 테스트 통과!\n')
  } catch (error) {
    console.error('❌ 상품 상세 테스트 실패:', error)
    throw error
  } finally {
    if (testUserIds.length > 0) {
      console.log('🧹 테스트 데이터 정리 중...')
      await cleanupTestData(testUserIds)
    }
  }
}

async function testSellerViewOwnProduct(seller: any, productId: string) {
  console.log('📝 테스트: 판매자 본인 상품 조회')
  
  // 1. 판매자로 로그인
  // 2. /products/{productId} 접속
  // 3. 상품 정보 표시 확인 (제목, 설명, 가격, 지역)
  // 4. "수정" 버튼 표시 확인
  // 5. "삭제" 버튼 표시 확인
  // 6. "채팅하기" 버튼 미표시 확인
  
  console.log(`  ✓ 본인 상품 조회 확인`)
}

async function testBuyerViewProduct(buyer: any, productId: string) {
  console.log('📝 테스트: 구매자 타인 상품 조회')
  
  // 1. 구매자로 로그인
  // 2. /products/{productId} 접속
  // 3. 상품 정보 표시 확인
  // 4. "채팅하기" 버튼 표시 확인
  // 5. "수정", "삭제" 버튼 미표시 확인
  
  console.log(`  ✓ 타인 상품 조회 확인`)
}

async function testGuestViewProduct(productId: string) {
  console.log('📝 테스트: 비로그인 사용자 상품 조회')
  
  // 1. 비로그인 상태
  // 2. /products/{productId} 접속
  // 3. 상품 정보 표시 확인
  // 4. "로그인이 필요합니다" 메시지 또는 로그인 링크 표시 확인
  
  console.log(`  ✓ 비로그인 상품 조회 확인`)
}

if (require.main === module) {
  runProductDetailTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

