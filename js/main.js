/**
 * main.js — Lógica central e interatividade do portfólio
 * Dênio Mingote | 2026
 * 
 * Funcionalidades nesta fase:
 * - Alternância de tema (Escuro / Claro) persistido em localStorage
 * - Controle do menu mobile (hambúrguer)
 * - Scroll spy (destaque automático do link da seção visível)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollSpy();
  initContato();
});

/* ==========================================================================
   1. GERENCIAMENTO DE TEMA (DARK / LIGHT)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.querySelector('.nav__theme-toggle');
  if (!themeToggleBtn) return;

  const iconMoon = themeToggleBtn.querySelector('.theme-icon--moon');
  const iconSun = themeToggleBtn.querySelector('.theme-icon--sun');

  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (iconMoon) iconMoon.style.display = 'none';
      if (iconSun) iconSun.style.display = 'block';
      themeToggleBtn.setAttribute('aria-label', 'Alternar para tema escuro');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (iconMoon) iconMoon.style.display = 'block';
      if (iconSun) iconSun.style.display = 'none';
      themeToggleBtn.setAttribute('aria-label', 'Alternar para tema claro');
    }
  }
}

/* ==========================================================================
   2. MENU MOBILE (HAMBÚRGUER)
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.nav__toggle');
  const navMenu = document.querySelector('.nav__menu');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('nav__menu--open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Fecha o menu ao clicar em qualquer link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('nav__menu--open')) {
        navMenu.classList.remove('nav__menu--open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Fecha o menu se clicar fora dele
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      navMenu.classList.remove('nav__menu--open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   3. SCROLL SPY (DESTAQUE DA SEÇÃO ATIVA NA NAVEGAÇÃO)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('nav__link--active');
          } else {
            link.classList.remove('nav__link--active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   4. CONTATO INTERATIVO (COPIAR E-MAIL & ENVIO DIRETO WHATSAPP/GMAIL)
   ========================================================================== */
function initContato() {
  // 1. Botão Copiar E-mail
  const copiarBtn = document.querySelector('.contato__copiar-btn');
  if (copiarBtn) {
    const textoOriginal = copiarBtn.innerHTML;
    copiarBtn.addEventListener('click', async () => {
      const email = copiarBtn.getAttribute('data-email') || 'deniobruno12@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        copiarBtn.classList.add('copiado');
        copiarBtn.innerHTML = '<span class="copiar__texto">✓ Copiado!</span>';

        if (window.soundFX) window.soundFX.playClick();

        setTimeout(() => {
          copiarBtn.classList.remove('copiado');
          copiarBtn.innerHTML = textoOriginal;
        }, 2200);
      } catch (err) {
        // Fallback para navegadores sem suporte à Clipboard API
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        copiarBtn.classList.add('copiado');
        copiarBtn.innerHTML = '<span class="copiar__texto">✓ Copiado!</span>';
        setTimeout(() => {
          copiarBtn.classList.remove('copiado');
          copiarBtn.innerHTML = textoOriginal;
        }, 2200);
      }
    });
  }

  // 2. Formulário Interativo com Ação Direta
  const btnWpp = document.getElementById('btn-enviar-wpp');
  const btnEmail = document.getElementById('btn-enviar-email');
  const nomeInput = document.getElementById('form-nome');
  const emailInput = document.getElementById('form-email');
  const mensagemInput = document.getElementById('form-mensagem');

  function validarCampos() {
    if (!nomeInput.value.trim()) {
      nomeInput.focus();
      return false;
    }
    if (!emailInput.value.trim() || !emailInput.checkValidity()) {
      emailInput.focus();
      return false;
    }
    if (!mensagemInput.value.trim()) {
      mensagemInput.focus();
      return false;
    }
    return true;
  }

  // Enviar via WhatsApp
  if (btnWpp) {
    btnWpp.addEventListener('click', () => {
      if (!validarCampos()) return;

      const nome = nomeInput.value.trim();
      const email = emailInput.value.trim();
      const msg = mensagemInput.value.trim();

      const textoFormatado = `Olá Dênio! Meu nome é *${nome}* (${email}).\n\n*Mensagem:* ${msg}`;
      const urlWpp = `https://wa.me/5531973426635?text=${encodeURIComponent(textoFormatado)}`;

      if (window.soundFX) window.soundFX.playClick();
      window.open(urlWpp, '_blank');
    });
  }

  // Enviar via Gmail / E-mail
  if (btnEmail) {
    btnEmail.addEventListener('click', () => {
      if (!validarCampos()) return;

      const nome = nomeInput.value.trim();
      const email = emailInput.value.trim();
      const msg = mensagemInput.value.trim();

      const assunto = `Contato via Portfólio — ${nome}`;
      const corpo = `Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${msg}`;

      // Abre no compositor do Gmail diretamente
      const urlGmail = `https://mail.google.com/mail/?view=cm&fs=1&to=deniobruno12@gmail.com&su=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;

      if (window.soundFX) window.soundFX.playClick();
      window.open(urlGmail, '_blank');
    });
  }
}
