'use client';

import { useState } from 'react';

export default function SubmissionForm() {
  const [contributor, setContributor] = useState('');
  const [promptText, setPromptText] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus('Please select a DOCX file');
      return;
    }

    setLoading(true);
    setStatus('');

    const formData = new FormData();
    formData.append('contributor', contributor);
    formData.append('prompt', promptText);
    formData.append('docx', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setStatus('✅ Submission successful!');
        setContributor('');
        setPromptText('');
        setFile(null);
        // reset file input
        document.getElementById('docx-input').value = '';
        // trigger re‑load in ContributionList
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
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <label>
        Your Name:
        <input
          type="text"
          value={contributor}
          onChange={(e) => setContributor(e.target.value)}
          required
        />
      </label>

      <label>
        Prompt:
        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          rows={4}
          required
        />
      </label>

      <label>
        Output DOCX:
        <input
          type="file"
          id="docx-input"
          accept=".docx"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting…' : 'Submit'}
      </button>

      {status && <p style={{ marginTop: '0.5rem' }}>{status}</p>}
    </form>
  );
}
