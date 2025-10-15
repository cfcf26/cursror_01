# 📁 KiwiMarket 프로젝트 구조

## 전체 구조

```
kiwimarket/
├── app/                        # Next.js 14 App Router
│   ├── layout.tsx             # Root 레이아웃
│   ├── page.tsx               # 홈페이지
│   └── globals.css            # 글로벌 스타일
│
├── components/                # 재사용 가능한 컴포넌트
│   ├── common/               # 공통 UI 컴포넌트
│   │   ├── Button.tsx       # 버튼 컴포넌트
│   │   ├── Card.tsx         # 카드 컴포넌트
│   │   ├── Input.tsx        # 인풋 컴포넌트
│   │   └── Textarea.tsx     # 텍스트영역 컴포넌트
│   │
│   ├── layout/              # 레이아웃 컴포넌트
│   │   └── Header.tsx       # 헤더 컴포넌트
│   │
│   └── product/             # 상품 관련 컴포넌트
│       └── ProductCard.tsx  # 상품 카드 컴포넌트
│
├── docs/                      # 문서
│   ├── setup-guide.md        # 설정 가이드
│   ├── supabase-schema.sql   # DB 스키마
│   └── project-structure.md  # 프로젝트 구조 (이 파일)
│
├── lib/                       # 유틸리티 및 설정
│   └── supabase.ts           # Supabase 클라이언트
│
├── types/                     # TypeScript 타입 정의
│   └── index.ts              # 공통 타입
│
├── public/                    # 정적 파일 (이미지 등)
│
├── .env.local                # 환경 변수 (로컬)
├── .env.local.example        # 환경 변수 예시
├── .gitignore               # Git 무시 파일
├── next.config.js           # Next.js 설정
├── tailwind.config.ts       # Tailwind CSS 설정
├── tsconfig.json            # TypeScript 설정
├── postcss.config.js        # PostCSS 설정
├── package.json             # 패키지 정보
└── README.md                # 프로젝트 README

```

## 다음 단계로 추가할 페이지

프로젝트가 진행되면서 다음 페이지들을 추가할 예정입니다:

```
app/
├── auth/                    # 인증 관련 페이지
│   ├── login/
│   │   └── page.tsx        # 로그인 페이지
│   ├── signup/
│   │   └── page.tsx        # 회원가입 페이지
│   └── onboarding/
│       └── page.tsx        # 온보딩 (지역 설정)
│
├── products/               # 상품 관련 페이지
│   ├── page.tsx           # 상품 목록
│   ├── new/
│   │   └── page.tsx       # 상품 등록
│   └── [id]/
│       └── page.tsx       # 상품 상세
│
└── chat/                  # 채팅 관련 페이지
    ├── page.tsx          # 채팅 목록
    └── [roomId]/
        └── page.tsx      # 채팅방
```

## 컴포넌트 추가 계획

```
components/
├── auth/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── OnboardingForm.tsx
│
├── product/
│   ├── ProductList.tsx
│   ├── ProductForm.tsx
│   └── ProductDetail.tsx
│
└── chat/
    ├── ChatList.tsx
    ├── ChatRoom.tsx
    └── MessageBubble.tsx
```

## 주요 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS (Kiwi Green 커스텀 컬러)
- **Backend**: Supabase (Database, Auth, Realtime)
- **Deployment**: Vercel

## 디자인 시스템

### 색상 팔레트
- **Primary (Kiwi Green)**: `#22c55e` (`kiwi-500`)
- **Background**: `#FFFFFF` (White)
- **Text**: `#000000` (Black)

### 디자인 원칙
- Sharp corners (날카로운 모서리, 둥근 테두리 없음)
- 2px 테두리 사용
- 카드 기반 레이아웃
- 모바일 우선 반응형 디자인

