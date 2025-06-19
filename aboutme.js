function generateAboutPage() {
  const file = document.getElementById('resumeUpload').files[0];
  if (!file) {
    alert('Please upload a resume!');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const resumeText = event.target.result;

    document.getElementById('loadingBar').style.display = 'block';
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('loadingStatus').textContent = 'Generating... Stand by...';

    let width = 0;
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval);
      } else {
        width += 5;
        document.getElementById('progressBar').style.width = width + '%';
      }
    }, 80);

    fetch("https://packiepresents.onrender.com/parse-resume", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ resumeText:  })
})
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const blob = new Blob([data.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        document.getElementById('loadingStatus').textContent = '✅ Success! Opening your page...';
        window.open(url, '_blank');
        setTimeout(() => {
  const proceed = confirm("Want to publish your About Me page? Sign in with Google to choose your free subdomain or upgrade to a custom domain with email.");

  if (proceed) {
    window.location.href = '/auth/google';
  }
}, 1000);
      })
      .catch(err => {
        console.error('Failed to generate page:', err);
        document.getElementById('loadingStatus').textContent = '❌ Something went wrong.';
        alert('Something went wrong. Try again.');
      });
  };

  reader.readAsText(file);
}
