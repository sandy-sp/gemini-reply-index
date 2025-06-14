// pages/_app.tsx
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabaseClient'
import { NavBar } from '@/components/NavBar'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <NavBar />
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
