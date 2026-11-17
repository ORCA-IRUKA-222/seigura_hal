(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const safe = (fn) => { try { return fn(); } catch (_) { return null; } };

  /* ---------- gate ---------- */
  const gate = $('#gate');
  const openGate = () => {
    gate.classList.add('is-open');
    document.body.classList.remove('locked');
    safe(() => sessionStorage.setItem('seigura-gate', '1'));
    setTimeout(() => gate.remove(), 1400);
  };
  if (gate) {
    if (safe(() => sessionStorage.getItem('seigura-gate'))) {
      gate.remove();
    } else {
      document.body.classList.add('locked');
      $('#gate-open').addEventListener('click', openGate);
      $('#gate-skip').addEventListener('click', openGate);
      $('#gate-open').focus({ preventScroll: true });
    }
  }

  /* ---------- nav ---------- */
  const nav = $('#nav'), progress = $('#progress');
  const toggle = $('#navToggle'), list = $('#navList');
  const setMenu = (open) => { toggle.setAttribute('aria-expanded', open); list.classList.toggle('is-open', open); };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', list).forEach(a => a.addEventListener('click', () => setMenu(false)));
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('is-solid', y > 60);
    progress.style.width = (h > 0 ? y / h * 100 : 0) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- reveal ---------- */
  const targets = $$('.reveal, .tale__p');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { threshold: .18, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(t => io.observe(t));
  } else targets.forEach(t => t.classList.add('is-in'));
  // hero is visible immediately after the gate; stagger it
  $$('.hero .reveal').forEach((el, i) => { el.style.transitionDelay = (0.25 + i * .18) + 's'; });

  /* ---------- day / night switch ---------- */
  const btns = $$('.switch__btn');
  const setPart = (p) => {
    document.body.dataset.part = p;
    btns.forEach(b => b.setAttribute('aria-selected', b.dataset.part === p));
  };
  btns.forEach(b => b.addEventListener('click', () => setPart(b.dataset.part)));
  setPart('night');

  /* ---------- event status (JST) ---------- */
  const T = (iso) => new Date(iso).getTime();
  const DAY_START = T('2026-10-24T14:00:00+09:00');
  const END = T('2026-10-24T19:00:00+09:00');
  const status = $('#status'), ticket = $('#ticket-btn');
  const renderStatus = () => {
    const now = Date.now();
    if (now < DAY_START) {
      const d = Math.ceil((DAY_START - now) / 864e5);
      status.innerHTML = `館の扉が開くまで、あと <b>${d}</b> 日`;
    } else if (now < END) {
      status.innerHTML = '今宵、館の扉は開かれている';
    } else {
      status.innerHTML = 'この夜会は、すでに幕を下ろしました';
      if (ticket) { ticket.textContent = '受付終了（最新情報は公式へ）'; ticket.classList.add('is-closed'); ticket.removeAttribute('href'); }
      const lead = $('.finale__lead');
      if (lead) lead.innerHTML = '夜会は、終わった。<br>けれど館の扉は、閉じきらない。';
    }
  };
  renderStatus();

  /* ---------- particle canvases ---------- */
  const fit = (c) => { const r = Math.min(devicePixelRatio || 1, 2); c.width = innerWidth * r; c.height = innerHeight * r; return r; };

  // fog behind the invitation
  const fog = $('#gate-fog');
  if (fog && gate && !reduce) {
    const ctx = fog.getContext('2d'); let r = fit(fog), t = 0;
    const blobs = Array.from({ length: 9 }, (_, i) => ({ x: Math.random(), y: Math.random(), s: .25 + Math.random() * .3, v: .0004 + Math.random() * .0006, p: Math.random() * 6 }));
    const loop = () => {
      if (!document.body.contains(fog)) return;
      t++; ctx.clearRect(0, 0, fog.width, fog.height);
      blobs.forEach(b => {
        const x = ((b.x + Math.sin(t * b.v * 6 + b.p) * .1) * fog.width), y = (b.y + Math.cos(t * b.v * 5 + b.p) * .08) * fog.height;
        const rad = b.s * Math.max(fog.width, fog.height) * .5;
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, 'rgba(120,90,190,.18)'); g.addColorStop(1, 'rgba(120,90,190,0)');
        ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      });
      requestAnimationFrame(loop);
    };
    addEventListener('resize', () => { r = fit(fog); });
    loop();
  }

  // drifting embers / fireflies
  const cv = $('#embers');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d'); let r = fit(cv);
    const N = innerWidth < 700 ? 38 : 70;
    const mk = (init) => ({
      x: Math.random() * cv.width, y: init ? Math.random() * cv.height : cv.height + 20,
      z: .4 + Math.random() * 1.2, vy: .15 + Math.random() * .5, ph: Math.random() * 6.28,
      hue: Math.random() < .7 ? 42 : 275
    });
    let ps = Array.from({ length: N }, () => mk(true));
    addEventListener('resize', () => { r = fit(cv); ps = ps.map(() => mk(true)); });
    let last = 0;
    const draw = (ts) => {
      if (document.hidden) { requestAnimationFrame(draw); return; }
      if (ts - last < 28) { requestAnimationFrame(draw); return; } last = ts;
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (const p of ps) {
        p.y -= p.vy * p.z * r; p.ph += .03;
        p.x += Math.sin(p.ph) * .5 * p.z * r;
        if (p.y < -20) Object.assign(p, mk(false));
        const a = (.35 + .35 * Math.sin(p.ph * 2.3)) * Math.min(1, p.z);
        const rad = (2 + p.z * 3) * r;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 3);
        g.addColorStop(0, `hsla(${p.hue},90%,70%,${a})`); g.addColorStop(1, `hsla(${p.hue},90%,60%,0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, rad * 3, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }

  // hero parallax
  const bg = $('.hero__bg');
  if (bg && !reduce) addEventListener('scroll', () => { if (scrollY < innerHeight) bg.style.translate = `0 ${scrollY * .25}px`; }, { passive: true });
})();
