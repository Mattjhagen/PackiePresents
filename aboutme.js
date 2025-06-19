console.log('✅ aboutme.js loaded');

window.generateAboutPage = async function () {
  const file = document.getElementById('resumeUpload').files[0];
  if (!file) {
    alert('Please upload a resume!');
    return;
  }

  const terminal = document.getElementById('terminalOutput');
  const cursor = document.getElementById('cursor');

  function printLog(line, delay = 500) {
    return new Promise(resolve => {
      setTimeout(() => {
        const textNode = document.createTextNode(`\n└─ $ ${line}`);
        terminal.insertBefore(textNode, cursor);
        terminal.scrollTop = terminal.scrollHeight;
        resolve();
      }, delay);
    });
  }

  const reader = new FileReader();
  reader.onload = async function (event) {
    const resumeText = event.target.result;

    await printLog('📄 Uploading resume...');
    await printLog('🧠 Connecting to AI...');

    const interval = setInterval(() => {
      const bar = document.getElementById('progressBar');
      if (!bar) return;
      let width = parseInt(bar.style.width || '0');
      if (width >= 100) clearInterval(interval);
      else bar.style.width = (width + 5) + '%';
    }, 80);

    await printLog('📤 Sending to OpenAI...');

    try {
      const response = await fetch("https://packiepresents.onrender.com/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText })
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.text();

      const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
      const supabase = createClient(
        'https://qaegmajxjdfqtispqdnt.supabase.co',
        'YOUR_PUBLIC_ANON_KEY'
      );

      await printLog('✅ Resume parsed!');

      const { data: { user } } = await supabase.auth.getUser();

      if (user?.email) {
        await fetch("https://packiepresents.onrender.com/save-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, html: data })
        });
      }

      await printLog('🔓 Opening preview...');

      const blob = new Blob([data], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      document.getElementById('loadingStatus').textContent = '✅ Success! Opening your page...';
      window.open(url, '_blank');

    } catch (err) {
      console.error('Failed to generate page:', err);
      document.getElementById('loadingStatus').textContent = '❌ Something went wrong.';
      await printLog(`❌ Error: ${err.message}`);
      alert('Something went wrong. Try again.');
    }
  };

  reader.readAsText(file);
};
