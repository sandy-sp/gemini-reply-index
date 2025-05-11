// === CONFIGURE these two constants ===
const OWNER = '<your‑username>';
const REPO  = 'gemini-prompts';
// =====================================

async function uploadFile(path, contentBase64, token, message) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message,
      content: contentBase64
    })
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.statusText}`);
  return await res.json();
}

document.getElementById('uploadForm').addEventListener('submit', async e => {
  e.preventDefault();
  const token  = document.getElementById('token').value.trim();
  const prompt = document.getElementById('prompt').value.trim();
  const file   = document.getElementById('docFile').files[0];
  const timestamp = Date.now();
  const folder = `entries/${timestamp}`;

  try {
    // 1. Upload prompt.txt
    const promptB64 = btoa(unescape(encodeURIComponent(prompt)));
    await uploadFile(
      `${folder}/prompt.txt`,
      promptB64,
      token,
      `Add prompt at ${timestamp}`
    );

    // 2. Upload docx
    const reader = new FileReader();
    reader.onload = async () => {
      const arrayBuffer = reader.result;
      const bytes = new Uint8Array(arrayBuffer);
      const b64   = btoa(String.fromCharCode(...bytes));
      await uploadFile(
        `${folder}/${file.name}`,
        b64,
        token,
        `Add docx ${file.name} at ${timestamp}`
      );
      alert('✅ Submission successful! Check entries.html to view it.');
      window.location.href = 'entries.html';
    };
    reader.readAsArrayBuffer(file);
  } catch (err) {
    console.error(err);
    alert('❌ Upload failed: ' + err.message);
  }
});
