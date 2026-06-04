/* ============================================================
   SIGNBRIDGE AI — ANIMATIONS JS
   animations.js · Scroll reveal, counters, tabs, FAQ, progress
   ============================================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Scroll Progress Bar ─────────────────────────────────────
  function initProgressBar() {
    const bar = document.createElement('div');
    bar.className = 'nav-progress';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', 'Progreso de lectura de la página');
    bar.setAttribute('aria-valuenow', '0');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    document.body.appendChild(bar);

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      bar.style.width = pct + '%';
      bar.setAttribute('aria-valuenow', Math.round(pct));
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ── Reveal on Scroll ────────────────────────────────────────
  function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (prefersReducedMotion) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  // ── Animated Counters ──────────────────────────────────────
  function animateCounter(el, target, duration, decimals) {
    if (prefersReducedMotion) {
      el.textContent = decimals ? target.toFixed(1) : Math.round(target);
      return;
    }
    const start  = performance.now();
    const from   = 0;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (target - from) * eased;
      el.textContent = decimals ? current.toFixed(1) : Math.round(current);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = decimals ? target.toFixed(1) : Math.round(target);
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    // Hero KPI badges
    const kpiNums = document.querySelectorAll('.kpi-num[data-target]');
    // Stat numbers in problem section
    const statNums = document.querySelectorAll('.stat-number[data-target]');
    // Metric values
    const metricVals = document.querySelectorAll('.metric-value[data-target]');

    const allCounters = [...kpiNums, ...statNums, ...metricVals];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target'));
          const decimals = target % 1 !== 0;
          const duration = 1400 + Math.random() * 400;
          animateCounter(el, target, duration, decimals);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    allCounters.forEach(el => observer.observe(el));
  }

  // ── Metric Bar Animations ───────────────────────────────────
  function initMetricBars() {
    const bars = document.querySelectorAll('.metric-bar-fill[data-width]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = parseFloat(bar.getAttribute('data-width'));
          if (prefersReducedMotion) {
            bar.style.width = width + '%';
          } else {
            setTimeout(() => { bar.style.width = width + '%'; }, 120);
          }
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.4 });

    bars.forEach(bar => { bar.style.width = '0%'; observer.observe(bar); });
  }

  // ── Lighthouse Card Visibility ──────────────────────────────
  function initLighthouseCards() {
    const cards = document.querySelectorAll('.lighthouse-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    cards.forEach(card => observer.observe(card));

    if (prefersReducedMotion) {
      cards.forEach(c => c.classList.add('visible'));
    }
  }

  // ── Benefits Tabs ──────────────────────────────────────────
  function initTabs() {
    const tabBtns   = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('aria-controls');

        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        tabPanels.forEach(p => {
          p.classList.remove('active');
          p.hidden = true;
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const panel = document.getElementById(target);
        if (panel) {
          panel.classList.add('active');
          panel.hidden = false;
        }
      });

      // Keyboard navigation for tabs
      btn.addEventListener('keydown', (e) => {
        const buttons = [...tabBtns];
        const index = buttons.indexOf(e.target);
        if (e.key === 'ArrowRight') {
          buttons[(index + 1) % buttons.length].focus();
          buttons[(index + 1) % buttons.length].click();
          e.preventDefault();
        }
        if (e.key === 'ArrowLeft') {
          buttons[(index - 1 + buttons.length) % buttons.length].focus();
          buttons[(index - 1 + buttons.length) % buttons.length].click();
          e.preventDefault();
        }
      });
    });
  }

  // ── FAQ Accordion ──────────────────────────────────────────
  function initFAQ() {
    const questions = document.querySelectorAll('.faq-question');

    questions.forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const answerId = btn.getAttribute('aria-controls');
        const answer = document.getElementById(answerId);

        // Close all
        questions.forEach(q => {
          q.setAttribute('aria-expanded', 'false');
          const a = document.getElementById(q.getAttribute('aria-controls'));
          if (a) a.hidden = true;
        });

        // Open current (toggle)
        if (!expanded) {
          btn.setAttribute('aria-expanded', 'true');
          if (answer) answer.hidden = false;
        }
      });

      // Keyboard support
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  // ── Active Nav Link on Scroll ───────────────────────────────
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' });

    sections.forEach(section => observer.observe(section));
  }

  // ── Pipeline Steps Staggered Entrance ──────────────────────
  function initPipelineStagger() {
    const steps = document.querySelectorAll('.pipeline-step');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          if (!prefersReducedMotion) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateX(0)';
            }, i * 80);
          } else {
            entry.target.style.opacity = '1';
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    steps.forEach((step, i) => {
      if (!prefersReducedMotion) {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-16px)';
        step.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
      }
      observer.observe(step);
    });
  }

  // ── OE items stagger ───────────────────────────────────────
  function initOEStagger() {
    const items = document.querySelectorAll('.oe-item');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          if (!prefersReducedMotion) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, i * 90);
          } else {
            entry.target.style.opacity = '1';
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    items.forEach((item, i) => {
      if (!prefersReducedMotion) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(12px)';
        item.style.transition = `opacity 0.45s ease ${i * 0.07}s, transform 0.45s ease ${i * 0.07}s`;
      }
      observer.observe(item);
    });
  }

  // ── Timeline items ──────────────────────────────────────────
  function initTimelineStagger() {
    const items = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!prefersReducedMotion) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
          } else {
            entry.target.style.opacity = '1';
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    items.forEach((item, i) => {
      if (!prefersReducedMotion) {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `opacity 0.55s ease ${i * 0.1}s, transform 0.55s ease ${i * 0.1}s`;
      }
      observer.observe(item);
    });
  }

  // ── Initialize all ──────────────────────────────────────────
  function init() {
    initProgressBar();
    initReveal();
    initCounters();
    initMetricBars();
    initLighthouseCards();
    initTabs();
    initFAQ();
    initActiveNav();
    initPipelineStagger();
    initOEStagger();
    initTimelineStagger();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
