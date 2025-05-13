'use client';
import useSWR from 'swr';
import { useEffect } from 'react';

const fetcher = async (url) => {
  const res = await fetch(url);
  const payload = await res.json();
  if (!res.ok) {
    // throw to trigger SWR’s error state
    throw new Error(payload.error ?? `Request failed (${res.status})`);
  }
  // now payload *must* be your array
  return payload;
};

export default function ContributionList() {
  const { data, error, mutate } = useSWR('/api/list', fetcher);

  // re‑load after a submission
  useEffect(() => {
    const onSuccess = () => mutate();
    window.addEventListener('submission-success', onSuccess);
    return () => window.removeEventListener('submission-success', onSuccess);
  }, [mutate]);

  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;
  if (!data) return <p>Loading contributions…</p>;
  if (data.length === 0) return <p>No contributions yet.</p>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id} className="contribution-item">
          <h3>{item.prompt}</h3>
          <p><strong>By:</strong> {item.contributor}</p>
          <a href={item.md_url} target="_blank">View MD</a>
          {' | '}
          <a href={item.docx_url} target="_blank">Download DOCX</a>
        </div>
      ))}
    </div>
  );
}
