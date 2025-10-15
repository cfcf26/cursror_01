import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Admin 클라이언트 생성
 * RLS를 우회하여 테스트 데이터를 관리할 수 있습니다.
 */
export function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY 환경 변수가 설정되지 않았습니다.')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * 테스트 사용자 생성
 * 이메일 인증을 자동으로 완료합니다.
 */
export async function createTestUser(
  email: string,
  password: string,
  area: string
): Promise<{ userId: string; email: string }> {
  const admin = getSupabaseAdminClient()
  
  // 1. Auth 사용자 생성 (이메일 인증 자동 완료)
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // 이메일 인증 자동 완료
  })
  
  if (authError || !authData.user) {
    throw new Error(`사용자 생성 실패: ${authError?.message}`)
  }
  
  // 2. Profile 생성
  const { error: profileError } = await admin
    .from('profiles')
    .insert({
      id: authData.user.id,
      email,
      area,
    })
  
  if (profileError) {
    // 실패 시 Auth 사용자도 삭제
    await admin.auth.admin.deleteUser(authData.user.id)
    throw new Error(`프로필 생성 실패: ${profileError.message}`)
  }
  
  return {
    userId: authData.user.id,
    email,
  }
}

/**
 * 테스트 상품 생성
 */
export async function createTestProduct(
  userId: string,
  data: {
    title: string
    description: string
    price: number
    area: string
  }
): Promise<string> {
  const admin = getSupabaseAdminClient()
  
  const { data: product, error } = await admin
    .from('products')
    .insert({
      user_id: userId,
      title: data.title,
      description: data.description,
      price: data.price,
      area: data.area,
    })
    .select('id')
    .single()
  
  if (error || !product) {
    throw new Error(`상품 생성 실패: ${error?.message}`)
  }
  
  return product.id
}

/**
 * 테스트 채팅방 생성
 */
export async function createTestChatRoom(
  productId: string,
  buyerId: string,
  sellerId: string
): Promise<string> {
  const admin = getSupabaseAdminClient()
  
  const { data: room, error } = await admin
    .from('chat_rooms')
    .insert({
      product_id: productId,
      buyer_id: buyerId,
      seller_id: sellerId,
    })
    .select('id')
    .single()
  
  if (error || !room) {
    throw new Error(`채팅방 생성 실패: ${error?.message}`)
  }
  
  return room.id
}

/**
 * 테스트 메시지 생성
 */
export async function createTestMessage(
  roomId: string,
  userId: string,
  message: string
): Promise<string> {
  const admin = getSupabaseAdminClient()
  
  const { data: msg, error } = await admin
    .from('chat_messages')
    .insert({
      room_id: roomId,
      user_id: userId,
      message,
    })
    .select('id')
    .single()
  
  if (error || !msg) {
    throw new Error(`메시지 생성 실패: ${error?.message}`)
  }
  
  return msg.id
}

/**
 * 테스트 데이터 정리
 * CASCADE DELETE로 관련 데이터도 자동 삭제됩니다.
 */
export async function cleanupTestData(userIds: string[]): Promise<void> {
  const admin = getSupabaseAdminClient()
  
  for (const userId of userIds) {
    try {
      // 1. Profile 삭제 (CASCADE로 products, chat_rooms, chat_messages 자동 삭제)
      await admin
        .from('profiles')
        .delete()
        .eq('id', userId)
      
      // 2. Auth 사용자 삭제
      await admin.auth.admin.deleteUser(userId)
      
      console.log(`테스트 사용자 삭제 완료: ${userId}`)
    } catch (error) {
      console.error(`사용자 삭제 실패 (${userId}):`, error)
    }
  }
}

/**
 * 특정 상품 삭제
 */
export async function deleteTestProduct(productId: string): Promise<void> {
  const admin = getSupabaseAdminClient()
  
  const { error } = await admin
    .from('products')
    .delete()
    .eq('id', productId)
  
  if (error) {
    throw new Error(`상품 삭제 실패: ${error.message}`)
  }
}

/**
 * 특정 채팅방 삭제
 */
export async function deleteTestChatRoom(roomId: string): Promise<void> {
  const admin = getSupabaseAdminClient()
  
  const { error } = await admin
    .from('chat_rooms')
    .delete()
    .eq('id', roomId)
  
  if (error) {
    throw new Error(`채팅방 삭제 실패: ${error.message}`)
  }
}

/**
 * 고유한 테스트 이메일 생성
 */
export function generateTestEmail(prefix: string = 'test'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`
}

/**
 * 랜덤 문자열 생성
 */
export function randomString(length: number = 10): string {
  return Math.random().toString(36).substring(2, 2 + length)
}

/**
 * 테스트용 지연 함수
 */
export async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

