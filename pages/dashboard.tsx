// pages/dashboard.tsx
import { withPageAuth } from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { NewSubmissionForm } from '@/components/NewSubmissionForm'

type Contribution = {
  id: string
  prompt: string
  docx_url: string
  created_at: string
}

export default function DashboardPage() {
  const supabase = useSupabaseClient()
  const [contributions, setContributions] = useState<Contribution[]>([])

  const loadContributions = async () => {
    const { data } = await supabase
      .from('contributions')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setContributions(data)
  }

  useEffect(() => {
    loadContributions()
  }, [])

  return (
    <div className="p-4">
      <NewSubmissionForm onSuccess={loadContributions} />

      <h1 className="text-2xl mb-4">My Submissions</h1>
      {contributions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <ul className="space-y-2">
          {contributions.map((c) => (
            <li key={c.id} className="border p-2 rounded">
              <strong>{new Date(c.created_at).toLocaleString()}</strong>
              <p className="mt-1">{c.prompt}</p>
              <a
                href={c.docx_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-1 block"
              >
                Download DOCX
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export const getServerSideProps = withPageAuth({ redirectTo: '/login' })
