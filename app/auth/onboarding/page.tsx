import OnboardingForm from './OnboardingForm'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // 이미 프로필이 있으면 홈으로
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2">환영합니다!</h1>
        <p className="text-gray-600 mb-8">
          거래할 지역을 입력해주세요.
        </p>
        <OnboardingForm email={user.email!} />
      </div>
    </div>
  )
}

