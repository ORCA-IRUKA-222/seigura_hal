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
        const h = base.y - top.y;
        const seed = (n) => { const v = Math.sin(c.p * 12.9898 + n * 78.233) * 43758.5453; return v - Math.floor(v); };
        // 床の灯りだまり（オレンジ・控えめ）
        ctx.globalCompositeOperation = 'lighter';
        let g = ctx.createRadialGradient(base.x, base.y, 0, base.x, base.y, w * 8);
        g.addColorStop(0, `rgba(210,100,30,${.17 * vis * fl})`); g.addColorStop(1, 'rgba(210,100,30,0)');
        ctx.fillStyle = g; ctx.save(); ctx.translate(base.x, base.y); ctx.scale(1, .28); ctx.translate(-base.x, -base.y);
        ctx.beginPath(); ctx.arc(base.x, base.y, w * 8, 0, 6.283); ctx.fill(); ctx.restore();
        ctx.globalCompositeOperation = 'source-over';
        // 真鍮の受け皿
        ctx.fillStyle = `rgba(74,52,26,${vis})`;
        ctx.beginPath(); ctx.ellipse(base.x, base.y, w * 1.5, w * .3, 0, 0, 6.283); ctx.fill();
        ctx.fillStyle = `rgba(122,88,40,${vis})`;
        ctx.beginPath(); ctx.ellipse(base.x, base.y - w * .1, w * 1.35, w * .24, 0, 0, 6.283); ctx.fill();
        // 蝋本体（くすんだ黄褐色・やや傾いた不揃いな上端）
        const lean = (seed(1) - .5) * w * .25, tl = top.y + seed(2) * w * .5, tr = top.y + seed(3) * w * .5;
        const x0 = base.x - w / 2, x1 = base.x + w / 2;
        ctx.fillStyle = `rgba(150,118,70,${vis})`;
        ctx.beginPath(); ctx.moveTo(x0, base.y - w * .1); ctx.lineTo(x0 + lean, tl); ctx.lineTo(x1 + lean, tr); ctx.lineTo(x1, base.y - w * .1); ctx.closePath(); ctx.fill();
        ctx.fillStyle = `rgba(64,42,20,${vis * .55})`; ctx.fillRect(base.x + w * .12, tr, w * .38, base.y - tr - w * .1);   // 影側
        ctx.fillStyle = `rgba(214,150,70,${vis * .3})`; ctx.fillRect(x0, tl, w * .18, base.y - tl - w * .1);               // 炎に照らされた縁
        // 溶けて垂れた跡
        for (let i = 0; i < 3; i++) {
          const dx = x0 + w * (.1 + seed(4 + i) * .7), dl = h * (.12 + seed(7 + i) * .38), dw = w * (.16 + seed(10 + i) * .12);
          ctx.fillStyle = `rgba(176,140,86,${vis * .9})`;
          ctx.beginPath(); ctx.moveTo(dx, tl); ctx.lineTo(dx + dw, tl); ctx.lineTo(dx + dw, tl + dl); ctx.arc(dx + dw / 2, tl + dl, dw / 2, 0, Math.PI); ctx.closePath(); ctx.fill();
        }
        // 溜まった蝋
        ctx.fillStyle = `rgba(110,74,34,${vis})`;
        ctx.beginPath(); ctx.ellipse(base.x + lean / 2, (tl + tr) / 2, w * .45, w * .14, 0, 0, 6.283); ctx.fill();
        // 芯
        ctx.fillStyle = `rgba(20,12,8,${vis})`; ctx.fillRect(base.x + lean / 2 - w * .03, (tl + tr) / 2 - w * .3, w * .06, w * .3);
        // 炎（オレンジ主体・白い芯は小さく）
        const fx = base.x + lean / 2, fy = (tl + tr) / 2 - w * .3;
        const fh = w * 2.0 * fl, fw = w * .6;
        ctx.globalCompositeOperation = 'lighter';
        g = ctx.createRadialGradient(fx, fy - fh * .4, 0, fx, fy - fh * .4, fh * 3);
        g.addColorStop(0, `rgba(230,110,30,${.38 * vis * fl})`); g.addColorStop(1, 'rgba(210,90,20,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(fx, fy - fh * .4, fh * 3, 0, 6.283); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        const sway = Math.sin(t * 7 + c.p) * w * .08;
        ctx.fillStyle = `rgba(232,104,22,${vis * .95})`;
        ctx.beginPath(); ctx.ellipse(fx + sway, fy - fh * .45, fw / 2, fh / 2, 0, 0, 6.283); ctx.fill();
        ctx.fillStyle = `rgba(255,170,60,${vis * .95})`;
        ctx.beginPath(); ctx.ellipse(fx + sway * .6, fy - fh * .38, fw / 3.2, fh / 3, 0, 0, 6.283); ctx.fill();
        ctx.fillStyle = `rgba(255,214,140,${vis * .8})`;
        ctx.beginPath(); ctx.ellipse(fx, fy - fh * .3, fw / 7, fh / 6, 0, 0, 6.283); ctx.fill();
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
        fg.addColorStop(0, 'rgba(50,22,10,0)'); fg.addColorStop(1, 'rgba(50,22,10,.3)');
        ctx.fillStyle = fg; ctx.fillRect(0, hz, W, H - hz);
        ctx.globalCompositeOperation = 'source-over';
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
