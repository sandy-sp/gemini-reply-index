import formidable from 'formidable';
import fs from 'fs';
import { supabaseAdmin } from '../../lib/supabase';
import mammoth from 'mammoth';
import TurndownService from 'turndown';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const { contributor, prompt } = fields;
    const file = files.docx;
    const buffer = await fs.promises.readFile(file.filepath);
    const id = crypto.randomUUID();

    // 1) upload .docx
    const docxPath = `contributions/${id}.docx`;
    await supabaseAdmin
      .storage
      .from('contributions')
      .upload(docxPath, buffer, { contentType: file.mimetype });

    // 2) convert → HTML → Markdown
    const { value: html } = await mammoth.convertToHtml({ buffer });
    const md = new TurndownService().turndown(html);
    const mdBuffer = Buffer.from(md, 'utf-8');
    const mdPath = `contributions/${id}.md`;
    await supabaseAdmin
      .storage
      .from('contributions')
      .upload(mdPath, mdBuffer, { contentType: 'text/markdown' });

    // 3) insert metadata
    const { error } = await supabaseAdmin
      .from('contributions')
      .insert([{
        id,
        contributor,
        prompt,
        docx_url: docxPath,
        md_url: mdPath
      }]);
    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json({ success: true });
  });
}
