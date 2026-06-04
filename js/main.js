/* =============================================
   SISTEMA DE MONITORAMENTO DE CATÁSTROFES
   main.js — Interatividade Principal
   ============================================= */

// === MENU HAMBÚRGUER ===
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('nav-mobile');

if (hamburger && navMobile) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMobile.classList.toggle('open');
  });

  // Fechar ao clicar em link
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMobile.classList.remove('open');
    });
  });
}

// === ACTIVE NAV LINK ===
function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
setActiveNavLink();

// === ACCORDION (FAQ) ===
document.querySelectorAll('.accordion-header').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.accordion-item');
    const isOpen = item.classList.contains('open');

    // Fechar todos
    document.querySelectorAll('.accordion-item').forEach(el => el.classList.remove('open'));

    // Abrir o clicado (toggle)
    if (!isOpen) item.classList.add('open');
  });
});

// === TABS ===
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('[data-tabs]') || btn.closest('section');
    const target = btn.dataset.tab;

    group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    group.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const panel = group.querySelector(`[data-panel="${target}"]`);
    if (panel) panel.classList.add('active');
  });
});

// === MODAL ===
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Fechar ao clicar fora
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

// Botões de fechar modal
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    const overlay = btn.closest('.modal-overlay');
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

// Botões que abrem modal
document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.modal));
});

// === SLIDER ===
document.querySelectorAll('.slider-container').forEach(container => {
  const track = container.querySelector('.slider-track');
  const slides = container.querySelectorAll('.slide');
  const dots = container.querySelectorAll('.dot');
  const prevBtn = container.querySelector('.slider-prev');
  const nextBtn = container.querySelector('.slider-next');

  if (!track || slides.length === 0) return;

  let current = 0;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Auto-play
  setInterval(() => goTo(current + 1), 5000);
});

// === TOAST NOTIFICATIONS ===
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✔', error: '✖', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${message}</span>`;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// === VALIDAÇÃO DE FORMULÁRIO ===
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Limpar erros anteriores
    contactForm.querySelectorAll('.field-error').forEach(el => el.classList.remove('visible'));
    contactForm.querySelectorAll('input, textarea, select').forEach(el => el.classList.remove('error'));

    // Validar campos
    const fields = [
      { id: 'nome', label: 'nome', minLen: 3 },
      { id: 'email', label: 'e-mail', isEmail: true },
      { id: 'assunto', label: 'assunto' },
      { id: 'mensagem', label: 'mensagem', minLen: 10 },
    ];

    fields.forEach(({ id, label, minLen, isEmail }) => {
      const input = document.getElementById(id);
      const error = document.getElementById(`${id}-error`);
      if (!input) return;

      const val = input.value.trim();

      if (!val) {
        input.classList.add('error');
        if (error) { error.textContent = `O campo ${label} é obrigatório.`; error.classList.add('visible'); }
        valid = false;
      } else if (minLen && val.length < minLen) {
        input.classList.add('error');
        if (error) { error.textContent = `${label} deve ter no mínimo ${minLen} caracteres.`; error.classList.add('visible'); }
        valid = false;
      } else if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        input.classList.add('error');
        if (error) { error.textContent = 'Informe um e-mail válido.'; error.classList.add('visible'); }
        valid = false;
      }
    });

    if (valid) {
      showToast('Mensagem enviada com sucesso!', 'success');
      contactForm.reset();
      openModal('modal-success');
    } else {
      showToast('Corrija os erros antes de enviar.', 'error');
    }
  });

  // Feedback em tempo real
  contactForm.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim()) {
        input.classList.remove('error');
        const error = document.getElementById(`${input.id}-error`);
        if (error) error.classList.remove('visible');
      }
    });
  });
}

// === ANIMAÇÃO DE SCROLL (reveal) ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .team-card, .alert-entry, .stat-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// === CONTADOR ANIMADO ===
function animateCount(el, target, suffix = '') {
  let current = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString('pt-BR') + suffix;
    if (current >= target) clearInterval(timer);
  }, 25);
}

const counters = document.querySelectorAll('[data-count]');
if (counters.length > 0) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.done) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        animateCount(el, target, suffix);
        el.dataset.done = 'true';
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));
}

// === CLOCK TEMPO REAL ===
const clockEl = document.getElementById('live-clock');
if (clockEl) {
  function updateClock() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('pt-BR');
  }
  updateClock();
  setInterval(updateClock, 1000);
}
