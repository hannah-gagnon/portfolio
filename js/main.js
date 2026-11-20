// Hannah Gagnon — Portfolio
// Small, dependency-free interactions. Hover states get added in the next pass.

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- "More projects" expand / collapse (Home) ---------- */
  document.querySelectorAll('[data-more-toggle]').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    const label = btn.querySelector('[data-more-label]');
    if (!panel) return;

    const open = () => {
      panel.hidden = false;
      const target = panel.scrollHeight;
      panel.style.height = '0px';
      requestAnimationFrame(() => { panel.style.height = target + 'px'; });
      btn.setAttribute('aria-expanded', 'true');
      label.textContent = btn.dataset.lessText;
    };
    const close = () => {
      panel.style.height = panel.scrollHeight + 'px';
      requestAnimationFrame(() => { panel.style.height = '0px'; });
      btn.setAttribute('aria-expanded', 'false');
      label.textContent = btn.dataset.moreText;
      const done = () => { panel.hidden = true; panel.removeEventListener('transitionend', done); };
      if (reduceMotion) done(); else panel.addEventListener('transitionend', done);
    };

    panel.addEventListener('transitionend', () => {
      if (btn.getAttribute('aria-expanded') === 'true') panel.style.height = 'auto';
    });
    btn.addEventListener('click', () => {
      btn.getAttribute('aria-expanded') === 'true' ? close() : open();
    });
  });

  /* ---------- Tabs (Misc) ---------- */
  document.querySelectorAll('[role="tablist"]').forEach((list) => {
    const tabs = Array.from(list.querySelectorAll('[role="tab"]'));
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        next.focus(); select(next);
      });
    });
  });


  /* ---------- Mobile menu (full screen) ---------- */
  const menu = document.querySelector('[data-menu]');
  const openBtn = document.querySelector('[data-menu-open]');
  if (menu && openBtn) {
    const closeBtn = menu.querySelector('[data-menu-close]');
    const focusables = () => Array.from(menu.querySelectorAll('a, button'));
    const openMenu = () => {
      menu.classList.add('is-open');
      document.body.classList.add('menu-open');
      openBtn.setAttribute('aria-expanded', 'true');
      setTimeout(() => closeBtn.focus(), 50);
    };
    const closeMenu = (returnFocus = true) => {
      menu.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      openBtn.setAttribute('aria-expanded', 'false');
      if (returnFocus) openBtn.focus();
    };
    openBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', () => closeMenu());
    menu.querySelectorAll('.menu__link').forEach((a) => a.addEventListener('click', () => closeMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (!menu.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeMenu();
      if (e.key === 'Tab') {           // keep focus inside the menu
        const f = focusables(); const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.matchMedia('(min-width: 761px)').addEventListener('change', (mq) => { if (mq.matches) closeMenu(false); });
  }

  /* ---------- Hover videos (project cards + Up next) ---------- */
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover && !reduceMotion) {
    document.querySelectorAll('[data-hover-video]').forEach((el) => {
      const video = el.querySelector('video.card__video');
      if (!video) return;
      const thumb = video.parentElement;
      const start = () => {
        if (!video.src) video.src = video.dataset.src;
        const p = video.play();
        if (p) p.then(() => thumb.classList.add('is-playing')).catch(() => {});
      };
      const stop = () => {
        thumb.classList.remove('is-playing');
        video.pause();
        setTimeout(() => { if (!thumb.classList.contains('is-playing')) video.currentTime = 0; }, 260);
      };
      el.addEventListener('mouseenter', start);
      el.addEventListener('mouseleave', stop);
      el.addEventListener('focusin', start);
      el.addEventListener('focusout', stop);
    });
  }

  /* ---------- Autoplay videos: respect reduced motion ---------- */
  if (reduceMotion) {
    document.querySelectorAll('video[autoplay]').forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });
  }
})();
