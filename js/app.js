/* =========================================================
   ONE OFF SNEAKERS — Boutique (Single Page App, JavaScript pur)
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  const GENDERS = { homme: 'Homme', femme: 'Femme' };
  const TYPES = ShoeArt.TYPES;
  const typesUsed = () => Object.keys(TYPES).filter(t => products().some(p => p.type === t));

  /* Icônes des réseaux sociaux (SVG intégrés) */
  const ICONS = {
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.2 21.8l4.9-1.3A9.8 9.8 0 1 0 12 2.2zm0 1.8a8 8 0 1 1-4.1 14.9l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 0 1 12 4z"/><path fill="currentColor" d="M8.9 7.3c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .6.4l.8 1.9c.1.2.1.4 0 .6l-.5.7c-.1.2-.2.3 0 .6.5.9 1.2 1.7 2.1 2.3.3.2.5.1.6 0l.6-.8c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.4 0 .5-.1 1.1-.5 1.5-.5.5-1.3.8-2 .7-1.2-.1-2.7-.8-4-2-1.4-1.3-2.4-2.9-2.6-4.1-.1-.9.2-1.8.4-2.1z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.6 2.5c.4 2.2 1.9 3.7 4 3.9v3.2c-1.5 0-2.9-.5-4-1.3v6.4a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v3.3a2.4 2.4 0 1 0 1.5 2.2V2.5h3.2z"/></svg>',
    snapchat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.4c3 0 5.1 2.3 5.1 5.3v2.3l1.3-.4c.6-.2 1 .5.6.9-.4.5-1.2.8-1.8 1 .6 1.6 1.9 3 3.5 3.5.4.1.4.6 0 .8-.6.3-1.4.5-2.1.6l-.3 1.2c-.9-.1-1.8 0-2.6.5-.9.6-1.6 1.1-2.7 1.1s-1.8-.5-2.7-1.1c-.8-.5-1.7-.6-2.6-.5l-.3-1.2c-.7-.1-1.5-.3-2.1-.6-.4-.2-.4-.7 0-.8 1.6-.5 2.9-1.9 3.5-3.5-.6-.2-1.4-.5-1.8-1-.4-.4 0-1.1.6-.9l1.3.4V7.7c0-3 2.1-5.3 5.1-5.3z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.3" fill="currentColor"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 8.6V6.9c0-.7.3-1 1-1h2.3V2.3h-3.1c-3 0-4.2 1.8-4.2 4.4v1.9H7.6V12H10v9.7h4V12h3l.5-3.4H14z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M12 20s-7-4.4-9.2-8.6C1.3 8.4 3 5 6.4 5c2 0 3.3 1.1 4.1 2.4h3C14.3 6.1 15.6 5 17.6 5 21 5 22.7 8.4 21.2 11.4 19 15.6 12 20 12 20z"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 3 4 6v6c0 4.4 3.4 8 8 9 4.6-1 8-4.6 8-9V6l-8-3z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
    truck: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M2 6h11v10H2zM13 9h4l4 4v3h-8z"/><circle cx="6" cy="18" r="2" fill="#fff" stroke="currentColor" stroke-width="2"/><circle cx="17" cy="18" r="2" fill="#fff" stroke="currentColor" stroke-width="2"/></svg>',
    swap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 8h13l-3-3M20 16H7l3 3"/></svg>',
    cash: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="6" width="19" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>',
    spin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M21 12c0 2.2-4 4-9 4s-9-1.8-9-4 4-4 9-4c2 0 3.8.3 5.3.8"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m15 6 2.6 2.8L14.8 11"/></svg>',
    drag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M8 9 4 12l4 3M16 9l4 3-4 3M4 12h16"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 2.5c.5 0 .9.3 1.1.8l1.4 3.3c.2.5.1 1-.3 1.4L7.3 9.5a12 12 0 0 0 7.2 7.2l1.5-1.5c.4-.4.9-.5 1.4-.3l3.3 1.4c.5.2.8.6.8 1.1V21c0 .7-.6 1.3-1.3 1.3C10.6 22.3 1.7 13.4 1.7 3.8c0-.7.6-1.3 1.3-1.3h3.6z"/></svg>'
  };
  const VIEWS = ShoeArt.VIEWS;

  let C = null;            // catalogue courant
  let disposers = [];      // nettoyage à chaque changement de page
  const app = $('#app');

  /* ---------- Accès aux données ---------- */
  const products = () => C.products.filter(p => p.active !== false);
  const productById = id => C.products.find(p => p.id === id);
  const brandById = id => C.brands.find(b => b.id === id);
  const brandName = p => (brandById(p.brandId) || {}).name || '';
  const price = n => Store.priceLabel(n, C.settings);
  const img = (p, v) => Store.imageFor(p, v);
  const viewsOf = p => Store.viewsFor(p);
  const mainView = p => { const vs = viewsOf(p); return (vs.find(v => v.id === 'profil') || vs[0]).id; };
  const altView = p => { const vs = viewsOf(p), m = mainView(p); return (vs.find(v => v.id === 'face' && v.id !== m) || vs.find(v => v.id !== m) || vs[0]).id; };
  const mainImg = p => img(p, mainView(p));
  const isPhoto = p => viewsOf(p).some(v => Store.hasPhoto(p, v.id));
  const has360 = p => Array.isArray(p.spin) && p.spin.length >= 6;
  const brandLogo = (b, cls = '') => b.logo
    ? `<span class="blogo ${cls}" style="--lb:${esc(b.logoBg || '#ffffff')}"><img src="${esc(b.logo)}" alt="${esc(b.name)}" loading="lazy"></span>`
    : `<span class="blogo blogo-text ${cls}" style="--lb:${esc(b.color || '#333')}">${esc(b.name)}</span>`;
  const fullName = p => { const b = brandName(p); return p.model.toLowerCase().startsWith(b.toLowerCase()) ? p.model : (b + ' ' + p.model).trim(); };
  const discount = p => p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  /* ---------- Favoris (enregistrés dans ce navigateur) ---------- */
  const Fav = {
    key: 'oos-fav',
    ids: [],
    load() { try { this.ids = JSON.parse(localStorage.getItem(this.key)) || []; } catch (e) { this.ids = []; } },
    save() { try { localStorage.setItem(this.key, JSON.stringify(this.ids)); } catch (e) { /* ignore */ } },
    has(id) { return this.ids.includes(id); },
    toggle(id) { if (this.has(id)) this.ids = this.ids.filter(x => x !== id); else this.ids.unshift(id); this.save(); return this.has(id); },
    list() { return this.ids.map(id => productById(id)).filter(p => p && p.active !== false); }
  };
  const favBtn = (p, cls = '') => `<button class="fav-btn ${cls} ${Fav.has(p.id) ? 'on' : ''}" data-fav="${p.id}" aria-pressed="${Fav.has(p.id)}" aria-label="Favori : ${esc(fullName(p))}">${ICONS.heart}</button>`;

  /* ---------- Familles de couleurs ---------- */
  const COLOR_FAMILIES = [
    ['noir', 'Noires', '#151515', /noir|black/],
    ['blanc', 'Blanches', '#f4f4f4', /blanc|white|crème|creme|écru|ivoire/],
    ['gris', 'Grises', '#9a9a9a', /gris|argent|silver/],
    ['bleu', 'Bleues', '#2b59c3', /bleu|marine|ciel|denim|royal/],
    ['vert', 'Vertes', '#2e8b57', /vert|kaki|olive|menthe|lime|volt|canard/],
    ['rouge', 'Rouges', '#c8102e', /rouge|bordeaux/],
    ['rose', 'Roses', '#e88aa8', /rose/],
    ['marron', 'Marron', '#7a4b2a', /marron|camel|chocolat|taupe|blé|moutarde/],
    ['beige', 'Beiges', '#d9c7a5', /beige|sable|lavande/],
    ['multi', 'Multicolores', 'conic-gradient(#e33,#fd0,#3c6,#39f,#c3f,#e33)', /multi|variés|plusieurs|orange|jaune|violet/]
  ];
  const colorKeys = p => {
    const txt = `${(p.colors || []).map(c => c.name).join(' ')} ${p.model}`.toLowerCase();
    return COLOR_FAMILIES.filter(c => c[3].test(txt)).map(c => c[0]);
  };
  const colorFam = k => COLOR_FAMILIES.find(c => c[0] === k);

  /* ---------- Séries (modèle sans le coloris) ---------- */
  function seriesOf(list) {
    const m = new Map();
    list.forEach(p => {
      const name = family(p), key = p.brandId + '|' + name;
      if (!m.has(key)) m.set(key, { name, brand: p.brandId, items: [] });
      m.get(key).items.push(p);
    });
    return [...m.values()];
  }
  const serieLink = s => `#/marque/${s.brand}?serie=${encodeURIComponent(s.name)}`;
  const thumbRow = (list, cls = '') => `<div class="thumb-row ${cls}">${list.map(s => `
    <a class="subcat" href="${serieLink(s)}"><span class="subcat-img"><img src="${mainImg(s.items[0])}" alt="" loading="lazy"></span><span class="subcat-name">${esc(s.name)}</span></a>`).join('')}</div>`;

  /* ---------- Carrousel de produits ---------- */
  let carSeq = 0;
  function carousel(list, opts = {}) {
    const id = 'car' + (++carSeq);
    return `<div class="car ${opts.cls || ''}">
      <button class="car-arrow prev" data-car="${id}" data-dir="-1" aria-label="Précédent">‹</button>
      <div class="car-track" id="${id}">${list.map((p, i) => opts.render ? opts.render(p, i) : card(p, i)).join('')}</div>
      <button class="car-arrow next" data-car="${id}" data-dir="1" aria-label="Suivant">›</button>
    </div>`;
  }
  function mountCarousels(root = document) {
    $$('.car-track', root).forEach(t => { if (!t._drag) { t._drag = true; dragScroll(t); } });
  }

  /* ---------- Comptes à rebours ---------- */
  function countdownTarget(spec) {
    const now = new Date();
    if (spec === 'midnight') { const d = new Date(now); d.setHours(24, 0, 0, 0); return d; }
    if (spec === 'weekly' || !spec) { const d = new Date(now); d.setHours(24, 0, 0, 0); while (d.getDay() !== 1) d.setDate(d.getDate() + 1); return d; }
    const d = new Date(String(spec).replace(' ', 'T'));
    return isNaN(d) ? null : d;
  }
  function fmtCountdown(ms) {
    if (ms <= 0) return 'terminé';
    const s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    const pad = n => String(n).padStart(2, '0');
    return (d ? `${d} j ` : '') + `${pad(h)} h ${pad(m)} min ${pad(sec)} s`;
  }
  function tickCountdowns() {
    $$('[data-cdbox]').forEach(el => {
      const t = countdownTarget(el.dataset.cdbox); if (!t) return;
      const ms = Math.max(0, t - Date.now()), s = Math.floor(ms / 1000);
      const parts = [Math.floor(s / 3600), Math.floor(s % 3600 / 60), s % 60].map(n => String(n).padStart(2, '0'));
      el.innerHTML = parts.map(x => `<i>${x[0]}</i><i>${x[1]}</i>`).join('<em>:</em>');
    });
    $$('[data-countdown]').forEach(el => {
      const t = countdownTarget(el.dataset.countdown);
      if (t) el.textContent = fmtCountdown(t - Date.now());
    });
  }

  /* ---------- Questions fréquentes (textes propres à la boutique) ---------- */
  const FAQ = [
    ['Comment passer commande ?', 'Ajoutez vos paires au panier puis touchez « Commander via WhatsApp » : votre commande arrive directement chez nous avec les pointures choisies. Vous pouvez aussi nous écrire depuis n\'importe quelle fiche produit.'],
    ['Pourquoi certains prix sont « sur demande » ?', 'Les prix peuvent varier selon la pointure et l\'arrivage. Écrivez-nous sur WhatsApp : on vous répond rapidement avec le prix exact et la disponibilité.'],
    ['Quels sont les délais de livraison ?', 'En ville, comptez en général 24 à 72 h après confirmation de la commande. Le délai exact vous est confirmé au moment de la commande.'],
    ['Comment se passe le paiement ?', 'Vous payez à la livraison, au moment où vous recevez votre paire. Aucun paiement en ligne n\'est demandé sur le site.'],
    ['Et si la pointure ne me va pas ?', 'Pas de souci : l\'échange de pointure est possible sous 7 jours, tant que la paire n\'a pas été portée et qu\'elle est rendue dans son état d\'origine.'],
    ['Comment choisir ma pointure ?', 'Consultez notre guide des tailles. En cas d\'hésitation entre deux pointures, prenez la plus grande ou demandez-nous conseil sur WhatsApp.'],
    ['Les paires sont-elles vérifiées ?', 'Oui : chaque paire est contrôlée par notre équipe avant l\'envoi (état, coutures, semelles, boîte).']
  ];
  const faqHTML = (list, open = 0) => `<div class="faq">${list.map((q, i) => `<details${i < open ? ' open' : ''}><summary>${esc(q[0])}</summary><p>${esc(q[1])}</p></details>`).join('')}</div>`;

  /* Guide des tailles (correspondances indicatives) */
  const SIZE_TABLE = [
    [36, '22,5', '3,5', '—', '5,5'], [37, '23,5', '4', '—', '6,5'], [38, '24', '5', '—', '7,5'], [39, '25', '6', '6,5', '8'],
    [40, '25,5', '6,5', '7', '9'], [41, '26,5', '7', '8', '9,5'], [42, '27', '8', '8,5', '10'], [43, '27,5', '9', '9,5', '—'],
    [44, '28,5', '9,5', '10', '—'], [45, '29', '10,5', '11', '—'], [46, '30', '11', '12', '—']
  ];

  /* Garanties de la boutique */
  const TRUST = [
    ['check', 'Paires vérifiées', 'Contrôle avant chaque envoi'],
    ['truck', 'Livraison 24–72 h', 'Rapide, en ville'],
    ['swap', 'Échange sous 7 jours', 'Si la pointure ne va pas'],
    ['cash', 'Paiement à la livraison', 'Vous payez à réception']
  ];


  /* =========================================================
     PANIER
     ========================================================= */
  const Cart = {
    key: 'oos-cart',
    items: [],
    load() { try { this.items = JSON.parse(localStorage.getItem(this.key)) || []; } catch (e) { this.items = []; } },
    save() { try { localStorage.setItem(this.key, JSON.stringify(this.items)); } catch (e) { /* ignore */ } renderCart(); },
    add(id, size, color, qty = 1) {
      const f = this.items.find(i => i.id === id && i.size === size && i.color === color);
      f ? f.qty += qty : this.items.push({ id, size, color, qty });
      this.save();
    },
    setQty(i, q) { if (q <= 0) this.items.splice(i, 1); else this.items[i].qty = q; this.save(); },
    count() { return this.items.reduce((a, i) => a + i.qty, 0); },
    lines() { return this.items.map(i => ({ ...i, p: productById(i.id) })).filter(l => l.p); },
    total() { return this.lines().reduce((a, l) => a + l.p.price * l.qty, 0); }
  };

  function renderCart() {
    const count = Cart.count();
    const cc = $('#cartCount');
    cc.textContent = count;
    cc.classList.toggle('show', count > 0);
    const dt = $('#dtCart'); if (dt) dt.textContent = count || '';
    const lines = Cart.lines();
    $('#cartItems').innerHTML = lines.length ? lines.map((l, i) => `
      <div class="cart-line" style="--d:${i * 50}ms">
        <a href="#/produit/${l.p.id}" class="cart-thumb"><img src="${mainImg(l.p)}" alt=""></a>
        <div class="cart-info">
          <small>${esc(brandName(l.p))}</small>
          <a href="#/produit/${l.p.id}"><b>${esc(l.p.model)}</b></a>
          <span>Pointure ${esc(l.size)}${l.color ? ' · ' + esc(l.color) : ''}</span>
          <div class="qty sm">
            <button data-cq="${i}" data-d="-1" aria-label="Moins">−</button><span>${l.qty}</span><button data-cq="${i}" data-d="1" aria-label="Plus">+</button>
          </div>
        </div>
        <div class="cart-right"><b>${price(l.p.price * l.qty)}</b><button class="link-btn" data-crm="${i}">Retirer</button></div>
      </div>`).join('') : `
      <div class="cart-empty">
        <img src="${ShoeArt.uri('basket', 'profil', { upper: '#2a2a31', accent: '#d4af5f', sole: '#3a3a42' })}" alt="">
        <p>Votre panier est vide.</p>
        <a href="#/catalogue" class="btn btn-primary" data-close-cart>Découvrir le catalogue</a>
      </div>`;
    $('#cartFoot').innerHTML = lines.length ? `
      <div class="cart-total"><span>Total</span><b>${price(Cart.total())}</b></div>
      <p class="muted small">Paiement à la livraison ou selon les modalités de la boutique.</p>
      <button class="btn btn-primary btn-block magnetic" id="checkoutBtn">Commander via WhatsApp</button>
      <button class="btn btn-ghost btn-block" data-close-cart>Continuer mes achats</button>` : '';
  }

  function renderFav() {
    const list = Fav.list();
    const fc = $('#favCount'); fc.textContent = list.length; fc.classList.toggle('show', list.length > 0);
    $('#dtFav').textContent = list.length || '';
    $('#favItems').innerHTML = list.length ? list.map((p, i) => `
      <div class="cart-line" style="--d:${i * 50}ms">
        <a href="#/produit/${p.id}" class="cart-thumb" data-close-cart><img src="${mainImg(p)}" alt=""></a>
        <div class="cart-info"><small>${esc(brandName(p))}</small><a href="#/produit/${p.id}" data-close-cart><b>${esc(p.model)}</b></a><span>${esc(TYPES[p.type] || '')}</span></div>
        <div class="cart-right"><b>${price(p.price)}</b><button class="link-btn" data-fav="${p.id}">Retirer</button></div>
      </div>`).join('') : `
      <div class="cart-empty"><p>Aucun favori pour le moment.</p><p class="muted small">Touchez le cœur sur une chaussure pour la retrouver ici.</p><a href="#/catalogue" class="btn btn-primary" data-close-cart>Parcourir les sneakers</a></div>`;
    $$('.fav-btn[data-fav]').forEach(b => { const on = Fav.has(b.dataset.fav); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  }
  function setDrawerTab(tab) {
    $$('[data-dtab]').forEach(b => b.classList.toggle('on', b.dataset.dtab === tab));
    $('#cartItems').hidden = tab !== 'cart'; $('#cartFoot').hidden = tab !== 'cart'; $('#favItems').hidden = tab !== 'fav';
  }
  function openCart(tab = 'cart') { setDrawerTab(tab); document.body.classList.add('cart-open'); }
  function closeCart() { document.body.classList.remove('cart-open'); }

  function orderMessage(lines) {
    const s = C.settings;
    let m = `Bonjour ${s.shopName}, je souhaite commander :\n\n`;
    lines.forEach(l => { m += `• ${brandName(l.p)} ${l.p.model} — pointure ${l.size}${l.color ? ', ' + l.color : ''} × ${l.qty} = ${price(l.p.price * l.qty)}\n`; });
    m += `\nTotal : ${price(lines.reduce((a, l) => a + l.p.price * l.qty, 0))}`;
    return m;
  }

  function sendWhatsApp(lines) {
    const num = String(C.settings.whatsapp || '').replace(/[^\d]/g, '');
    if (!num) { toast('Le numéro WhatsApp de la boutique n\'est pas encore configuré.', 'warn'); return; }
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(orderMessage(lines))}`, '_blank', 'noopener');
  }

  /* =========================================================
     UTILITAIRES D'ANIMATION
     ========================================================= */
  function toast(msg, type = 'ok') {
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.innerHTML = `<span class="toast-dot"></span>${esc(msg)}`;
    $('#toasts').appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 2800);
  }

  let revealObs;
  function reveal(root = document) {
    if (!revealObs) {
      revealObs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
    $$('[data-reveal]:not(.in)', root).forEach(el => revealObs.observe(el));
  }

  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w, i) => `<span class="w"><span style="--i:${i}">${esc(w)}</span></span>`).join(' ');
  }

  function counters(root = document) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        const end = +e.target.dataset.count, t0 = performance.now(), dur = 1400;
        const step = t => {
          const k = Math.max(0, Math.min(1, (t - t0) / dur)), v = Math.round(end * (1 - Math.pow(1 - k, 3)));
          e.target.textContent = v;
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    });
    $$('[data-count]', root).forEach(el => obs.observe(el));
  }

  function tilt(root = document) {
    if (!finePointer || reduced) return;
    $$('.tilt', root).forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--rx', (-y * 10).toFixed(2) + 'deg');
        el.style.setProperty('--ry', (x * 12).toFixed(2) + 'deg');
        el.style.setProperty('--mx', ((x + 0.5) * 100).toFixed(1) + '%');
        el.style.setProperty('--my', ((y + 0.5) * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
  }

  function magnetic(root = document) {
    if (!finePointer || reduced) return;
    $$('.magnetic', root).forEach(el => {
      if (el._mag) return; el._mag = true;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  function dragScroll(el) {
    let down = false, sx = 0, sl = 0, moved = false;
    el.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = el.scrollLeft; el.classList.add('dragging'); });
    window.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) moved = true; el.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', () => { down = false; el.classList.remove('dragging'); });
    el.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  }

  function flyToCart(fromEl) {
    if (!fromEl || reduced) { bumpCart(); return; }
    const r = fromEl.getBoundingClientRect(), t = $('#cartBtn').getBoundingClientRect();
    const c = fromEl.cloneNode(true);
    Object.assign(c.style, { position: 'fixed', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', zIndex: 999, pointerEvents: 'none', objectFit: 'contain', margin: 0 });
    c.className = 'fly';
    document.body.appendChild(c);
    const dx = t.left + t.width / 2 - (r.left + r.width / 2), dy = t.top + t.height / 2 - (r.top + r.height / 2);
    c.animate([
      { transform: 'translate(0,0) scale(1) rotate(0)', opacity: 1 },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 120}px) scale(.55) rotate(-18deg)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(.08) rotate(-40deg)`, opacity: 0.4 }
    ], { duration: 850, easing: 'cubic-bezier(.55,0,.35,1)' }).onfinish = () => { c.remove(); bumpCart(); };
  }

  function bumpCart() {
    const b = $('#cartBtn');
    b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  }

  /* =========================================================
     COMPOSANTS
     ========================================================= */
  function card(p, i = 0) {
    const d = discount(p);
    const sizes = (p.sizes || []).slice().sort((a, b) => a - b);
    return `
    <article class="card" data-reveal style="--d:${(i % 8) * 70}ms" data-id="${p.id}">
      <div class="card-inner">
        <a href="#/produit/${p.id}" class="card-media" aria-label="${esc(fullName(p))}">
          <span class="badges">${has360(p) ? '<b class="badge b360">360°</b>' : ''}${p.isNew ? '<b class="badge new">Nouveau</b>' : ''}${d ? `<b class="badge sale">-${d}%</b>` : ''}${p.stock <= 0 ? '<b class="badge out">Épuisé</b>' : ''}</span>
          <span class="ship-tag">${ICONS.bolt}24–72H</span>
          <img class="img-main" src="${mainImg(p)}" alt="${esc(fullName(p))}" loading="lazy">
          ${mainView(p) !== altView(p) ? `<img class="img-alt" src="${img(p, altView(p))}" alt="" loading="lazy">` : ''}
        </a>
        ${favBtn(p)}
        <div class="card-body">
          <a href="#/produit/${p.id}" class="card-title">${esc(fullName(p))}</a>
          <div class="card-foot">
            <span class="price">${p.price > 0 ? '<small>À partir de</small> ' : ''}${price(p.price)}${p.oldPrice > p.price ? ` <s>${price(p.oldPrice)}</s>` : ''}</span>
            ${p.stock > 0 && sizes.length ? `<button class="quick-add" data-quick="${p.id}" aria-label="Ajout rapide">+</button>` : ''}
          </div>
        </div>
        ${sizes.length ? `<div class="quick-sizes" data-qs="${p.id}">
          <p>Choisissez votre pointure</p>
          <div>${sizes.map(s => `<button data-qsize="${s}">${s}</button>`).join('')}</div>
          <button class="link-btn" data-qclose>Annuler</button>
        </div>` : ''}
      </div>
    </article>`;
  }

  function sectionHead(kicker, title, link) {
    return `<header class="section-head" data-reveal>
      <div><span class="kicker">${kicker}</span><h2>${title}</h2></div>
      ${link ? `<a href="${link[0]}" class="arrow-link">${link[1]} <span>→</span></a>` : ''}
    </header>`;
  }

  function emptyState(msg) {
    return `<div class="empty" data-reveal><img src="${ShoeArt.uri('nu-pieds', 'dessus', { upper: '#2a2a31', accent: '#d4af5f', sole: '#3a3a42' })}" alt=""><p>${msg}</p></div>`;
  }

  /* =========================================================
     PAGES
     ========================================================= */
  function viewHome() {
    const all = products(), s = C.settings;
    const ph = all.filter(isPhoto);
    const byId = id => { const p = productById(id); return p && p.active !== false && isPhoto(p) ? p : null; };
    const featured = ph.filter(p => p.featured);
    const fresh = [...ph.filter(p => p.isNew), ...ph.filter(p => !p.isNew)];
    const ofBrand = id => ph.filter(p => p.brandId === id);
    const series = seriesOf(ph.filter(p => p.brandId !== 'autres')).sort((a, b) => b.items.length - a.items.length);
    const multi = series.filter(x => x.items.length >= 2);

    /* Diaporama d'accueil */
    const SL = [
      ['maison-mihara-yasuhiro-toile-rouge', 'Maison Mihara Yasuhiro', 'La toile vintage et la semelle « fondue » façonnée à la main : la sneaker qui ne ressemble à aucune autre.', '#/marque/maison-mihara-yasuhiro'],
      ['dior-b30-noir-blanc', 'Dior B30', 'Le runner technique de la maison parisienne, en six coloris à découvrir.', '#/marque/dior?serie=B30'],
      ['hermes-oran-rouge', 'Sandales Hermès', 'Oran, Chypre, Izmir : le H découpé dans un cuir d\'exception.', '#/marque/hermes'],
      ['timberland-6-inch-x-supreme-noir', 'Bottes 6-Inch', 'Le classique robuste en nubuck, revisité en éditions spéciales.', '#/catalogue?type=bottes'],
      ['loro-piana-summer-charms-walk-beige', 'Loro Piana Summer Walk', 'Le mocassin en daim d\'une légèreté absolue, pour toutes les saisons.', '#/marque/loro-piana']
    ].map(x => ({ p: byId(x[0]), title: x[1], text: x[2], href: x[3] })).filter(x => x.p);
    if (!SL.length && featured[0]) SL.push({ p: featured[0], title: brandName(featured[0]), text: featured[0].model, href: '#/produit/' + featured[0].id });

    /* Pastilles de collections */
    const pills = list => `<div class="pills">${list.map(x => `<a class="pill" href="${serieLink(x)}"><img src="${mainImg(x.items[0])}" alt="" loading="lazy"><span>${esc(x.name.toLowerCase().startsWith(((brandById(x.brand) || {}).name || '').toLowerCase()) ? x.name : ((brandById(x.brand) || {}).name || '') + ' ' + x.name)}</span></a>`).join('')}</div>`;

    /* Carrousel de cartes (flèches dans l'en-tête de section) */
    let seq = 0;
    const track = (list, cls = '') => { const id = 'tr' + (++seq) + Math.random().toString(36).slice(2, 6); return [id, `<div class="ctrack ${cls}" id="${id}">${list.map(card).join('')}</div>`]; };
    const ctrl = (id, more) => `<div class="hs-ctrl"><button class="sq-arrow" data-car="${id}" data-dir="-1" aria-label="Précédent">‹</button><button class="sq-arrow" data-car="${id}" data-dir="1" aria-label="Suivant">›</button>${more ? `<a class="ul-link" href="${more}">Voir plus</a>` : ''}</div>`;
    const brandCar = bid => {
      const b = brandById(bid), list = ofBrand(bid);
      if (!b || !list.length) return '';
      const [id, tr] = track(list.slice(0, 12));
      return `<section class="section hs"><header class="hs-head"><h2 class="hs-title">${esc(b.name)}</h2>${ctrl(id, '#/marque/' + b.id)}</header>${tr}</section>`;
    };

    /* Onglets Nouveautés / Sélection */
    const [tNew, trNew] = track(fresh.slice(0, 12));
    const [tSel, trSel] = track((featured.length ? featured : ph).slice(0, 12));

    /* Coup de cœur du jour */
    const pool = featured.length ? featured : ph;
    const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
    const deals = pool.length ? [...pool.slice(day % pool.length), ...pool.slice(0, day % pool.length)].slice(0, 10) : [];
    const deal = deals[0];
    const N = deals.length;
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    const sizesTxt = p => { const z = (p.sizes || []).slice().sort((a, b) => a - b); return z.length ? `${z[0]}–${z[z.length - 1]}` : '—'; };

    /* Sandales, bottes */
    const sandals = ph.filter(p => p.type === 'sandale');
    const boots = ph.filter(p => p.type === 'bottes');
    const bootHero = byId('timberland-6-inch-damier') || boots[0];

    const html = `
    ${SL.length ? `<section class="hero-sl" id="heroSl" aria-roledescription="carrousel">
      ${SL.map((x, i) => `<a class="sl ${i === 0 ? 'on' : ''}" href="${x.href}" aria-hidden="${i !== 0}">
        <img class="sl-bg" src="${mainImg(x.p)}" alt="" aria-hidden="true" ${i ? 'loading="lazy"' : ''}><img class="sl-main" src="${mainImg(x.p)}" alt="" ${i ? 'loading="lazy"' : ''}>
        <span class="sl-txt"><b>${esc(x.title)}</b><span>${esc(x.text)}</span><em class="sl-btn">Découvrir</em></span>
      </a>`).join('')}
      ${SL.length > 1 ? `<button class="sl-arrow prev" aria-label="Diapositive précédente">‹</button><button class="sl-arrow next" aria-label="Diapositive suivante">›</button>
      <div class="sl-dots"><button class="sl-pause" aria-label="Pause">❚❚</button>${SL.map((_, i) => `<button class="sl-dot ${i === 0 ? 'on' : ''}" data-sl="${i}" aria-label="Diapositive ${i + 1}"><i></i></button>`).join('')}</div>` : ''}
    </section>` : ''}

    <section class="trust-strip" aria-label="Nos garanties">
      <div class="trust-track">${[0, 1, 2].map(() => TRUST.map(x => `<span>${ICONS[x[0]]}${esc(x[1])}</span>`).join('') + `<span>${ICONS.whatsapp}Commande facile sur WhatsApp</span>`).join('')}</div>
    </section>

    <section class="pills-sec">${pills(series.slice(0, 12))}</section>

    <section class="section hs">
      <header class="hs-head">
        <div class="ttabs" role="tablist"><button class="on" data-htab="new" role="tab">Nouveautés</button><button data-htab="sel" role="tab">Sélection</button></div>
        <div class="hs-ctrl"><button class="sq-arrow" data-tabcar="-1" aria-label="Précédent">‹</button><button class="sq-arrow" data-tabcar="1" aria-label="Suivant">›</button><a class="ul-link" id="hTabMore" href="#/catalogue?tri=recent">Voir plus</a></div>
      </header>
      <div data-hpanel="new" data-track="${tNew}">${trNew}</div>
      <div data-hpanel="sel" data-track="${tSel}" hidden>${trSel}</div>
    </section>

    ${deal ? `<section class="section">
      <div class="deals">
        <div class="deals-head">
          <div><h2 class="hs-title">Coup de cœur du jour <span class="date-chip">${esc(today)}</span></h2><p class="deals-sub">Chaque jour, une sélection de paires mise en avant. Elle change à minuit : ne tardez pas !</p></div>
          <div class="cd"><small>Nouvelle sélection dans</small><div class="cd-boxes" data-cdbox="midnight"></div></div>
        </div>
        <div class="deals-body">
          <div class="deal-card">
            <a class="dc-img" href="#/produit/${deal.id}"><img src="${mainImg(deal)}" alt="${esc(fullName(deal))}" loading="lazy"></a>
            <div class="dc-info">
              <div class="dc-top"><span class="dc-num">N° 01 / ${String(N).padStart(2, '0')}</span>${favBtn(deal, 'dc-fav')}</div>
              <h3><a href="#/produit/${deal.id}">${esc(fullName(deal))}</a></h3>
              <p class="dc-label">Choisissez votre pointure</p>
              <div class="deal-sizes" id="dealSizes">${(deal.sizes || []).slice().sort((a, b) => a - b).map(x => `<button data-dsize="${x}">${x}</button>`).join('')}</div>
              <div class="dc-price"><small>Prix</small><b>${price(deal.price)}</b>${deal.oldPrice > deal.price ? `<s>${price(deal.oldPrice)}</s>` : ''}</div>
              <button class="btn btn-primary btn-block" id="dealAdd">Ajouter au panier</button>
              <button class="ul-link dc-wa" id="dealWa">Votre pointure n'y est pas ? Écrivez-nous</button>
            </div>
          </div>
          <div class="deals-side">
            <div class="ds-head"><b>Les autres coups de cœur</b><div class="hs-ctrl"><button class="sq-arrow" data-car="dealTrack" data-dir="-1" aria-label="Précédent">‹</button><button class="sq-arrow" data-car="dealTrack" data-dir="1" aria-label="Suivant">›</button></div></div>
            <div class="ds-track" id="dealTrack">${deals.slice(1).map((p, i) => `<a class="ds-card" href="#/produit/${p.id}">
              <span class="dc-num">N° ${String(i + 2).padStart(2, '0')} / ${String(N).padStart(2, '0')}</span>
              <span class="ds-img"><img src="${mainImg(p)}" alt="" loading="lazy"></span>
              <span class="ds-name">${esc(fullName(p))}</span>
              <span class="ds-foot"><small>Pointures</small><b>${sizesTxt(p)}</b><em>${price(p.price)}</em></span>
            </a>`).join('')}</div>
            <div class="ds-bottom"><div class="ds-progress"><i id="dealProg"></i></div><a class="btn btn-primary" href="#/catalogue">Voir plus de modèles</a></div>
          </div>
        </div>
      </div>
    </section>` : ''}

    ${brandCar('dior')}

    <section class="pills-sec">${pills(series.slice(12, 24))}</section>

    ${multi.length ? `<section class="section hs">
      <header class="hs-head"><h2 class="hs-title">Modèles tendance</h2><a class="ul-link" href="#/catalogue">Tout voir</a></header>
      <div class="tall-row">${multi.slice(0, 8).map(x => {
        const pic = x.items[1] || x.items[0];
        return `<a class="tall" href="${serieLink(x)}"><img src="${mainImg(pic)}" alt="" loading="lazy"><span class="tall-label">${esc(((brandById(x.brand) || {}).name || '') + ' ' + x.name)}</span></a>`;
      }).join('')}</div>
    </section>` : ''}

    ${sandals.length ? `<section class="gray-sec">
      <div class="gray-inner">
        <header class="hs-head"><h2 class="hs-title">Sandales & claquettes</h2><a class="ul-link" href="#/catalogue?type=sandale">Tout voir</a></header>
        <div class="mini-grid">${sandals.slice(0, 21).map(p => `<a href="#/produit/${p.id}" class="mini-item" title="${esc(fullName(p))}"><img src="${mainImg(p)}" alt="${esc(fullName(p))}" loading="lazy"></a>`).join('')}</div>
      </div>
    </section>` : ''}

    ${bootHero ? `<section class="section">
      <div class="split">
        <a class="split-img" href="#/catalogue?type=bottes"><img class="sl-bg" src="${mainImg(bootHero)}" alt="" aria-hidden="true" loading="lazy"><img class="sl-main" src="${mainImg(bootHero)}" alt="" loading="lazy"><b class="split-title">Bottes 6-Inch</b><em class="sl-btn">Découvrir</em></a>
        <div class="split-prods">${boots.filter(p => p !== bootHero).slice(0, 4).map(p => `<a class="sp" href="#/produit/${p.id}"><span class="sp-img"><img src="${mainImg(p)}" alt="" loading="lazy"></span><span class="sp-name">${esc(fullName(p))}</span><span class="sp-price">${price(p.price)}</span></a>`).join('')}</div>
      </div>
    </section>` : ''}

    <section class="pills-sec">${pills(series.slice(24, 36))}</section>

    ${brandCar('nike')}
    ${brandCar('jordan')}
    ${brandCar('new-balance')}
    ${brandCar('asics')}
    ${brandCar('adidas')}
    ${brandCar('hermes')}

    <section class="section faq-sec">
      <div class="faq-wrap">
        <div><h2 class="hs-title">Questions fréquentes</h2><p class="muted">Une autre question ? Écrivez-nous sur WhatsApp, on vous répond rapidement.</p><a class="btn btn-ghost" href="#/aide/faq">Toutes les questions</a></div>
        ${faqHTML(FAQ.slice(0, 6))}
      </div>
    </section>`;

    const mount = () => {
      // Diaporama : défilement automatique, flèches, points, pause
      const sl = $('#heroSl');
      if (sl && SL.length > 1) {
        const slides = $$('.sl', sl), dots = $$('.sl-dot', sl);
        let cur = 0, paused = false, timer = 0;
        const go = i => {
          cur = (i + slides.length) % slides.length;
          slides.forEach((x, k) => { x.classList.toggle('on', k === cur); x.setAttribute('aria-hidden', k !== cur); });
          dots.forEach((d, k) => { d.classList.toggle('on', k === cur); d.classList.remove('run'); });
          if (!paused && !reduced) { void dots[cur].offsetWidth; dots[cur].classList.add('run'); }
        };
        const play = () => { clearInterval(timer); if (!paused && !reduced) timer = setInterval(() => go(cur + 1), 6000); };
        $('.sl-arrow.prev', sl).addEventListener('click', e => { e.preventDefault(); go(cur - 1); play(); });
        $('.sl-arrow.next', sl).addEventListener('click', e => { e.preventDefault(); go(cur + 1); play(); });
        dots.forEach(d => d.addEventListener('click', e => { e.preventDefault(); go(+d.dataset.sl); play(); }));
        $('.sl-pause', sl).addEventListener('click', e => {
          e.preventDefault(); paused = !paused; e.currentTarget.textContent = paused ? '▶' : '❚❚';
          e.currentTarget.setAttribute('aria-label', paused ? 'Lecture' : 'Pause'); go(cur); play();
        });
        let sx = null;
        sl.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
        sl.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) { go(cur + (dx < 0 ? 1 : -1)); play(); } sx = null; });
        go(0); play();
        disposers.push(() => clearInterval(timer));
      }
      // Onglets Nouveautés / Sélection
      const more = { new: '#/catalogue?tri=recent', sel: '#/catalogue' };
      $$('[data-htab]').forEach(b => b.addEventListener('click', () => {
        $$('[data-htab]').forEach(x => x.classList.toggle('on', x === b));
        $$('[data-hpanel]').forEach(pn => { pn.hidden = pn.dataset.hpanel !== b.dataset.htab; if (!pn.hidden) reveal(pn); });
        $('#hTabMore').href = more[b.dataset.htab];
      }));
      $$('[data-tabcar]').forEach(b => b.addEventListener('click', () => {
        const pn = $$('[data-hpanel]').find(x => !x.hidden); const tr = pn && document.getElementById(pn.dataset.track);
        tr && tr.scrollBy({ left: +b.dataset.tabcar * tr.clientWidth * 0.9, behavior: 'smooth' });
      }));
      $$('.ctrack, .ds-track, .pills, .tall-row').forEach(t => dragScroll(t));
      // Barre de progression des coups de cœur
      const dt = $('#dealTrack'), pg = $('#dealProg');
      if (dt && pg) {
        const upd = () => { const w = dt.clientWidth / dt.scrollWidth; pg.style.width = Math.min(100, w * 100) + '%'; pg.style.marginLeft = (dt.scrollLeft / dt.scrollWidth * 100) + '%'; };
        dt.addEventListener('scroll', upd, { passive: true }); upd();
      }
      // Coup de cœur : pointure + panier
      if (deal) {
        let dsize = null;
        $('#dealSizes').addEventListener('click', e => {
          const b = e.target.closest('[data-dsize]'); if (!b) return;
          $$('#dealSizes button').forEach(x => x.classList.toggle('on', x === b)); dsize = b.dataset.dsize;
        });
        const need = () => { if (!dsize && (deal.sizes || []).length) { const g = $('#dealSizes'); g.classList.remove('shake'); void g.offsetWidth; g.classList.add('shake'); toast('Choisissez d\'abord votre pointure.', 'warn'); return true; } return false; };
        const col = deal.colors && deal.colors[0] ? deal.colors[0].name : '';
        $('#dealAdd').addEventListener('click', () => { if (need()) return; Cart.add(deal.id, dsize || 'Unique', col, 1); flyToCart($('.dc-img img')); toast(`${deal.model} (P. ${dsize || 'unique'}) ajouté au panier`); });
        $('#dealWa').addEventListener('click', () => sendWhatsApp([{ p: deal, size: dsize || 'à préciser', color: col, qty: 1 }]));
      }
    };
    return [html, mount];
  }

  /* ---------- Pages d'aide ---------- */
  function viewHelp([slug]) {
    const s = C.settings;
    const wa = s.whatsapp ? `https://wa.me/${String(s.whatsapp).replace(/[^\d]/g, '')}` : '';
    const pages = {
      faq: ['Questions fréquentes', faqHTML(FAQ, 1)],
      livraison: ['Livraison & retours', `
        <div class="help-cards">${TRUST.map(x => `<div class="help-card">${ICONS[x[0]]}<b>${esc(x[1])}</b><span>${esc(x[2])}</span></div>`).join('')}</div>
        <h3>Livraison</h3><p>Après confirmation de votre commande sur WhatsApp, la livraison se fait en général sous 24 à 72 h en ville. Le délai et les frais éventuels vous sont confirmés au moment de la commande.</p>
        <h3>Paiement</h3><p>Vous payez à la livraison, au moment où vous recevez votre paire.</p>
        <h3>Échanges</h3><p>La pointure ne convient pas ? L'échange est possible sous 7 jours, si la paire n'a pas été portée et qu'elle est rendue dans son état d'origine, avec sa boîte. Contactez-nous sur WhatsApp pour l'organiser.</p>`],
      'guide-tailles': ['Guide des tailles', `
        <p>Correspondances <b>indicatives</b> : la taille peut varier d'une marque et d'un modèle à l'autre. Pour mesurer votre pied, posez-le sur une feuille, tracez le talon et le bout du plus long orteil, puis mesurez en centimètres.</p>
        <div class="size-table-wrap"><table class="size-table"><thead><tr><th>EU</th><th>Longueur du pied (cm)</th><th>UK</th><th>US homme</th><th>US femme</th></tr></thead>
        <tbody>${SIZE_TABLE.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
        <p class="muted">Entre deux pointures ? Prenez la plus grande, ou demandez-nous conseil.</p>`]
    };
    const pg = pages[slug];
    if (!pg) return viewNotFound();
    return [`<section class="coll-head"><nav class="crumbs"><a href="#/">Accueil</a><span>›</span><span>Aide</span><span>›</span><span>${esc(pg[0])}</span></nav><h1 class="coll-h1">${esc(pg[0])}</h1></section>
      <section class="section help">
        <nav class="help-nav">${Object.entries(pages).map(([k, v]) => `<a href="#/aide/${k}" class="${k === slug ? 'on' : ''}">${esc(v[0])}</a>`).join('')}${wa ? `<a href="${wa}" target="_blank" rel="noopener">Nous écrire sur WhatsApp</a>` : ''}</nav>
        <div class="help-body">${pg[1]}</div>
      </section>`];
  }

  /* ---------- PAGE COLLECTION (catalogue, univers, style, marque) ---------- */
  const COLOR_WORDS = new Set(['noir', 'noire', 'blanc', 'blanche', 'gris', 'grise', 'rouge', 'bleu', 'bleue', 'marine', 'vert', 'verte', 'rose', 'beige', 'argent', 'crème', 'creme', 'kaki', 'marron', 'camel', 'violet', 'olive', 'orange', 'jaune', 'taupe', 'blé', 'lime', 'volt', 'ciel', 'menthe', 'réfléchissant', 'strass', 'canard', 'lavande', 'moutarde', 'brodée', 'verni', 'multicolore', 'denim', '/', '&', '+', '(coloris', 'variés)', 'triple', 'blanc/rouge', 'semelle', 'premium']);
  function family(p) {
    const w = String(p.model).split(/\s+/);
    while (w.length > 1 && COLOR_WORDS.has(w[w.length - 1].toLowerCase())) w.pop();
    return w.join(' ');
  }
  const PER_PAGE = 24;

  function viewCatalogue(_, params, brandId) {
    const brand = brandId ? brandById(brandId) : null;
    const st = {
      genre: (params.get('genre') || '').split(',').filter(Boolean),
      type: (params.get('type') || '').split(',').filter(Boolean),
      marque: (params.get('marque') || '').split(',').filter(Boolean),
      taille: (params.get('taille') || '').split(',').filter(Boolean).map(Number),
      serie: params.get('serie') || '',
      couleur: (params.get('couleur') || '').split(',').filter(Boolean),
      q: params.get('q') || '',
      tri: params.get('tri') || 'pertinence',
      max: +params.get('max') || 0,
      promo: params.get('promo') === '1',
      page: Math.max(1, +params.get('page') || 1)
    };
    const all = brand ? products().filter(p => p.brandId === brand.id) : products();
    const maxPrice = Math.max(10000, ...all.map(p => p.price));
    const allSizes = [...new Set(all.flatMap(p => p.sizes || []))].sort((a, b) => a - b);
    if (!st.max) st.max = maxPrice;

    let title = 'Toutes les sneakers';
    if (st.promo) title = 'Promotions';
    else if (st.tri === 'recent' && !st.genre.length && !st.type.length) title = 'Nouveautés';
    if (st.genre.length === 1 && !st.type.length) title = GENDERS[st.genre[0]] || title;
    if (st.type.length === 1 && !st.genre.length) title = TYPES[st.type[0]] || title;
    if (st.genre.length === 1 && st.type.length === 1) title = `${TYPES[st.type[0]]} ${GENDERS[st.genre[0]]}`;
    if (brand) title = brand.name;

    /* Rangée de sous-collections */
    let subs = '';
    if (brand) {
      const fams = [];
      all.forEach(p => {
        const f = family(p);
        let e = fams.find(x => x.name === f);
        if (!e) { e = { name: f, n: 0, p }; fams.push(e); }
        e.n++;
      });
      if (fams.length > 1) subs = fams.map(f => `<button class="subcat" data-serie="${esc(f.name)}"><span class="subcat-img"><img src="${mainImg(f.p)}" alt="" loading="lazy"></span><span class="subcat-name">${esc(f.name)}</span></button>`).join('');
    } else {
      subs = C.brands.filter(b => all.some(p => p.brandId === b.id) && b.id !== 'autres')
        .map(b => `<a class="subcat" href="#/marque/${b.id}">${brandLogo(b, 'subcat-logo')}<span class="subcat-name">${esc(b.name)}</span></a>`).join('');
    }

    const chip = (group, val, label) => `<button class="chip" data-f="${group}" data-v="${esc(val)}">${esc(label)}</button>`;
    const crumbs = brand
      ? `<a href="#/">Accueil</a><span>›</span><a href="#/marques">Marques</a><span>›</span><span>${esc(brand.name)}</span>`
      : `<a href="#/">Accueil</a><span>›</span><a href="#/catalogue">Sneakers</a>${title !== 'Toutes les sneakers' ? `<span>›</span><span>${esc(title)}</span>` : ''}`;
    /* Tuile éditoriale glissée dans la grille */
    const edCand = brand
      ? C.brands.filter(x => x.id !== brand.id && x.id !== 'autres' && products().some(p => p.brandId === x.id && p.featured && isPhoto(p)))
      : C.brands.filter(x => x.id !== 'autres' && products().some(p => p.brandId === x.id && p.featured && isPhoto(p)));
    const edB = edCand.length ? edCand[(all.length + (brand ? brand.id.length : 0)) % edCand.length] : null;
    const edP = edB ? products().find(p => p.brandId === edB.id && p.featured && isPhoto(p)) : null;
    const edito = edB && edP ? `<a class="edito-tile" href="#/marque/${edB.id}"><img src="${mainImg(edP)}" alt="" loading="lazy"><span><small>À découvrir aussi</small><b>${esc(edB.name)}</b><em class="h-btn">Découvrir</em></span></a>` : '';
    /* « Dans une autre couleur » */
    const colorsAvail = COLOR_FAMILIES.map(c => [c, all.filter(p => colorKeys(p).includes(c[0]) && isPhoto(p))]).filter(x => x[1].length);
    const collName = brand ? brand.name : title;
    const others = brand
      ? C.brands.filter(b => b.id !== brand.id && b.id !== 'autres' && products().some(p => p.brandId === b.id))
      : [];

    const html = `
    <section class="coll-head">
      <nav class="crumbs">${crumbs}</nav>
      <div class="coll-title">${brand && brand.logo ? brandLogo(brand, 'coll-logo') : ''}<h1 class="coll-h1">${esc(title)}</h1></div>
      ${brand && brand.description ? `<p class="coll-desc">${esc(brand.description)}</p>` : ''}
      ${subs ? `<div class="subcats" id="subcats">${subs}</div>` : ''}
    </section>
    <section class="coll">
      <div class="coll-bar">
        <span class="coll-count" id="catCount"></span>
        <div class="coll-actions">
          <button class="coll-btn" id="fOpen"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M7 12h10M10 18h4"/></svg>Afficher les filtres<em id="fN"></em></button>
          <a class="coll-guide" href="#/aide/guide-tailles">Guide des tailles</a>
          <label class="coll-sort"><span>Trier par</span>
            <select id="fSort" aria-label="Trier par">
              <option value="pertinence">Recommandés</option>
              <option value="recent">Nouveautés</option>
              <option value="prix-asc">Prix croissant</option>
              <option value="prix-desc">Prix décroissant</option>
              <option value="nom">Nom A → Z</option>
            </select>
          </label>
        </div>
      </div>
      <div class="active-filters" id="activeFilters"></div>
      <div class="grid coll-grid" id="grid"></div>
      <nav class="pager" id="pager" aria-label="Pages"></nav>
    </section>

    ${colorsAvail.length > 1 ? `<section class="section discover">
      <h2 class="discover-title">${esc(collName)} dans une autre couleur</h2>
      <div class="thumb-row">${colorsAvail.map(([c, l]) => `<button class="subcat" data-couleur="${c[0]}"><span class="subcat-img"><img src="${mainImg(l[0])}" alt="" loading="lazy"><i class="sw-dot" style="background:${c[2]}"></i></span><span class="subcat-name">${esc(c[1])}</span></button>`).join('')}</div>
    </section>` : ''}

    <section class="section discover coll-faq">
      <h2 class="discover-title">${esc(collName)} : vos questions</h2>
      ${faqHTML([
        [`Comment commander ${brand ? 'une paire ' + brand.name : 'une paire'} ?`, 'Ajoutez la paire au panier avec votre pointure puis touchez « Commander via WhatsApp », ou écrivez-nous directement depuis la fiche du modèle.'],
        ['Les pointures indiquées sont-elles disponibles ?', 'Les pointures affichées sont celles proposées pour le modèle. La disponibilité exacte vous est confirmée sur WhatsApp au moment de la commande.'],
        ['Comment choisir la bonne taille ?', 'Consultez le guide des tailles. Entre deux pointures, prenez la plus grande ou demandez-nous conseil.']
      ])}
      <p class="muted small">D'autres questions ? <a href="#/aide/faq">Voir toute la FAQ</a></p>
    </section>

    ${others.length ? `<section class="section discover">
      <h2 class="discover-title">Découvrez aussi</h2>
      <div class="discover-row">${others.map(b => `<a class="subcat" href="#/marque/${b.id}">${brandLogo(b, 'subcat-logo')}<span class="subcat-name">${esc(b.name)}</span></a>`).join('')}</div>
    </section>` : `<section class="section discover">
      <h2 class="discover-title">Découvrez aussi</h2>
      <div class="discover-links">${typesUsed().map(t => `<a href="#/catalogue?type=${t}">${TYPES[t]}</a>`).join('')}${Object.keys(GENDERS).map(g => `<a href="#/catalogue?genre=${g}">Sneakers ${GENDERS[g].toLowerCase()}</a>`).join('')}<a href="#/catalogue?tri=recent">Nouveautés</a><a href="#/marques">Toutes les marques</a></div>
    </section>`}

    <aside class="filters" id="filters" aria-label="Filtres">
      <div class="filters-head"><b>Filtres</b><button class="icon-btn filters-close" id="fClose" aria-label="Fermer">✕</button></div>
      <div class="filters-body">
        <div class="search-inline">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input id="fQ" type="search" placeholder="Rechercher un modèle…" value="${esc(st.q)}">
        </div>
        <div class="f-group"><h4>Univers</h4><div class="chips">${Object.entries(GENDERS).map(([k, v]) => chip('genre', k, v)).join('')}</div></div>
        <div class="f-group"><h4>Style</h4><div class="chips">${typesUsed().filter(t => all.some(p => p.type === t)).map(k => chip('type', k, TYPES[k])).join('')}</div></div>
        ${brand ? '' : `<div class="f-group"><h4>Marque</h4><div class="checks">${C.brands.map(b => {
          const n = all.filter(p => p.brandId === b.id).length;
          return n ? `<label class="check"><input type="checkbox" data-f="marque" value="${b.id}"><span></span>${esc(b.name)}<em>${n}</em></label>` : '';
        }).join('')}</div></div>`}
        <div class="f-group"><h4>Couleur</h4><div class="chips swatch-chips">${COLOR_FAMILIES.filter(c => all.some(p => colorKeys(p).includes(c[0]))).map(c => `<button class="chip" data-f="couleur" data-v="${c[0]}"><i style="background:${c[2]}"></i>${c[1]}</button>`).join('')}</div></div>
        <div class="f-group"><h4>Pointure <a class="f-guide" href="#/aide/guide-tailles">Guide des tailles</a></h4><div class="chips sizes">${allSizes.map(s => chip('taille', s, s)).join('')}</div></div>
        <div class="f-group"><h4>Prix max <output id="maxOut"></output></h4>
          <input type="range" id="fMax" min="0" max="${maxPrice}" step="1000" value="${st.max}">
        </div>
        <div class="f-group"><label class="check"><input type="checkbox" id="fPromo"><span></span>En promotion uniquement</label></div>
      </div>
      <div class="filters-foot"><button class="btn btn-ghost" id="fReset">Tout effacer</button><button class="btn btn-primary" id="fApply">Voir les produits</button></div>
    </aside>`;

    const mount = () => {
      const grid = $('#grid');
      // Le panneau de filtres passe au premier plan (au-dessus du voile sombre)
      const fPanel = $('#filters');
      document.body.appendChild(fPanel);
      disposers.push(() => fPanel.remove());
      $('#fSort').value = st.tri;
      $('#fPromo').checked = st.promo;

      const syncUI = () => {
        $$('.chip[data-f]').forEach(b => {
          const arr = st[b.dataset.f];
          const v = b.dataset.f === 'taille' ? +b.dataset.v : b.dataset.v;
          b.classList.toggle('on', arr.includes(v));
        });
        $$('input[data-f="marque"]').forEach(i => { i.checked = st.marque.includes(i.value); });
        $$('[data-serie]').forEach(b => b.classList.toggle('on', b.dataset.serie === st.serie));
        $('#maxOut').textContent = price(st.max);
        const tags = [
          ...(st.serie ? [['serie', st.serie, st.serie]] : []),
          ...st.genre.map(v => ['genre', v, GENDERS[v]]),
          ...st.type.map(v => ['type', v, TYPES[v]]),
          ...st.marque.map(v => ['marque', v, (brandById(v) || {}).name || v]),
          ...st.taille.map(v => ['taille', v, 'Pointure ' + v]),
          ...st.couleur.map(v => ['couleur', v, (colorFam(v) || [v, v])[1]]),
          ...(st.promo ? [['promo', '1', 'En promotion']] : [])
        ];
        $('#activeFilters').innerHTML = tags.map(t => `<button class="tag" data-rm="${t[0]}" data-v="${esc(t[1])}">${esc(t[2])} ✕</button>`).join('');
        const n = st.genre.length + st.type.length + st.marque.length + st.taille.length + st.couleur.length + (st.promo ? 1 : 0) + (st.q ? 1 : 0) + (st.max < maxPrice ? 1 : 0);
        $('#fN').textContent = n ? n : '';
      };

      const filtered = () => {
        const q = st.q.trim().toLowerCase();
        const list = all.filter(p =>
          (!st.serie || family(p) === st.serie) &&
          (!st.couleur.length || st.couleur.some(c => colorKeys(p).includes(c))) &&
          (!st.genre.length || st.genre.some(g => p.gender.includes(g))) &&
          (!st.type.length || st.type.includes(p.type)) &&
          (!st.marque.length || st.marque.includes(p.brandId)) &&
          (!st.taille.length || st.taille.some(s => (p.sizes || []).includes(s))) &&
          p.price <= st.max &&
          (!st.promo || discount(p) > 0) &&
          (!q || `${brandName(p)} ${p.model} ${TYPES[p.type]} ${p.description}`.toLowerCase().includes(q))
        );
        const sorters = {
          'prix-asc': (a, b) => a.price - b.price,
          'prix-desc': (a, b) => b.price - a.price,
          nom: (a, b) => a.model.localeCompare(b.model, 'fr'),
          recent: (a, b) => (b.isNew - a.isNew) || (b.createdAt - a.createdAt),
          pertinence: (a, b) => (b.featured - a.featured) || (b.isNew - a.isNew)
        };
        return list.sort(sorters[st.tri] || sorters.pertinence);
      };

      const writeURL = () => {
        const q = new URLSearchParams();
        ['genre', 'type', 'marque', 'taille', 'couleur'].forEach(k => st[k].length && q.set(k, st[k].join(',')));
        if (st.serie) q.set('serie', st.serie);
        if (st.q) q.set('q', st.q);
        if (st.tri !== 'pertinence') q.set('tri', st.tri);
        if (st.max < maxPrice) q.set('max', st.max);
        if (st.promo) q.set('promo', '1');
        if (st.page > 1) q.set('page', st.page);
        const qs = q.toString();
        history.replaceState(null, '', (brand ? '#/marque/' + brand.id : '#/catalogue') + (qs ? '?' + qs : ''));
      };

      const pagerHTML = (page, pages) => {
        if (pages <= 1) return '';
        const nums = [];
        for (let i = 1; i <= pages; i++) {
          if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
          else if (nums[nums.length - 1] !== '…') nums.push('…');
        }
        return `<button class="pg" data-pg="${page - 1}" ${page === 1 ? 'disabled' : ''} aria-label="Page précédente">‹</button>` +
          nums.map(n => n === '…' ? '<span class="pg-gap">…</span>' : `<button class="pg ${n === page ? 'on' : ''}" data-pg="${n}">${n}</button>`).join('') +
          `<button class="pg" data-pg="${page + 1}" ${page === pages ? 'disabled' : ''} aria-label="Page suivante">›</button>`;
      };

      let first = true;
      const render = async (opts = {}) => {
        syncUI();
        const list = filtered();
        const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
        st.page = Math.min(st.page, pages);
        $('#catCount').textContent = `${list.length} produit${list.length > 1 ? 's' : ''}`;
        $('#fApply').textContent = `Voir les ${list.length} produit${list.length > 1 ? 's' : ''}`;
        if (!first && !reduced) { grid.classList.add('fading'); await wait(200); }
        const slice = list.slice((st.page - 1) * PER_PAGE, st.page * PER_PAGE);
        let cards = slice.map(card);
        if (slice.length >= 8 && edito) cards.splice(6, 0, edito);
        grid.innerHTML = slice.length ? cards.join('') : emptyState('Aucune chaussure ne correspond à ces filtres.');
        $('#pager').innerHTML = pagerHTML(st.page, pages);
        grid.classList.remove('fading');
        reveal(grid);
        if (!first) writeURL();
        if (opts.scroll) window.scrollTo({ top: $('.coll').getBoundingClientRect().top + scrollY - 90, behavior: 'smooth' });
        first = false;
      };
      const change = () => { st.page = 1; render(); };

      $('#filters').addEventListener('click', e => {
        const b = e.target.closest('.chip[data-f]');
        if (!b) return;
        const k = b.dataset.f, v = k === 'taille' ? +b.dataset.v : b.dataset.v;
        const arr = st[k], i = arr.indexOf(v);
        i >= 0 ? arr.splice(i, 1) : arr.push(v);
        change();
      });
      $('#filters').addEventListener('change', e => {
        if (e.target.matches('input[data-f="marque"]')) { st.marque = $$('input[data-f="marque"]:checked').map(i => i.value); change(); }
        if (e.target.id === 'fPromo') { st.promo = e.target.checked; change(); }
      });
      $$('[data-couleur]').forEach(b => b.addEventListener('click', () => {
        st.couleur = [b.dataset.couleur]; change();
        window.scrollTo({ top: $('.coll').getBoundingClientRect().top + scrollY - 90, behavior: 'smooth' });
      }));
      const subcats = $('#subcats');
      subcats && subcats.addEventListener('click', e => {
        const b = e.target.closest('[data-serie]');
        if (!b) return;
        st.serie = st.serie === b.dataset.serie ? '' : b.dataset.serie;
        change();
      });
      dragScroll && subcats && dragScroll(subcats);
      let rt;
      $('#fMax').addEventListener('input', e => { st.max = +e.target.value; $('#maxOut').textContent = price(st.max); clearTimeout(rt); rt = setTimeout(change, 250); });
      $('#fSort').addEventListener('change', e => { st.tri = e.target.value; change(); });
      let qt;
      $('#fQ').addEventListener('input', e => { st.q = e.target.value; clearTimeout(qt); qt = setTimeout(change, 280); });
      $('#fReset').addEventListener('click', () => {
        Object.assign(st, { genre: [], type: [], marque: [], taille: [], couleur: [], serie: '', q: '', max: maxPrice, promo: false, page: 1 });
        $('#fQ').value = ''; $('#fMax').value = maxPrice; $('#fPromo').checked = false;
        render();
      });
      $('#activeFilters').addEventListener('click', e => {
        const t = e.target.closest('[data-rm]');
        if (!t) return;
        const k = t.dataset.rm, v = k === 'taille' ? +t.dataset.v : t.dataset.v;
        if (k === 'serie') st.serie = '';
        else if (k === 'promo') { st.promo = false; $('#fPromo').checked = false; }
        else st[k] = st[k].filter(x => x !== v);
        change();
      });
      $('#pager').addEventListener('click', e => {
        const b = e.target.closest('[data-pg]');
        if (!b || b.disabled) return;
        st.page = +b.dataset.pg;
        render({ scroll: true });
      });
      const closeF = () => document.body.classList.remove('filters-open');
      $('#fOpen').addEventListener('click', () => document.body.classList.add('filters-open'));
      $('#fClose').addEventListener('click', closeF);
      $('#fApply').addEventListener('click', () => { closeF(); window.scrollTo({ top: $('.coll').getBoundingClientRect().top + scrollY - 90, behavior: 'smooth' }); });
      disposers.push(closeF);
      render();
    };
    return [html, mount];
  }

  /* ---------- MARQUES ---------- */
  function viewBrands() {
    const all = products();
    const html = `
    <section class="page-head">
      <div class="page-head-inner">
        <nav class="crumbs"><a href="#/">Accueil</a><span>/</span><span>Marques</span></nav>
        <h1 class="page-title">Nos marques</h1>
        <p class="muted">Chaque marque, chaque modèle, rangés pour vous.</p>
      </div>
    </section>
    <section class="section brands-list">
      ${C.brands.map((b, i) => {
        const list = all.filter(p => p.brandId === b.id);
        if (!list.length) return '';
        return `<article class="brand-row" data-reveal style="--d:${(i % 4) * 80}ms; --bc:${esc(b.color || '#d4af5f')}">
          <a href="#/marque/${b.id}" class="brand-row-head">
            ${brandLogo(b, 'row-logo')}
            <div><h2>${esc(b.name)}</h2><p class="muted">${esc(b.description || '')}</p></div>
            <span class="arrow-link">${list.length} modèle${list.length > 1 ? 's' : ''} <span>→</span></span>
          </a>
          <div class="brand-models">${list.map(p => `
            <a href="#/produit/${p.id}" class="model-pill">
              <img src="${mainImg(p)}" alt="" loading="lazy">
              <span><b>${esc(p.model)}</b><small>${TYPES[p.type]} · ${price(p.price)}</small></span>
            </a>`).join('')}
          </div>
        </article>`;
      }).join('')}
    </section>`;
    return [html];
  }

  function viewBrand([id], params) {
    if (!brandById(id)) return viewNotFound();
    return viewCatalogue(null, params, id);
  }

  /* ---------- FICHE PRODUIT ---------- */
  /* ---------- Visionneuse 360° ---------- */
  function mountSpin(p) {
    const frames = p.spin, n = frames.length;
    const el = $('#spin360'), im = $('#spinImg'), range = $('#s360Range'), bar = $('#s360Load i');
    let pos = 0, cur = 0, loaded = 0, raf = 0, glideRaf = 0, interacted = false;
    const set = v => {
      pos = v;
      const i = ((Math.round(v) % n) + n) % n;
      if (i !== cur) { cur = i; im.src = frames[i]; range.value = i; }
    };
    const stop = () => {
      interacted = true;
      cancelAnimationFrame(raf); cancelAnimationFrame(glideRaf);
      const h = $('#s360Hint'); h && h.classList.add('gone');
    };
    const autoTurn = () => {
      if (reduced || interacted) return;
      let t0 = 0;
      const dur = 2800;
      const step = t => {
        if (interacted) return;
        if (!t0) t0 = t;
        const k = Math.min(1, (t - t0) / dur);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        set(e * n);
        if (k < 1) raf = requestAnimationFrame(step); else set(0);
      };
      raf = requestAnimationFrame(step);
    };
    // Préchargement de toutes les vues
    frames.forEach(src => {
      const o = new Image();
      o.onload = o.onerror = () => {
        loaded++;
        bar.style.width = Math.round(loaded / n * 100) + '%';
        if (loaded === n) el.classList.add('ready');
      };
      o.src = src;
    });
    // Glisser : une largeur de visionneuse = un tour complet
    const ppf = () => Math.max(3, el.clientWidth / n);
    let down = false, sx = 0, sp = 0, lastX = 0, lastT = 0, vel = 0;
    el.addEventListener('pointerdown', e => {
      if (e.target === range) return;
      stop(); down = true; sx = lastX = e.clientX; sp = pos; lastT = performance.now(); vel = 0;
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* capture indisponible : sans effet */ }
      el.classList.add('grabbing');
    });
    el.addEventListener('pointermove', e => {
      if (!down) return;
      const now = performance.now();
      vel = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX; lastT = now;
      set(sp - (e.clientX - sx) / ppf());
    });
    const up = () => {
      if (!down) return;
      down = false; el.classList.remove('grabbing');
      let v = vel * 16;
      const glide = () => {
        v *= 0.92;
        if (Math.abs(v) < 0.4) { set(Math.round(pos)); return; }
        set(pos - v / ppf());
        glideRaf = requestAnimationFrame(glide);
      };
      glideRaf = requestAnimationFrame(glide);
    };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { stop(); set(cur + 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { stop(); set(cur - 1); e.preventDefault(); }
    });
    range.addEventListener('input', () => { stop(); set(+range.value); });
    // Onglets 360° / Photos
    const tabs = $('#viewTabs');
    tabs && tabs.addEventListener('click', e => {
      const b = e.target.closest('[data-mode]');
      if (!b) return;
      const is360 = b.dataset.mode === '360';
      $$('#viewTabs button').forEach(x => x.classList.toggle('on', x === b));
      el.hidden = !is360;
      $('#photoView').hidden = is360;
    });
    disposers.push(() => { cancelAnimationFrame(raf); cancelAnimationFrame(glideRaf); });
  }
  function viewProduct([id]) {
    const p = productById(id);
    if (!p || p.active === false) return viewNotFound();
    const b = brandById(p.brandId) || {};
    const d = discount(p);
    const sizes = (p.sizes || []).slice().sort((a, b) => a - b);
    const PV = viewsOf(p);
    const start = Math.max(0, PV.findIndex(v => v.id === mainView(p)));
    const photo = isPhoto(p);
    const hasSpin = has360(p);
    const related = products().filter(x => x.id !== p.id && (x.brandId === p.brandId || x.type === p.type))
      .sort((a, c) => (c.brandId === p.brandId) - (a.brandId === p.brandId)).slice(0, 4);

    const html = `
    <section class="pdp">
      <nav class="crumbs pdp-crumbs"><a href="#/">Accueil</a><span>/</span><a href="#/marque/${b.id}">${esc(b.name)}</a><span>/</span><span>${esc(p.model)}</span></nav>
      <div class="gallery" data-reveal>
        ${hasSpin ? `<div class="view-tabs" id="viewTabs" role="tablist">
          <button class="on" data-mode="360" role="tab">${ICONS.spin}360°</button>
          <button data-mode="photos" role="tab">Photos</button>
        </div>
        <div class="spin360" id="spin360" tabindex="0" aria-label="Vue 360° : glissez ou utilisez les flèches pour faire tourner la chaussure">
          <img id="spinImg" src="${esc(p.spin[0])}" alt="${esc(b.name + ' ' + p.model)} — vue 360°" draggable="false">
          <span class="s360-badge">${ICONS.spin}360°</span>
          <span class="s360-hint" id="s360Hint">${ICONS.drag}Glissez pour faire tourner</span>
          <div class="s360-load" id="s360Load"><i></i></div>
          <input type="range" class="s360-range" id="s360Range" min="0" max="${p.spin.length - 1}" value="0" step="1" aria-label="Rotation de la chaussure">
        </div>` : ''}
        <div id="photoView"${hasSpin ? ' hidden' : ''}>
        <div class="stage ${photo ? 'photo' : ''}" id="stage" tabindex="0" aria-label="Visionneuse : glissez ou utilisez les flèches pour changer de vue">
          <span class="stage-bg-word" aria-hidden="true">${esc(b.name || '')}</span>
          <img id="stageImg" src="${img(p, PV[start].id)}" alt="${esc(b.name + ' ' + p.model)} — vue ${PV[start].label}" draggable="false">
          <div class="stage-ui">
            <span class="view-label" id="viewLabel">${photo ? (PV.length === 1 ? 'Photo' : 'Photo ' + (start + 1)) : PV[start].label}</span>
            ${PV.length > 1 ? `<div class="stage-btns">
              <button class="round-btn" id="prevView" aria-label="Vue précédente">‹</button>
              <button class="round-btn spin-btn" id="spinBtn" aria-label="Rotation automatique">${photo ? '▶' : '360°'}</button>
              <button class="round-btn" id="nextView" aria-label="Vue suivante">›</button>
            </div>` : ''}
          </div>
          <span class="stage-hint">${PV.length > 1 ? 'Glissez pour changer de vue • ' : ''}Cliquez pour zoomer</span>
        </div>
        ${PV.length > 1 ? `<div class="thumbs" id="thumbs" style="--n:${PV.length}">
          ${PV.map((v, i) => `<button class="thumb ${i === start ? 'active' : ''}" data-view="${i}">
            <img src="${img(p, v.id)}" alt="" loading="lazy"><span>${photo ? 'Photo ' + (i + 1) : v.label}</span></button>`).join('')}
        </div>` : ''}
        </div>
      </div>

      <div class="pdp-info">
        <a class="pdp-brand" href="#/marque/${b.id}" data-reveal>${esc(b.name)}</a>
        <h1 class="pdp-title" data-reveal style="--d:60ms">${esc(p.model)}</h1>
        <div class="pdp-tags" data-reveal style="--d:120ms">
          <a href="#/catalogue?type=${p.type}" class="tag">${TYPES[p.type]}</a>
          ${p.gender.map(g => `<a href="#/catalogue?genre=${g}" class="tag">${GENDERS[g]}</a>`).join('')}
          ${p.isNew ? '<span class="tag hot">Nouveau</span>' : ''}
        </div>
        <div class="pdp-price" data-reveal style="--d:160ms">
          <b>${price(p.price)}</b>${p.oldPrice > p.price ? `<s>${price(p.oldPrice)}</s><span class="badge sale">-${d}%</span>` : ''}
        </div>
        <p class="pdp-desc" data-reveal style="--d:200ms">${esc(p.description)}</p>

        ${p.colors && p.colors.length ? `<div class="pdp-block" data-reveal style="--d:240ms">
          <h4>Coloris : <span id="colorName">${esc(p.colors[0].name)}</span></h4>
          <div class="swatches">${p.colors.map((c, i) => `<button class="swatch ${i === 0 ? 'on' : ''}" data-color="${esc(c.name)}" style="--c:${esc(c.hex)}" aria-label="${esc(c.name)}"></button>`).join('')}</div>
        </div>` : ''}

        <div class="pdp-block" data-reveal style="--d:280ms">
          <h4>Pointure <span class="muted">(EU)</span> <a class="pdp-guide" href="#/aide/guide-tailles">Guide des tailles</a></h4>
          <div class="size-grid" id="sizeGrid">${sizes.length ? sizes.map(s => `<button class="size" data-size="${s}">${s}</button>`).join('') : '<span class="muted">Pointures sur demande</span>'}</div>
        </div>

        <div class="pdp-actions" data-reveal style="--d:320ms">
          <div class="qty"><button id="qMinus" aria-label="Moins">−</button><span id="qVal">1</span><button id="qPlus" aria-label="Plus">+</button></div>
          <button class="btn btn-primary magnetic grow" id="addBtn" ${p.stock <= 0 ? 'disabled' : ''}>${p.stock <= 0 ? 'Épuisé' : 'Ajouter au panier'}</button>
          ${favBtn(p, 'pdp-fav')}
        </div>
        <button class="btn btn-ghost btn-block" id="waBtn" data-reveal style="--d:360ms">Commander directement sur WhatsApp</button>
        <p class="stock ${p.stock <= 0 ? 'out' : p.stock <= 3 ? 'low' : ''}" data-reveal style="--d:380ms">
          <span></span>${p.stock <= 0 ? 'Rupture de stock' : p.stock <= 3 ? `Plus que ${p.stock} paire${p.stock > 1 ? 's' : ''} !` : 'En stock — expédition rapide'}
        </p>

        <div class="accordion" data-reveal style="--d:420ms">
          ${photo ? '' : '<details open><summary>Les 5 vues du modèle</summary><p>Face, profil, dessus, arrière et semelle : faites glisser l\'image ou utilisez les miniatures pour examiner chaque angle.</p></details>'}
          <details><summary>Livraison & retours</summary><p>Livraison en 24 à 72 h. Paiement à la livraison possible. Échange de pointure sous 7 jours si la paire n'a pas été portée.</p></details>
          <details><summary>Guide des pointures</summary><p>Si vous hésitez entre deux pointures, prenez la plus grande. Contactez-nous sur WhatsApp pour un conseil personnalisé.</p></details>
        </div>
      </div>
    </section>

    ${related.length ? `<section class="section">
      ${sectionHead('Vous aimerez aussi', 'Dans le même esprit')}
      <div class="grid">${related.map(card).join('')}</div>
    </section>` : ''}`;

    const mount = () => {
      if (hasSpin) mountSpin(p);
      const stage = $('#stage'), imgEl = $('#stageImg');
      let idx = start, token = 0, spin = null, qty = 1, size = null, color = p.colors && p.colors[0] ? p.colors[0].name : '';

      const show = (i, dir = 1) => {
        if (PV.length < 2) return;
        idx = (i + PV.length) % PV.length;
        const v = PV[idx], my = ++token;
        stage.classList.remove('zoomed');
        $('#viewLabel').textContent = photo ? 'Photo ' + (idx + 1) : v.label;
        $$('.thumb').forEach((t, j) => t.classList.toggle('active', j === idx));
        if (reduced) { imgEl.src = img(p, v.id); return; }
        imgEl.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-40 * dir}px) rotateY(${-35 * dir}deg) scale(.92)` }],
          { duration: 170, easing: 'ease-in', fill: 'forwards' }).onfinish = () => {
          if (my !== token) return;
          imgEl.src = img(p, v.id);
          imgEl.alt = `${b.name} ${p.model} — vue ${v.label}`;
          imgEl.animate([{ opacity: 0, transform: `translateX(${40 * dir}px) rotateY(${35 * dir}deg) scale(.92)` }, { opacity: 1, transform: 'none' }],
            { duration: 380, easing: 'cubic-bezier(.2,.9,.25,1)', fill: 'forwards' });
        };
      };

      const stopSpin = () => { if (spin) { clearInterval(spin); spin = null; $('#spinBtn') && $('#spinBtn').classList.remove('on'); } };
      disposers.push(stopSpin);
      if (PV.length > 1) {
        $('#spinBtn').addEventListener('click', () => {
          if (spin) return stopSpin();
          $('#spinBtn').classList.add('on');
          show(idx + 1);
          spin = setInterval(() => show(idx + 1), photo ? 1800 : 1100);
        });
        $('#prevView').addEventListener('click', () => { stopSpin(); show(idx - 1, -1); });
        $('#nextView').addEventListener('click', () => { stopSpin(); show(idx + 1, 1); });
        $('#thumbs').addEventListener('click', e => { const t = e.target.closest('[data-view]'); if (t) { stopSpin(); const n = +t.dataset.view; show(n, n >= idx ? 1 : -1); } });
      }
      stage.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { stopSpin(); show(idx + 1, 1); }
        if (e.key === 'ArrowLeft') { stopSpin(); show(idx - 1, -1); }
      });

      // glisser pour tourner / cliquer pour zoomer
      let down = false, sx = 0, moved = false;
      stage.addEventListener('pointerdown', e => {
        if (e.target.closest('button')) return;
        down = true; moved = false; sx = e.clientX; stopSpin();
      });
      stage.addEventListener('pointermove', e => {
        if (stage.classList.contains('zoomed') && !down) {
          const r = stage.getBoundingClientRect();
          imgEl.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
        }
        if (!down) return;
        const dx = e.clientX - sx;
        if (Math.abs(dx) > 55) { moved = true; show(idx + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); sx = e.clientX; }
      });
      stage.addEventListener('pointerup', e => {
        if (down && !moved && !e.target.closest('button')) {
          const r = stage.getBoundingClientRect();
          imgEl.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
          stage.classList.toggle('zoomed');
        }
        down = false;
      });
      stage.addEventListener('pointerleave', () => { down = false; stage.classList.remove('zoomed'); });

      // options
      $$('.swatch').forEach(s => s.addEventListener('click', () => {
        $$('.swatch').forEach(x => x.classList.remove('on'));
        s.classList.add('on'); color = s.dataset.color; $('#colorName').textContent = color;
      }));
      $('#sizeGrid').addEventListener('click', e => {
        const s = e.target.closest('[data-size]');
        if (!s) return;
        $$('.size').forEach(x => x.classList.remove('on'));
        s.classList.add('on'); size = s.dataset.size;
      });
      const setQ = v => { qty = Math.max(1, Math.min(20, v)); $('#qVal').textContent = qty; };
      $('#qMinus').addEventListener('click', () => setQ(qty - 1));
      $('#qPlus').addEventListener('click', () => setQ(qty + 1));

      const needSize = () => {
        if (sizes.length && !size) {
          const g = $('#sizeGrid');
          g.classList.remove('shake'); void g.offsetWidth; g.classList.add('shake');
          toast('Choisissez d\'abord votre pointure.', 'warn');
          return true;
        }
        return false;
      };
      $('#addBtn').addEventListener('click', () => {
        if (needSize()) return;
        Cart.add(p.id, size || 'Unique', color, qty);
        flyToCart(imgEl);
        toast(`${p.model} (P. ${size || 'unique'}) ajouté au panier`);
      });
      $('#waBtn').addEventListener('click', () => {
        if (needSize()) return;
        sendWhatsApp([{ p, size: size || 'Unique', color, qty }]);
      });
    };
    return [html, mount];
  }

  function viewNotFound() {
    return [`<section class="section notfound">
      <h1 class="page-title giant">404</h1>
      <p class="muted">Cette page s'est fait la malle… comme une paire en promo.</p>
      <a href="#/" class="btn btn-primary">Retour à l'accueil</a>
    </section>`];
  }

  /* =========================================================
     ROUTEUR
     ========================================================= */
  const routes = [
    [/^\/?$/, viewHome],
    [/^\/catalogue$/, viewCatalogue],
    [/^\/marques$/, viewBrands],
    [/^\/marque\/([^/]+)$/, viewBrand],
    [/^\/produit\/([^/]+)$/, viewProduct],
    [/^\/aide\/([^/]+)$/, viewHelp]
  ];

  function parseHash() {
    const h = decodeURIComponent(location.hash.slice(1)) || '/';
    const [path, qs] = h.split('?');
    return { path: path || '/', params: new URLSearchParams(qs || '') };
  }

  let routing = false, pending = null, firstRoute = true;
  async function router(opts = {}) {
    if (location.hash && !location.hash.startsWith('#/') && !firstRoute) return; // ancres internes
    if (routing) { pending = opts; return; }
    routing = true;
    const { path, params } = parseHash();
    let view = viewNotFound, m = null;
    for (const [re, fn] of routes) { m = path.match(re); if (m) { view = fn; break; } }

    disposers.forEach(fn => { try { fn(); } catch (e) { /* ignore */ } });
    disposers = [];
    closeCart(); closeSearch(); document.body.classList.remove('menu-open');

    if (!firstRoute && !opts.soft && !reduced) {
      app.classList.add('page-leave');
      await wait(260);
    }
    const [html, mount] = view(m ? m.slice(1) : [], params);
    app.innerHTML = html;
    if (!opts.soft) window.scrollTo({ top: 0, behavior: 'instant' });
    app.classList.remove('page-leave');
    if (!opts.soft) { app.classList.remove('page-enter'); void app.offsetWidth; app.classList.add('page-enter'); }
    mount && mount();
    tickCountdowns();
    reveal(app); tilt(app); magnetic(app);
    setActiveNav(path, params);
    firstRoute = false;
    routing = false;
    if (pending) { const o = pending; pending = null; router(o); }
  }

  function setActiveNav(path, params) {
    let key = 'home';
    if (path.startsWith('/marque')) key = 'marques';
    else if (path === '/catalogue') {
      const g = params.get('genre');
      key = params.get('promo') === '1' ? 'promos' : params.get('tri') === 'recent' && !g ? 'nouveautes' : g && !g.includes(',') ? g : 'catalogue';
    } else if (path !== '/') key = '';
    $$('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === key));
  }

  /* =========================================================
     CHROME : en-tête, recherche, pied de page, curseur
     ========================================================= */
  function renderChrome() {
    const s = C.settings;
    document.title = `${s.shopName} — Chaussures homme & femme`;
    const msgs = String(s.announcement || s.tagline || '').split(/\s*[•|]\s*/).filter(Boolean);
    const promoOn = s.promoText && countdownTarget(s.promoEnd) && countdownTarget(s.promoEnd) > Date.now();
    $('#announce').innerHTML = `<div class="ann-inner">${promoOn ? `<span class="ann-promo">${esc(s.promoText)} <b data-countdown="${esc(s.promoEnd || 'weekly')}">--</b></span><a class="ann-cta" href="#/catalogue?promo=1">Voir les offres →</a>` : `<span>${esc(msgs[0] || '')}</span>`}</div>`;
    $('#ann2').innerHTML = msgs.length ? `<div class="ann2-dots">${msgs.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('')}</div><span class="ann-rot" id="annRot">${esc(msgs[0])}</span>` : '';
    clearInterval(renderChrome._rot);
    if (msgs.length > 1) { let k = 0; renderChrome._rot = setInterval(() => { const el = $('#annRot'); if (!el) return; el.classList.add('out'); setTimeout(() => { k = (k + 1) % msgs.length; el.textContent = msgs[k]; el.classList.remove('out'); $$('.ann2-dots i').forEach((d, i) => d.classList.toggle('on', i === k)); }, 350); }, 4000); }
    // Menus déroulants Homme / Femme
    ['homme', 'femme'].forEach(g => {
      const box = $('#mega' + (g === 'homme' ? 'Homme' : 'Femme')); if (!box) return;
      const list = products().filter(p => p.gender.includes(g) && isPhoto(p));
      const types = typesUsed().filter(t => list.some(p => p.type === t));
      const brs = C.brands.filter(b => b.id !== 'autres' && list.some(p => p.brandId === b.id)).slice(0, 12);
      box.innerHTML = `<div class="mg-types">${types.map(t => { const rep = list.find(p => p.type === t && p.featured) || list.find(p => p.type === t); return `<a href="#/catalogue?genre=${g}&type=${t}"><img src="${mainImg(rep)}" alt="" loading="lazy"><span>${TYPES[t]}</span></a>`; }).join('')}</div>
        <div class="mg-brands"><b>Marques</b>${brs.map(b => `<a href="#/marque/${b.id}">${esc(b.name)}</a>`).join('')}<a class="all" href="#/catalogue?genre=${g}">Tout voir →</a></div>`;
    });
    renderMobileMenu(renderMobileMenu._g || 'homme');
    const brandsWith = C.brands.filter(b => products().some(p => p.brandId === b.id));
    $('#megaBrands').innerHTML = brandsWith.map(b => `<a href="#/marque/${b.id}" style="--bc:${esc(b.color || '#d4af5f')}">${b.logo ? brandLogo(b, 'mega-logo') : '<i></i>'}${esc(b.name)}</a>`).join('') + `<a href="#/marques" class="all">Toutes les marques →</a>`;
    const wa = s.whatsapp ? 'https://wa.me/' + String(s.whatsapp).replace(/[^\d]/g, '') : '';
    const socials = [['WhatsApp', wa, 'whatsapp'], ['TikTok', s.tiktok, 'tiktok'], ['Snapchat', s.snapchat, 'snapchat'], ['Instagram', s.instagram, 'instagram'], ['Facebook', s.facebook, 'facebook']].filter(x => x[1]);
    const socialRow = socials.length ? `<div class="social-row">${socials.map(x => `<a class="social-ic ${x[2]}" href="${esc(x[1])}" target="_blank" rel="noopener" aria-label="${x[0]}" title="${x[0]}">${ICONS[x[2]]}</a>`).join('')}</div>` : '';
    $('#footer').innerHTML = `
      <div class="ft-trust">${TRUST.map(x => `<div>${ICONS[x[0]]}<span><b>${esc(x[1])}</b><small>${esc(x[2])}</small></span></div>`).join('')}</div>
      ${wa ? `<div class="ft-cta">
        <div class="ft-cta-text">
          <span class="ft-cta-kicker">Une paire vous plaît ?</span>
          <h3>Commandez en un message</h3>
          <p>Prix, pointures disponibles et livraison : on vous répond rapidement.</p>
        </div>
        <a class="ft-wa" href="${esc(wa)}" target="_blank" rel="noopener">${ICONS.whatsapp}<span>Écrire sur WhatsApp</span></a>
      </div>` : ''}
      <div class="ft-main">
        <div class="ft-brand">
          <a href="#/" class="ft-logo-link" aria-label="Accueil"><img class="ft-logo" src="img/logo-oneoff.png" alt="${esc(s.shopName)}"></a>
          <div>
            <b class="ft-name">${esc(s.shopName)}</b>
            <p>${esc(s.tagline)} Baskets, sandales, mocassins et bottes des plus grandes marques, pour homme et femme.</p>
            ${socialRow}
          </div>
        </div>
        <nav class="ft-col" aria-label="Boutique"><h4>Boutique</h4>
          <a href="#/">Accueil</a><a href="#/catalogue?genre=homme">Homme</a><a href="#/catalogue?genre=femme">Femme</a><a href="#/marques">Marques</a><a href="#/catalogue?promo=1">Promotions</a>
        </nav>
        <nav class="ft-col" aria-label="Aide"><h4>Aide</h4><a href="#/aide/faq">Questions fréquentes</a><a href="#/aide/livraison">Livraison & retours</a><a href="#/aide/guide-tailles">Guide des tailles</a>${wa ? `<a href="${esc(wa)}" target="_blank" rel="noopener">Nous contacter</a>` : ''}</nav>
        <nav class="ft-col" aria-label="Styles"><h4>Styles</h4>${typesUsed().map(k => `<a href="#/catalogue?type=${k}">${TYPES[k]}</a>`).join('')}<a href="#/catalogue?tri=recent">Nouveautés</a></nav>
        <div class="ft-col"><h4>Contact</h4>
          ${s.phone ? `<a class="ft-line" href="tel:${esc(s.phone.replace(/\s/g, ''))}">${ICONS.phone}<span>${esc(s.phone)}</span></a>` : ''}
          ${s.address ? `<p class="ft-line">${esc(s.address)}</p>` : ''}
          ${s.email ? `<a class="ft-line" href="mailto:${esc(s.email)}">${esc(s.email)}</a>` : ''}
          <p class="ft-note">Paiement à la livraison · Échange sous 7 jours</p>
        </div>
      </div>
      <div class="ft-bottom"><span>© ${new Date().getFullYear()} ${esc(s.shopName)} · Tous droits réservés</span><span class="ft-pay">${ICONS.cash} Paiement à la livraison · ${ICONS.whatsapp} Commande WhatsApp</span><a href="admin.html">Espace propriétaire</a></div>`;
  }

  /* ---------- Menu mobile (onglets Homme / Femme) ---------- */
  function renderMobileMenu(g) {
    renderMobileMenu._g = g;
    const body = $('#mmBody'); if (!body) return;
    const list = products().filter(p => p.gender.includes(g) && isPhoto(p));
    const types = typesUsed().filter(t => list.some(p => p.type === t));
    const brands = C.brands.filter(b => b.id !== 'autres' && list.some(p => p.brandId === b.id));
    $$('[data-mm]').forEach(b => b.classList.toggle('on', b.dataset.mm === g));
    body.innerHTML = `
      <a class="mm-all" href="#/catalogue?genre=${g}">Toutes les sneakers ${GENDERS[g].toLowerCase()} <span>→</span></a>
      <div class="mm-grid">${types.map(t => { const rep = list.find(p => p.type === t && p.featured) || list.find(p => p.type === t); return `<a href="#/catalogue?genre=${g}&type=${t}"><img src="${mainImg(rep)}" alt="" loading="lazy"><span>${TYPES[t]}</span></a>`; }).join('')}</div>
      <h4>Marques</h4>
      <div class="mm-brands">${brands.map(b => `<a href="#/marque/${b.id}">${brandLogo(b, 'mm-logo')}<span>${esc(b.name)}</span></a>`).join('')}</div>
      <nav class="mm-links"><a href="#/catalogue?tri=recent">Nouveautés</a><a href="#/catalogue?promo=1" class="red">Promotions</a><a href="#/marques">Toutes les marques</a><a href="#/aide/faq">Aide & FAQ</a><a href="#/aide/guide-tailles">Guide des tailles</a></nav>`;
  }

  function openSearch() {
    document.body.classList.add('search-open');
    $('#searchOverlay').setAttribute('aria-hidden', 'false');
    setTimeout(() => $('#searchInput').focus(), 200);
    renderSearch('');
  }
  function closeSearch() {
    document.body.classList.remove('search-open');
    $('#searchOverlay').setAttribute('aria-hidden', 'true');
  }
  function renderSearch(q) {
    q = q.trim().toLowerCase();
    const list = (q ? products().filter(p => `${brandName(p)} ${p.model} ${TYPES[p.type]}`.toLowerCase().includes(q)) : products().filter(p => p.featured)).slice(0, 8);
    $('#searchResults').innerHTML = (q ? '' : '<p class="muted small">Suggestions</p>') + (list.length ? list.map((p, i) => `
      <a href="#/produit/${p.id}" class="sr" style="--d:${i * 40}ms">
        <img src="${mainImg(p)}" alt=""><span><small>${esc(brandName(p))}</small><b>${esc(p.model)}</b></span><em>${price(p.price)}</em>
      </a>`).join('') : '<p class="muted">Aucun résultat.</p>');
  }

  function initCursor() {
    if (!finePointer || reduced) return;
    const c = $('.cursor'), d = $('.cursor-dot');
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    document.body.classList.add('has-cursor');
    window.addEventListener('pointermove', e => {
      x = e.clientX; y = e.clientY;
      d.style.transform = `translate(${x}px, ${y}px)`;
      const hov = e.target.closest('a, button, .stage, input, select, label');
      c.classList.toggle('hover', !!hov);
    });
    const loop = () => {
      cx += (x - cx) * 0.16; cy += (y - cy) * 0.16;
      c.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  function initHeader() {
    const h = $('#header');
    let last = 0;
    window.addEventListener('scroll', () => {
      const y = scrollY;
      h.classList.toggle('scrolled', y > 30);
      h.classList.toggle('hide', y > 300 && y > last && !document.body.classList.contains('menu-open'));
      last = y;
    }, { passive: true });
    $('#burger').addEventListener('click', () => document.body.classList.add('mm-open'));
    $('#mmClose').addEventListener('click', () => document.body.classList.remove('mm-open'));
    $('#mobileMenu').addEventListener('click', e => {
      const tab = e.target.closest('[data-mm]'); if (tab) return renderMobileMenu(tab.dataset.mm);
      if (e.target.closest('a')) document.body.classList.remove('mm-open');
    });
    $('#mainNav').addEventListener('click', e => { if (e.target.closest('a')) document.body.classList.remove('menu-open'); });
  }

  function bindGlobal() {
    $('#cartBtn').addEventListener('click', () => openCart('cart'));
    $('#favBtn').addEventListener('click', () => openCart('fav'));
    $('#cartClose').addEventListener('click', closeCart);
    $('.drawer-tabs').addEventListener('click', e => { const b = e.target.closest('[data-dtab]'); if (b) setDrawerTab(b.dataset.dtab); });
    $('#backdrop').addEventListener('click', () => { closeCart(); document.body.classList.remove('filters-open', 'mm-open'); });
    $('#searchBtn').addEventListener('click', openSearch);
    $('#hSearch').addEventListener('click', openSearch);
    $('#searchClose').addEventListener('click', closeSearch);
    $('#searchInput').addEventListener('input', e => renderSearch(e.target.value));
    $('#searchInput').addEventListener('keydown', e => {
      if (e.key === 'Enter') { const q = e.target.value.trim(); closeSearch(); location.hash = '#/catalogue' + (q ? '?q=' + encodeURIComponent(q) : ''); }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeSearch(); closeCart(); document.body.classList.remove('mm-open'); } });

    document.addEventListener('click', e => {
      if (e.target.closest('[data-close-cart]')) closeCart();

      // Favoris
      const fv = e.target.closest('[data-fav]');
      if (fv) {
        e.preventDefault(); e.stopPropagation();
        const p = productById(fv.dataset.fav); if (!p) return;
        const on = Fav.toggle(p.id);
        renderFav();
        if (fv.classList.contains('fav-btn')) { fv.classList.remove('pop'); void fv.offsetWidth; fv.classList.add('pop'); }
        const fb = $('#favBtn'); fb.classList.remove('bump'); void fb.offsetWidth; fb.classList.add('bump');
        toast(on ? `${p.model} ajouté aux favoris` : `${p.model} retiré des favoris`);
        return;
      }
      // Flèches des carrousels
      const ca = e.target.closest('[data-car]');
      if (ca) { const tr = document.getElementById(ca.dataset.car); tr && tr.scrollBy({ left: +ca.dataset.dir * tr.clientWidth * 0.85, behavior: 'smooth' }); return; }

      const cq = e.target.closest('[data-cq]');
      if (cq) { const i = +cq.dataset.cq; Cart.setQty(i, Cart.items[i].qty + +cq.dataset.d); }
      const crm = e.target.closest('[data-crm]');
      if (crm) Cart.setQty(+crm.dataset.crm, 0);
      if (e.target.closest('#checkoutBtn')) sendWhatsApp(Cart.lines());

      // Ajout rapide depuis une carte
      const qa = e.target.closest('[data-quick]');
      if (qa) {
        e.preventDefault();
        $$('.card.qs-open').forEach(c => c.classList.remove('qs-open'));
        qa.closest('.card').classList.add('qs-open');
        return;
      }
      if (e.target.closest('[data-qclose]')) { e.target.closest('.card').classList.remove('qs-open'); return; }
      const qsz = e.target.closest('[data-qsize]');
      if (qsz) {
        const cardEl = qsz.closest('.card');
        const p = productById(cardEl.dataset.id);
        const color = p.colors && p.colors[0] ? p.colors[0].name : '';
        Cart.add(p.id, qsz.dataset.qsize, color, 1);
        flyToCart($('.img-main', cardEl));
        cardEl.classList.remove('qs-open');
        toast(`${p.model} (P. ${qsz.dataset.qsize}) ajouté au panier`);
        return;
      }
      if (!e.target.closest('.quick-sizes')) $$('.card.qs-open').forEach(c => c.classList.remove('qs-open'));
    });
  }

  async function hideLoader() {
    const l = $('#loader');
    if (!l) return;
    await wait(reduced ? 0 : 1300);
    l.classList.add('done');
    setTimeout(() => l.remove(), 900);
  }

  /* =========================================================
     DÉMARRAGE
     ========================================================= */
  async function boot() {
    C = await Store.load();
    Cart.load();
    Fav.load();
    renderChrome();
    renderCart();
    renderFav();
    tickCountdowns();
    setInterval(tickCountdowns, 1000);
    initHeader();
    bindGlobal();
    window.addEventListener('hashchange', () => router());
    await router();
    hideLoader();

    // Mise à jour en direct quand le propriétaire modifie le catalogue
    let seen = C.updatedAt || 0;
    const refresh = async () => {
      C = await Store.load();
      seen = C.updatedAt || 0;
      renderChrome(); renderCart(); renderFav();
      await router({ soft: true });
      tickCountdowns();
      toast('Catalogue mis à jour');
    };
    Store.onChange(refresh);
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState !== 'visible') return;
      const fresh = await Store.load();
      if ((fresh.updatedAt || 0) !== seen) refresh();
    });
  }

  boot();
})();
