function showLoadingEffect(callback) {
  const bar = document.getElementById('loadingBar');
  const progress = document.getElementById('progressBar');
  const statusText = document.getElementById('loadingStatus');

  bar.style.display = 'block';
  progress.style.width = '0%';
  statusText.textContent = 'Generating... Stand by...';

  let width = 0;
  const loading = setInterval(() => {
    if (width >= 100) {
      clearInterval(loading);
      statusText.textContent = '✅ Success! Opening your page...';
      callback();
    } else {
      width += 5;
      progress.style.width = width + '%';
    }
  }, 80);
}

function generateAboutPage() {
  const file = document.getElementById('resumeUpload').files[0];
  if (!file) {
    alert('Please upload a resume!');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const raw = event.target.result;
    const lines = raw.split('\n').map(line => line.trim()).filter(Boolean);

    // Basic parsing logic
    const email = lines.find(l => l.includes('@')) || '';
    const phone = lines.find(l => l.match(/\d{3}.?\d{3}.?\d{4}/)) || '';
    const name = lines.find(l => l.match(/^[A-Z][a-z]+\s[A-Z][a-z]+$/)) || 'Your Name';

    const contact = [name, phone, email]
      .filter(Boolean)
      .map(line => `<p>${line}</p>`)
      .join('');

    const experienceStart = lines.findIndex(l => l.toLowerCase().includes('experience'));
    const experience = experienceStart > -1 ? lines.slice(experienceStart).join('<br>') : '';

    const skillsIndex = lines.findIndex(l => l.toLowerCase().includes('skills') || l.toLowerCase().includes('certifications'));
    const skills = skillsIndex > -1 ? lines.slice(skillsIndex, skillsIndex + 8).join(', ') : '';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>About ${name}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #fdfdfd;
      color: #222;
      max-width: 800px;
      margin: auto;
      padding: 2em;
    }
    h1, h2 {
      color: #444;
      border-bottom: 1px solid #ccc;
      padding-bottom: 0.2em;
    }
    .contact p {
      margin: 0.3em 0;
    }
    .section {
      margin-top: 2em;
    }
    .skills {
      background: #f4f4f4;
      padding: 1em;
      border-radius: 6px;
    }
  </style>
</head>
<body>
  <h1>${name}</h1>

  <div class="section contact">
    <h2>Contact</h2>
    ${contact}
  </div>

  <div class="section">
    <h2>Skills & Certifications</h2>
    <div class="skills">${skills}</div>
  </div>

  <div class="section">
    <h2>Experience</h2>
    <p style="white-space: pre-wrap;">${experience}</p>
  </div>

  <div class="section" style="margin-top:3em;">
    <p style="font-style: italic; text-align:center; color:#555;">Built with ❤️ on PacMacMobile.com</p>
  </div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  reader.readAsText(file);
}
