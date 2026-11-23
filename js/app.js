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
  const brandLogo = (b, cls = '') => b.logo
    ? `<span class="blogo ${cls}" style="--lb:${esc(b.logoBg || '#ffffff')}"><img src="${esc(b.logo)}" alt="${esc(b.name)}" loading="lazy"></span>`
    : `<span class="blogo blogo-text ${cls}" style="--lb:${esc(b.color || '#333')}">${esc(b.name)}</span>`;
  const discount = p => p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

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

  function openCart() { document.body.classList.add('cart-open'); }
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
    <article class="card tilt" data-reveal style="--d:${(i % 8) * 70}ms" data-id="${p.id}">
      <div class="card-inner">
        <a href="#/produit/${p.id}" class="card-media" aria-label="${esc(brandName(p) + ' ' + p.model)}">
          <span class="badges">${p.isNew ? '<b class="badge new">Nouveau</b>' : ''}${d ? `<b class="badge sale">-${d}%</b>` : ''}${p.stock <= 0 ? '<b class="badge out">Épuisé</b>' : ''}</span>
          <img class="img-main" src="${mainImg(p)}" alt="${esc(brandName(p) + ' ' + p.model)}" loading="lazy">
          ${mainView(p) !== altView(p) ? `<img class="img-alt" src="${img(p, altView(p))}" alt="" loading="lazy">` : ''}
          <span class="card-shine"></span>
          <span class="card-views">${isPhoto(p) ? `${viewsOf(p).length} photo${viewsOf(p).length > 1 ? 's' : ''}` : `${VIEWS.length} vues`}</span>
        </a>
        <div class="card-body">
          <span class="card-brand">${esc(brandName(p))}</span>
          <a href="#/produit/${p.id}" class="card-title">${esc(p.model)}</a>
          <span class="card-meta">${esc(TYPES[p.type] || '')} · ${p.gender.map(g => GENDERS[g]).join(' / ')}</span>
          <div class="card-foot">
            <span class="price">${price(p.price)}${p.oldPrice > p.price ? ` <s>${price(p.oldPrice)}</s>` : ''}</span>
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
    const all = products();
    const featured = all.filter(p => p.featured);
    const fresh = all.filter(p => p.isNew).concat(all.filter(p => !p.isNew)).slice(0, 10);
    const wall = [...new Set([...featured, ...all.filter(p => p.isNew), ...all])].filter(p => isPhoto(p)).slice(0, 21);
    const wallCols = [0, 1, 2].map(c => wall.filter((_, i) => i % 3 === c));
    const s = C.settings;
    const typeKeys = typesUsed();
    const brandsWithCount = C.brands.map(b => ({ ...b, n: all.filter(p => p.brandId === b.id).length })).filter(b => b.n);

    const html = `
    <section class="hero">
      <div class="hero-bg"><span class="blob b1"></span><span class="blob b2"></span><div class="hero-grid"></div></div>
      <div class="hero-text">
        <p class="eyebrow"><span class="pulse"></span>Nouvelle collection ${new Date().getFullYear()}</p>
        <h1 class="hero-title" id="heroTitle">${esc(s.heroTitle)}</h1>
        <p class="hero-sub">${esc(s.heroSubtitle)}</p>
        <div class="hero-cta">
          <a class="btn btn-primary magnetic" href="#/catalogue">Découvrir la collection</a>
          <a class="btn btn-ghost magnetic" href="#/marques">Nos marques</a>
        </div>
        <div class="hero-stats">
          <div><b data-count="${all.length}">0</b><span>Modèles</span></div>
          <div><b data-count="${brandsWithCount.length}">0</b><span>Marques</span></div>
          <div><b data-count="${typeKeys.length}">0</b><span>Styles</span></div>
        </div>
      </div>
      ${wall.length ? `
      <div class="hero-visual hero-wall" id="heroVisual" aria-label="Nos chaussures">
        ${wallCols.map((col, ci) => `<div class="hw-col ${ci % 2 ? 'down' : 'up'}" style="--dur:${42 + ci * 9}s"><div class="hw-track">${[0, 1].map(k => col.map(p => `<a class="hw-item" href="#/produit/${p.id}"${k ? ' tabindex="-1" aria-hidden="true"' : ''}><img src="${mainImg(p)}" alt="${esc(brandName(p) + ' ' + p.model)}" loading="lazy"><span class="hw-cap"><small>${esc(brandName(p))}</small><b>${esc(p.model)}</b></span></a>`).join('')).join('')}</div></div>`).join('')}
      </div>` : ''}
      <button class="scroll-hint" id="scrollHint" aria-label="Défiler"><span></span></button>
    </section>

    <section class="marquee" aria-label="Marques">
      <div class="marquee-track">${[0, 1].map(() => brandsWithCount.filter(b => b.id !== 'autres').map(b => `<a href="#/marque/${b.id}" class="mq-item" title="${esc(b.name)}">${brandLogo(b, 'mq-logo')}</a>`).join('')).join('')}</div>
    </section>

    <section class="section" id="types">
      ${sectionHead('Par style', 'Trouvez votre paire', ['#/catalogue', 'Tout voir'])}
      <div class="types-grid">
        ${typeKeys.map((t, i) => {
          const list = all.filter(p => p.type === t);
          const rep = list.find(p => p.featured) || list[0];
          const art = rep ? mainImg(rep) : ShoeArt.uri(t, 'profil', {});
          return `<a href="#/catalogue?type=${t}" class="type-card tilt" data-reveal style="--d:${i * 80}ms">
            <span class="type-num">0${i + 1}</span>
            <img src="${art}" alt="" loading="lazy">
            <div><h3>${TYPES[t]}</h3><span>${list.length} modèle${list.length > 1 ? 's' : ''}</span></div>
            <span class="type-arrow">→</span>
          </a>`;
        }).join('')}
      </div>
    </section>

    <section class="section genders">
      ${Object.keys(GENDERS).map((g, i) => {
        const list = all.filter(p => p.gender.includes(g));
        const only = list.filter(p => p.gender.length === 1 && isPhoto(p));
        const cover = only.find(p => p.featured) || only[0] || list.find(p => isPhoto(p)) || list[0];
        return `<a href="#/catalogue?genre=${g}" class="gender-tile g-${g}" data-reveal style="--d:${i * 120}ms">
          <div class="gender-pics">${cover ? `<img class="g-cover" src="${mainImg(cover)}" alt="" loading="lazy">` : ''}</div>
          <div class="gender-text"><span class="kicker">${list.length} modèles</span><h3>${GENDERS[g]}</h3><span class="arrow-link">Explorer <span>→</span></span></div>
        </a>`;
      }).join('')}
    </section>

    ${featured.length ? `<section class="section">
      ${sectionHead('Sélection', 'Les pièces du moment', ['#/catalogue', 'Voir le catalogue'])}
      <div class="grid">${featured.slice(0, 8).map(card).join('')}</div>
    </section>` : ''}

    <section class="big-banner" aria-hidden="true">
      <div class="bb-line" data-speed="1">BASKETS ✦ SANDALES ✦ MOCASSINS ✦ BOTTES ✦ BASKETS ✦ SANDALES ✦ MOCASSINS ✦</div>
      <div class="bb-line outline" data-speed="-1">HOMME ✦ FEMME ✦ ${esc(s.shopName)} ✦ HOMME ✦ FEMME ✦ ${esc(s.shopName)} ✦</div>
    </section>

    <section class="section">
      ${sectionHead('Arrivages', 'Nouveautés', ['#/catalogue?tri=recent', 'Toutes les nouveautés'])}
      <div class="slider" id="newSlider">${fresh.map((p, i) => card(p, i)).join('')}</div>
    </section>

    <section class="section">
      ${sectionHead('Marques', 'Classées par marque & modèle', ['#/marques', 'Toutes les marques'])}
      <div class="brand-grid">
        ${brandsWithCount.map((b, i) => `<a href="#/marque/${b.id}" class="brand-tile" data-reveal style="--d:${i * 50}ms; --bc:${esc(b.color || '#d4af5f')}">
          ${brandLogo(b, 'tile-logo')}
          <b>${esc(b.name)}</b><span>${b.n} modèle${b.n > 1 ? 's' : ''}</span>
        </a>`).join('')}
      </div>
    </section>

    ${s.whatsapp || s.tiktok || s.snapchat ? `<section class="section">
      <div class="contact-band" data-reveal>
        <div class="contact-poster"><img src="img/affiche-oneoff.jpg" alt="Affiche ${esc(s.shopName)}" loading="lazy"></div>
        <div class="contact-text">
          <span class="kicker">Commander</span>
          <h2>Contactez-nous pour commander maintenant</h2>
          <p>Une paire vous plaît ? Écrivez-nous, on vous répond rapidement avec le prix, les pointures disponibles et la livraison.</p>
          <div class="contact-links">
            ${s.whatsapp ? `<a class="contact-link" href="https://wa.me/${esc(String(s.whatsapp).replace(/[^\d]/g, ''))}" target="_blank" rel="noopener"><span class="ci wa">${ICONS.whatsapp}</span><span><small>WhatsApp</small><b>${esc(s.phone || '+' + s.whatsapp)}</b></span></a>` : ''}
            ${s.tiktok ? `<a class="contact-link" href="${esc(s.tiktok)}" target="_blank" rel="noopener"><span class="ci tt">${ICONS.tiktok}</span><span><small>TikTok</small><b>@${esc(s.tiktok.split('@').pop().replace(/\/.*$/, ''))}</b></span></a>` : ''}
            ${s.snapchat ? `<a class="contact-link" href="${esc(s.snapchat)}" target="_blank" rel="noopener"><span class="ci sc">${ICONS.snapchat}</span><span><small>Snapchat</small><b>@${esc(s.snapchat.replace(/\/+$/, '').split('/').pop())}</b></span></a>` : ''}
          </div>
        </div>
      </div>
    </section>` : ''}

    <section class="section perks">
      ${[['🚚', 'Livraison rapide', 'Partout en ville, en 24 à 72 h.'], ['💳', 'Paiement à la livraison', 'Vous payez quand vous recevez.'], ['🔁', 'Échange sous 7 jours', 'La pointure ne va pas ? On échange.'], ['✅', 'Qualité vérifiée', 'Chaque paire est contrôlée.']]
        .map((x, i) => `<div class="perk" data-reveal style="--d:${i * 90}ms"><span>${x[0]}</span><b>${x[1]}</b><p>${x[2]}</p></div>`).join('')}
    </section>`;

    const mount = () => {
      splitWords($('#heroTitle'));
      requestAnimationFrame(() => $('.hero').classList.add('ready'));
      counters();
      dragScroll($('#newSlider'));
      $('#scrollHint').addEventListener('click', () => {
        const t = $('#types');
        window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' });
      });

      // Bandeaux qui défilent au scroll
      const lines = $$('.bb-line');
      const onScroll = () => {
        const y = window.scrollY;
        lines.forEach(l => { l.style.transform = `translateX(${(l.dataset.speed * y * 0.25) % 1200 - 300}px)`; });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      disposers.push(() => window.removeEventListener('scroll', onScroll));
    };
    return [html, mount];
  }

  /* ---------- CATALOGUE ---------- */
  function viewCatalogue(_, params) {
    const st = {
      genre: (params.get('genre') || '').split(',').filter(Boolean),
      type: (params.get('type') || '').split(',').filter(Boolean),
      marque: (params.get('marque') || '').split(',').filter(Boolean),
      taille: (params.get('taille') || '').split(',').filter(Boolean).map(Number),
      q: params.get('q') || '',
      tri: params.get('tri') || 'pertinence',
      max: +params.get('max') || 0,
      promo: params.get('promo') === '1'
    };
    const all = products();
    const maxPrice = Math.max(10000, ...all.map(p => p.price));
    const allSizes = [...new Set(all.flatMap(p => p.sizes || []))].sort((a, b) => a - b);
    if (!st.max) st.max = maxPrice;

    let title = 'Catalogue';
    if (st.genre.length === 1 && !st.type.length) title = GENDERS[st.genre[0]] || title;
    if (st.type.length === 1 && !st.genre.length) title = TYPES[st.type[0]] || title;
    if (st.genre.length === 1 && st.type.length === 1) title = `${TYPES[st.type[0]]} ${GENDERS[st.genre[0]]}`;

    const chip = (group, val, label) => `<button class="chip" data-f="${group}" data-v="${val}">${label}</button>`;

    const html = `
    <section class="page-head">
      <div class="page-head-inner">
        <nav class="crumbs"><a href="#/">Accueil</a><span>/</span><span>Catalogue</span></nav>
        <h1 class="page-title" id="catTitle">${esc(title)}</h1>
        <p class="muted" id="catCount"></p>
      </div>
    </section>
    <section class="catalog">
      <aside class="filters" id="filters">
        <div class="filters-head"><b>Filtres</b><button class="link-btn" id="fReset">Tout effacer</button><button class="icon-btn filters-close" id="fClose" aria-label="Fermer">✕</button></div>
        <div class="f-group"><h4>Univers</h4><div class="chips">${Object.entries(GENDERS).map(([k, v]) => chip('genre', k, v)).join('')}</div></div>
        <div class="f-group"><h4>Style</h4><div class="chips">${typesUsed().map(k => chip('type', k, TYPES[k])).join('')}</div></div>
        <div class="f-group"><h4>Marque</h4><div class="checks">${C.brands.map(b => {
          const n = all.filter(p => p.brandId === b.id).length;
          return n ? `<label class="check"><input type="checkbox" data-f="marque" value="${b.id}"><span></span>${esc(b.name)}<em>${n}</em></label>` : '';
        }).join('')}</div></div>
        <div class="f-group"><h4>Prix max <output id="maxOut"></output></h4>
          <input type="range" id="fMax" min="0" max="${maxPrice}" step="1000" value="${st.max}">
        </div>
        <div class="f-group"><h4>Pointure</h4><div class="chips sizes">${allSizes.map(s => chip('taille', s, s)).join('')}</div></div>
        <div class="f-group"><label class="check"><input type="checkbox" id="fPromo"><span></span>En promotion uniquement</label></div>
      </aside>
      <div class="catalog-main">
        <div class="catalog-bar">
          <div class="search-inline">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <input id="fQ" type="search" placeholder="Rechercher un modèle…" value="${esc(st.q)}">
          </div>
          <button class="btn btn-ghost filters-open" id="fOpen">Filtres</button>
          <select id="fSort" aria-label="Trier">
            <option value="pertinence">Pertinence</option>
            <option value="recent">Nouveautés</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
            <option value="nom">Nom A → Z</option>
          </select>
        </div>
        <div class="active-filters" id="activeFilters"></div>
        <div class="grid" id="grid"></div>
      </div>
    </section>`;

    const mount = () => {
      const grid = $('#grid');
      $('#fSort').value = st.tri;
      $('#fPromo').checked = st.promo;

      const syncUI = () => {
        $$('.chip[data-f]').forEach(b => {
          const arr = st[b.dataset.f];
          const v = b.dataset.f === 'taille' ? +b.dataset.v : b.dataset.v;
          b.classList.toggle('on', arr.includes(v));
        });
        $$('input[data-f="marque"]').forEach(i => { i.checked = st.marque.includes(i.value); });
        $('#maxOut').textContent = price(st.max);
        const tags = [
          ...st.genre.map(v => ['genre', v, GENDERS[v]]),
          ...st.type.map(v => ['type', v, TYPES[v]]),
          ...st.marque.map(v => ['marque', v, (brandById(v) || {}).name || v]),
          ...st.taille.map(v => ['taille', v, 'P. ' + v])
        ];
        $('#activeFilters').innerHTML = tags.map(t => `<button class="tag" data-rm="${t[0]}" data-v="${t[1]}">${esc(t[2])} ✕</button>`).join('');
      };

      const filtered = () => {
        const q = st.q.trim().toLowerCase();
        let list = all.filter(p =>
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
        ['genre', 'type', 'marque', 'taille'].forEach(k => st[k].length && q.set(k, st[k].join(',')));
        if (st.q) q.set('q', st.q);
        if (st.tri !== 'pertinence') q.set('tri', st.tri);
        if (st.max < maxPrice) q.set('max', st.max);
        if (st.promo) q.set('promo', '1');
        const qs = q.toString();
        history.replaceState(null, '', '#/catalogue' + (qs ? '?' + qs : ''));
      };

      let first = true;
      const render = async () => {
        syncUI();
        const list = filtered();
        $('#catCount').textContent = `${list.length} modèle${list.length > 1 ? 's' : ''}`;
        if (!first && !reduced) {
          grid.classList.add('fading');
          await wait(220);
        }
        grid.innerHTML = list.length ? list.map(card).join('') : emptyState('Aucune chaussure ne correspond à ces filtres.');
        grid.classList.remove('fading');
        reveal(grid); tilt(grid);
        if (!first) writeURL();
        first = false;
      };

      $('#filters').addEventListener('click', e => {
        const b = e.target.closest('.chip[data-f]');
        if (!b) return;
        const k = b.dataset.f, v = k === 'taille' ? +b.dataset.v : b.dataset.v;
        const arr = st[k], i = arr.indexOf(v);
        i >= 0 ? arr.splice(i, 1) : arr.push(v);
        render();
      });
      $('#filters').addEventListener('change', e => {
        if (e.target.matches('input[data-f="marque"]')) {
          st.marque = $$('input[data-f="marque"]:checked').map(i => i.value);
          render();
        }
        if (e.target.id === 'fPromo') { st.promo = e.target.checked; render(); }
      });
      let rt;
      $('#fMax').addEventListener('input', e => { st.max = +e.target.value; $('#maxOut').textContent = price(st.max); clearTimeout(rt); rt = setTimeout(render, 250); });
      $('#fSort').addEventListener('change', e => { st.tri = e.target.value; render(); });
      let qt;
      $('#fQ').addEventListener('input', e => { st.q = e.target.value; clearTimeout(qt); qt = setTimeout(render, 280); });
      $('#fReset').addEventListener('click', () => {
        Object.assign(st, { genre: [], type: [], marque: [], taille: [], q: '', max: maxPrice, promo: false });
        $('#fQ').value = ''; $('#fMax').value = maxPrice; $('#fPromo').checked = false;
        render();
      });
      $('#activeFilters').addEventListener('click', e => {
        const t = e.target.closest('[data-rm]');
        if (!t) return;
        const k = t.dataset.rm, v = k === 'taille' ? +t.dataset.v : t.dataset.v;
        st[k] = st[k].filter(x => x !== v);
        render();
      });
      $('#fOpen').addEventListener('click', () => document.body.classList.add('filters-open'));
      $('#fClose').addEventListener('click', () => document.body.classList.remove('filters-open'));
      disposers.push(() => document.body.classList.remove('filters-open'));
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

  function viewBrand([id]) {
    const b = brandById(id);
    if (!b) return viewNotFound();
    const list = products().filter(p => p.brandId === id);
    const byType = Object.keys(TYPES).map(t => [t, list.filter(p => p.type === t)]).filter(x => x[1].length);
    const html = `
    <section class="page-head brand-hero" style="--bc:${esc(b.color || '#d4af5f')}">
      <div class="page-head-inner">
        <nav class="crumbs"><a href="#/">Accueil</a><span>/</span><a href="#/marques">Marques</a><span>/</span><span>${esc(b.name)}</span></nav>
        ${b.logo ? brandLogo(b, 'hero-logo') : ''}
        <h1 class="page-title giant">${esc(b.name)}</h1>
        <p class="muted">${esc(b.description || '')} — ${list.length} modèle${list.length > 1 ? 's' : ''}</p>
        <div class="chips jump">${byType.map(([t, l]) => `<a class="chip" href="#bt-${t}" data-jump="bt-${t}">${TYPES[t]} <em>${l.length}</em></a>`).join('')}</div>
      </div>
    </section>
    ${byType.length ? byType.map(([t, l]) => `
      <section class="section" id="bt-${t}">
        ${sectionHead(esc(b.name), TYPES[t])}
        <div class="grid">${l.map(card).join('')}</div>
      </section>`).join('') : `<section class="section">${emptyState('Aucun modèle pour cette marque pour le moment.')}</section>`}`;
    const mount = () => {
      $$('[data-jump]').forEach(a => a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.getElementById(a.dataset.jump);
        t && window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 90, behavior: 'smooth' });
      }));
    };
    return [html, mount];
  }

  /* ---------- FICHE PRODUIT ---------- */
  function viewProduct([id]) {
    const p = productById(id);
    if (!p || p.active === false) return viewNotFound();
    const b = brandById(p.brandId) || {};
    const d = discount(p);
    const sizes = (p.sizes || []).slice().sort((a, b) => a - b);
    const PV = viewsOf(p);
    const start = Math.max(0, PV.findIndex(v => v.id === mainView(p)));
    const photo = isPhoto(p);
    const related = products().filter(x => x.id !== p.id && (x.brandId === p.brandId || x.type === p.type))
      .sort((a, c) => (c.brandId === p.brandId) - (a.brandId === p.brandId)).slice(0, 4);

    const html = `
    <section class="pdp">
      <nav class="crumbs pdp-crumbs"><a href="#/">Accueil</a><span>/</span><a href="#/marque/${b.id}">${esc(b.name)}</a><span>/</span><span>${esc(p.model)}</span></nav>
      <div class="gallery" data-reveal>
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
          <h4>Pointure <span class="muted">(EU)</span></h4>
          <div class="size-grid" id="sizeGrid">${sizes.length ? sizes.map(s => `<button class="size" data-size="${s}">${s}</button>`).join('') : '<span class="muted">Pointures sur demande</span>'}</div>
        </div>

        <div class="pdp-actions" data-reveal style="--d:320ms">
          <div class="qty"><button id="qMinus" aria-label="Moins">−</button><span id="qVal">1</span><button id="qPlus" aria-label="Plus">+</button></div>
          <button class="btn btn-primary magnetic grow" id="addBtn" ${p.stock <= 0 ? 'disabled' : ''}>${p.stock <= 0 ? 'Épuisé' : 'Ajouter au panier'}</button>
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
    [/^\/produit\/([^/]+)$/, viewProduct]
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
      key = g && !g.includes(',') ? g : 'catalogue';
    } else if (path !== '/') key = '';
    $$('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === key));
  }

  /* =========================================================
     CHROME : en-tête, recherche, pied de page, curseur
     ========================================================= */
  function renderChrome() {
    const s = C.settings;
    document.title = `${s.shopName} — Chaussures homme & femme`;
    const ann = esc(s.announcement || s.tagline || '');
    $('#announce').innerHTML = Array(6).fill(`<span>${ann}</span><i>✦</i>`).join('');
    const brandsWith = C.brands.filter(b => products().some(p => p.brandId === b.id));
    $('#megaBrands').innerHTML = brandsWith.map(b => `<a href="#/marque/${b.id}" style="--bc:${esc(b.color || '#d4af5f')}">${b.logo ? brandLogo(b, 'mega-logo') : '<i></i>'}${esc(b.name)}</a>`).join('') + `<a href="#/marques" class="all">Toutes les marques →</a>`;
    const wa = s.whatsapp ? 'https://wa.me/' + String(s.whatsapp).replace(/[^\d]/g, '') : '';
    const socials = [['WhatsApp', wa, 'whatsapp'], ['TikTok', s.tiktok, 'tiktok'], ['Snapchat', s.snapchat, 'snapchat'], ['Instagram', s.instagram, 'instagram'], ['Facebook', s.facebook, 'facebook']].filter(x => x[1]);
    const socialRow = socials.length ? `<div class="social-row">${socials.map(x => `<a class="social-ic ${x[2]}" href="${esc(x[1])}" target="_blank" rel="noopener" aria-label="${x[0]}" title="${x[0]}">${ICONS[x[2]]}</a>`).join('')}</div>` : '';
    $('#footer').innerHTML = `
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
        <nav class="ft-col" aria-label="Styles"><h4>Styles</h4>${typesUsed().map(k => `<a href="#/catalogue?type=${k}">${TYPES[k]}</a>`).join('')}</nav>
        <div class="ft-col"><h4>Contact</h4>
          ${s.phone ? `<a class="ft-line" href="tel:${esc(s.phone.replace(/\s/g, ''))}">${ICONS.phone}<span>${esc(s.phone)}</span></a>` : ''}
          ${s.address ? `<p class="ft-line">${esc(s.address)}</p>` : ''}
          ${s.email ? `<a class="ft-line" href="mailto:${esc(s.email)}">${esc(s.email)}</a>` : ''}
          <p class="ft-note">Paiement à la livraison · Échange sous 7 jours</p>
        </div>
      </div>
      <div class="ft-bottom"><span>© ${new Date().getFullYear()} ${esc(s.shopName)} · Tous droits réservés</span><a href="admin.html">Espace propriétaire</a></div>`;
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
    $('#burger').addEventListener('click', () => document.body.classList.toggle('menu-open'));
    $('#mainNav').addEventListener('click', e => { if (e.target.closest('a')) document.body.classList.remove('menu-open'); });
  }

  function bindGlobal() {
    $('#cartBtn').addEventListener('click', openCart);
    $('#cartClose').addEventListener('click', closeCart);
    $('#backdrop').addEventListener('click', () => { closeCart(); document.body.classList.remove('filters-open'); });
    $('#searchBtn').addEventListener('click', openSearch);
    $('#searchClose').addEventListener('click', closeSearch);
    $('#searchInput').addEventListener('input', e => renderSearch(e.target.value));
    $('#searchInput').addEventListener('keydown', e => {
      if (e.key === 'Enter') { const q = e.target.value.trim(); closeSearch(); location.hash = '#/catalogue' + (q ? '?q=' + encodeURIComponent(q) : ''); }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeSearch(); closeCart(); } });

    document.addEventListener('click', e => {
      if (e.target.closest('[data-close-cart]')) closeCart();

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
    renderChrome();
    renderCart();
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
      renderChrome(); renderCart();
      await router({ soft: true });
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
