function generateAboutPage() {
  console.log("Generating About Page...");
  // rest of your code...
}
function createRipple(event) {
  const button = event.currentTarget;
  
  // Remove existing ripple if present
  const existingRipple = button.querySelector('.ripple');
  if (existingRipple) {
    existingRipple.remove();
  }

  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
  circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
  circle.classList.add("ripple");

  button.appendChild(circle);
}
document.getElementById('generateButton').addEventListener('click', () => {
  const name = document.getElementById('fullName').value || 'Unnamed';
  const email = document.getElementById('email').value || 'Not Provided';
  const summary = document.getElementById('summary').value || 'No summary available.';
  const skills = document.getElementById('skills').value || '';
  const themeColor = document.getElementById('themeColor').value || '#00ff99';

  const previewSection = document.getElementById('about-me-preview');
  const output = document.getElementById('generated-content');

  output.innerHTML = `
    <div style="color: ${themeColor}; font-family: monospace;">
      <h3>${name}</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Bio:</strong> ${summary}</p>
      <p><strong>Skills:</strong> ${skills.split(',').map(skill => `<span style="display:inline-block; margin:2px; padding:3px 6px; background:#222; border:1px solid ${themeColor}; border-radius:4px;">${skill.trim()}</span>`).join(' ')}</p>
    </div>
  `;

  previewSection.style.display = 'block';
});
function showLoadingEffect(callback) {
  const previewSection = document.getElementById('about-me-preview');
  const output = document.getElementById('generated-content');
  
  previewSection.style.display = 'block';
  output.innerHTML = `
    <pre id="kali-loading" style="color: #00ff99; font-family: 'Courier New', monospace; background-color: #000; padding: 1em; border: 1px solid #00ff99;">
[+] Initializing site generator...
[+] Analyzing resume...
[+] Extracting metadata...
[+] Generating digital presence...
[                    ] 0%
    </pre>
  `;

  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 10 + 1);
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      callback(); // call the generator function after animation finishes
    }

    const bar = '[' + '='.repeat(progress / 5) + ' '.repeat(20 - progress / 5) + `] ${progress}%`;
    document.getElementById('kali-loading').innerHTML = `
[+] Initializing site generator...
[+] Analyzing resume...
[+] Extracting metadata...
[+] Generating digital presence...
${bar}
    `;
  }, 150);
}
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
  }, 80);
}

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
<html>
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
    }
  </style>
</head>
<body>
  <h1>${name}</h1>
  <p><strong>Bio:</strong> ${bio}</p>
  <h2>Resume</h2>
  <pre>${content.replace(/</g, "&lt;")}</pre>
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

