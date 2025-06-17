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
