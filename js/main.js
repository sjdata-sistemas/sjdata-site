/**
 * SJDATA — Site Principal
 * Interatividade e Animações
 * 2026
 */

// ─── NAVBAR SCROLL ───
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navCta = document.querySelector('.nav-cta');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ─── MENU HAMBURGER ───
navToggle?.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
  navCta.classList.toggle('open');
});

// Fechar menu ao clicar em link
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    navCta.classList.remove('open');
  });
});

// ─── SMOOTH SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = document.querySelector('.navbar')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── REVEAL ON SCROLL ───
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ─── COUNTER ANIMATION ───
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => {
  counterObserver.observe(el);
});

// ─── FORMULÁRIO CONTATO ───
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', function(e) {
  e.preventDefault();

  const btn = this.querySelector('[type="submit"]');
  const nome    = this.querySelector('#nome')?.value?.trim();
  const empresa = this.querySelector('#empresa')?.value?.trim();
  const telefone= this.querySelector('#telefone')?.value?.trim();
  const msg     = this.querySelector('#mensagem')?.value?.trim();
  const produto = this.querySelector('#produto')?.value;

  if (!nome || !telefone) {
    showToast('Preencha pelo menos seu nome e telefone.', 'error');
    return;
  }

  // Enviar via WhatsApp
  const text = `Olá! Me chamo *${nome}*${empresa ? ` e trabalho na *${empresa}*` : ''}.%0A%0ATenho interesse em: *${produto || 'Sistema SJDATA'}*%0A%0A${msg ? `Mensagem: ${msg}` : 'Gostaria de mais informações.'}%0A%0ATelefone: ${telefone}`;
  const waUrl = `https://wa.me/5511976695896?text=${text}`;

  btn.textContent = '✓ Enviando...';
  btn.style.opacity = '0.7';

  setTimeout(() => {
    window.open(waUrl, '_blank');
    btn.textContent = 'Enviar pelo WhatsApp';
    btn.style.opacity = '1';
    showToast('Redirecionando para o WhatsApp! 🚀', 'success');
    this.reset();
  }, 800);
});

// ─── TOAST NOTIFICATION ───
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 28px;
    z-index: 9999;
    background: ${type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'};
    border: 1px solid ${type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'};
    color: ${type === 'success' ? '#6EE7B7' : '#FCA5A5'};
    padding: 14px 20px;
    border-radius: 12px;
    font-family: var(--font);
    font-size: 0.875rem;
    font-weight: 600;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    animation: slideInRight 0.3s ease;
    max-width: 300px;
  `;
  toast.textContent = message;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ─── TELEFONE MASK ───
document.getElementById('telefone')?.addEventListener('input', function() {
  let v = this.value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 6) {
    v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  } else if (v.length > 2) {
    v = `(${v.slice(0,2)}) ${v.slice(2)}`;
  } else if (v.length > 0) {
    v = `(${v}`;
  }
  this.value = v;
});

// ─── ACTIVE NAV LINK ON SCROLL ───
const sections = document.querySelectorAll('section[id]');
const navLinkItems = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinkItems.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--color-text)';
    }
  });
});
