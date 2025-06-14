// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import mammoth from 'mammoth'
import TurndownService from 'turndown'
import { supabaseAdmin } from '@/lib/supabase'

export const config = { api: { bodyParser: false } }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = new formidable.IncomingForm()
  const { fields, files } = await new Promise<any>((resolve, reject) =>
    form.parse(req as any, (err, flds, fls) =>
      err ? reject(err) : resolve({ fields: flds, files: fls })
    )
  )

  const contributor = fields.contributor as string
  const promptText  = fields.prompt as string
  const file        = files.docx as formidable.File
  const buffer      = await fs.promises.readFile(file.filepath)
  const id          = crypto.randomUUID()

  // 1) Upload DOCX
  const docxPath = `contributions/${id}.docx`
  await supabaseAdmin
    .storage
    .from('contributions')
    .upload(docxPath, buffer, { contentType: file.mimetype })

  // 2) Convert→MD & upload
  const { value: html } = await mammoth.convertToHtml({ buffer })
  const md = new TurndownService().turndown(html)
  await supabaseAdmin
    .storage
    .from('contributions')
    .upload(`contributions/${id}.md`, Buffer.from(md), { contentType: 'text/markdown' })

  // 3) Insert row
  const { error } = await supabaseAdmin
    .from('contributions')
    .insert([{ id, contributor, prompt: promptText, docx_url: docxPath, md_url: `contributions/${id}.md` }])

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ success: true })
}
