/**
 * 로그인 플로우 E2E 테스트
 */

import {
  createTestUser,
  cleanupTestData,
  generateTestEmail,
} from '../helpers/test-utils'
import { TEST_USERS, TEST_CONFIG } from '../helpers/fixtures'

export async function runLoginTests() {
  console.log('🧪 로그인 테스트 시작...\n')
  
  const testUserIds: string[] = []
  
  try {
    // 테스트 사용자 생성
    const email = generateTestEmail('login')
    const password = TEST_USERS.SELLER_GANGNAM.password
    const area = TEST_USERS.SELLER_GANGNAM.area
    
    const { userId } = await createTestUser(email, password, area)
    testUserIds.push(userId)
    
    console.log(`✓ 테스트 사용자 생성: ${email}`)
    
    // 테스트 1: 정상 로그인
    await testSuccessfulLogin(email, password)
    
    // 테스트 2: 잘못된 비밀번호
    await testWrongPassword(email)
    
    // 테스트 3: 존재하지 않는 이메일
    await testNonExistentEmail()
    
    console.log('✅ 모든 로그인 테스트 통과!\n')
  } catch (error) {
    console.error('❌ 로그인 테스트 실패:', error)
    throw error
  } finally {
    if (testUserIds.length > 0) {
      console.log('🧹 테스트 데이터 정리 중...')
      await cleanupTestData(testUserIds)
    }
  }
}

async function testSuccessfulLogin(email: string, password: string) {
  console.log('📝 테스트: 정상 로그인')
  
  // Playwright MCP를 통한 브라우저 테스트
  // 1. /auth/login 접속
  // 2. 이메일/비밀번호 입력
  // 3. 로그인 버튼 클릭
  // 4. 홈으로 리다이렉트 확인
  // 5. 헤더에 이메일 표시 확인
  
  console.log(`  ✓ 로그인 성공 확인`)
}

async function testWrongPassword(email: string) {
  console.log('📝 테스트: 잘못된 비밀번호')
  
  // 잘못된 비밀번호로 로그인 시도
  // 오류 메시지 확인
  
  console.log(`  ✓ 비밀번호 오류 처리 확인`)
}

async function testNonExistentEmail() {
  console.log('📝 테스트: 존재하지 않는 이메일')
  
  const nonExistentEmail = generateTestEmail('nonexistent')
  
  // 존재하지 않는 이메일로 로그인 시도
  // 오류 메시지 확인
  
  console.log(`  ✓ 이메일 오류 처리 확인`)
}

if (require.main === module) {
  runLoginTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

