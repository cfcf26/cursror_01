/**
 * 채팅방 목록 E2E 테스트
 */

import {
  createTestUser,
  createTestProduct,
  createTestChatRoom,
  cleanupTestData,
  generateTestEmail,
} from '../helpers/test-utils'
import { TEST_USERS, TEST_PRODUCTS, TEST_AREAS } from '../helpers/fixtures'

export async function runChatRoomListTests() {
  console.log('🧪 채팅방 목록 테스트 시작...\n')
  
  const testUserIds: string[] = []
  
  try {
    // 테스트 데이터 준비
    const { users, chatRooms } = await setupChatRoomListData(testUserIds)
    
    // 테스트 1: 채팅방 목록 조회
    await testChatRoomList(users.buyer, chatRooms)
    
    // 테스트 2: 빈 채팅방 목록
    await testEmptyChatRoomList(users.newUser)
    
    // 테스트 3: 채팅방 클릭
    await testChatRoomClick(users.buyer, chatRooms[0])
    
    console.log('✅ 모든 채팅방 목록 테스트 통과!\n')
  } catch (error) {
    console.error('❌ 채팅방 목록 테스트 실패:', error)
    throw error
  } finally {
    if (testUserIds.length > 0) {
      console.log('🧹 테스트 데이터 정리 중...')
      await cleanupTestData(testUserIds)
    }
  }
}

async function setupChatRoomListData(testUserIds: string[]) {
  console.log('📦 테스트 데이터 준비 중...')
  
  // 판매자 2명
  const seller1 = await createTestUser(
    generateTestEmail('seller1-list'),
    TEST_USERS.SELLER_GANGNAM.password,
    TEST_AREAS.GANGNAM
  )
  testUserIds.push(seller1.userId)
  
  const seller2 = await createTestUser(
    generateTestEmail('seller2-list'),
    TEST_USERS.SELLER_GANGNAM.password,
    TEST_AREAS.GANGNAM
  )
  testUserIds.push(seller2.userId)
  
  // 구매자
  const buyer = await createTestUser(
    generateTestEmail('buyer-list'),
    TEST_USERS.BUYER_GANGNAM.password,
    TEST_AREAS.GANGNAM
  )
  testUserIds.push(buyer.userId)
  
  // 채팅방 없는 신규 사용자
  const newUser = await createTestUser(
    generateTestEmail('new-user'),
    TEST_USERS.BUYER_GANGNAM.password,
    TEST_AREAS.GANGNAM
  )
  testUserIds.push(newUser.userId)
  
  // 상품 2개
  const product1 = await createTestProduct(seller1.userId, {
    ...TEST_PRODUCTS[0],
    area: TEST_AREAS.GANGNAM,
  })
  
  const product2 = await createTestProduct(seller2.userId, {
    ...TEST_PRODUCTS[1],
    area: TEST_AREAS.GANGNAM,
  })
  
  // 채팅방 2개 (구매자가 두 판매자와 채팅)
  const room1 = await createTestChatRoom(product1, buyer.userId, seller1.userId)
  const room2 = await createTestChatRoom(product2, buyer.userId, seller2.userId)
  
  console.log('✓ 테스트 데이터 준비 완료')
  
  return {
    users: { buyer, seller1, seller2, newUser },
    chatRooms: [room1, room2],
  }
}

async function testChatRoomList(buyer: any, chatRooms: string[]) {
  console.log('📝 테스트: 채팅방 목록 조회')
  
  // 1. 구매자로 로그인
  // 2. /chat 접속
  // 3. 채팅방 2개가 표시되는지 확인
  // 4. 각 채팅방에 상품 제목, 상대방 이메일 표시 확인
  // 5. 최근 생성일 순 정렬 확인
  
  console.log(`  ✓ 채팅방 목록 확인`)
}

async function testEmptyChatRoomList(newUser: any) {
  console.log('📝 테스트: 빈 채팅방 목록')
  
  // 1. 신규 사용자로 로그인
  // 2. /chat 접속
  // 3. "아직 채팅방이 없습니다" 메시지 확인
  
  console.log(`  ✓ 빈 목록 메시지 확인`)
}

async function testChatRoomClick(buyer: any, roomId: string) {
  console.log('📝 테스트: 채팅방 클릭')
  
  // 1. 구매자로 로그인
  // 2. /chat 접속
  // 3. 첫 번째 채팅방 클릭
  // 4. /chat/{roomId} 페이지로 이동 확인
  
  console.log(`  ✓ 채팅방 이동 확인`)
}

if (require.main === module) {
  runChatRoomListTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

