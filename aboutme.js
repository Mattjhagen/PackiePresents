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
    const content = event.target.result;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>About Me</title>
  <style>
    body {
      font-family: sans-serif;
      background: #fff;
      color: #111;
      padding: 2em;
      max-width: 800px;
      margin: auto;
    }
    h1 {
      border-bottom: 2px solid #111;
    }
    pre {
      background: #f4f4f4;
      padding: 1em;
      border-radius: 8px;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <h1>About Me</h1>
  <h2>Resume</h2>
  <pre>${content.replace(/</g, "&lt;")}</pre>
</body>
</html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  reader.readAsText(file);
}
