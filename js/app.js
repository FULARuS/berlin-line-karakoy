import { DRINKS, KIND, GLASS, MENU, drinkName } from './data.js';

const PHONE = '905496003540';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');

/* ============================ I18N ============================ */
const T = {
  en: {
    'hero.title': 'Berlin Line Karaköy — cocktail bar, live music and kitchen till 4 AM',
    'hero.hint': 'Drag the rail · tap a drink', 'hero.loading': 'Setting the bar…',
    'hero.nowebgl': 'Your browser can’t show the 3D bar — scroll down for the full cocktail list.',
    'top.reserve': 'Reserve', 'st.open': 'Open now · till 04:00', 'st.closed': 'Opens at 10:00',
    'card.ingredients': 'Ingredients', 'card.garnish': 'Garnish', 'card.glass': 'Glass', 'card.strength': 'Strength', 'card.cta': 'Reserve a table',
    'nav.bar': 'Bar', 'nav.cocktails': 'Cocktails', 'nav.menu': 'Menu', 'nav.res': 'Reservations',
    'bar.eyebrow': 'Bar · Music · Kitchen', 'bar.h2': 'Music. Drinks. Food. <em>Till 4 AM.</em>',
    'bar.p1': 'A ruby-red room on Mumhane Caddesi with a live band every evening, a bartender who takes cocktails personally and a heated terrace for long Karaköy nights.',
    'bar.p2': 'From 10:00 the open kitchen serves Berlin-style döner, crispy chicken burgers and wings — with five house sauces on every plate.',
    'stat.rating': '2,022 Google reviews', 'stat.hours': 'Open every day', 'stat.liveV': 'Live', 'stat.music': 'Band every evening',
    'f1.h': 'Live music', 'f1.p': 'Every evening a band plays — 182 guests mention it in their reviews.',
    'f2.h': 'Heated terrace', 'f2.p': 'Patio heaters outside, a warm room inside, Glühwein on cold nights.',
    'f3.h': 'We speak your language', 'f3.p': 'English, Turkish and Russian — at the bar and on this site.',
    'ck.eyebrow': 'The cocktail list', 'ck.h2': 'Twelve glasses on the rail',
    'ck.p': 'Signatures from our bartenders and the classics done properly. Prices at the bar — ask for today’s list.',
    'ck.all': 'All', 'ck.sig': 'Signature', 'ck.classic': 'Classics', 'ck.view': 'View on the rail ↑',
    'ck.quote': '“The tastiest, best-quality cocktails. We haven’t had better anywhere.”', 'ck.quoteby': 'Irina R. · Google review',
    'menu.eyebrow': 'Kitchen · 10:00–04:00', 'menu.h2': 'Hungry at any hour',
    'menu.p': 'Prices from our printed menu, in Turkish lira. Everything crispy comes with fries and five house sauces.',
    'menu.note': 'Prices may change — message us for today’s menu.', 'tag.hot': 'hot', 'tag.veg': 'veg', 'tag.sig': 'signature',
    'rev.eyebrow': 'Guests about us', 'rev.h2': '1,279 five-star nights',
    'rev.1': 'Really enjoyed the atmosphere — lovely lighting and a live band playing calm music. They kindly extended happy hour for us.',
    'rev.2': 'Super cosy bar with very friendly staff. Good music, good beer — they even serve mulled wine.',
    'rev.3': 'My mum and I had a wonderful time. Timur made our evening — and the live music made it even better.',
    'rev.all': 'All 2,022 reviews on Google',
    'res.eyebrow': 'Reservations', 'res.h2': 'Hold a table close to the band', 'res.p': 'Fill in the form — it opens WhatsApp with your request ready to send.',
    'res.name': 'Your name', 'res.date': 'Date', 'res.time': 'Time', 'res.guests': 'Guests', 'res.note': 'Occasion or wishes (optional)', 'res.submit': 'Send via WhatsApp',
    'res.where': 'Find us', 'res.walk': 'A few minutes’ walk from Karaköy tram (T1) and the ferry pier.', 'res.hoursK': 'Hours', 'res.hours': 'Every day 10:00 – 04:00', 'res.phoneK': 'Phone',
    'res.route': 'Get directions', 'res.call': 'Call', 'res.err': 'Please add your name and a date.', 'res.ok': 'WhatsApp opened — just press send.',
    'res.more': '10+',
    'wa.book': 'Hi Berlin Line! I’d like to book a table.\nName: {name}\nDate: {date}\nTime: {time}\nGuests: {guests}{note}',
    'wa.note': '\nNote: ', 'wa.drink': 'Hi Berlin Line! I’d like to book a table and try the {drink}. Date: … Time: … Guests: …'
  },
  tr: {
    'hero.title': 'Berlin Line Karaköy — kokteyl bar, canlı müzik ve sabah 4’e kadar mutfak',
    'hero.hint': 'Rafı kaydırın · bir içkiye dokunun', 'hero.loading': 'Bar hazırlanıyor…',
    'hero.nowebgl': 'Tarayıcınız 3D barı gösteremiyor — kokteyl listesi için aşağı kaydırın.',
    'top.reserve': 'Rezervasyon', 'st.open': 'Şu an açık · 04:00’e kadar', 'st.closed': '10:00’da açılır',
    'card.ingredients': 'Malzemeler', 'card.garnish': 'Garnitür', 'card.glass': 'Kadeh', 'card.strength': 'Sertlik', 'card.cta': 'Masa ayırt',
    'nav.bar': 'Bar', 'nav.cocktails': 'Kokteyller', 'nav.menu': 'Menü', 'nav.res': 'Rezervasyon',
    'bar.eyebrow': 'Bar · Müzik · Mutfak', 'bar.h2': 'Müzik. İçki. Yemek. <em>Sabah 4’e kadar.</em>',
    'bar.p1': 'Mumhane Caddesi’nde yakut kırmızısı bir salon: her akşam canlı grup, kokteylleri kişisel mesele sayan bir barmen ve uzun Karaköy geceleri için ısıtmalı teras.',
    'bar.p2': '10:00’dan itibaren açık mutfakta Berlin usulü döner, çıtır tavuk burger ve kanat — her tabakta beş ev yapımı sosla.',
    'stat.rating': '2.022 Google yorumu', 'stat.hours': 'Her gün açık', 'stat.liveV': 'Canlı', 'stat.music': 'Her akşam grup',
    'f1.h': 'Canlı müzik', 'f1.p': 'Her akşam grup çalıyor — 182 misafir yorumunda bundan bahsediyor.',
    'f2.h': 'Isıtmalı teras', 'f2.p': 'Dışarıda ısıtıcılar, içeride sıcak bir salon, soğuk gecelerde sıcak şarap.',
    'f3.h': 'Dilinizi konuşuyoruz', 'f3.p': 'İngilizce, Türkçe ve Rusça — barda da, bu sitede de.',
    'ck.eyebrow': 'Kokteyl listesi', 'ck.h2': 'Raftaki on iki kadeh',
    'ck.p': 'Barmenlerimizin imza kokteylleri ve hakkıyla yapılmış klasikler. Fiyatlar barda — günün listesini sorun.',
    'ck.all': 'Tümü', 'ck.sig': 'İmza', 'ck.classic': 'Klasikler', 'ck.view': 'Rafta gör ↑',
    'ck.quote': '“En lezzetli, en kaliteli kokteyller. Hiçbir yerde daha iyisini içmedik.”', 'ck.quoteby': 'Irina R. · Google yorumu',
    'menu.eyebrow': 'Mutfak · 10:00–04:00', 'menu.h2': 'Her saatte acıkanlara',
    'menu.p': 'Fiyatlar basılı menümüzden, Türk lirası. Tüm çıtırlar patates ve beş ev sosuyla gelir.',
    'menu.note': 'Fiyatlar değişebilir — güncel menü için bize yazın.', 'tag.hot': 'acı', 'tag.veg': 'vejetaryen', 'tag.sig': 'imza',
    'rev.eyebrow': 'Misafirlerimiz', 'rev.h2': '1.279 beş yıldızlı gece',
    'rev.1': 'Atmosferi çok sevdik — güzel ışıklar ve sakin müzik çalan canlı bir grup. Bizim için happy hour’u uzattılar.',
    'rev.2': 'Çok samimi bir bar, çalışanlar çok güler yüzlü. İyi müzik, iyi bira — sıcak şarap bile var.',
    'rev.3': 'Annemle harika vakit geçirdik. Timur akşamımızı güzelleştirdi, canlı müzik daha da iyi yaptı.',
    'rev.all': 'Google’daki 2.022 yorumun tamamı',
    'res.eyebrow': 'Rezervasyon', 'res.h2': 'Sahneye yakın bir masa ayıralım', 'res.p': 'Formu doldurun — talebiniz hazır şekilde WhatsApp’ta açılır.',
    'res.name': 'Adınız', 'res.date': 'Tarih', 'res.time': 'Saat', 'res.guests': 'Kişi', 'res.note': 'Özel gün ya da istek (isteğe bağlı)', 'res.submit': 'WhatsApp ile gönder',
    'res.where': 'Konum', 'res.walk': 'Karaköy tramvay durağına (T1) ve vapur iskelesine birkaç dakika.', 'res.hoursK': 'Saatler', 'res.hours': 'Her gün 10:00 – 04:00', 'res.phoneK': 'Telefon',
    'res.route': 'Yol tarifi', 'res.call': 'Ara', 'res.err': 'Lütfen adınızı ve tarihi yazın.', 'res.ok': 'WhatsApp açıldı — sadece gönder’e basın.',
    'res.more': '10+',
    'wa.book': 'Merhaba Berlin Line! Masa ayırtmak istiyorum.\nAd: {name}\nTarih: {date}\nSaat: {time}\nKişi: {guests}{note}',
    'wa.note': '\nNot: ', 'wa.drink': 'Merhaba Berlin Line! Masa ayırtıp {drink} denemek istiyorum. Tarih: … Saat: … Kişi: …'
  },
  ru: {
    'hero.title': 'Berlin Line Karaköy — коктейль-бар, живая музыка и кухня до 4 утра',
    'hero.hint': 'Листайте стойку · нажмите на напиток', 'hero.loading': 'Накрываем стойку…',
    'hero.nowebgl': 'Ваш браузер не показывает 3D-бар — листайте вниз к коктейльной карте.',
    'top.reserve': 'Бронь', 'st.open': 'Открыто · до 04:00', 'st.closed': 'Откроется в 10:00',
    'card.ingredients': 'Ингредиенты', 'card.garnish': 'Украшение', 'card.glass': 'Бокал', 'card.strength': 'Крепость', 'card.cta': 'Забронировать стол',
    'nav.bar': 'Бар', 'nav.cocktails': 'Коктейли', 'nav.menu': 'Меню', 'nav.res': 'Бронь',
    'bar.eyebrow': 'Бар · Музыка · Кухня', 'bar.h2': 'Музыка. Коктейли. Еда. <em>До 4 утра.</em>',
    'bar.p1': 'Рубиновый зал на Мумхане Джаддеси: живая группа каждый вечер, бармен, для которого коктейли — личное дело, и терраса с обогревом для долгих ночей Каракёя.',
    'bar.p2': 'С 10:00 открытая кухня готовит берлинский дёнер, хрустящие куриные бургеры и крылышки — к каждой тарелке пять домашних соусов.',
    'stat.rating': '2 022 отзыва в Google', 'stat.hours': 'Каждый день', 'stat.liveV': 'Live', 'stat.music': 'Группа каждый вечер',
    'f1.h': 'Живая музыка', 'f1.p': 'Каждый вечер играет группа — об этом пишут 182 гостя.',
    'f2.h': 'Терраса с обогревом', 'f2.p': 'Обогреватели снаружи, тёплый зал внутри, глинтвейн в холодные вечера.',
    'f3.h': 'Говорим на вашем языке', 'f3.p': 'Английский, турецкий и русский — и у стойки, и на этом сайте.',
    'ck.eyebrow': 'Коктейльная карта', 'ck.h2': 'Двенадцать бокалов на стойке',
    'ck.p': 'Авторские коктейли наших барменов и классика, сделанная как надо. Цены — у бара, спросите карту дня.',
    'ck.all': 'Все', 'ck.sig': 'Авторские', 'ck.classic': 'Классика', 'ck.view': 'Показать на стойке ↑',
    'ck.quote': '«Самые вкусные и качественные коктейли. Нигде лучше не пили».', 'ck.quoteby': 'Ирина Р. · отзыв в Google',
    'menu.eyebrow': 'Кухня · 10:00–04:00', 'menu.h2': 'Голодны в любое время',
    'menu.p': 'Цены из печатного меню, в турецких лирах. Всё хрустящее — с фри и пятью домашними соусами.',
    'menu.note': 'Цены могут меняться — напишите нам за актуальным меню.', 'tag.hot': 'остро', 'tag.veg': 'вег', 'tag.sig': 'фирменное',
    'rev.eyebrow': 'Гости о нас', 'rev.h2': '1 279 вечеров на пять звёзд',
    'rev.1': 'Очень понравилась атмосфера — красивый свет и живая группа со спокойной музыкой. Нам даже продлили happy hour.',
    'rev.2': 'Очень уютный бар и дружелюбный персонал. Хорошая музыка, хорошее пиво — даже глинтвейн подают.',
    'rev.3': 'Мы с мамой прекрасно провели время. Тимур сделал наш вечер, а живая музыка — ещё лучше.',
    'rev.all': 'Все 2 022 отзыва в Google',
    'res.eyebrow': 'Бронирование', 'res.h2': 'Оставим стол поближе к сцене', 'res.p': 'Заполните форму — откроется WhatsApp с готовым сообщением.',
    'res.name': 'Ваше имя', 'res.date': 'Дата', 'res.time': 'Время', 'res.guests': 'Гостей', 'res.note': 'Повод или пожелания (необязательно)', 'res.submit': 'Отправить в WhatsApp',
    'res.where': 'Как найти', 'res.walk': 'Несколько минут пешком от трамвая Karaköy (T1) и паромного причала.', 'res.hoursK': 'Часы работы', 'res.hours': 'Ежедневно 10:00 – 04:00', 'res.phoneK': 'Телефон',
    'res.route': 'Маршрут', 'res.call': 'Позвонить', 'res.err': 'Укажите имя и дату.', 'res.ok': 'WhatsApp открыт — осталось нажать «отправить».',
    'res.more': '10+',
    'wa.book': 'Здравствуйте, Berlin Line! Хочу забронировать стол.\nИмя: {name}\nДата: {date}\nВремя: {time}\nГостей: {guests}{note}',
    'wa.note': '\nКомментарий: ', 'wa.drink': 'Здравствуйте, Berlin Line! Хочу забронировать стол и попробовать {drink}. Дата: … Время: … Гостей: …'
  }
};

// Opens in Turkish; only an explicit ?lang=xx in the link overrides it.
let lang = new URLSearchParams(location.search).get('lang') || 'tr';
if (!T[lang]) lang = 'tr';
const t = (k) => T[lang][k] ?? T.en[k] ?? k;
const wa = (text) => `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;

function applyLang() {
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
  $$('.lang button').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
  renderCocktails(); renderMenu(); updateStatus(); fillGuests();
  if (current >= 0) { setPlate(current); if (cardOpen) fillCard(current, false); }
}

/* ============================ STATUS ============================ */
function updateStatus() {
  // Istanbul is UTC+3 all year
  const now = new Date(Date.now() + (new Date().getTimezoneOffset() + 180) * 60000);
  const h = now.getHours();
  const open = h >= 10 || h < 4;
  $$('[data-status]').forEach((el) => { el.classList.toggle('closed', !open); el.querySelector('span').textContent = t(open ? 'st.open' : 'st.closed'); });
}

/* ============================ CARD ============================ */
const card = $('#drinkCard'), hero = $('.hero');
let current = -1, cardOpen = false, rail = null;
const pad = (n) => String(n).padStart(2, '0');

function setPlate(i) {
  const el = $('#plateName');
  el.textContent = drinkName(DRINKS[i], lang);
  el.classList.remove('card-swap'); void el.offsetWidth; el.classList.add('card-swap');
}

function fillCard(i, animate = true) {
  const d = DRINKS[i], L = d[lang] || d.en;
  $('#cardKind').textContent = KIND[d.kind][lang];
  $('#cardName').textContent = drinkName(d, lang);
  $('#cardTagline').textContent = L.tagline;
  $('#cardIngredients').innerHTML = L.ingredients.map((x) => `<li>${x}</li>`).join('');
  $('#cardGarnish').textContent = L.garnish;
  $('#cardGlass').textContent = GLASS[d.glass][lang];
  $('#cardStrength').textContent = '●'.repeat(d.strength) + '○'.repeat(5 - d.strength);
  $('#cardStrength').setAttribute('aria-label', `${d.strength} / 5`);
  $('#cardTags').innerHTML = L.tags.map((x) => `<span class="tag">${x}</span>`).join('');
  $('#cardCta').href = wa(t('wa.drink').replace('{drink}', drinkName(d, lang)));
  $('#cardCount').textContent = `${pad(i + 1)} / ${pad(DRINKS.length)}`;
  if (animate) { const f = card.querySelector('.card-frame'); f.classList.remove('card-swap'); void f.offsetWidth; f.classList.add('card-swap'); }
}

function openCard(i) {
  fillCard(i, cardOpen);
  cardOpen = true; card.classList.add('open'); card.setAttribute('aria-hidden', 'false'); hero.classList.add('card-open');
}
function closeCard() {
  cardOpen = false; card.classList.remove('open'); card.setAttribute('aria-hidden', 'true'); hero.classList.remove('card-open');
}

/* ============================ COCKTAIL LIST ============================ */
let filter = 'all';
function renderCocktails() {
  const grid = $('#ckGrid');
  grid.innerHTML = DRINKS.map((d, i) => {
    const L = d[lang] || d.en;
    const show = filter === 'all' || (filter === 'signature' ? d.kind === 'signature' : d.kind !== 'signature');
    return `<article class="ck-card notched" style="--c:${d.swatch}" ${show ? '' : 'hidden'}>
      <div class="ck-top"><span class="ck-orb"></span><div><span class="ck-kind">${KIND[d.kind][lang]}</span><span class="ck-glass">${GLASS[d.glass][lang]}</span></div></div>
      <h3>${drinkName(d, lang)}</h3>
      <p class="ck-tag">${L.tagline}</p>
      <p class="ck-ing">${L.ingredients.join(' · ')}</p>
      <div class="ck-foot"><span class="strength" aria-label="${d.strength} / 5">${'●'.repeat(d.strength)}${'○'.repeat(5 - d.strength)}</span>
      <button class="ck-view" data-show="${i}">${t('ck.view')}</button></div>
    </article>`;
  }).join('');
}
$('#ckGrid').addEventListener('click', (e) => {
  const b = e.target.closest('[data-show]'); if (!b) return;
  const i = +b.dataset.show;
  scrollToEl('#top');
  setTimeout(() => { if (rail) rail.open(i); else { current = i; openCard(i); } }, reduced ? 0 : 700);
});
$$('.filters .chip').forEach((c) => c.addEventListener('click', () => {
  filter = c.dataset.filter; $$('.filters .chip').forEach((x) => x.classList.toggle('active', x === c)); renderCocktails();
}));

/* ============================ MENU ============================ */
let menuTab = MENU[0].id;
function renderMenu() {
  $('#menuTabs').innerHTML = MENU.map((c) => `<button class="chip ${c.id === menuTab ? 'active' : ''}" role="tab" aria-selected="${c.id === menuTab}" data-tab="${c.id}">${c.title[lang]}</button>`).join('');
  const cat = MENU.find((c) => c.id === menuTab);
  $('#menuPanel').innerHTML = cat.items.map((it) => `<div class="m-item">
    <div class="m-top"><span class="m-name">${it.n}${it.hot ? `<span class="m-badge hot">${t('tag.hot')}</span>` : ''}${it.veg ? `<span class="m-badge">${t('tag.veg')}</span>` : ''}${it.sig ? `<span class="m-badge">${t('tag.sig')}</span>` : ''}</span><span class="m-lead"></span><span class="m-price">₺${it.p}</span></div>
    <p class="m-desc">${it.d[lang]}</p></div>`).join('');
}
$('#menuTabs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-tab]'); if (!b) return;
  menuTab = b.dataset.tab; renderMenu();
  if (window.gsap && !reduced) gsap.from('#menuPanel .m-item', { opacity: 0, y: 12, duration: 0.45, stagger: 0.04, ease: 'power2.out' });
});

/* ============================ RESERVATION ============================ */
function fillGuests() {
  const g = $('#resGuests'), keep = g.value;
  g.innerHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `<option value="${n}">${n}</option>`).join('') + `<option value="10+">${t('res.more')}</option>`;
  g.value = keep || '2';
}
(function initForm() {
  const times = []; for (let h = 12; h <= 27; h++) for (const m of ['00', '30']) times.push(`${pad(h % 24)}:${m}`);
  $('#resTime').innerHTML = times.map((x) => `<option ${x === '20:00' ? 'selected' : ''}>${x}</option>`).join('');
  const d = $('#resForm [name=date]');
  const today = new Date(); d.min = today.toISOString().slice(0, 10); d.value = today.toISOString().slice(0, 10);
  $('#resForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target, name = f.name.value.trim(), date = f.date.value;
    f.name.classList.toggle('invalid', !name); f.date.classList.toggle('invalid', !date);
    if (!name || !date) { $('#formMsg').textContent = t('res.err'); return; }
    const note = f.note.value.trim();
    const msg = t('wa.book').replace('{name}', name).replace('{date}', date).replace('{time}', f.time.value)
      .replace('{guests}', f.guests.value).replace('{note}', note ? t('wa.note') + note : '');
    window.open(wa(msg), '_blank', 'noopener');
    $('#formMsg').textContent = t('res.ok');
  });
})();

/* ============================ SCROLL / NAV ============================ */
let lenis = null;
function scrollToEl(sel) {
  const el = $(sel); if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.2 }); else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const href = a.getAttribute('href'); if (href.length < 2) return;
  e.preventDefault(); scrollToEl(href);
}));

function initScroll() {
  if (window.Lenis && !reduced) {
    lenis = new Lenis({ lerp: 0.1, prevent: (node) => node.closest && node.closest('.card-frame') });
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
    }
  }
  if (window.gsap && window.ScrollTrigger && !reduced) {
    gsap.registerPlugin(ScrollTrigger);
    $$('.reveal').forEach((el) => gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
  } else {
    $$('.reveal').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
  }
  // active pill
  const links = $$('.pillnav a');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { const k = en.target.dataset.nav; links.forEach((l) => l.classList.toggle('active', l.dataset.link === k)); }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('[data-nav]').forEach((s) => io.observe(s));
}

/* ============================ 3D RAIL ============================ */
async function initRail() {
  const canvas = $('#bar3d');
  try {
    const gl = document.createElement('canvas').getContext('webgl2'); if (!gl) throw new Error('no webgl2');
  } catch (err) {
    $('#noWebgl').hidden = false; $('#loader').classList.add('done'); current = 0; setPlate(0); return;
  }
  const { BarRail } = await import('./bar3d.js');
  rail = new BarRail({
    canvas, drinks: DRINKS, reducedMotion: reduced,
    onSelect: (i, open) => { current = i; setPlate(i); if (open && cardOpen) fillCard(i); },
    onOpen: (i) => { current = i; openCard(i); },
    onClose: () => closeCard(),
    onReady: () => $('#loader').classList.add('done')
  });
  window.__rail = rail;
  // pause rendering when the hero is off screen
  new IntersectionObserver(([en]) => rail.setActive(en.isIntersecting), { threshold: 0 }).observe(hero);
  document.addEventListener('visibilitychange', () => rail.setActive(!document.hidden));
}

$$('[data-step]').forEach((b) => b.addEventListener('click', () => rail && rail.step(+b.dataset.step)));
$('#drinkPlate').addEventListener('click', () => rail ? rail.open(current) : openCard(current));
card.querySelector('[data-close]').addEventListener('click', () => (rail ? rail.close() : closeCard()));
window.addEventListener('keydown', (e) => {
  if (!rail || /INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName)) return;
  const r = hero.getBoundingClientRect(); if (r.bottom < innerHeight * 0.4) return;
  if (e.key === 'ArrowRight') { rail.step(1); e.preventDefault(); }
  else if (e.key === 'ArrowLeft') { rail.step(-1); e.preventDefault(); }
  else if (e.key === 'Enter' && document.activeElement === $('#bar3d')) rail.open(current);
  else if (e.key === 'Escape') rail.close();
});
$$('.lang button').forEach((b) => b.addEventListener('click', () => { lang = b.dataset.lang; localStorage.setItem('bl-lang', lang); applyLang(); }));
$$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

applyLang();
initScroll();
setInterval(updateStatus, 60000);
initRail().catch((err) => {
  console.error(err);
  $('#noWebgl').hidden = false; $('#loader').classList.add('done');
});
