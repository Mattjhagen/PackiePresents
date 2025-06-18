function generateAboutPage() {
  const file = document.getElementById('resumeUpload').files[0];
  if (!file) {
    alert('Please upload a resume!');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const resumeText = event.target.result;

    showLoadingEffect(() => {
      fetch('https://packiepresents.onrender.com/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText })
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
      })
      .catch(err => {
        console.error('Failed to generate page:', err);
        document.getElementById('loadingStatus').textContent = '❌ Something went wrong.';
        alert('Something went wrong. Try again.');
      });
    });
  };

  reader.readAsText(file);
}