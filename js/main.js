/* TRALH — interaction
   Quiet by design: current-page marker, a nav tray, and reveals on scroll.
   Reveal uses a rect check (not IntersectionObserver) so it fires reliably
   on first paint in every environment, including headless preview. */
(function () {
  'use strict';

  /* ---- Mark the current page in the nav ---- */
  var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var brand = { 'darbar.html': 1, 'solene.html': 1, 'auri.html': 1 };
  document.querySelectorAll('.gnav__links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path || (brand[path] && href === 'houses.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ---- Mobile nav tray ---- */
  var burger = document.querySelector('.gnav__burger');
  var tray = document.querySelector('.tray');
  if (burger && tray) {
    burger.addEventListener('click', function () {
      var open = tray.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    tray.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        tray.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Reveals + staggered groups ---- */
  var items = [].slice.call(document.querySelectorAll('.reveal, [data-stagger]'));

  function reveal() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = items.length - 1; i >= 0; i--) {
      var el = items[i];
      if (el.getBoundingClientRect().top < vh * 0.9) {
        el.classList.add('is-in');
        items.splice(i, 1);
      }
    }
  }

  requestAnimationFrame(function () { requestAnimationFrame(reveal); });
  window.addEventListener('scroll', reveal, { passive: true });
  window.addEventListener('resize', reveal, { passive: true });
  window.addEventListener('load', reveal);
})();
