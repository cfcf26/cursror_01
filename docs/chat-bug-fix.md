# 채팅 기능 버그 수정

## 발생한 문제

### 에러 메시지
```
TypeError: Cannot read properties of null (reading 'email')
```

### 에러 위치
`app/chat/[roomId]/ChatRoom.tsx` 65번째 줄
```typescript
{otherUser.email} 님과의 채팅
```

## 원인 분석

Supabase에서 같은 테이블(`profiles`)을 여러 번 JOIN할 때 사용한 문법이 올바르지 않았습니다.

### 문제가 있던 코드
```typescript
const { data: chatRoom } = await supabase
  .from('chat_rooms')
  .select(`
    id,
    buyer_id,
    seller_id,
    buyer:profiles!buyer_id (id, email),    // ❌ 작동하지 않음
    seller:profiles!seller_id (id, email)   // ❌ 작동하지 않음
  `)
```

이 문법은 Supabase의 PostgREST에서 올바르게 작동하지 않아 `buyer`와 `seller` 필드가 `null`로 반환되었습니다.

## 해결 방법

### 방법 1: 별도 쿼리로 분리 (적용된 방법)

채팅방 정보를 먼저 조회한 후, `buyer_id`와 `seller_id`를 사용해서 profiles를 별도로 조회합니다.

#### 채팅방 상세 페이지 수정
```typescript
// app/chat/[roomId]/page.tsx

// 1. 채팅방 정보 조회 (products JOIN만)
const { data: chatRoom } = await supabase
  .from('chat_rooms')
  .select(`
    id,
    product_id,
    buyer_id,
    seller_id,
    products (id, title, price)
  `)
  .eq('id', params.roomId)
  .single()

// 2. buyer와 seller 프로필 정보 별도 조회
const { data: buyerProfile } = await supabase
  .from('profiles')
  .select('id, email')
  .eq('id', chatRoom.buyer_id)
  .single()

const { data: sellerProfile } = await supabase
  .from('profiles')
  .select('id, email')
  .eq('id', chatRoom.seller_id)
  .single()

// 3. 상대방 정보 계산
const otherUser = chatRoom.buyer_id === user.id ? sellerProfile : buyerProfile
```

#### 채팅방 목록 페이지 수정
```typescript
// app/chat/page.tsx

// 1. 채팅방 목록 조회
const { data: chatRooms } = await supabase
  .from('chat_rooms')
  .select(`
    id,
    created_at,
    product_id,
    buyer_id,
    seller_id,
    products (id, title, price)
  `)
  .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
  .order('created_at', { ascending: false })

// 2. 모든 user ID 추출
const userIds = [
  ...new Set(chatRooms.flatMap(room => [room.buyer_id, room.seller_id]))
]

// 3. profiles 일괄 조회
const { data: profiles } = await supabase
  .from('profiles')
  .select('id, email')
  .in('id', userIds)

// 4. profiles를 맵으로 변환하여 매핑
const profilesMap = new Map(profiles?.map(p => [p.id, p]) || [])

const chatRoomsWithProfiles = chatRooms.map(room => ({
  ...room,
  buyer: profilesMap.get(room.buyer_id),
  seller: profilesMap.get(room.seller_id)
}))
```

### 타입 정의 수정

profiles 정보가 optional이 될 수 있으므로 타입 정의 업데이트:

```typescript
// types/index.ts
export interface ChatRoomWithDetails extends ChatRoom {
  products: {
    id: string;
    title: string;
    price: number;
  };
  buyer?: {        // optional로 변경
    id: string;
    email: string;
  };
  seller?: {       // optional로 변경
    id: string;
    email: string;
  };
}
```

### 컴포넌트에 Null 체크 추가

#### ChatRoomList 컴포넌트
```typescript
// app/chat/ChatRoomList.tsx
{chatRooms.map((room) => {
  const otherUser = room.buyer_id === currentUserId ? room.seller : room.buyer
  
  // buyer나 seller 정보가 없는 경우 스킵
  if (!otherUser) {
    return null
  }
  
  return (
    // ... 렌더링
  )
})}
```

#### ChatRoom 컴포넌트
```typescript
// app/chat/[roomId]/ChatRoom.tsx
interface ChatRoomProps {
  otherUser: {
    id: string
    email: string
  } | null    // null 허용
  // ...
}

export default function ChatRoom({ otherUser, ... }: ChatRoomProps) {
  // ... Realtime 구독 로직
  
  // otherUser가 없는 경우 처리
  if (!otherUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">채팅방 정보를 불러올 수 없습니다.</p>
      </div>
    )
  }
  
  return (
    // ... 정상 렌더링
  )
}
```

## 방법 2: 외래 키 제약 조건 이름 명시 (대안)

Supabase 데이터베이스의 외래 키 제약 조건 이름을 확인하고 명시적으로 지정하는 방법도 있습니다:

```typescript
const { data: chatRoom } = await supabase
  .from('chat_rooms')
  .select(`
    *,
    buyer:profiles!chat_rooms_buyer_id_fkey(id, email),
    seller:profiles!chat_rooms_seller_id_fkey(id, email)
  `)
```

하지만 이 방법은:
- 외래 키 이름이 정확해야 함
- 데이터베이스 스키마 변경 시 코드도 변경 필요
- 별도 쿼리 방법보다 덜 명확함

따라서 **방법 1 (별도 쿼리)**을 채택했습니다.

## 수정된 파일 목록

1. `app/chat/page.tsx` - 채팅방 목록 조회 로직 수정
2. `app/chat/[roomId]/page.tsx` - 채팅방 상세 조회 로직 수정
3. `app/chat/ChatRoomList.tsx` - null 체크 추가
4. `app/chat/[roomId]/ChatRoom.tsx` - null 체크 추가, 타입 수정
5. `types/index.ts` - ChatRoomWithDetails 타입 수정 (optional)

## 성능 고려사항

### 채팅방 목록
- 기존: 1개의 쿼리 (JOIN 실패)
- 수정 후: 2개의 쿼리
  1. 채팅방 목록 조회
  2. 모든 profiles 일괄 조회 (`.in()` 사용)

성능 영향: **미미함** - profiles는 user ID로 일괄 조회하므로 효율적

### 채팅방 상세
- 기존: 1개의 쿼리 (JOIN 실패)
- 수정 후: 3개의 쿼리
  1. 채팅방 정보 조회
  2. buyer 프로필 조회
  3. seller 프로필 조회

성능 영향: **미미함** - 단일 레코드 조회이며, 페이지 로드 시 1회만 실행

## 테스트 확인 사항

- [x] 채팅방 목록에서 상대방 이메일 정상 표시
- [x] 채팅방 상세에서 상대방 이메일 정상 표시
- [x] profiles 정보가 없는 경우 graceful handling
- [x] Linter 에러 없음
- [x] TypeScript 컴파일 에러 없음

## 교훈

1. **Supabase JOIN 문법 주의**: 같은 테이블을 여러 번 JOIN할 때는 별도 쿼리 고려
2. **항상 null 체크**: 외부 데이터는 항상 optional로 처리
3. **타입 안전성**: TypeScript 타입을 실제 데이터 구조에 맞게 정의
4. **에러 핸들링**: null/undefined 케이스에 대한 fallback UI 제공

