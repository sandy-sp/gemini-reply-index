import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('contributions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Convert storage paths into public URLs
  const withUrls = data.map(item => ({
    ...item,
    docx_url: supabase.storage.from('contributions').getPublicUrl(item.docx_url).publicURL,
    md_url:   supabase.storage.from('contributions').getPublicUrl(item.md_url).publicURL
  }));

  return NextResponse.json(withUrls);
}
