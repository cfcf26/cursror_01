<!-- 311f6bfa-106b-4eb5-ad4b-a1003eacc477 2317f657-9b3c-4928-9a74-91b79851af60 -->
# KiwiMarket MVP 구현 계획

## 현재 상태

- ✅ Next.js 14 프로젝트 세팅 완료 (App Router, TypeScript, Tailwind CSS)
- ✅ 기본 컴포넌트 생성 (Button, Card, Input, Textarea, Header, ProductCard)
- ✅ Supabase 스키마 설계 완료 (profiles, products, chat_rooms, chat_messages)
- ✅ 타입 정의 완료 (`types/index.ts`)
- ⏳ Supabase 프로젝트 연결 필요
- ⏳ 페이지 구현 필요

활성화된 Supabase 프로젝트: **lovable** (ACTIVE_HEALTHY)

## 구현 단계

### 1단계: Supabase 연결 및 클라이언트 설정

**업데이트 필요 파일:**

- `lib/supabase.ts` → `@supabase/ssr` 패턴으로 업그레이드
- `utils/supabase/client.ts` 생성 (클라이언트 컴포넌트용)
- `utils/supabase/server.ts` 생성 (서버 컴포넌트용)
- `utils/supabase/middleware.ts` 생성 (세션 관리용)
- `middleware.ts` 생성 (루트)

**작업 내용:**

```typescript
// 최신 Supabase SSR 패턴 적용
// - createBrowserClient (클라이언트)
// - createServerClient (서버)
// - 쿠키 기반 세션 관리
```

**환경 변수 확인:**

- `.env.local`에 lovable 프로젝트 URL과 ANON_KEY 설정

### 2단계: 데이터베이스 스키마 적용

**작업 내용:**

- Supabase 프로젝트(lovable)에 `docs/supabase-schema.sql` 실행
- 테이블 생성: profiles, products, chat_rooms, chat_messages
- RLS (Row Level Security) 정책 활성화
- 인덱스 생성 (성능 최적화)

**검증:**

- Supabase Dashboard에서 테이블 확인
- RLS 정책 활성화 확인

### 3단계: 인증 시스템 구현

**생성할 파일:**

```
app/
├── auth/
│   ├── login/
│   │   ├── page.tsx (로그인/회원가입 폼)
│   │   └── actions.ts (Server Actions)
│   ├── confirm/
│   │   └── route.ts (이메일 인증 핸들러)
│   ├── signout/
│   │   └── route.ts (로그아웃 핸들러)
│   └── onboarding/
│       ├── page.tsx (지역 정보 입력)
│       └── actions.ts (프로필 생성)
```

**구현 내용:**

- 이메일 기반 회원가입/로그인 (Server Actions 사용)
- 회원가입 후 이메일 인증 플로우
- 프로필 생성 시 지역(area) 필수 입력
- Middleware를 통한 인증 상태 확인

**참조 패턴:**

```typescript
// Server Action 예시
export async function login(formData: FormData) {
  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signInWithPassword(data)
  // ...
}
```

### 4단계: 상품 목록 페이지

**생성할 파일:**

```
app/
├── products/
│   ├── page.tsx (상품 목록 - Server Component)
│   ├── ProductList.tsx (Client Component)
```

**구현 내용:**

- 현재 사용자의 지역(area)과 일치하는 상품만 조회
- ProductCard 컴포넌트 활용
- Server Component에서 데이터 페칭
- 빈 상태 처리 (상품 없을 때)

**RLS 정책 활용:**

```sql
-- 같은 지역의 상품만 조회 가능
WHERE area = (SELECT area FROM profiles WHERE id = auth.uid())
```

### 5단계: 상품 등록 페이지

**생성할 파일:**

```
app/
├── products/
│   ├── new/
│   │   ├── page.tsx (등록 폼)
│   │   └── actions.ts (Server Actions)
```

**구현 내용:**

- 제목, 설명, 가격 입력 폼
- Input, Textarea, Button 컴포넌트 활용
- 판매자의 지역 정보 자동 설정
- 폼 검증 (클라이언트 & 서버)

**데이터 구조:**

```typescript
{
  title: string
  description: string
  price: number
  area: string (자동 설정)
  user_id: UUID (자동 설정)
}
```

### 6단계: 상품 상세 페이지

**생성할 파일:**

```
app/
├── products/
│   ├── [id]/
│   │   ├── page.tsx (상세 정보)
│   │   ├── ProductDetail.tsx (Client Component)
│   │   └── actions.ts (채팅 시작)
```

**구현 내용:**

- 동적 라우팅 활용 (`[id]`)
- 상품 정보 표시 (제목, 설명, 가격, 등록일)
- 판매자 정보 표시 (이메일, 지역)
- "채팅하기" 버튼 (구매자만)
- "배송 요청" 버튼 (개념 전달용, 기능 없음)
- 본인 상품인 경우 수정/삭제 버튼

**채팅 시작 로직:**

```typescript
// chat_rooms 테이블에 채팅방 생성 (없으면)
// 기존 채팅방 있으면 재사용
```

### 7단계: 채팅 기능 구현

**생성할 파일:**

```
app/
├── chat/
│   ├── page.tsx (채팅방 목록)
│   ├── [roomId]/
│   │   ├── page.tsx (채팅방)
│   │   ├── ChatRoom.tsx (Client Component)
│   │   ├── MessageList.tsx
│   │   ├── MessageInput.tsx
│   │   └── actions.ts (메시지 전송)
```

**구현 내용:**

- 채팅방 목록 조회 (Server Component)
- Supabase Realtime을 활용한 실시간 메시지
- 메시지 전송/수신
- 스크롤 자동 이동 (최신 메시지로)

**Realtime 구독 패턴:**

```typescript
supabase
  .channel('chat-messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'chat_messages',
    filter: `room_id=eq.${roomId}`
  }, (payload) => {
    // 새 메시지 추가
  })
  .subscribe()
```

### 8단계: 메인 페이지 및 네비게이션

**업데이트할 파일:**

- `app/page.tsx` (홈 페이지)
- `components/layout/Header.tsx` (네비게이션)

**구현 내용:**

- 홈 페이지: 최근 상품 미리보기
- Header: 로그인 상태에 따른 메뉴 변경
  - 비로그인: "로그인" 버튼
  - 로그인: "상품 등록", "채팅", "내 정보", "로그아웃"

### 9단계: 프로필/설정 페이지

**생성할 파일:**

```
app/
├── profile/
│   ├── page.tsx (프로필 정보)
│   ├── ProfileForm.tsx (Client Component)
│   └── actions.ts (프로필 업데이트)
```

**구현 내용:**

- 사용자 이메일 표시 (읽기 전용)
- 지역 정보 수정
- 내가 등록한 상품 목록

### 10단계: 최종 검증 및 배포 준비

**체크리스트:**

- [ ] 모든 페이지에 적절한 메타데이터 설정
- [ ] 에러 처리 (error.tsx, not-found.tsx)
- [ ] 로딩 상태 (loading.tsx)
- [ ] 반응형 디자인 확인 (모바일)
- [ ] 디자인 시스템 준수 (Sharp Corners, Kiwi Green)
- [ ] TypeScript 타입 에러 없음
- [ ] Linter 에러 없음
- [ ] 환경 변수 문서화

**배포:**

- Vercel에 배포
- 환경 변수 설정 (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

## 기술적 고려사항

### Supabase SSR 패턴 (최신)

- `@supabase/ssr` 패키지 사용
- Server Components: `createServerClient` with cookies
- Client Components: `createBrowserClient`
- Middleware: 세션 자동 갱신

### Next.js App Router 패턴

- Server Components 우선 사용 (데이터 페칭)
- Client Components는 상호작용이 필요한 부분만 (`'use client'`)
- Server Actions for mutations (로그인, 상품 등록 등)
- Dynamic Routes for 상품 상세, 채팅방

### 보안 고려사항

- RLS 정책으로 데이터 접근 제어
- `supabase.auth.getUser()` 사용 (서버에서)
- `supabase.auth.getSession()` 서버에서 사용 금지
- 환경 변수 `.gitignore`에 추가

### 성능 최적화

- Server Components로 초기 로딩 속도 개선
- Realtime 구독 정리 (useEffect cleanup)
- 데이터베이스 인덱스 활용

## 참고 문서

- [Next.js Server-Side Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Next.js App Router](https://nextjs.org/docs/app)

### To-dos

- [ ] Supabase 클라이언트 설정 업데이트 (@supabase/ssr 패턴으로)
- [ ] Supabase 프로젝트에 데이터베이스 스키마 적용
- [ ] 인증 시스템 구현 (로그인, 회원가입, 프로필 생성)
- [ ] 상품 목록 페이지 구현
- [ ] 상품 등록 페이지 구현
- [ ] 상품 상세 페이지 구현
- [ ] 실시간 채팅 기능 구현 (Supabase Realtime)
- [ ] 메인 페이지 및 네비게이션 완성
- [ ] 프로필/설정 페이지 구현
- [ ] 최종 검증, 에러 처리, 배포 준비