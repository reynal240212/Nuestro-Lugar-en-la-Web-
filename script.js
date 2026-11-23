(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ========================================================================
     1. DATOS DEL ÁLBUM Y NOTAS DE APOYO
     ======================================================================== */
  const GALLERY_PHOTOS = [
    { src: 'img/1.jpg', alt: 'Fiorella y Reinaldo abrazados', caption: 'Contigo todo es hogar' },
    { src: 'img/2.jpg', alt: 'Fiorella y Reinaldo sonriendo juntos', caption: 'Sonrisas que iluminan' },
    { src: 'img/3.jpg', alt: 'Selfie alegre de Fiorella y Reinaldo', caption: 'Nuestra complicidad' },
    { src: 'img/4.jpg', alt: 'Fiorella apoyada en el hombro de Reinaldo', caption: 'Abrazos que curan' },
    { src: 'img/5.png', alt: 'Fiorella y Reinaldo paseando', caption: 'Cada paseo juntos' },
    { src: 'img/6.png', alt: 'Fiorella y Reinaldo compartiendo una tarde', caption: 'Tardes favoritas' },
    { src: 'img/7.png', alt: 'Fiorella y Reinaldo juntos', caption: 'Siempre nosotros' },
  ];

  const SUPPORT_NOTES = [
    'No tienes que tener todo resuelto hoy. Avanza a tu ritmo, respira y confía en que cada paso te está llevando justo donde debes estar.',
    'Incluso en los días nublados, tu esfuerzo vale muchísimo. Permítete descansar sin culpa; mañana seguimos construyendo juntos.',
    'Eres más fuerte de lo que crees en los momentos difíciles y más valiosa de lo que las palabras alcanzan a decir.',
    'Cuando el ruido del mundo pese demasiado, recuerda que siempre tienes un lugar seguro en mis brazos para soltar todo.',
    'No importa cuán largo parezca el camino: no lo estás recorriendo sola. Un paso pequeño hoy sigue siendo avanzar.',
  ];

  /* ========================================================================
     2. CONTADOR EN TIEMPO REAL (DESDE EL 24/11/2025)
     ======================================================================== */
  const START_DATE = new Date(2025, 10, 24, 0, 0, 0); // 24 de noviembre de 2025

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function calculateCalendarDiff(start, now) {
    if (now < start) {
      return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0, totalMonths: 0 };
    }

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();
    let hours = now.getHours() - start.getHours();
    let minutes = now.getMinutes() - start.getMinutes();
    let seconds = now.getSeconds() - start.getSeconds();

    if (seconds < 0) { seconds += 60; minutes -= 1; }
    if (minutes < 0) { minutes += 60; hours -= 1; }
    if (hours < 0) { hours += 24; days -= 1; }
    if (days < 0) {
      const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += prevMonthDays;
      months -= 1;
    }
    if (months < 0) {
      months += 12;
      years -= 1;
    }

    const totalDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;

    return { years, months, days, hours, minutes, seconds, totalDays, totalMonths };
  }

  function getNextAnniversaryInfo(now) {
    let nextMonthDate = new Date(now.getFullYear(), now.getMonth(), 24, 0, 0, 0);
    if (now.getDate() > 24 || (now.getDate() === 24 && now >= nextMonthDate)) {
      if (now.getDate() === 24) {
        return '¡Hoy celebramos un mes más juntos!';
      }
      nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 24, 0, 0, 0);
    }

    const diffMs = nextMonthDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (daysLeft === 1) {
      const isYearly = nextMonthDate.getMonth() === 10;
      return isYearly
        ? '¡Mañana cumplimos nuestro aniversario anual!'
        : '¡Mañana celebramos un mes más juntos!';
    }
    return `Faltan ${daysLeft} días para nuestro próximo 24`;
  }

  function initLiveCounter() {
    const heroTotalDays = document.getElementById('hero-total-days');
    const yearsWrap = document.getElementById('unit-years-wrap');
    const elYears = document.getElementById('cd-years');
    const lblYears = document.getElementById('lbl-years');
    const elMonths = document.getElementById('cd-months');
    const lblMonths = document.getElementById('lbl-months');
    const elDays = document.getElementById('cd-days');
    const lblDays = document.getElementById('lbl-days');
    const elHours = document.getElementById('cd-hours');
    const elMinutes = document.getElementById('cd-minutes');
    const elSeconds = document.getElementById('cd-seconds');
    const milestoneText = document.getElementById('milestone-text');
    const nextMilestoneInfo = document.getElementById('next-milestone-info');

    function update() {
      const now = new Date();
      const diff = calculateCalendarDiff(START_DATE, now);

      if (heroTotalDays) {
        heroTotalDays.textContent = diff.totalDays.toLocaleString('es-ES');
      }

      if (diff.years > 0 && yearsWrap) {
        yearsWrap.hidden = false;
        elYears.textContent = diff.years;
        lblYears.textContent = diff.years === 1 ? 'Año' : 'Años';
      } else if (yearsWrap) {
        yearsWrap.hidden = true;
      }

      elMonths.textContent = diff.months;
      lblMonths.textContent = diff.months === 1 ? 'Mes' : 'Meses';
      elDays.textContent = diff.days;
      lblDays.textContent = diff.days === 1 ? 'Día' : 'Días';
      elHours.textContent = pad2(diff.hours);
      elMinutes.textContent = pad2(diff.minutes);
      elSeconds.textContent = pad2(diff.seconds);

      if (milestoneText) {
        if (now.getDate() === 24 && now.getMonth() === 10 && diff.years >= 1) {
          milestoneText.textContent = `¡Feliz aniversario #${diff.years}, mi amor!`;
        } else if (now.getDate() === 24 && diff.totalMonths >= 1) {
          milestoneText.textContent = `¡Feliz mes #${diff.totalMonths}, mi amor!`;
        } else if (diff.years >= 1) {
          const yLabel = diff.years === 1 ? '1 año' : `${diff.years} años`;
          milestoneText.textContent = `Más de ${yLabel} escribiendo nuestra historia`;
        } else {
          milestoneText.textContent = `${diff.totalMonths} meses y contando · Desde el 24/11/2025`;
        }
      }

      if (nextMilestoneInfo) {
        nextMilestoneInfo.textContent = getNextAnniversaryInfo(now);
      }
    }

    update();
    setInterval(update, 1000);
  }

  /* ========================================================================
     3. PROGRESO DE SCROLL, NAVBAR ACTIVA Y REVEAL AL SCROLLEAR
     ======================================================================== */
  function initScrollEnhancements() {
    const progressBar = document.getElementById('scroll-progress-bar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main > section[id]');

    function updateProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      if (progressBar) {
        progressBar.style.width = `${pct}%`;
      }
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    // Sección activa en la barra de navegación
    if ('IntersectionObserver' in window) {
      const navObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute('id');
              navLinks.forEach((link) => {
                link.classList.toggle('active', link.dataset.section === id);
              });
            }
          });
        },
        { rootMargin: '-38% 0px -48% 0px', threshold: 0.05 }
      );

      sections.forEach((sec) => navObserver.observe(sec));
    }

    // Animaciones de entrada al hacer scroll
    const reveals = document.querySelectorAll('.reveal');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => revealObserver.observe(el));
  }

  /* ========================================================================
     4. PÉTALOS SUTILES FLOTANTES + BOTÓN "ENVIAR UN LATIDO"
     ======================================================================== */
  function initAmbientPetals() {
    const container = document.getElementById('petals-container');
    const toggleBtn = document.getElementById('ambient-toggle');
    if (!container) return;

    let enabled = !prefersReducedMotion;
    let timerId = null;

    function spawnPetal() {
      if (!enabled || document.hidden) return;
      if (container.childElementCount > 18) return;

      const petal = document.createElement('span');
      const isGold = Math.random() < 0.35;
      petal.className = `petal ${isGold ? 'petal--gold' : 'petal--rose'}`;

      const size = isGold ? Math.random() * 5 + 4 : Math.random() * 9 + 7;
      const duration = Math.random() * 7 + 9;
      const left = Math.random() * 100;
      const drift = (Math.random() - 0.5) * 140;
      const rot = (Math.random() > 0.5 ? 1 : -1) * (160 + Math.random() * 200);
      const opacity = isGold ? 0.45 : 0.38 + Math.random() * 0.25;

      petal.style.width = `${size}px`;
      petal.style.height = `${isGold ? size : size * 1.35}px`;
      petal.style.left = `${left}vw`;
      petal.style.animationDuration = `${duration}s`;
      petal.style.setProperty('--petal-drift', `${drift}px`);
      petal.style.setProperty('--petal-rot', `${rot}deg`);
      petal.style.setProperty('--petal-opacity', opacity.toFixed(2));

      container.appendChild(petal);
      setTimeout(() => petal.remove(), duration * 1000 + 200);
    }

    function syncState() {
      container.classList.toggle('paused', !enabled);
      if (toggleBtn) {
        toggleBtn.classList.toggle('is-off', !enabled);
        toggleBtn.setAttribute('aria-pressed', String(enabled));
      }
      if (enabled && !timerId) {
        spawnPetal();
        timerId = setInterval(spawnPetal, 1200);
      } else if (!enabled && timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        enabled = !enabled;
        syncState();
      });
    }

    syncState();
  }

  function initLovePulseButton() {
    const btn = document.getElementById('pulse-love-btn');
    const label = document.getElementById('pulse-love-label');
    if (!btn) return;

    let resetTimer = null;

    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const originX = e.clientX || rect.left + rect.width / 2;
      const originY = e.clientY || rect.top + rect.height / 2;

      if (!prefersReducedMotion) {
        const glyphs = ['♥', '✦', '♡'];
        const colors = ['#7c1f3c', '#be5270', '#c19663', '#d97a94'];

        for (let i = 0; i < 12; i += 1) {
          const particle = document.createElement('span');
          particle.className = 'burst-heart';
          particle.textContent = glyphs[i % glyphs.length];
          particle.style.left = `${originX}px`;
          particle.style.top = `${originY}px`;
          particle.style.color = colors[i % colors.length];
          particle.style.fontSize = `${12 + Math.random() * 10}px`;

          const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.4;
          const dist = 55 + Math.random() * 75;
          particle.style.setProperty('--bx', `${Math.cos(angle) * dist}px`);
          particle.style.setProperty('--by', `${Math.sin(angle) * dist - 35}px`);
          particle.style.setProperty('--br', `${(Math.random() - 0.5) * 60}deg`);

          document.body.appendChild(particle);
          setTimeout(() => particle.remove(), 1250);
        }
      }

      if (label) {
        label.textContent = '¡Latido enviado!';
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          label.textContent = 'Enviar un latido';
        }, 1800);
      }
    });
  }

  /* ========================================================================
     5. GALERÍA INTERACTIVA Y LIGHTBOX A PANTALLA COMPLETA
     ======================================================================== */
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const backdrop = document.getElementById('lightbox-backdrop');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const imgEl = document.getElementById('lightbox-img');
    const captionEl = document.getElementById('lightbox-caption');
    const counterEl = document.getElementById('lightbox-counter');
    const triggers = document.querySelectorAll('[data-lightbox-index]');

    if (!lightbox || !imgEl) return;

    let currentIndex = 0;
    let lastTrigger = null;
    let touchStartX = 0;

    function renderPhoto(index) {
      currentIndex = (index + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length;
      const item = GALLERY_PHOTOS[currentIndex];
      imgEl.src = item.src;
      imgEl.alt = item.alt;
      captionEl.textContent = item.caption;
      counterEl.textContent = `${currentIndex + 1} / ${GALLERY_PHOTOS.length}`;
    }

    function openLightbox(index, triggerEl) {
      lastTrigger = triggerEl || null;
      renderPhoto(index);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      if (lastTrigger) {
        lastTrigger.focus();
      }
    }

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const idx = Number(trigger.getAttribute('data-lightbox-index')) || 0;
        openLightbox(idx, trigger);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => renderPhoto(currentIndex - 1));
    nextBtn.addEventListener('click', () => renderPhoto(currentIndex + 1));

    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') renderPhoto(currentIndex - 1);
      if (e.key === 'ArrowRight') renderPhoto(currentIndex + 1);
    });

    // Soporte táctil (swipe) en móviles
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const deltaX = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(deltaX) > 45) {
        renderPhoto(deltaX > 0 ? currentIndex - 1 : currentIndex + 1);
      }
    }, { passive: true });
  }

  /* ========================================================================
     6. SECCIÓN "PARA TI" (NOTAS ROTATIVAS + RESPIRACIÓN GUIADA)
     ======================================================================== */
  function initSupportSection() {
    const noteText = document.getElementById('support-note-text');
    const noteCounter = document.getElementById('note-counter');
    const nextNoteBtn = document.getElementById('next-note-btn');

    let noteIdx = 0;

    if (nextNoteBtn && noteText) {
      nextNoteBtn.addEventListener('click', () => {
        noteIdx = (noteIdx + 1) % SUPPORT_NOTES.length;
        noteText.classList.add('is-switching');
        setTimeout(() => {
          noteText.textContent = SUPPORT_NOTES[noteIdx];
          if (noteCounter) {
            noteCounter.textContent = `${noteIdx + 1} / ${SUPPORT_NOTES.length}`;
          }
          noteText.classList.remove('is-switching');
        }, 220);
      });
    }

    const breatheBtn = document.getElementById('breathe-toggle-btn');
    const breatheWidget = document.getElementById('breathe-widget');
    const breatheCircle = document.getElementById('breathe-circle');
    const breathePhase = document.getElementById('breathe-phase');

    if (!breatheBtn || !breatheWidget || !breatheCircle || !breathePhase) return;

    const phases = [
      { cls: 'inhale', label: 'Inhala' },
      { cls: 'hold', label: 'Sostén' },
      { cls: 'exhale', label: 'Exhala' },
    ];

    let breatheTimer = null;
    let phaseIdx = 0;

    function runPhase() {
      const current = phases[phaseIdx];
      breatheCircle.classList.remove('inhale', 'hold', 'exhale');
      void breatheCircle.offsetWidth; // reflow suave
      breatheCircle.classList.add(current.cls);
      breathePhase.textContent = current.label;
      phaseIdx = (phaseIdx + 1) % phases.length;
    }

    function stopBreathing() {
      clearInterval(breatheTimer);
      breatheTimer = null;
      breatheCircle.classList.remove('inhale', 'hold', 'exhale');
      breatheWidget.hidden = true;
      breatheBtn.setAttribute('aria-expanded', 'false');
      breatheBtn.querySelector('span').textContent = 'Tómate un respiro';
    }

    breatheBtn.addEventListener('click', () => {
      const isOpen = !breatheWidget.hidden;
      if (isOpen) {
        stopBreathing();
        return;
      }

      breatheWidget.hidden = false;
      breatheBtn.setAttribute('aria-expanded', 'true');
      breatheBtn.querySelector('span').textContent = 'Cerrar respiro';
      phaseIdx = 0;
      runPhase();
      breatheTimer = setInterval(runPhase, 4000);
    });
  }

  /* ========================================================================
     7. SOBRE CON SELLO DE LACRE Y CARTA DESPLEGABLE
     ======================================================================== */
  function initEnvelopeLetter() {
    const stage = document.getElementById('envelope-stage');
    const envelope = document.getElementById('envelope');
    const letterSheet = document.getElementById('letter-sheet');
    const closeBtn = document.getElementById('close-letter-btn');

    if (!stage || !envelope || !letterSheet) return;

    let isAnimating = false;

    function openEnvelope() {
      if (isAnimating || stage.classList.contains('is-open')) return;
      isAnimating = true;
      envelope.classList.add('opening');
      envelope.setAttribute('aria-expanded', 'true');

      const delay = prefersReducedMotion ? 50 : 620;
      setTimeout(() => {
        stage.classList.add('is-open');
        letterSheet.setAttribute('aria-hidden', 'false');
        isAnimating = false;
      }, delay);
    }

    function closeEnvelope() {
      if (isAnimating || !stage.classList.contains('is-open')) return;
      isAnimating = true;
      stage.classList.remove('is-open');
      letterSheet.setAttribute('aria-hidden', 'true');
      envelope.classList.remove('opening');
      envelope.setAttribute('aria-expanded', 'false');

      setTimeout(() => {
        isAnimating = false;
        envelope.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
      }, 300);
    }

    envelope.addEventListener('click', openEnvelope);
    envelope.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeEnvelope);
    }
  }

  /* ========================================================================
     INICIALIZACIÓN
     ======================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initLiveCounter();
    initScrollEnhancements();
    initAmbientPetals();
    initLovePulseButton();
    initLightbox();
    initSupportSection();
    initEnvelopeLetter();
  });
})();
