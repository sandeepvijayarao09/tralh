/* TRALH — interaction
   Quiet by design: a nav tray, and reveals that arrive on scroll.
   Reveal uses a rect check (not IntersectionObserver) so it fires reliably
   on first paint in every environment, including headless preview. */
(function () {
  'use strict';

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

  // Paint the hidden state first, then reveal in-view items so the
  // entrance transition actually plays.
  requestAnimationFrame(function () { requestAnimationFrame(reveal); });

  window.addEventListener('scroll', reveal, { passive: true });
  window.addEventListener('resize', reveal, { passive: true });
  window.addEventListener('load', reveal);
})();
