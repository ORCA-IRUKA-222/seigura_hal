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
})();
