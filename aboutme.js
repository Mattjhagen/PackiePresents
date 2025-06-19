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
        const newLine = document.createTextNode(`\n└─ $ ${line}`);
        terminal.appendChild(newLine);
        terminal.scrollTop = terminal.scrollHeight;
        resolve();
      }, delay);
    });
  }

  const reader = new FileReader();
  reader.onload = async function (event) {
    const resumeText = event.target.result;

    await printLog('📄 Uploading resume...');
    await printLog('🔌 Connecting to OpenAI...');

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

      await printLog('✅ Resume parsed successfully!');

      const { data: { user } } = await supabase.auth.getUser();

      if (user?.email) {
        await fetch("https://packiepresents.onrender.com/save-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, html: data })
        });

        await printLog(`💾 Resume saved for ${user.email}`);
      } else {
        await printLog(`⚠️ User not logged in; skipping save.`);
      }

      await printLog('🚀 Opening preview page...');

      const blob = new Blob([data], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');

    } catch (err) {
      console.error('❌ Failed:', err);
      await printLog(`❌ Error: ${err.message}`);
      alert('Something went wrong. Try again.');
    }
  };

  reader.readAsText(file);
};
