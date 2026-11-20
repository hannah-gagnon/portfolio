// Hannah Gagnon — Portfolio
// Small, dependency-free interactions. Hover states get added in the next pass.

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Smooth scroll (Lenis) ----------
     Eases mouse-wheel / trackpad scrolling so it glides and slows down gently.
     Touch scrolling stays native. Skipped with prefers-reduced-motion, and the
     site still scrolls normally if the library fails to load. */
  let lenis = null;
  if (!reduceMotion && window.Lenis) {
    lenis = new window.Lenis({
      lerp: 0.1,            // lower = smoother / floatier (0.05–0.15 is the sweet spot)
      wheelMultiplier: 1,
    });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  /* ---------- Nav: hide on scroll down, show on scroll up / when scrolling stops ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const SHOW_AFTER_STOP = 500;   // ms of no scrolling before the nav slides back in
    let lastY = window.scrollY;
    let stopTimer = null;
    let ticking = false;
    const show = () => nav.classList.remove('is-hidden');
    const update = () => {
      ticking = false;
      const y = Math.max(window.scrollY, 0);
      nav.classList.toggle('is-glass', y > 4);
      if (document.body.classList.contains('menu-open') || nav.contains(document.activeElement)) { show(); }
      else if (y > lastY && y > nav.offsetHeight) nav.classList.add('is-hidden');   // scrolling down
      else if (y < lastY) show();                                                     // scrolling up
      lastY = y;
      clearTimeout(stopTimer);
      stopTimer = setTimeout(show, SHOW_AFTER_STOP);
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    nav.addEventListener('focusin', show);   // keyboard users can always reach it
    update();
  }

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
      if (lenis) lenis.stop();
      openBtn.setAttribute('aria-expanded', 'true');
      setTimeout(() => closeBtn.focus(), 50);
    };
    const closeMenu = (returnFocus = true) => {
      menu.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      if (lenis) lenis.start();
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

  /* ---------- Flourish swoops (grow on their own) ----------
     Every cross-stitch flourish (except the one in the mobile menu) is swapped from <img> to
     inline SVG so individual stitches can animate. About GROW_DELAY after a flourish scrolls
     into view, an extra swoop grows off its end, stitch by stitch, and stays.
     BLOOMS are the swoops, traced from Hannah's sketch: [column, row] on the flourish's own
     stitch grid (column 0 / row 0 = the top-left stitch, 10.1 SVG units apart; negative or
     >99 columns grow past the artwork). Listed in growth order, from the flourish outward.
     Only swoops that fit fully on screen grow (the flourishes are offset differently per page).
     A flourish marked data-draw (Home's top one) starts invisible and draws itself in, stitch by
     stitch from the screen edge along its curves, then the swoop carries on from its end.
     Skipped with prefers-reduced-motion (the flourishes stay as plain images). */
  const BLOOMS = [[[9,7],[10,7],[9,6],[8,6],[7,6],[7,5],[6,5],[5,5],[4,5],[3,5],[3,6],[2,5],[2,6],[1,5],[1,6],[0,5],[0,6],[0,7],[-1,6],[-1,7],[-2,6],[-2,7],[-3,7],[-3,8],[-4,7],[-4,8],[-5,7],[-5,8],[-6,8],[-6,9],[-7,8],[-7,9],[-8,8],[-8,9],[-9,9],[-9,8],[-10,9],[-10,8],[-11,9],[-11,8],[-12,8],[-12,7],[-13,7],[-12,6],[-13,6],[-13,5],[-12,5],[-12,4],[-11,4],[-11,3],[-10,4],[-10,3],[-9,3],[-9,4],[-8,4],[-8,5],[-9,5]],[[96,8],[97,8],[98,8],[99,8],[100,8],[100,9],[101,8],[101,9],[102,8],[102,9],[103,8],[103,9],[104,8],[104,9],[105,8],[105,9],[105,10],[106,9],[106,10],[107,9],[107,10],[108,9],[108,10],[109,10],[109,9],[110,10],[110,9],[111,10],[111,9],[110,8],[111,8],[111,7],[112,8],[112,7],[113,7],[112,6],[113,6],[114,6],[113,5],[114,5],[114,4],[115,4],[114,3],[115,3],[114,2],[115,2],[115,1],[114,1],[115,0],[114,0],[113,0],[113,-1],[112,0],[112,-1],[111,-1],[111,0],[110,0],[110,1],[109,1],[109,2],[110,2],[110,3]]];
  // Original stitches to fade out while each swoop grows (Hannah's edit: the left swoop replaces the little bump it grows from)
  const BLOOM_HIDE = [[[7,7],[8,7]],[]];
  const STITCH_PITCH = 10.1;   // distance between stitches in the SVG
  const GROW_DELAY = 1500;     // ms after the flourish comes into view
  const DRAW_DELAY = 500;      // data-draw: ms after page load before it starts drawing in
  const DRAW_STEP = 30;        // data-draw: ms between each "ring" of stitches as it draws in

  if (!reduceMotion && 'DOMParser' in window && 'IntersectionObserver' in window) {
    const NS = 'http://www.w3.org/2000/svg';
    const svgText = {};

    // Only grow swoops that fit fully on screen
    const fit = (svg, x0, vbW, groups) => {
      const rect = svg.getBoundingClientRect();
      const s = rect.width / vbW;
      groups.forEach((g) => {
        const left = rect.left + (x0 + g.minC * STITCH_PITCH) * s;
        const right = rect.left + (x0 + g.maxC * STITCH_PITCH) * s;
        g.off = left < 16 || right > window.innerWidth - 16;
        g.group.classList.toggle('bloom--off', g.off);
      });
    };
    const grow = (svg, x0, vbW, groups) => {
      fit(svg, x0, vbW, groups);
      groups.forEach((g) => g.hide.forEach((p) => p.classList.toggle('is-faded', !g.off)));
      svg.classList.add('is-blooming');
    };

    // data-draw: every stitch appears in order, spreading from the screen edge along the curves
    const draw = (svg) => {
      const f = svg._flourish;
      fit(svg, f.x0, f.vbW, f.groups);
      f.groups.forEach((g) => { if (!g.off) g.hide.forEach((p) => p.classList.add('is-skip')); });
      const rect = svg.getBoundingClientRect();
      const s = rect.width / f.vbW;
      const cells = f.centres.map(([x, y]) => [Math.round((x - f.x0) / STITCH_PITCH), Math.round((y - f.y0) / STITCH_PITCH)]);
      const byKey = new Map(cells.map((c, i) => [c[0] + ',' + c[1], i]));
      const screenX = f.centres.map(([x]) => rect.left + x * s);
      const edge = Math.min(window.innerWidth, rect.right) - 24;
      let queue = cells.map((c, i) => i).filter((i) => screenX[i] >= edge);
      if (!queue.length) queue = [screenX.indexOf(Math.max(...screenX))];
      const level = new Array(cells.length).fill(-1);
      queue.forEach((i) => { level[i] = 0; });
      for (let head = 0; head < queue.length; head++) {
        const i = queue[head];
        const [c, r] = cells[i];
        for (let dc = -2; dc <= 2; dc++) for (let dr = -2; dr <= 2; dr++) {
          const j = byKey.get((c + dc) + ',' + (r + dr));
          if (j !== undefined && level[j] < 0) { level[j] = level[i] + 1; queue.push(j); }
        }
      }
      let max = 0;
      level.forEach((l) => { if (l > max) max = l; });
      f.paths.forEach((p, i) => p.style.setProperty('--d', ((level[i] < 0 ? max : level[i]) * DRAW_STEP) + 'ms'));
      f.groups.forEach((g) => g.group.style.setProperty('--o', (max * DRAW_STEP) + 'ms'));
      svg.getBoundingClientRect();   // commit the hidden state before animating
      svg.classList.add('is-drawing', 'is-blooming');
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const f = entry.target._flourish;
        setTimeout(() => grow(entry.target, f.x0, f.vbW, f.groups), GROW_DELAY);
      });
    }, { threshold: 0.25 });

    const setup = (svg) => {
      const paths = Array.from(svg.querySelectorAll('path'));
      if (!paths.length) return;
      const centres = paths.map((p) => { const b = p.getBBox(); return [b.x + b.width / 2, b.y + b.height / 2]; });
      const x0 = Math.min(...centres.map((c) => c[0]));
      const y0 = Math.min(...centres.map((c) => c[1]));
      const [tx, ty] = centres[0];
      const cellOf = ([x, y]) => Math.round((x - x0) / STITCH_PITCH) + ',' + Math.round((y - y0) / STITCH_PITCH);
      const groups = BLOOMS.map((bloom, gi) => {
        const hideKeys = new Set(BLOOM_HIDE[gi].map(([c, r]) => c + ',' + r));
        const hide = paths.filter((p, pi) => hideKeys.has(cellOf(centres[pi])));
        hide.forEach((p) => p.classList.add('bloom__fade'));
        const group = document.createElementNS(NS, 'g');
        group.setAttribute('class', 'bloom');
        group.style.setProperty('--n', bloom.length);
        bloom.forEach(([c, r], i) => {
          const g = document.createElementNS(NS, 'g');
          g.setAttribute('transform', `translate(${x0 + c * STITCH_PITCH - tx} ${y0 + r * STITCH_PITCH - ty})`);
          const stitch = paths[0].cloneNode(false);
          stitch.setAttribute('class', 'bloom__stitch');
          stitch.style.setProperty('--i', i);
          g.appendChild(stitch);
          group.appendChild(g);
        });
        svg.appendChild(group);
        const cs = bloom.map((b) => b[0]);
        return { group, hide, minC: Math.min(...cs), maxC: Math.max(...cs) };
      });
      svg._flourish = { x0, y0, vbW: svg.viewBox.baseVal.width, groups, paths, centres };
      if (svg.hasAttribute('data-draw')) {
        paths.forEach((p) => p.classList.add('draw__stitch'));
        setTimeout(() => draw(svg), DRAW_DELAY);
      } else {
        observer.observe(svg);
      }
    };

    document.querySelectorAll('img.flourish').forEach((img) => {
      if (img.closest('.menu')) return;   // the full-screen mobile menu keeps its plain flourish
      const src = img.getAttribute('src');
      (svgText[src] = svgText[src] || fetch(src).then((r) => r.text()))
        .then((text) => {
          const svg = document.importNode(new DOMParser().parseFromString(text, 'image/svg+xml').documentElement, true);
          if (svg.nodeName.toLowerCase() !== 'svg') return;
          svg.setAttribute('class', img.className);
          if (img.getAttribute('style')) svg.setAttribute('style', img.getAttribute('style'));
          if (img.hasAttribute('data-draw')) svg.setAttribute('data-draw', '');
          svg.setAttribute('aria-hidden', 'true');
          svg.setAttribute('focusable', 'false');
          img.replaceWith(svg);
          setup(svg);
        })
        .catch(() => img.removeAttribute('data-draw'));   // keep the plain image if anything goes wrong
    });
  }

  /* ---------- Autoplay videos: respect reduced motion ---------- */
  if (reduceMotion) {
    document.querySelectorAll('video[autoplay]').forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });
  }
})();
