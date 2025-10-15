# KiwiMarket E2E 테스트 가이드

## 개요

이 문서는 KiwiMarket의 E2E (End-to-End) 테스트를 실행하고 관리하는 방법을 설명합니다. 모든 테스트는 Playwright MCP를 통해 실제 브라우저에서 실행됩니다.

## 환경 설정

### 1. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 설정해야 합니다:

```bash
# Supabase 기본 설정
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 테스트용 Service Role Key (필수)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 테스트 환경 (선택사항)
TEST_BASE_URL=http://localhost:3000
```

⚠️ **주의**: `SUPABASE_SERVICE_ROLE_KEY`는 RLS를 우회할 수 있는 강력한 권한을 가진 키입니다. 절대 공개 저장소에 커밋하지 마세요!

### 2. 개발 서버 실행

테스트를 실행하기 전에 Next.js 개발 서버를 실행해야 합니다:

```bash
npm run dev
```

서버가 `http://localhost:3000`에서 실행 중인지 확인하세요.

## 테스트 실행

### 전체 테스트 실행

모든 E2E 테스트를 순차적으로 실행합니다:

```bash
npm run test:e2e
```

### 카테고리별 테스트 실행

#### 인증 테스트만 실행

```bash
npm run test:e2e:auth
```

회원가입, 로그인, 로그아웃 플로우를 테스트합니다.

#### 상품 테스트만 실행

```bash
npm run test:e2e:products
```

상품 목록, 등록, 상세, 수정, 삭제 기능을 테스트합니다.

#### 채팅 테스트만 실행

```bash
npm run test:e2e:chat
```

채팅방 생성, 메시지 송수신, 실시간 기능을 테스트합니다.

## 테스트 구조

### 디렉토리 구조

```
tests/
├── helpers/
│   ├── test-utils.ts      # 테스트 유틸리티 함수
│   └── fixtures.ts         # 테스트 픽스처 데이터
├── auth/                   # 인증 테스트
│   ├── signup.test.ts
│   ├── login.test.ts
│   └── logout.test.ts
├── products/               # 상품 테스트
│   ├── list.test.ts
│   ├── create.test.ts
│   ├── detail.test.ts
│   └── update-delete.test.ts
├── chat/                   # 채팅 테스트
│   ├── create-room.test.ts
│   ├── messages.test.ts
│   └── room-list.test.ts
├── profile/                # 프로필 테스트
│   ├── view.test.ts
│   └── update-area.test.ts
├── navigation/             # 네비게이션 테스트
│   ├── header.test.ts
│   └── homepage.test.ts
├── ui/                     # UI 테스트
│   └── responsive.test.ts
├── errors/                 # 에러 처리 테스트
│   ├── form-validation.test.ts
│   ├── permissions.test.ts
│   └── not-found.test.ts
├── integration/            # 통합 테스트
│   ├── full-flow.test.ts
│   └── area-filtering.test.ts
└── run-*.js                # 테스트 러너 스크립트
```

### 핵심 유틸리티 함수

#### `createTestUser(email, password, area)`

테스트 사용자를 생성하고 이메일 인증을 자동으로 완료합니다.

```typescript
const user = await createTestUser(
  'test@example.com',
  'Password123!',
  '강남구'
);
```

#### `createTestProduct(userId, data)`

테스트 상품을 생성합니다.

```typescript
const productId = await createTestProduct(userId, {
  title: '테스트 상품',
  description: '설명',
  price: 10000,
  area: '강남구',
});
```

#### `cleanupTestData(userIds)`

테스트 종료 후 생성된 데이터를 정리합니다. Supabase의 CASCADE DELETE가 관련 데이터를 자동으로 삭제합니다.

```typescript
await cleanupTestData([userId1, userId2]);
```

## Playwright MCP 사용법

### 기본 브라우저 작업

#### 페이지 이동

```typescript
// browser_navigate
await navigateTo('http://localhost:3000/auth/login');
```

#### 요소 클릭

```typescript
// browser_click
await click({ element: '로그인 버튼', ref: 'button[type="submit"]' });
```

#### 텍스트 입력

```typescript
// browser_type
await type({
  element: '이메일 입력',
  ref: 'input[name="email"]',
  text: 'test@example.com',
});
```

#### 대기

```typescript
// browser_wait_for
await waitFor({ text: '로그인 성공' });
```

#### 스크린샷

```typescript
// browser_take_screenshot
await takeScreenshot({ filename: 'login-page.png' });
```

### 실시간 메시지 테스트 (탭 사용)

```typescript
// 1. 탭 1: 구매자
await tabs('select', 0);
await type({ element: '메시지 입력', ref: 'input[name="message"]', text: '안녕하세요' });
await click({ element: '전송', ref: 'button[type="submit"]' });

// 2. 탭 2: 판매자
await tabs('new');
await login(sellerEmail, sellerPassword);
await navigateTo(`/chat/${roomId}`);

// 3. 실시간 메시지 수신 대기
await waitFor({ text: '안녕하세요' });
```

## 테스트 데이터 관리

### 데이터 생성 전략

1. **고유한 이메일**: `generateTestEmail()` 함수로 타임스탬프 기반 고유 이메일 생성
2. **사용자 ID 추적**: 생성된 모든 사용자 ID를 배열에 저장
3. **자동 정리**: `try-finally` 블록으로 테스트 실패 시에도 정리 보장

### 예시

```typescript
export async function runMyTest() {
  const testUserIds: string[] = [];
  
  try {
    // 테스트 사용자 생성
    const user = await createTestUser(
      generateTestEmail('mytest'),
      'Password123!',
      '강남구'
    );
    testUserIds.push(user.userId);
    
    // 테스트 수행
    // ...
    
  } catch (error) {
    console.error('테스트 실패:', error);
    throw error;
  } finally {
    // 항상 정리
    if (testUserIds.length > 0) {
      await cleanupTestData(testUserIds);
    }
  }
}
```

## 새로운 테스트 추가하기

### 1. 테스트 파일 생성

적절한 디렉토리에 `*.test.ts` 파일을 생성합니다.

```typescript
// tests/my-feature/my-test.test.ts

import {
  createTestUser,
  cleanupTestData,
  generateTestEmail,
} from '../helpers/test-utils';

export async function runMyTest() {
  console.log('🧪 나의 테스트 시작...\n');
  
  const testUserIds: string[] = [];
  
  try {
    // 테스트 로직
    
    console.log('✅ 테스트 통과!\n');
  } catch (error) {
    console.error('❌ 테스트 실패:', error);
    throw error;
  } finally {
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

### 2. 테스트 러너에 추가

`tests/run-all-tests.js`의 `testSuites` 배열에 추가:

```javascript
const testSuites = [
  // ... 기존 테스트들
  { name: '나의 기능', path: './my-feature/my-test.test.ts' },
];
```

## 디버깅 팁

### 1. 스크린샷 활용

테스트 중 특정 시점의 화면을 캡처하여 확인:

```typescript
await takeScreenshot({ filename: 'debug-step-1.png' });
```

### 2. 콘솔 로그 확인

브라우저 콘솔 메시지 확인:

```typescript
const consoleMessages = await getConsoleMessages({ onlyErrors: true });
```

### 3. 네트워크 요청 확인

API 요청 실패 여부 확인:

```typescript
const networkRequests = await getNetworkRequests();
```

### 4. 개별 테스트 실행

특정 테스트 파일만 직접 실행:

```bash
node tests/auth/login.test.ts
```

## 모범 사례

### 1. 테스트 독립성

- 각 테스트는 다른 테스트에 의존하지 않아야 합니다
- 필요한 데이터는 테스트 내에서 직접 생성합니다

### 2. 데이터 정리

- 항상 `try-finally` 블록을 사용하여 데이터를 정리합니다
- `cleanupTestData()` 함수를 사용하여 CASCADE DELETE 활용

### 3. 고유한 데이터

- `generateTestEmail()` 등의 함수로 고유한 테스트 데이터 생성
- 테스트 간 데이터 충돌 방지

### 4. 명확한 로그

- 각 테스트 단계를 명확히 로그로 남깁니다
- 실패 시 디버깅이 쉽도록 합니다

### 5. 적절한 대기

- `browser_wait_for`를 사용하여 요소나 텍스트가 나타날 때까지 대기
- 실시간 기능은 충분한 대기 시간 설정

## 문제 해결

### Service Role Key 오류

```
Error: SUPABASE_SERVICE_ROLE_KEY 환경 변수가 설정되지 않았습니다.
```

**해결**: `.env.local` 파일에 `SUPABASE_SERVICE_ROLE_KEY` 추가

### 서버 연결 오류

```
Error: ECONNREFUSED localhost:3000
```

**해결**: `npm run dev`로 개발 서버가 실행 중인지 확인

### 테스트 데이터 정리 실패

**해결**: Supabase 콘솔에서 수동으로 테스트 데이터 삭제 후 재시도

## 참고 자료

- [Supabase 문서](https://supabase.com/docs)
- [Playwright 문서](https://playwright.dev/)
- [프로젝트 구조](./project-structure.md)
- [Supabase 스키마](./supabase-schema.sql)

