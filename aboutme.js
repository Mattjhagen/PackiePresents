console.log('✅ aboutme.js loaded');

window.generateAboutPage = async function () {
  console.log('🟢 generateAboutPage triggered');

  const file = document.getElementById('resumeUpload').files[0];
  const terminalBox = document.getElementById('terminalBox');
  const terminal = document.getElementById('terminalOutput');
const { data: { user } } = await supabase.auth.getUser();
  if (!file) {
    alert('Please upload a resume!');
    return;
  }

  terminalBox.style.display = 'block';
  terminal.textContent = '┌─[resume@parser]─[$] Initializing...\n';
  terminal.appendChild(blinkCursor());

  const printLog = (line, delay = 600) =>
    new Promise((resolve) => {
      setTimeout(() => {
        terminal.textContent += `\n└─ $ ${line}`;
        terminal.scrollTop = terminal.scrollHeight;
        resolve();
      }, delay);
    });

  await printLog('Uploading resume...');
  const reader = new FileReader();

  reader.onload = async function (event) {
    const resumeText = event.target.result;

    await printLog('Connecting to OpenAI...');
    try {
      const res = await fetch('https://packiepresents.onrender.com/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
        
        await fetch("https://packiepresents.onrender.com/save-resume", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: user.email, html: data })
});

      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.text();

      await printLog('✅ Resume parsed!');

      const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
      const supabase = createClient(
        'https://qaegmajxjdfqtispqdnt.supabase.co',
        'YOUR_PUBLIC_ANON_KEY' // replace with your real anon key
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        await fetch('https://packiepresents.onrender.com/save-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, html: data }),
        });
        await printLog('🗂 Saved to your account');
      }

      await printLog('🪟 Opening preview...');

      const blob = new Blob([data], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      await printLog(`❌ Error: ${err.message}`);
      console.error('Failed to generate page:', err);
    }
  };
  
  await fetch('https://your-backend.com/api/saveResume', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: user.email,      // from Supabase Auth
    html: parsedResumeHtml  // already generated
  })
});

  reader.readAsText(file);
};

function blinkCursor() {
  const span = document.createElement('span');
  span.textContent = '█';
  span.style.animation = 'blink 1s steps(1) infinite';
  span.style.marginLeft = '0.5ch';
  span.style.display = 'inline-block';
  span.style.color = '#0f0';
  return span;
}
