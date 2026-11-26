/**
 * audio.js — Sintetizador de efeitos sonoros hi-tech via Web Audio API pura
 * Dênio Mingote | 2026
 */

class SoundFX {
  constructor() {
    this.audioCtx = null;
    this.isMuted = localStorage.getItem('sound_muted') !== 'false'; // Padrão: mutado
    this.toggleBtn = document.querySelector('.nav__audio-toggle');
    this.iconMuted = this.toggleBtn ? this.toggleBtn.querySelector('.audio-icon--muted') : null;
    this.iconOn = this.toggleBtn ? this.toggleBtn.querySelector('.audio-icon--on') : null;

    this.initUI();
    this.bindEvents();
  }

  getContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  initUI() {
    this.updateUI();
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => {
        this.isMuted = !this.isMuted;
        localStorage.setItem('sound_muted', String(this.isMuted));
        this.updateUI();
        if (!this.isMuted) {
          this.playClick();
        }
      });
    }
  }

  updateUI() {
    if (!this.toggleBtn || !this.iconMuted || !this.iconOn) return;
    if (this.isMuted) {
      this.iconMuted.style.display = 'block';
      this.iconOn.style.display = 'none';
      this.toggleBtn.setAttribute('title', 'Efeitos sonoros: desativados (clique para ativar)');
      this.toggleBtn.setAttribute('aria-label', 'Ativar efeitos sonoros');
    } else {
      this.iconMuted.style.display = 'none';
      this.iconOn.style.display = 'block';
      this.toggleBtn.setAttribute('title', 'Efeitos sonoros: ativados (clique para mutar)');
      this.toggleBtn.setAttribute('aria-label', 'Desativar efeitos sonoros');
    }
  }

  playHover() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch (e) {}
  }

  playClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(940, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {}
  }

  bindEvents() {
    const interactiveSelectors = 'a, button, .btn, .filtro__btn, .contador';

    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest(interactiveSelectors);
      if (target && !this.isMuted) {
        this.playHover();
      }
    });

    document.addEventListener('click', (e) => {
      const target = e.target.closest(interactiveSelectors);
      if (target && !this.isMuted && target !== this.toggleBtn) {
        this.playClick();
      }
    });
  }
}

window.soundFX = new SoundFX();
