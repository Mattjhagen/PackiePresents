// utils/renderResumePage.js

export async function renderResumePage(subdomain, supabase) {
  const { data, error } = await supabase
    .from('resume_pages')
    .select('html')
    .eq('username', subdomain)
    .single();

  if (error || !data) {
    throw new Error('Resume page not found');
  }

  const footerCTA = `
    <div style="text-align:center; margin-top:2em;">
      <hr style="margin: 2em 0; border-color: #444;">
      <p style="color:#00ffff;">
        🚀 Build your own site like this one at 
        <a href="https://pacmacmobile.com" style="color:#00ffff;">PacMacMobile.com</a>
      </p>
    </div>
  `;

  return data.html + footerCTA;
}
