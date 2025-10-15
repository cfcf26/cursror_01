# KiwiMarket 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 새 프로젝트 생성
2. 프로젝트 이름: `kiwimarket-mvp`
3. 데이터베이스 비밀번호 설정
4. 리전 선택 (한국이면 Northeast Asia 권장)

## 2. 데이터베이스 스키마 설정

1. Supabase 대시보드에서 **SQL Editor** 열기
2. `docs/supabase-schema.sql` 파일의 내용을 복사
3. SQL Editor에 붙여넣고 실행 (Run)
4. 성공 메시지 확인

## 3. Supabase 인증 설정

1. **Authentication** > **Providers** 메뉴로 이동
2. **Email** 프로바이더 활성화
3. **Email Templates** 설정 (선택사항):
   - 회원가입 확인 이메일
   - 비밀번호 재설정 이메일

## 4. 환경 변수 설정

1. Supabase 대시보드에서 **Settings** > **API** 메뉴로 이동
2. 다음 정보를 복사:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. 프로젝트 루트에 `.env.local` 파일 생성:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. 로컬 개발 환경 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 6. 테스트 데이터 생성 (선택사항)

Supabase SQL Editor에서 실행:

```sql
-- 테스트 지역 데이터
INSERT INTO public.profiles (id, email, area) VALUES
('00000000-0000-0000-0000-000000000001', 'test1@example.com', '강남구'),
('00000000-0000-0000-0000-000000000002', 'test2@example.com', '강남구');

-- 테스트 상품 데이터
INSERT INTO public.products (user_id, title, description, price, area) VALUES
('00000000-0000-0000-0000-000000000001', '미개봉 에어팟 프로', '선물받았는데 이미 있어서 팝니다', 200000, '강남구'),
('00000000-0000-0000-0000-000000000002', '새 상품 스타벅스 텀블러', '미개봉 텀블러 세트입니다', 35000, '강남구');
```

## 7. Vercel 배포 (선택사항)

1. GitHub에 프로젝트 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 import
3. 환경 변수 설정 (Supabase URL, API Key)
4. 배포 완료!

## 문제 해결

### RLS 정책 오류
- Supabase 대시보드에서 **Authentication** > **Policies** 확인
- 각 테이블의 RLS가 활성화되어 있는지 확인

### 환경 변수 인식 안 됨
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 개발 서버 재시작 (`npm run dev`)
- 환경 변수는 반드시 `NEXT_PUBLIC_` 접두사 필요

### 패키지 설치 오류
- Node.js 버전 확인 (18 이상 권장)
- `npm cache clean --force`
- `rm -rf node_modules package-lock.json`
- `npm install` 재실행

