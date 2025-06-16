document.addEventListener("DOMContentLoaded", function () {
  const cta = document.createElement("div");
  cta.innerHTML = `
    <div style="background:#111; color:#0f0; padding:1em; margin:2em 0; text-align:center; border: 1px dashed #0f0;">
      <strong>🌐 Want a site like this?</strong><br>
      Upload your resume to auto-build a one-pager + get a custom domain!<br>
      <a href="/start.html" style="color:#0f0; text-decoration:underline;">Start Here</a>
    </div>
  `;
  document.body.appendChild(cta);
});
