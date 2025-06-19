console.log('✅ aboutme.js loaded');

window.generateAboutPage = function () {
  const file = document.getElementById('resumeUpload').files[0];
  if (!file) {
    alert('Please upload a resume!');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const resumeText = event.target.result;

   await printLog('Uploading resume...');
await printLog('Connecting to AI...');

function printLog(line, delay = 500) {
  return new Promise(resolve => {
    setTimeout(() => {
      terminal.textContent += `\n└─ $ ${line}`;
      terminal.scrollTop = terminal.scrollHeight;
      resolve();
    }, delay);
  });
} 
    let width = 0;
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval);
      } else {
        width += 5;
        document.getElementById('progressBar').style.width = width + '%';
      }
    }, 80);
    
await printLog('Sending to OpenAI...');
    
    fetch("https://packiepresents.onrender.com/parse-resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ resumeText })
    })
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.text();
      })
    .then(async data => {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
  const supabase = createClient(
    'https://qaegmajxjdfqtispqdnt.supabase.co',
    'YOUR_PUBLIC_ANON_KEY' // Replace this!
    await printLog('✅ Resume parsed!');
await printLog('Opening preview...');
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (user?.email) {
    await fetch("https://packiepresents.onrender.com/save-resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: user.email, html: data })
    });
  }

  const blob = new Blob([data], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  document.getElementById('loadingStatus').textContent = '✅ Success! Opening your page...';
  window.open(url, '_blank');
      })
      .catch(err => {
        console.error('Failed to generate page:', err);
        document.getElementById('loadingStatus').textContent = '❌ Something went wrong.';
        alert('Something went wrong. Try again.');
  await printLog(`❌ Error: ${err.message}`);
      });
  };

  reader.readAsText(file);
};
