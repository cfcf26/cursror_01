/**
 * @deprecated
 * 이 파일은 더 이상 사용되지 않습니다.
 * 대신 다음을 사용하세요:
 * - 클라이언트: @/utils/supabase/client
 * - 서버: @/utils/supabase/server
 */
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// 기존 export 유지 (기존 코드 호환성)
export const supabase = createClient()
