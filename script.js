(async () => {
  // ── CONFIG ───────────────────────────────────────────────────────────
  const OWNER    = 'sandy-sp';
  const REPO     = 'gemini-reply-index';
  const BRANCH   = 'main';
  const INDEX    = 'index.json';
  const FOLDER   = 'contributions';

  // Octokit instance (initialized once token is set)
  let octokit;

  // ── TOKEN MANAGEMENT ─────────────────────────────────────────────────
  function setToken(t) {
    localStorage.setItem('github_token', t);
    octokit = new Octokit.Octokit({ auth: t });
    loadContributions();
  }

  document.getElementById('token-button')
    .addEventListener('click', () => {
      const t = prompt('Enter your GitHub PAT (repo scope):');
      if (t) setToken(t.trim());
    });

  const saved = localStorage.getItem('github_token');
  if (saved) setToken(saved);

  // ── HELPERS ──────────────────────────────────────────────────────────
  async function getFile(path) {
    try {
      const res = await octokit.rest.repos.getContent({ owner: OWNER, repo: REPO, path, ref: BRANCH });
      return {
        content: atob(res.data.content.replace(/\n/g,'')),
        sha: res.data.sha
      };
    } catch (err) {
      if (err.status === 404) return null;
      throw err;
    }
  }

  // ── FORM SUBMISSION ──────────────────────────────────────────────────
  document.getElementById('contribution-form')
    .addEventListener('submit', async e => {
      e.preventDefault();
      if (!octokit) return alert('Set your GitHub token first.');

      const contributor = document.getElementById('contributor').value.trim();
      const promptText  = document.getElementById('prompt').value.trim();
      const fileInput   = document.getElementById('docx-file');
      if (!fileInput.files.length) return;

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64  = reader.result.split(',')[1];
          const ts      = new Date().toISOString().replace(/[-:.]/g,'');
          const fname   = `${FOLDER}/${ts}_${contributor.replace(/\s+/g,'_')}.docx`;

          // 1️⃣ Commit .docx
          await octokit.rest.repos.createOrUpdateFileContents({
            owner: OWNER, repo: REPO, path: fname,
            message: `Add contribution by ${contributor}`,
            content: base64, branch: BRANCH
          });

          // 2️⃣ Update index.json
          let idx = [];
          const fileData = await getFile(INDEX);
          if (fileData) idx = JSON.parse(fileData.content);
          idx.unshift({ contributor, prompt: promptText, filePath: fname, date: new Date().toISOString() });
          const updated = btoa(JSON.stringify(idx, null, 2));
          await octokit.rest.repos.createOrUpdateFileContents({
            owner: OWNER, repo: REPO, path: INDEX,
            message: `Update index.json`,
            content: updated, sha: fileData?.sha, branch: BRANCH
          });

          document.getElementById('form-status').textContent = '✅ Submission successful!';
          loadContributions();
        } catch (err) {
          console.error(err);
          document.getElementById('form-status').textContent = '❌ ' + err.message;
        }
      };
      reader.readAsDataURL(fileInput.files[0]);
    });

  // ── RENDER CONTRIBUTIONS ─────────────────────────────────────────────
  async function loadContributions() {
    const listEl = document.getElementById('contributions-list');
    listEl.textContent = 'Loading…';
    try {
      const res = await fetch(`https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${INDEX}`);
      if (!res.ok) throw new Error('Could not load index.json');
      const data = await res.json();
      if (!data.length) {
        listEl.innerHTML = '<p>No contributions yet.</p>';
        return;
      }
      listEl.innerHTML = '';
      data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
          <h3>${item.prompt}</h3>
          <p><strong>By:</strong> ${item.contributor} on ${new Date(item.date).toLocaleString()}</p>
          <a href="https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${item.filePath}" target="_blank">
            Download DOCX
          </a>
        `;
        listEl.appendChild(div);
      });
    } catch (err) {
      listEl.textContent = 'Error loading contributions: ' + err.message;
    }
  }

  // ── INIT ─────────────────────────────────────────────────────────────
  if (octokit) loadContributions();
})();
