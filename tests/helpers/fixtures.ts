/**
 * 테스트용 픽스처 데이터
 */

export const TEST_AREAS = {
  GANGNAM: '강남구',
  SEOCHO: '서초구',
  SONGPA: '송파구',
  GANGDONG: '강동구',
}

export const TEST_PRODUCTS = [
  {
    title: '테스트 상품 1',
    description: '테스트용 상품 설명입니다. 미개봉 새 상품입니다.',
    price: 10000,
  },
  {
    title: '테스트 상품 2',
    description: '두 번째 테스트 상품입니다. 거의 새 것처럼 깨끗합니다.',
    price: 20000,
  },
  {
    title: '노트북',
    description: '맥북 프로 16인치 미개봉 상품입니다.',
    price: 3000000,
  },
  {
    title: '아이폰',
    description: '아이폰 15 Pro 256GB 미개봉',
    price: 1500000,
  },
  {
    title: '에어팟',
    description: '에어팟 프로 2세대 미개봉',
    price: 350000,
  },
]

export const TEST_MESSAGES = [
  '안녕하세요, 구매 희망합니다.',
  '가격 협상 가능한가요?',
  '네, 가능합니다.',
  '직거래 가능한 시간이 언제인가요?',
  '오후 6시 이후면 됩니다.',
  '좋습니다. 내일 오후 6시에 만나요.',
]

export const DEFAULT_PASSWORD = 'Test1234!@#$'

/**
 * 테스트 사용자 템플릿
 */
export interface TestUserTemplate {
  emailPrefix: string
  password: string
  area: string
}

export const TEST_USERS = {
  SELLER_GANGNAM: {
    emailPrefix: 'seller-gangnam',
    password: DEFAULT_PASSWORD,
    area: TEST_AREAS.GANGNAM,
  } as TestUserTemplate,
  
  BUYER_GANGNAM: {
    emailPrefix: 'buyer-gangnam',
    password: DEFAULT_PASSWORD,
    area: TEST_AREAS.GANGNAM,
  } as TestUserTemplate,
  
  USER_SEOCHO: {
    emailPrefix: 'user-seocho',
    password: DEFAULT_PASSWORD,
    area: TEST_AREAS.SEOCHO,
  } as TestUserTemplate,
  
  SELLER_SEOCHO: {
    emailPrefix: 'seller-seocho',
    password: DEFAULT_PASSWORD,
    area: TEST_AREAS.SEOCHO,
  } as TestUserTemplate,
}

/**
 * 테스트 환경 설정
 */
export const TEST_CONFIG = {
  BASE_URL: process.env.TEST_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 30000, // 30초
  WAIT_FOR_NAVIGATION: 5000, // 5초
  WAIT_FOR_ELEMENT: 3000, // 3초
  REALTIME_WAIT: 2000, // 실시간 업데이트 대기 시간 2초
}

/**
 * 셀렉터 상수
 */
export const SELECTORS = {
  // 헤더
  HEADER_LOGIN_LINK: 'a[href="/auth/login"]',
  HEADER_LOGOUT_BUTTON: 'button:has-text("로그아웃")',
  HEADER_PROFILE_LINK: 'a[href="/profile"]',
  HEADER_CHAT_LINK: 'a[href="/chat"]',
  HEADER_NEW_PRODUCT_LINK: 'a[href="/products/new"]',
  
  // 로그인/회원가입
  LOGIN_EMAIL_INPUT: 'input[name="email"]',
  LOGIN_PASSWORD_INPUT: 'input[name="password"]',
  LOGIN_SUBMIT_BUTTON: 'button[type="submit"]',
  
  // 온보딩
  ONBOARDING_AREA_INPUT: 'input[name="area"]',
  ONBOARDING_SUBMIT_BUTTON: 'button[type="submit"]',
  
  // 상품
  PRODUCT_TITLE_INPUT: 'input[name="title"]',
  PRODUCT_DESCRIPTION_TEXTAREA: 'textarea[name="description"]',
  PRODUCT_PRICE_INPUT: 'input[name="price"]',
  PRODUCT_SUBMIT_BUTTON: 'button[type="submit"]',
  PRODUCT_CARD: '[data-testid="product-card"]',
  PRODUCT_CHAT_BUTTON: 'button:has-text("채팅하기")',
  
  // 채팅
  CHAT_MESSAGE_INPUT: 'input[name="message"]',
  CHAT_SEND_BUTTON: 'button[type="submit"]',
  CHAT_MESSAGE_LIST: '[data-testid="message-list"]',
  CHAT_ROOM_CARD: '[data-testid="chat-room-card"]',
  
  // 프로필
  PROFILE_AREA_INPUT: 'input[name="area"]',
  PROFILE_SUBMIT_BUTTON: 'button[type="submit"]',
  
  // 공통
  ERROR_MESSAGE: '[role="alert"]',
  SUCCESS_MESSAGE: '[role="status"]',
}

