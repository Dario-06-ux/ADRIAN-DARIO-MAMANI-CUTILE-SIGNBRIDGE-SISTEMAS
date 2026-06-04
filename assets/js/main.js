/* ============================================================
   SIGNBRIDGE AI — MAIN JS
   main.js · Navbar, smooth scroll, back to top, misc
   ============================================================ */

(function () {
  'use strict';

  // ── Navbar Scroll Behavior ─────────────────────────────────
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;
    let ticking = false;

    function updateNavbar() {
      const scrollY = window.scrollY;
      if (scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = scrollY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }, { passive: true });

    updateNavbar();
  }

  // ── Mobile Hamburger Menu ──────────────────────────────────
  function initHamburger() {
    const btn  = document.getElementById('navHamburger');
    const menu = document.getElementById('navMenu');
    if (!btn || !menu) return;

    function openMenu() {
      menu.classList.add('open');
      btn.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Cerrar menú');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.remove('open');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Abrir menú');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', () => {
      const isOpen = menu.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    // Close on link click
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('open') &&
          !menu.contains(e.target) &&
          !btn.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
        btn.focus();
      }
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  // ── Smooth Scroll for anchor links ─────────────────────────
  function initSmoothScroll() {
    const OFFSET = 76; // navbar height

    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#' || href === '#!') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;

        window.scrollTo({
          top: Math.max(0, top),
          behavior: 'smooth',
        });

        // Update URL without scrolling
        history.pushState(null, '', href);

        // Set focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.addEventListener('blur', () => {
          target.removeAttribute('tabindex');
        }, { once: true });
      });
    });
  }

  // ── Back to Top Button ─────────────────────────────────────
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
        btn.hidden = false;
      } else {
        btn.classList.remove('visible');
        setTimeout(() => {
          if (!btn.classList.contains('visible')) btn.hidden = true;
        }, 300);
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Return focus to top
      document.getElementById('inicio')?.focus({ preventScroll: true });
    });
  }

  // ── Skip to Main Content link ──────────────────────────────
  function initSkipLink() {
    const skip = document.createElement('a');
    skip.href = '#inicio';
    skip.textContent = 'Saltar al contenido principal';
    skip.className = 'skip-link';
    skip.style.cssText = `
      position: fixed; top: -100%; left: 8px; z-index: 10000;
      background: var(--cyan); color: var(--navy);
      font-weight: 700; font-size: 0.88rem;
      padding: 10px 18px; border-radius: 0 0 8px 8px;
      transition: top 0.2s ease;
    `;
    skip.addEventListener('focus', () => { skip.style.top = '0'; });
    skip.addEventListener('blur',  () => { skip.style.top = '-100%'; });
    document.body.insertBefore(skip, document.body.firstChild);
  }

  // ── External links — open in new tab safely ────────────────
  function initExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      if (!link.hostname || link.hostname !== window.location.hostname) {
        if (!link.getAttribute('target')) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      }
    });
  }

  // ── Lazy images (native) ───────────────────────────────────
  function initLazyImages() {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.setAttribute('src', img.getAttribute('data-src'));
      img.removeAttribute('data-src');
    });
  }

  // ── Current year in footer ─────────────────────────────────
  function initYear() {
    const yearSpans = document.querySelectorAll('.footer-year');
    const year = new Date().getFullYear();
    yearSpans.forEach(s => { s.textContent = year; });
  }

  // ── Tooltip on tech strip ──────────────────────────────────
  function initTechTooltips() {
    const techImgs = document.querySelectorAll('.hero-tech-strip img[title]');
    techImgs.forEach(img => {
      img.setAttribute('tabindex', '0');
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') img.click();
      });
    });
  }

  // ── Ensure FAQ answers are properly hidden on load ─────────
  function initFAQAria() {
    document.querySelectorAll('.faq-answer').forEach(answer => {
      answer.hidden = true;
    });
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  // ── Ensure first tab panel is shown ───────────────────────
  function initFirstTab() {
    const panels = document.querySelectorAll('.tab-panel');
    panels.forEach((p, i) => {
      if (i === 0) { p.classList.add('active'); p.hidden = false; }
      else         { p.classList.remove('active'); p.hidden = true; }
    });
  }

  // ── Keyboard trap prevention in modal-less overlays ────────
  function initA11y() {
    // Ensure all interactive elements inside hidden content are not focusable
    document.querySelectorAll('[hidden]').forEach(el => {
      el.querySelectorAll('a, button, input, textarea, select, [tabindex]').forEach(focusable => {
        if (!focusable.hasAttribute('data-original-tabindex')) {
          focusable.setAttribute('data-original-tabindex', focusable.getAttribute('tabindex') || '0');
        }
        focusable.setAttribute('tabindex', '-1');
      });
    });
  }

  // ── Hero scroll indicator hide on scroll ──────────────────
  function initScrollIndicator() {
    const indicator = document.querySelector('.hero-scroll-indicator');
    if (!indicator) return;
    window.addEventListener('scroll', () => {
      indicator.style.opacity = window.scrollY > 100 ? '0' : '0.5';
    }, { passive: true });
  }

  // ── Initialize all ─────────────────────────────────────────
  function init() {
    initSkipLink();
    initNavbar();
    initHamburger();
    initSmoothScroll();
    initBackToTop();
    initExternalLinks();
    initLazyImages();
    initYear();
    initTechTooltips();
    initFAQAria();
    initFirstTab();
    initScrollIndicator();

    // Log project info in console for developers
    console.info(
      '%c SignBridge AI %c v1.0 · UNIFRANZ 2026 ',
      'background:#0D1B2A; color:#00D4FF; font-weight:bold; padding:4px 8px; border-radius:4px 0 0 4px;',
      'background:#00D4FF; color:#0D1B2A; font-weight:bold; padding:4px 8px; border-radius:0 4px 4px 0;'
    );
    console.info('📚 Repositorio: https://github.com/adrianmamani/signbridge-ai');
    console.info('🌐 GitHub Pages: https://adrianmamani.github.io/signbridge-ai/');
    console.info('👤 Autor: Adrián Darío Mamani Cutile · Ingeniería en Sistemas · UNIFRANZ');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
