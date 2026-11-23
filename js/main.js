(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* header */
  const hd = $('#hd'), btn = $('#menuBtn'), nav = $('#menu');
  const setMenu = (o) => { btn.setAttribute('aria-expanded', o); nav.classList.toggle('is-open', o); };
  btn.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  const onScroll = () => hd.classList.toggle('is-solid', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* reveal */
  const rv = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { threshold: .15 });
    rv.forEach(el => io.observe(el));
  } else rv.forEach(el => el.classList.add('is-in'));

  /* story: read more */
  const more = $('#moreBtn'), body = $('.story__more');
  more.addEventListener('click', () => {
    const open = !body.classList.contains('is-open');
    body.classList.toggle('is-open', open);
    more.setAttribute('aria-expanded', open);
    more.textContent = open ? 'close ▲' : 'read more ▼';
  });

  /* cast: day / night */
  const sw = $$('.switch button');
  sw.forEach(b => b.addEventListener('click', () => {
    document.body.dataset.part = b.dataset.part;
    sw.forEach(x => x.setAttribute('aria-selected', x === b));
  }));

  /* ticket tabs */
  const tabs = $$('.tabs button');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => { x.setAttribute('aria-selected', x === t); $('#' + x.dataset.tab).hidden = x !== t; });
  }));

  /* event status (JST) */
  const DAY = new Date('2026-10-24T14:00:00+09:00').getTime();
  const END = new Date('2026-10-24T19:00:00+09:00').getTime();
  const st = $('#status'), tb = $('#ticket-btn'), now = Date.now();
  if (now < DAY) st.innerHTML = `開催まで あと<b>${Math.ceil((DAY - now) / 864e5)}</b>日`;
  else if (now < END) st.textContent = '本日開催！';
  else {
    st.textContent = 'このイベントは終了しました';
    tb.textContent = '販売終了（最新情報は公式へ）';
    tb.classList.add('is-closed'); tb.removeAttribute('href');
  }

  /* opening : ろうそくの廊下を進み、奥からロゴが近づく */
  const op = $('#op');
  if (op) {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try { seen = !!sessionStorage.getItem('op-seen'); } catch (_) {}
    if (seen || reduce) { op.remove(); }
    else {
      const cv = $('#opCv'), ctx = cv.getContext('2d'), logo = $('#opLogo');
      let W = 0, H = 0, R = 1, raf = 0, done = false;
      const fit = () => { R = Math.min(devicePixelRatio || 1, 2); W = cv.width = innerWidth * R; H = cv.height = innerHeight * R; };
      fit(); addEventListener('resize', fit);

      const LOGO_Z = 11.5, GAP = 1.5, SIDE = 1.05, CH = .5, CAM_H = .95;
      const END_Z = LOGO_Z - 3.4, TRAVEL = 7.4, TOTAL = 9.6;
      const candles = [];
      for (let z = 1.2; z < LOGO_Z - 0.6; z += GAP) {
        candles.push({ z, x: -SIDE, p: Math.random() * 6.3 }, { z: z + GAP / 2, x: SIDE, p: Math.random() * 6.3 });
      }
      candles.sort((a, b) => b.z - a.z);

      const proj = (wx, wy, dz) => {
        const f = H * .95, hz = H * .47;
        return { x: W / 2 + wx / dz * f, y: hz + (CAM_H - wy) / dz * f, s: f / dz };
      };
      const drawCandle = (c, camZ, t) => {
        const dz = c.z - camZ; if (dz < .3) return;
        const base = proj(c.x, 0, dz), top = proj(c.x, CH, dz);
        const w = .085 * base.s, vis = Math.min(1, (LOGO_Z - dz) / 2.2) * Math.min(1, dz / .8);
        if (vis <= 0) return;
        const fl = .85 + .15 * Math.sin(t * 9 + c.p) + .06 * Math.sin(t * 23 + c.p * 2);
        // 床の灯りだまり
        let g = ctx.createRadialGradient(base.x, base.y, 0, base.x, base.y, w * 9);
        g.addColorStop(0, `rgba(255,150,60,${.22 * vis * fl})`); g.addColorStop(1, 'rgba(255,150,60,0)');
        ctx.fillStyle = g; ctx.save(); ctx.translate(base.x, base.y); ctx.scale(1, .28); ctx.translate(-base.x, -base.y);
        ctx.beginPath(); ctx.arc(base.x, base.y, w * 9, 0, 6.283); ctx.fill(); ctx.restore();
        // 本体
        ctx.fillStyle = `rgba(214,200,170,${vis})`;
        ctx.fillRect(base.x - w / 2, top.y, w, base.y - top.y);
        ctx.fillStyle = `rgba(120,104,80,${vis * .6})`; ctx.fillRect(base.x + w * .15, top.y, w * .35, base.y - top.y);
        // 炎
        const fh = w * 2.1 * fl, fw = w * .62;
        g = ctx.createRadialGradient(base.x, top.y - fh * .35, 0, base.x, top.y - fh * .35, fh * 3.2);
        g.addColorStop(0, `rgba(255,170,70,${.5 * vis * fl})`); g.addColorStop(1, 'rgba(255,140,40,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(base.x, top.y - fh * .35, fh * 3.2, 0, 6.283); ctx.fill();
        ctx.fillStyle = `rgba(255,${190 + 30 * fl | 0},90,${vis})`;
        ctx.beginPath(); ctx.ellipse(base.x + Math.sin(t * 7 + c.p) * w * .08, top.y - fh * .45, fw / 2, fh / 2, 0, 0, 6.283); ctx.fill();
        ctx.fillStyle = `rgba(255,246,210,${vis})`;
        ctx.beginPath(); ctx.ellipse(base.x, top.y - fh * .32, fw / 4, fh / 3.2, 0, 0, 6.283); ctx.fill();
      };

      const t0 = performance.now();
      const finish = () => {
        if (done) return; done = true; cancelAnimationFrame(raf);
        op.classList.add('is-done');
        document.body.classList.remove('op-lock');
        try { sessionStorage.setItem('op-seen', '1'); } catch (_) {}
        setTimeout(() => op.remove(), 1500);
      };
      document.body.classList.add('op-lock');
      const frame = (now) => {
        if (done) return;
        const t = (now - t0) / 1000;
        const p = Math.min(1, Math.max(0, (t - .6) / TRAVEL));
        const camZ = END_Z * (1 - Math.pow(1 - p, 1.8));
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#050303'; ctx.fillRect(0, 0, W, H);
        // 奥へ続く廊下のうっすらした床
        const hz = H * .47, fg = ctx.createLinearGradient(0, hz, 0, H);
        fg.addColorStop(0, 'rgba(60,28,16,0)'); fg.addColorStop(1, 'rgba(60,28,16,.35)');
        ctx.fillStyle = fg; ctx.fillRect(0, hz, W, H - hz);
        ctx.globalCompositeOperation = 'lighter';
        const fadeIn = Math.min(1, t / 1.2);
        ctx.globalAlpha = fadeIn;
        candles.forEach(c => drawCandle(c, camZ, t));
        ctx.globalAlpha = 1;
        // ロゴ：奥から近づく
        const dz = LOGO_Z - camZ, lp = proj(0, 0, dz);
        const lw = Math.min(W * .62, 5.2 * lp.s);
        logo.style.width = lw / R + 'px';
        logo.style.top = (hz - 0.2 * lp.s * 0 + 0) / R + 'px';
        logo.style.opacity = Math.max(0, Math.min(1, (t - 3.2) / 2.2)).toFixed(3);
        op.classList.toggle('s1', t > .9 && t < 3.3);
        op.classList.toggle('s2', t >= 3.5 && t < 6.2);
        if (t > TOTAL) return finish();
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
      $('#opSkip').addEventListener('click', finish);
      addEventListener('keydown', (e) => { if (e.key === 'Escape') finish(); });
    }
  }
})();
