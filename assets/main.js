/* Gideons River — interactions */
(function () {
  'use strict';

  // ── Nav: solid on scroll ──
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile menu ──
  var toggle = document.querySelector('.nav__toggle');
  var overlay = document.querySelector('.nav__overlay');
  function closeMenu() { document.body.classList.remove('menu-open'); if (toggle) toggle.setAttribute('aria-expanded', 'false'); }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  if (overlay) {
    overlay.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // ── Reveal on scroll ──
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ── Contact form ──
  // Submits to the form's `action` (FormSubmit AJAX endpoint) via fetch and shows
  // the inline success state.
  var form = document.querySelector('#contact-form');
  if (form) {
    var success = document.querySelector('#form-success');
    function showSuccess() {
      form.style.display = 'none';
      if (success) { success.hidden = false; success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var action = form.getAttribute('action') || '';
      if (!action) { showSuccess(); return; }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      fetch(action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (r.ok) { showSuccess(); }
          else { if (btn) { btn.disabled = false; btn.textContent = 'Send message'; } alert('Something went wrong. Please try again shortly.'); }
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = 'Send message'; }
          alert('Network error. Please try again shortly.');
        });
    });
  }
})();
