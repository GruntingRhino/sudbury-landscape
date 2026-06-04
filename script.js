/* Sudbury Lawn & Landscape Design — interaction layer */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Scroll reveal ─────────────────────────────────────────────────────── */
  function initReveal() {
    if (prefersReducedMotion) return;

    const targets = document.querySelectorAll('.reveal, .reveal-left, .scale-reveal');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ─── Geo canvas (approach panel / about panel) ─────────────────────────── */
  function drawGeoCanvas(canvas, dark) {
    if (!canvas) return;

    const parent = canvas.parentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
    }
    resize();

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const W = parent.offsetWidth;
    const H = parent.offsetHeight;
    const bg     = dark ? '#0a0a0a' : '#0a0a0a';
    const stroke = dark ? 'rgba(61,90,62,0.55)'   : 'rgba(61,90,62,0.5)';
    const accent = dark ? 'rgba(139,201,141,0.18)' : 'rgba(139,201,141,0.12)';
    const faint  = dark ? 'rgba(245,242,238,0.06)' : 'rgba(245,242,238,0.04)';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* Grid of fine lines */
    const step = 54;
    ctx.strokeStyle = faint;
    ctx.lineWidth = .5;
    for (let x = 0; x <= W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    /* Organic concentric ovals — botanical reference */
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    const cx = W * 0.62, cy = H * 0.44;
    for (let i = 1; i <= 7; i++) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, i * 52, i * 38, Math.PI / 7, 0, Math.PI * 2);
      ctx.stroke();
    }

    /* Accent filled ellipse core */
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 60, 44, Math.PI / 7, 0, Math.PI * 2);
    ctx.fill();

    /* Diagonal structure lines */
    ctx.strokeStyle = stroke;
    ctx.lineWidth = .8;
    const diagonals = [
      [0, H * 0.3, W * 0.6, 0],
      [0, H, W, 0],
      [W * 0.2, H, W, H * 0.1],
    ];
    diagonals.forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });

    /* Corner mark */
    ctx.strokeStyle = 'rgba(139,201,141,0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W - 30, 20);
    ctx.lineTo(W - 20, 20);
    ctx.lineTo(W - 20, 30);
    ctx.stroke();
  }

  /* ─── About page abstract plate ─────────────────────────────────────────── */
  function drawAboutCanvas(canvas) {
    if (!canvas) return;
    const parent = canvas.parentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const w = parent.offsetWidth;
    const h = parent.offsetHeight || 480;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, w, h);

    /* Subtle grid */
    ctx.strokeStyle = 'rgba(245,242,238,0.05)';
    ctx.lineWidth = .5;
    const step = 44;
    for (let x = 0; x <= w; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    /* Layered leaf-vein structure */
    const cx = w * 0.5, cy = h * 0.52;
    const veinColor = 'rgba(61,90,62,0.7)';
    ctx.strokeStyle = veinColor;
    ctx.lineWidth = 1.2;

    function vein(fromX, fromY, angle, length, depth) {
      if (depth === 0 || length < 8) return;
      const toX = fromX + Math.cos(angle) * length;
      const toY = fromY + Math.sin(angle) * length;
      ctx.beginPath(); ctx.moveTo(fromX, fromY); ctx.lineTo(toX, toY); ctx.stroke();
      const spread = 0.36;
      vein(toX, toY, angle - spread, length * 0.7, depth - 1);
      vein(toX, toY, angle + spread, length * 0.7, depth - 1);
    }

    ctx.lineWidth = 1.4;
    vein(cx, cy + h * 0.22, -Math.PI / 2, h * 0.34, 5);

    /* Thin accent ring */
    ctx.strokeStyle = 'rgba(139,201,141,0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 90, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(139,201,141,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 150, 0, Math.PI * 2);
    ctx.stroke();

    /* Caption text at bottom */
    ctx.fillStyle = 'rgba(155,150,142,0.5)';
    ctx.font = '700 10px ui-sans-serif, Inter, sans-serif';
    ctx.letterSpacing = '0.18em';
    ctx.fillText('SUDBURY, MA', 20, h - 20);
  }

  /* ─── Scroll parallax on hero heading ───────────────────────────────────── */
  function initParallax() {
    if (prefersReducedMotion) return;
    const hero = document.querySelector('.hero');
    if (!hero) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroH = hero.offsetHeight;
          if (scrollY < heroH) {
            const pct = scrollY / heroH;
            const heading = hero.querySelector('.display');
            if (heading) {
              heading.style.transform = `translateY(${pct * 40}px)`;
              heading.style.opacity = String(1 - pct * 0.8);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─── Notes / Capabilities carousel ────────────────────────────────────── */
  function initNotesCarousel() {
    const items  = document.querySelectorAll('.note-item');
    const dots   = document.querySelectorAll('.notes-dot');
    const catVal = document.querySelector('.note-cat-val');
    if (!items.length) return;

    const categories = ['Drainage', 'Planting', 'Site Light', 'Edge Work', 'Grading'];
    let current = 0;
    let timer   = null;

    function goTo(idx) {
      items[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (idx + items.length) % items.length;
      items[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
      if (catVal) catVal.textContent = categories[current] || '';
    }

    function start() {
      timer = setInterval(function () { goTo(current + 1); }, 5000);
    }
    function stop() {
      clearInterval(timer);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        stop(); goTo(i); start();
      });
    });

    if (!prefersReducedMotion) {
      start();
    }
  }

  /* ─── Contact form (local demo — no real submission) ────────────────────── */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      /* Basic required-field check */
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach((field) => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#c0392b';
          valid = false;
        }
      });
      if (!valid) {
        required[0].focus();
        return;
      }

      /* Demo: show success, hide form */
      form.style.display = 'none';
      if (success) {
        success.style.display = 'block';
        success.focus();
      }
    });

    /* Clear error state on input */
    form.querySelectorAll('input, textarea').forEach((el) => {
      el.addEventListener('input', () => {
        el.style.borderColor = '';
      });
    });
  }

  /* ─── Mobile nav toggle ─────────────────────────────────────────────────── */
  function initMobileNav() {
    /* Nav links are hidden on mobile via CSS; phone CTA always visible. */
    /* If a hamburger button is desired, it can be injected here. */
  }

  /* ─── Init ──────────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initParallax();
    initContactForm();
    initMobileNav();
    initNotesCarousel();
  });

})();
