# 🥝 KiwiMarket MVP

내 근처에서 미개봉 상품을 사고파는 로컬 마켓플레이스

## 🚀 기술 스택

- **Frontend**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database, Auth, Realtime)
- **Deployment**: Vercel

## 📁 프로젝트 구조

```
.
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root 레이아웃
│   ├── page.tsx           # 홈페이지
│   ├── globals.css        # 글로벌 스타일
│   ├── auth/              # 인증 페이지
│   ├── products/          # 상품 페이지
│   └── chat/              # 채팅 페이지
├── components/            # 재사용 컴포넌트
│   ├── auth/
│   ├── product/
│   ├── chat/
│   └── common/
├── lib/                   # 유틸리티 함수 및 설정
│   └── supabase.ts       # Supabase 클라이언트
├── types/                 # TypeScript 타입 정의
└── public/               # 정적 파일

```

## 🎨 디자인 가이드라인

- **배경색**: White (#FFFFFF)
- **포인트 컬러**: Kiwi Green (#22c55e)
- **텍스트**: Black (#000000)
- **UI 요소**: Sharp corners (모서리 각진 디자인)
- **레이아웃**: 카드 스타일 상품 리스팅
- **반응형**: 모바일 최적화

## ⚙️ 설정 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 Supabase 정보를 입력하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Supabase 데이터베이스 설정

`docs/supabase-schema.sql` 파일의 내용을 Supabase SQL Editor에서 실행하세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📋 주요 기능 (MVP)

- ✅ 이메일 기반 회원가입/로그인
- ✅ 상품 등록 (제목, 설명, 가격)
- ✅ 지역 기반 필터링
- ✅ 실시간 1:1 채팅
- ✅ 배송 요청 버튼 (컨셉 전달용)

## 🚫 MVP 범위 제외

- 이미지 업로드
- 결제 시스템
- 배송 API 연동
- GPS/위치 권한
- 평점/리뷰
- 푸시 알림

## 🧪 테스트

### E2E 테스트

Playwright MCP를 사용한 포괄적인 E2E 테스트가 구현되어 있습니다.

#### 테스트 설정

테스트 실행 전 환경 변수 설정이 필요합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # 테스트용
```

#### 테스트 실행

```bash
npm run test:e2e              # 전체 E2E 테스트 실행
npm run test:e2e:auth         # 인증 테스트만 실행
npm run test:e2e:products     # 상품 테스트만 실행
npm run test:e2e:chat         # 채팅 테스트만 실행
```

#### 테스트 커버리지

- ✅ 인증 플로우 (회원가입, 로그인, 로그아웃)
- ✅ 상품 관리 (목록, 등록, 상세, 수정, 삭제)
- ✅ 채팅 기능 (채팅방 생성, 메시지 송수신, 실시간 업데이트)
- ✅ 프로필 관리 (조회, 지역 변경)
- ✅ 네비게이션 및 UI (헤더, 홈페이지, 반응형)
- ✅ 에러 처리 (폼 검증, 권한, 404)
- ✅ 통합 플로우 (전체 거래 플로우, 지역 필터링)

자세한 내용은 [E2E 테스트 가이드](docs/e2e-testing-guide.md)와 [테스트 커버리지](docs/test-coverage.md)를 참조하세요.

## 📝 문서

- [제품 요구사항 (PRD)](kiwimarket_mvp_prd.md)
- [프로젝트 구조](docs/project-structure.md)
- [Supabase 스키마](docs/supabase-schema.sql)
- [E2E 테스트 가이드](docs/e2e-testing-guide.md)
- [테스트 커버리지](docs/test-coverage.md)
- [채팅 기능 구현 요약](docs/chat-implementation-summary.md)

## 🔧 명령어

### 개발

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 실행
```

### 테스트

```bash
npm run test:e2e              # 전체 E2E 테스트
npm run test:e2e:auth         # 인증 테스트
npm run test:e2e:products     # 상품 테스트
npm run test:e2e:chat         # 채팅 테스트
```

## 📄 라이선스

Private - KiwiMarket MVP

