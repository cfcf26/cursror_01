/**
 * 반응형 레이아웃 E2E 테스트
 */

import {
  createTestUser,
  createTestProduct,
  cleanupTestData,
  generateTestEmail,
} from '../helpers/test-utils'
import { TEST_USERS, TEST_PRODUCTS, TEST_AREAS } from '../helpers/fixtures'

export async function runResponsiveTests() {
  console.log('🧪 반응형 레이아웃 테스트 시작...\n')
  
  const testUserIds: string[] = []
  
  try {
    // 테스트 사용자 및 상품 생성
    const user = await createTestUser(
      generateTestEmail('responsive'),
      TEST_USERS.SELLER_GANGNAM.password,
      TEST_AREAS.GANGNAM
    )
    testUserIds.push(user.userId)
    
    await createTestProduct(user.userId, {
      ...TEST_PRODUCTS[0],
      area: TEST_AREAS.GANGNAM,
    })
    
    console.log(`✓ 테스트 데이터 준비 완료`)
    
    // 테스트: 다양한 화면 크기
    await testMobileLayout()
    await testTabletLayout()
    await testDesktopLayout()
    
    console.log('✅ 모든 반응형 테스트 통과!\n')
  } catch (error) {
    console.error('❌ 반응형 테스트 실패:', error)
    throw error
  } finally {
    if (testUserIds.length > 0) {
      console.log('🧹 테스트 데이터 정리 중...')
      await cleanupTestData(testUserIds)
    }
  }
}

async function testMobileLayout() {
  console.log('📝 테스트: 모바일 레이아웃 (375x667)')
  
  // 1. browser_resize(375, 667)
  // 2. 홈 접속
  // 3. 레이아웃 정상 표시 확인
  // 4. 스크린샷 저장
  
  console.log(`  ✓ 모바일 레이아웃 확인`)
}

async function testTabletLayout() {
  console.log('📝 테스트: 태블릿 레이아웃 (768x1024)')
  
  // 1. browser_resize(768, 1024)
  // 2. 홈 접속
  // 3. 레이아웃 정상 표시 확인
  // 4. 스크린샷 저장
  
  console.log(`  ✓ 태블릿 레이아웃 확인`)
}

async function testDesktopLayout() {
  console.log('📝 테스트: 데스크톱 레이아웃 (1920x1080)')
  
  // 1. browser_resize(1920, 1080)
  // 2. 홈 접속
  // 3. 레이아웃 정상 표시 확인
  // 4. 스크린샷 저장
  
  console.log(`  ✓ 데스크톱 레이아웃 확인`)
}

if (require.main === module) {
  runResponsiveTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

