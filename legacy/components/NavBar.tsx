// components/NavBar.tsx
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Link from 'next/link'

export function NavBar() {
  const session = useSession()
  const supabase = useSupabaseClient()

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link href="/">
        <a className="font-bold text-xl">Gemini Reply Index</a>
      </Link>

      {session ? (
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <a className="hover:underline">Dashboard</a>
          </Link>
          <button
            onClick={signOut}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <Link href="/login">
          <a className="px-3 py-1 border rounded hover:bg-gray-100">Sign In</a>
        </Link>
      )}
    </nav>
  )
}
