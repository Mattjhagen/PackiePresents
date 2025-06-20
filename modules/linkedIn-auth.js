// modules/linkedin-auth.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient(
  'https://YOUR_PROJECT_ID.supabase.co',
  'YOUR_PUBLIC_ANON_KEY'
)

export async function loginWithLinkedIn() {
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'linkedin' })
  if (error) console.error('LinkedIn Login Error:', error)
}

export async function getAuthenticatedUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return data.user
}

export async function claimSubdomainFromLinkedInProfile() {
  const user = await getAuthenticatedUser()
  if (!user) return console.warn('❌ No user authenticated.')

  const email = user.email
  const id = user.id
  const domain = email?.split('@')[0]?.toLowerCase()

  const { error } = await supabase
    .from('user_domains')
    .insert([{ user_id: id, subdomain: domain, user_email: email }])

  if (error) {
    console.error('❌ Subdomain claim failed:', error.message)
  } else {
    console.log('✅ Domain claimed for:', domain)
  }
}
