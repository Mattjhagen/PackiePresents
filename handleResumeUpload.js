// 🧠 AUTO DB ENTRY AFTER RESUME UPLOAD & PARSE

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient(
  'https://qaegmajxjdfqtispqdnt.supabase.co',
  'YOUR_PUBLIC_ANON_KEY' // Replace with actual env var or secure key management
);

window.generateAboutPage = async function () {
  const file = document.getElementById('resumeUpload').files[0];
  if (!file) return alert('Please upload a resume!');

  const reader = new FileReader();
  reader.onload = async function (event) {
    const resumeText = event.target.result;
    
    const terminal = document.getElementById('terminalOutput');
    terminal.textContent += '\n└─ $ Uploading resume...';

    // Send resume to backend for GPT parsing
    const response = await fetch('https://packiepresents.onrender.com/parse-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText })
    });

    if (!response.ok) {
      terminal.textContent += `\n❌ Error: ${response.statusText}`;
      return alert('Failed to parse resume.');
    }

    const formattedContent = await response.text();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      terminal.textContent += '\n❌ Auth error: User not found';
      return alert('Authentication failed');
    }

    const username = user.email.split('@')[0].toLowerCase();

    // Create resume_pages entry
    const { error: insertError } = await supabase
      .from('resume_pages')
      .insert({
        user_id: user.id,
        subdomain: username,
        html: formattedContent,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      terminal.textContent += `\n❌ Failed DB insert: ${insertError.message}`;
      return alert('Could not save resume page.');
    }

    // Create user_domains entry (optional)
    await supabase.from('user_domains').insert({
      user_id: user.id,
      domain: `${username}.pacmacmobile.com`
    });

    // Show preview
    const blob = new Blob([formattedContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    terminal.textContent += '\n✅ Resume saved! Opening preview...';
    window.open(url, '_blank');
  };

  reader.readAsText(file);
};