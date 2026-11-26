/**
 * typing.js — Efeito de digitação realista estilo terminal
 * - Alternância de frases com pausas de leitura
 * - Velocidade com jitter simulando digitação humana
 * - Respeito a prefers-reduced-motion
 * Dênio Mingote | 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  const textElement = document.querySelector('.hero__typing-text');
  if (!textElement) return;

  const phrases = [
    'Desenvolvedor Web',
    'Estudante de Sistemas de Informação — UFVJM',
    'Entusiasta de Cibersegurança & Redes',
    'Automação de Processos & Análise de Dados'
  ];

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Se o usuário prefere redução de movimento, exibe o primeiro texto fixo
  if (isReducedMotion) {
    textElement.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      // Apaga o caractere
      textElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40; // Apaga mais rápido
    } else {
      // Digita o caractere
      textElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      // Variação orgânica na digitação
      typingSpeed = 80 + Math.random() * 60;
    }

    // Se terminou de digitar a frase inteira
    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Pausa generosa de 2.2s para leitura
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Se terminou de apagar
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500; // Pequena pausa antes de começar a próxima
    }

    setTimeout(type, typingSpeed);
  }

  // Inicia após uma breve pausa inicial
  setTimeout(type, 800);
});
