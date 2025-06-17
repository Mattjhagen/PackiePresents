// Show animated loading bar before running callback
function showLoadingEffect(callback) {
  const bar = document.getElementById('loadingBar');
  const progress = document.getElementById('progressBar');
  bar.style.display = 'block';
  progress.style.width = '0%';

  let width = 0;
  const loading = setInterval(() => {
    if (width >= 100) {
      clearInterval(loading);
      callback(); // After loading animation, trigger page generation
    } else {
      width += 5;
      progress.style.width = width + '%';
    }
  }, 80);
}

// Generate the "About Me" page using the uploaded resume and user inputs
function generateAboutPage() {
  const file = document.getElementById('resumeUpload').files[0];
  const reader = new FileReader();

  const name = document.getElementById('yourName').value || 'Anonymous';
  const bio = document.getElementById('bio').value || 'Just vibing.';
  const color1 = document.getElementById('color1').value || '#00ff99';
  const color2 = document.getElementById('color2').value || '#111111';

  reader.onload = function (event) {
    const content = event.target.result;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>About ${name}</title>
  <style>
    body {
      font-family: monospace;
      background: ${color2};
      color: ${color1};
      padding: 2em;
    }
    h1 {
      border-bottom: 1px solid ${color1};
    }
    pre {
      background: rgba(255, 255, 255, 0.05);
      padding: 1em;
      border-radius: 8px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  </style>
</head>
<body>
  <h1>${name}</h1>
  <p><strong>Bio:</strong> ${bio}</p>
  <h2>Resume</h2>
  <pre>${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
</body>
</html>`;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  if (file) {
    reader.readAsText(file);
  } else {
    alert('Please upload a resume!');
  }
}
