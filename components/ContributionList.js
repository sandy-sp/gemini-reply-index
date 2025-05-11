import useSWR from 'swr';
import { useEffect } from 'react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ContributionList() {
  const { data, error, mutate } = useSWR('/api/list', fetcher);

  // re‑validate after a successful submission
  useEffect(() => {
    const onSuccess = () => mutate();
    window.addEventListener('submission-success', onSuccess);
    return () => window.removeEventListener('submission-success', onSuccess);
  }, [mutate]);

  if (error) return <p>Error loading contributions: {error.message}</p>;
  if (!data) return <p>Loading contributions…</p>;
  if (data.length === 0) return <p>No contributions yet.</p>;

  return (
    <div>
      {data.map((item) => (
        <div key={item.id} className="contribution-item" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '0.25rem' }}>{item.prompt}</h3>
          <p style={{ margin: 0 }}>
            <strong>By:</strong> {item.contributor} on{' '}
            {new Date(item.created_at).toLocaleString()}
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            <a href={item.md_url} target="_blank" rel="noopener noreferrer">
              View Markdown
            </a>{' '}
            |{' '}
            <a href={item.docx_url} target="_blank" rel="noopener noreferrer">
              Download DOCX
            </a>
          </p>
        </div>
      ))}
    </div>
  );
}
