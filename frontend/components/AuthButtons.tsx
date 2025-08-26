'use client' // Required for Next.js to run client-side code
import { supabase } from '@/lib/supabaseClient'

export default function AuthButtons() {
  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'super-secure-pass'
    })
    if (error) alert(error.message)
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'super-secure-pass'
    })
    if (error) alert(error.message)
  }

  return (
    <div className="space-x-2">
      <button onClick={signUp}>Sign up</button>
      <button onClick={signIn}>Sign in</button>
    </div>
  )
}
