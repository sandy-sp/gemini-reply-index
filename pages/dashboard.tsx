// pages/dashboard.tsx

import { withPageAuth } from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'

type Contribution = {
  id: string
  prompt: string
  docx_url: string
  created_at: string
}

export default function DashboardPage() {
  const supabase = useSupabaseClient()
  const [contributions, setContributions] = useState<Contribution[]>([])

  useEffect(() => {
    // fetch only this user’s contributions
    const load = async () => {
      const { data } = await supabase
        .from('contributions')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setContributions(data)
    }
    load()
  }, [supabase])

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">My Submissions</h1>
      {contributions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <ul className="space-y-2">
          {contributions.map((c) => (
            <li key={c.id} className="border p-2 rounded">
              <strong>{new Date(c.created_at).toLocaleString()}</strong>
              <p>{c.prompt}</p>
              <a href={c.docx_url} target="_blank" className="text-blue-600">
                Download DOCX
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// This ensures only authenticated users can reach `/dashboard`.
export const getServerSideProps = withPageAuth({ redirectTo: '/login' })
