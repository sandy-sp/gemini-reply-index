// components/SubmissionForm.js
'use client';

import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';

export default function SubmissionForm() {
  const session = useSession();
  const [promptText, setPromptText] = useState('');
  const [file, setFile]         = useState(null);
  const [status, setStatus]     = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) must be signed in
    if (!session) {
      setStatus('⚠️ You must be signed in to submit.');
      return;
    }

    // 2) require a file
    if (!file) {
      setStatus('⚠️ Please select a DOCX file.');
      return;
    }

    setLoading(true);
    setStatus('');

    // 3) build FormData payload
    const formData = new FormData();
    // use email if available, otherwise fallback to user ID
    const contributor = session.user.email || session.user.id;
    formData.append('contributor', contributor);
    formData.append('prompt', promptText);
    formData.append('docx', file);

    try {
      // 4) call your serverless conversion endpoint
      const res  = await fetch('/api/upload', { method: 'POST', body: formData });
      const json = await res.json();

      if (res.ok && json.success) {
        setStatus('✅ Submission successful!');
        setPromptText('');
        setFile(null);
        // clear the underlying file input
        document.getElementById('docx-input').value = '';
        // let your list component know to re‑fetch
        window.dispatchEvent(new Event('submission-success'));
      } else {
        setStatus('❌ ' + (json.error || 'Upload failed'));
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
      <div>
        <label htmlFor="prompt" className="block font-medium">Prompt</label>
        <textarea
          id="prompt"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          rows={4}
          required
          className="mt-1 block w-full border rounded p-2"
        />
      </div>

      <div>
        <label htmlFor="docx-input" className="block font-medium">Output DOCX</label>
        <input
          id="docx-input"
          type="file"
          accept=".docx"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
          className="mt-1 block"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Submitting…' : 'Submit'}
      </button>

      {status && <p className="mt-2 text-sm">{status}</p>}
    </form>
  );
}
