function showLoadingEffect(callback) {
  const bar = document.getElementById('loadingBar');
  const progress = document.getElementById('progressBar');
  bar.style.display = 'block';
  progress.style.width = '0%';

  let width = 0;
  const loading = setInterval(() => {
    if (width >= 100) {
      clearInterval(loading);
      callback();
    } else {
      width += 5;
      progress.style.width = width + '%';
    }
  }, 100);
}

function generateAboutPage() {
  const file = document.getElementById('resumeUpload').files[0];
  if (!file) {
    alert('Please upload a resume file!');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const content = event.target.result;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>About Me</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #fff;
      color: #333;
      padding: 2em;
      max-width: 800px;
      margin: auto;
    }
    h1 {
      border-bottom: 2px solid #333;
    }
    pre {
      background: #f4f4f4;
      padding: 1em;
      border-radius: 6px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  </style>
</head>
<body>
  <h1>About Me</h1>
  <h2>Resume</h2>
  <pre>${content.replace(/</g, '&lt;')}</pre>
</body>
</html>
`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  reader.readAsText(file);
}
