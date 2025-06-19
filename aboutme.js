console.log('✅ aboutme.js loaded');

window.generateAboutPage = async function () {
  const file = document.getElementById('resumeUpload').files[0];
  if (!file) {
    alert('Please upload a resume!');
    return;
  }

  const terminal = document.getElementById('terminalOutput');
  const cursor = document.getElementById('cursor');

  const printLog = (line, delay = 500) =>
    new Promise(resolve => {
      setTimeout(() => {
        terminal.textContent += `\n└─ $ ${line}`;
        terminal.scrollTop = terminal.scrollHeight;
        resolve();
      }, delay);
    });

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
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhZWdtYWp4amRmcXRpc3BxZG50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMDk2OTUsImV4cCI6MjA2NTg4NTY5NX0.DmO2FMufZ7LBVY3nVOv0r0P7HuD4kvgKjBy8cC-MjJw'
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
