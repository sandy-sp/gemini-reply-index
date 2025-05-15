// components/NewSubmissionForm.tsx
import { useState } from 'react'
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react'

export function NewSubmissionForm({ onSuccess }: { onSuccess: () => void }) {
  const supabase = useSupabaseClient()
  const session = useSession()
  const [prompt, setPrompt] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!session) {
      setErrorMsg('You must be signed in.')
      return
    }
    if (!prompt.trim() || !file) {
      setErrorMsg('Please enter a prompt and select a file.')
      return
    }

    setLoading(true)
    try {
      // 1. Upload file to Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${session.user.id}/${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase
        .storage
        .from('contributions')
        .upload(fileName, file, { upsert: false })

      if (uploadError) throw uploadError

      // 2. Get a public URL
      const { data } = supabase
        .storage
        .from('contributions')
        .getPublicUrl(fileName)

      const docxUrl = data.publicUrl

      // 3. Insert record into DB
      const { error: insertError } = await supabase
        .from('contributions')
        .insert({
          user_id: session.user.id,
          prompt,
          docx_url: docxUrl
        })

      if (insertError) throw insertError

      // 4. Reset form & notify parent
      setPrompt('')
      setFile(null)
      onSuccess()
    } catch (error: any) {
      console.error(error)
      setErrorMsg(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
      <h2 className="text-xl mb-2">New Submission</h2>

      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder="Enter your prompt here…"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
      />

      <input
        type="file"
        accept=".docx"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mb-2"
      />

      {errorMsg && (
        <p className="text-red-600 text-sm mb-2">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Uploading…' : 'Submit'}
      </button>
    </form>
  )
}
