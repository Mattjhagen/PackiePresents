import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function renderResumePage(subdomain) {
  const { data, error } = await supabase
    .from('resume_pages')
    .select('html')
    .eq('email', `${subdomain}@example.com`)  // Adjust this logic if needed
    .single();

  if (error || !data?.html) throw new Error('No resume found for this subdomain');

  // Inject CTA
  const htmlWithCTA = data.html.replace(
    '</body>',
    `
    <div class="cta">
      <h2>🚀 Claim Your Digital Presence</h2>
      <a class="cta-link" href="/login" target="_blank" rel="noopener">
        Sign in with Google via Supabase
      </a>
    </div>
    </body>`
  );

  return htmlWithCTA;
}
