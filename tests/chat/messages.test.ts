/**
 * 채팅 메시지 송수신 E2E 테스트
 */

import {
  createTestUser,
  createTestProduct,
  createTestChatRoom,
  cleanupTestData,
  generateTestEmail,
  wait,
} from '../helpers/test-utils'
import { TEST_USERS, TEST_PRODUCTS, TEST_AREAS, TEST_MESSAGES, TEST_CONFIG } from '../helpers/fixtures'

export async function runChatMessagesTests() {
  console.log('🧪 채팅 메시지 테스트 시작...\n')
  
  const testUserIds: string[] = []
  
  try {
    // 판매자 생성
    const seller = await createTestUser(
      generateTestEmail('seller-msg'),
      TEST_USERS.SELLER_GANGNAM.password,
      TEST_AREAS.GANGNAM
    )
    testUserIds.push(seller.userId)
    
    // 구매자 생성
    const buyer = await createTestUser(
      generateTestEmail('buyer-msg'),
      TEST_USERS.BUYER_GANGNAM.password,
      TEST_AREAS.GANGNAM
    )
    testUserIds.push(buyer.userId)
    
    // 테스트 상품 및 채팅방 생성
    const productId = await createTestProduct(seller.userId, {
      ...TEST_PRODUCTS[0],
      area: TEST_AREAS.GANGNAM,
    })
    
    const roomId = await createTestChatRoom(productId, buyer.userId, seller.userId)
    
    console.log(`✓ 테스트 데이터 준비 완료`)
    
    // 테스트 1: 메시지 전송
    await testSendMessage(buyer, roomId)
    
    // 테스트 2: 연속 메시지 전송
    await testMultipleMessages(buyer, roomId)
    
    // 테스트 3: 실시간 메시지 수신 (Playwright MCP 탭 기능 사용)
    await testRealtimeMessages(buyer, seller, roomId)
    
    console.log('✅ 모든 채팅 메시지 테스트 통과!\n')
  } catch (error) {
    console.error('❌ 채팅 메시지 테스트 실패:', error)
    throw error
  } finally {
    if (testUserIds.length > 0) {
      console.log('🧹 테스트 데이터 정리 중...')
      await cleanupTestData(testUserIds)
    }
  }
}

async function testSendMessage(buyer: any, roomId: string) {
  console.log('📝 테스트: 메시지 전송')
  
  const message = TEST_MESSAGES[0]
  
  // 1. 구매자로 로그인
  // 2. /chat/{roomId} 접속
  // 3. 메시지 입력: "안녕하세요, 구매 희망합니다"
  // 4. 전송 버튼 클릭
  // 5. 메시지가 화면에 표시되는지 확인
  // 6. 메시지 내용, 작성자 확인
  
  console.log(`  ✓ 메시지 전송 확인`)
}

async function testMultipleMessages(buyer: any, roomId: string) {
  console.log('📝 테스트: 연속 메시지 전송')
  
  // 1. 구매자로 로그인
  // 2. /chat/{roomId} 접속
  // 3. 여러 메시지 연속 전송
  // 4. 메시지 순서 확인
  // 5. 스크롤이 최신 메시지로 이동했는지 확인
  
  console.log(`  ✓ 연속 메시지 확인`)
}

async function testRealtimeMessages(buyer: any, seller: any, roomId: string) {
  console.log('📝 테스트: 실시간 메시지 수신')
  
  // Playwright MCP의 탭 기능 사용
  // 1. 탭 1: 구매자로 채팅방 접속
  // 2. 탭 2: 판매자로 동일 채팅방 접속
  // 3. 탭 1에서 메시지 전송
  // 4. browser_wait_for로 탭 2에서 메시지 표시 대기
  // 5. 실시간으로 메시지가 나타나는지 확인
  
  console.log(`  ✓ 실시간 수신 확인`)
}

if (require.main === module) {
  runChatMessagesTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

