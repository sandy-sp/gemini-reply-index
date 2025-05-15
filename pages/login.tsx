// pages/login.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const session = useSession()
  const supa = useSupabaseClient()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (session) router.replace('/')  
  }, [session, router])

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    await supa.auth.signInWithOAuth({ provider })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-semibold mb-6">Sign in</h1>
      <button
        onClick={() => handleOAuthLogin('github')}
        className="w-full max-w-xs mb-4 py-2 bg-gray-800 text-white rounded"
      >
        Sign in with GitHub
      </button>
      <button
        onClick={() => handleOAuthLogin('google')}
        className="w-full max-w-xs py-2 bg-red-600 text-white rounded"
      >
        Sign in with Google
      </button>
    </div>
  )
}
