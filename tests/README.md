# KiwiMarket E2E 테스트

이 디렉토리는 KiwiMarket의 E2E (End-to-End) 테스트를 포함하고 있습니다.

## 📁 디렉토리 구조

```
tests/
├── README.md                    # 이 파일
├── helpers/                     # 테스트 헬퍼 유틸리티
│   ├── test-utils.ts           # 테스트 데이터 생성 및 정리 함수
│   └── fixtures.ts             # 테스트 픽스처 및 상수
│
├── auth/                        # 인증 플로우 테스트
│   ├── signup.test.ts          # 회원가입
│   ├── login.test.ts           # 로그인
│   └── logout.test.ts          # 로그아웃
│
├── products/                    # 상품 관리 테스트
│   ├── list.test.ts            # 상품 목록 조회
│   ├── create.test.ts          # 상품 등록
│   ├── detail.test.ts          # 상품 상세 조회
│   └── update-delete.test.ts   # 상품 수정/삭제
│
├── chat/                        # 채팅 기능 테스트
│   ├── create-room.test.ts     # 채팅방 생성
│   ├── messages.test.ts        # 메시지 송수신
│   └── room-list.test.ts       # 채팅방 목록
│
├── profile/                     # 프로필 관리 테스트
│   ├── view.test.ts            # 프로필 조회
│   └── update-area.test.ts     # 지역 변경
│
├── navigation/                  # 네비게이션 테스트
│   ├── header.test.ts          # 헤더 네비게이션
│   └── homepage.test.ts        # 홈페이지 UI
│
├── ui/                          # UI 테스트
│   └── responsive.test.ts      # 반응형 레이아웃
│
├── errors/                      # 에러 처리 테스트
│   ├── form-validation.test.ts # 폼 검증
│   ├── permissions.test.ts     # 권한 오류
│   └── not-found.test.ts       # 404 에러
│
├── integration/                 # 통합 플로우 테스트
│   ├── full-flow.test.ts       # 전체 거래 플로우
│   └── area-filtering.test.ts  # 지역 필터링 플로우
│
└── run-*.js                     # 테스트 러너 스크립트
    ├── run-all-tests.js        # 전체 테스트 실행
    ├── run-auth-tests.js       # 인증 테스트 실행
    ├── run-product-tests.js    # 상품 테스트 실행
    └── run-chat-tests.js       # 채팅 테스트 실행
```

## 🚀 빠른 시작

### 1. 환경 변수 설정

`.env.local` 파일에 다음을 추가:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 테스트 실행

```bash
# 전체 테스트
npm run test:e2e

# 카테고리별 테스트
npm run test:e2e:auth      # 인증
npm run test:e2e:products  # 상품
npm run test:e2e:chat      # 채팅
```

## 📚 핵심 헬퍼 함수

### `test-utils.ts`

- `getSupabaseAdminClient()` - RLS 우회 Admin 클라이언트
- `createTestUser(email, password, area)` - 테스트 사용자 생성
- `createTestProduct(userId, data)` - 테스트 상품 생성
- `createTestChatRoom(productId, buyerId, sellerId)` - 채팅방 생성
- `cleanupTestData(userIds)` - 테스트 데이터 정리
- `generateTestEmail(prefix)` - 고유 이메일 생성

### `fixtures.ts`

- `TEST_AREAS` - 테스트용 지역 상수
- `TEST_PRODUCTS` - 테스트용 상품 템플릿
- `TEST_MESSAGES` - 테스트용 메시지
- `TEST_USERS` - 테스트용 사용자 템플릿
- `TEST_CONFIG` - 테스트 설정
- `SELECTORS` - CSS 셀렉터 상수

## ✅ 테스트 커버리지

- **인증** (3개): 회원가입, 로그인, 로그아웃
- **상품** (4개): 목록, 등록, 상세, 수정/삭제
- **채팅** (3개): 채팅방 생성, 메시지, 목록
- **프로필** (2개): 조회, 지역 변경
- **네비게이션** (2개): 헤더, 홈페이지
- **UI** (1개): 반응형
- **에러** (3개): 폼 검증, 권한, 404
- **통합** (2개): 전체 플로우, 지역 필터링

**총 20개 테스트 스위트**

## 📖 문서

자세한 가이드는 다음 문서를 참조하세요:

- [E2E 테스트 가이드](../docs/e2e-testing-guide.md)
- [테스트 커버리지](../docs/test-coverage.md)

## 🔧 테스트 작성 예시

```typescript
import {
  createTestUser,
  cleanupTestData,
  generateTestEmail,
} from '../helpers/test-utils';
import { TEST_USERS, TEST_AREAS } from '../helpers/fixtures';

export async function runMyTest() {
  console.log('🧪 나의 테스트 시작...\n');
  
  const testUserIds: string[] = [];
  
  try {
    // 테스트 사용자 생성
    const user = await createTestUser(
      generateTestEmail('mytest'),
      TEST_USERS.SELLER_GANGNAM.password,
      TEST_AREAS.GANGNAM
    );
    testUserIds.push(user.userId);
    
    // Playwright MCP를 통한 브라우저 테스트
    // ...
    
    console.log('✅ 테스트 통과!\n');
  } catch (error) {
    console.error('❌ 테스트 실패:', error);
    throw error;
  } finally {
    // 항상 데이터 정리
    if (testUserIds.length > 0) {
      await cleanupTestData(testUserIds);
    }
  }
}

if (require.main === module) {
  runMyTest()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
```

## 🎯 테스트 원칙

1. **독립성**: 각 테스트는 서로 독립적이어야 함
2. **자동 정리**: 테스트 종료 시 생성된 데이터 자동 삭제
3. **고유 데이터**: 타임스탬프 기반 고유 이메일 사용
4. **명확한 로그**: 각 단계를 명확히 로깅
5. **실시간 테스트**: Supabase Realtime 기능 검증

## ⚠️ 주의사항

- `SUPABASE_SERVICE_ROLE_KEY`는 절대 공개 저장소에 커밋하지 마세요
- 테스트는 항상 개발 서버가 실행 중인 상태에서 실행해야 합니다
- 테스트 데이터는 CASCADE DELETE로 자동 정리됩니다
- 실패한 테스트의 데이터도 `finally` 블록에서 정리됩니다

