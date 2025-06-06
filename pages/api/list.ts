// pages/api/list.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'  

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data, error } = await supabase
    .from('contributions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  const withUrls = data.map(item => ({
    ...item,
    docx_url: supabase.storage.from('contributions').getPublicUrl(item.docx_url).publicURL,
    md_url:   supabase.storage.from('contributions').getPublicUrl(item.md_url).publicURL
  }))

  res.status(200).json(withUrls)
}
