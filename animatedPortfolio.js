// File: animatedPortfolio.js

// Animate text with typing effect
export function typeWriter(element, text, delay = 50) {
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, delay);
    }
  }
  element.textContent = '';
  type();
}

// Add scroll-based fade-in animations
export function setupScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => observer.observe(el));
}

// Initialize the hero animation
export function startHeroAnimation() {
  const headline = document.getElementById('hero-headline');
  if (headline) {
    typeWriter(headline, 'Turn Your Resume Into a Real Site ✨');
  }
}

// Optional parallax effect on background
export function setupParallax() {
  const bg = document.querySelector('.parallax-bg');
  if (!bg) return;

  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.5;
    bg.style.transform = `translateY(${offset}px)`;
  });
}

// Bootstrap all animations
export function initializePortfolioAnimations() {
  startHeroAnimation();
  setupScrollAnimations();
  setupParallax();
}
