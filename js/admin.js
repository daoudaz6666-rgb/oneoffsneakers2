/* =========================================================
   ONE OFF SNEAKERS — Espace propriétaire (admin)
   Toute modification enregistrée ici met à jour la boutique.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  /* Mot de passe initial stocké uniquement sous forme d'empreinte (jamais en clair) */
  const DEFAULT_HASH = '67be382173dd6533ca808b88d841e15e5de94d2e7bda633bf7e701124b531d0d';
  const DEFAULT_SIMPLE = 'f-991516898';
  const HASH_KEY = 'oos-admin-hash';
  const SESSION_KEY = 'oos-admin-session';
  const GENDERS = { homme: 'Homme', femme: 'Femme' };
  const TYPES = ShoeArt.TYPES;
  const VIEWS = ShoeArt.VIEWS;
  const SIZE_RANGE = Array.from({ length: 33 }, (_, i) => 16 + i); // 16 → 48
  const PRESETS = { Homme: [39, 40, 41, 42, 43, 44, 45, 46], Femme: [36, 37, 38, 39, 40, 41] };

  let C = null;
  let tab = 'dashboard';
  let listState = { q: '', brand: '', type: '' };

  const price = n => Store.priceLabel(n, C.settings);
  const brandById = id => C.brands.find(b => b.id === id);

  /* ---------- UI helpers ---------- */
  function toast(msg, type = 'ok') {
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.innerHTML = `<span class="toast-dot"></span>${esc(msg)}`;
    $('#toasts').appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 3000);
  }

  function confirmBox(title, text, yes = 'Confirmer') {
    return new Promise(resolve => {
      const m = $('#modal');
      $('#modalTitle').textContent = title;
      $('#modalText').textContent = text;
      $('#modalYes').textContent = yes;
      m.classList.add('open'); m.setAttribute('aria-hidden', 'false');
      const done = v => { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); $('#modalYes').onclick = $('#modalNo').onclick = null; resolve(v); };
      $('#modalYes').onclick = () => done(true);
      $('#modalNo').onclick = () => done(false);
    });
  }

  async function persist(msg = 'Enregistré — la boutique est à jour') {
    const s = $('#sync');
    s.classList.add('saving'); s.lastChild.textContent = 'Enregistrement…';
    try {
      await Store.save(C);
      s.classList.remove('saving'); s.lastChild.textContent = 'Synchronisé avec la boutique';
      toast(msg);
      return true;
    } catch (e) {
      console.error(e);
      s.classList.remove('saving'); s.classList.add('error'); s.lastChild.textContent = 'Erreur d\'enregistrement';
      toast('Impossible d\'enregistrer (espace de stockage plein ?). Réduisez la taille des photos.', 'warn');
      return false;
    }
  }

  async function hash(str) {
    const data = 'oos::' + str;
    try {
      if (window.crypto && crypto.subtle) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
        return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) { /* chiffrement indisponible (page ouverte en local) : méthode de secours */ }
    return simpleHash(data);
  }
  function simpleHash(data) {
    let h = 0; for (const ch of data) h = (h * 31 + ch.charCodeAt(0)) | 0;
    return 'f' + h;
  }

  /* Accès protégés à la mémoire du navigateur (peut être bloquée selon le contexte) */
  const mem = {
    get(store, k) { try { return window[store].getItem(k); } catch (e) { return null; } },
    set(store, k, v) { try { window[store].setItem(k, v); return true; } catch (e) { return false; } },
    del(store, k) { try { window[store].removeItem(k); } catch (e) { /* ignore */ } }
  };

  async function checkPassword(v) {
    const stored = mem.get('localStorage', HASH_KEY);
    if (!stored) return (await hash(v)) === DEFAULT_HASH || simpleHash('oos::' + v) === DEFAULT_SIMPLE;
    return stored === await hash(v) || stored === simpleHash('oos::' + v);
  }

  function animateCount(el) {
    const end = +el.dataset.count, t0 = performance.now();
    const step = t => {
      const k = Math.max(0, Math.min(1, (t - t0) / 900));
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))).toLocaleString('fr-FR');
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* Redimensionne et compresse une image importée */
  function compressImage(file, max = 1400) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) return reject(new Error('Fichier non image'));
      const url = URL.createObjectURL(file);
      const im = new Image();
      im.onload = () => {
        const s = Math.min(1, max / Math.max(im.width, im.height));
        const cv = document.createElement('canvas');
        cv.width = Math.round(im.width * s); cv.height = Math.round(im.height * s);
        const ctx = cv.getContext('2d');
        ctx.drawImage(im, 0, 0, cv.width, cv.height);
        URL.revokeObjectURL(url);
        let out = cv.toDataURL('image/webp', 0.85);
        if (!out.startsWith('data:image/webp')) {
          const cv2 = document.createElement('canvas');
          cv2.width = cv.width; cv2.height = cv.height;
          const c2 = cv2.getContext('2d');
          c2.fillStyle = '#ffffff'; c2.fillRect(0, 0, cv2.width, cv2.height); c2.drawImage(cv, 0, 0);
          out = cv2.toDataURL('image/jpeg', 0.85);
        }
        resolve(out);
      };
      im.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image illisible')); };
      im.src = url;
    });
  }

  function download(name, content, type) {
    const blob = new Blob([content], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* =========================================================
     CONNEXION
     ========================================================= */
  async function initLogin() {
    const stored = mem.get('localStorage', HASH_KEY);
    $('#loginHint').innerHTML = stored ? '' : 'Première connexion : utilisez le mot de passe qui vous a été communiqué, puis changez-le dans <b>Paramètres</b>.';
    if (mem.get('sessionStorage', SESSION_KEY) === '1') return enter();
    $('#loginForm').addEventListener('submit', async e => {
      e.preventDefault();
      let ok = false;
      try { ok = await checkPassword($('#pwd').value); } catch (err) { console.error(err); }
      if (!ok) {
        const card = $('.login-card');
        card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
        toast('Mot de passe incorrect', 'warn');
        return;
      }
      mem.set('sessionStorage', SESSION_KEY, '1');
      $('#login').classList.add('leaving');
      setTimeout(enter, 500);
    });
  }

  async function enter() {
    C = await Store.load();
    $('#login').hidden = true;
    $('#admin').hidden = false;
    requestAnimationFrame(() => $('#admin').classList.add('ready'));
    $('#sideNav').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) go(b.dataset.tab); });
    $('#logout').addEventListener('click', () => { mem.del('sessionStorage', SESSION_KEY); location.reload(); });
    $('#menuBtn').addEventListener('click', () => document.body.classList.toggle('side-open'));
    $('#backdrop').addEventListener('click', closePanel);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
    Store.onChange(async () => { C = await Store.load(); render(); });
    go(location.hash.replace('#', '') || 'dashboard');
  }

  /* =========================================================
     NAVIGATION
     ========================================================= */
  const TITLES = { dashboard: 'Tableau de bord', products: 'Chaussures', brands: 'Marques', settings: 'Paramètres', data: 'Sauvegarde & publication' };
  function go(t) {
    if (!TITLES[t]) t = 'dashboard';
    tab = t;
    history.replaceState(null, '', '#' + t);
    $$('#sideNav [data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === t));
    $('#tabTitle').textContent = TITLES[t];
    document.body.classList.remove('side-open');
    render();
  }

  function render() {
    const v = $('#view');
    v.classList.remove('enter'); void v.offsetWidth; v.classList.add('enter');
    ({ dashboard: renderDashboard, products: renderProducts, brands: renderBrands, settings: renderSettings, data: renderData })[tab]();
  }

  /* =========================================================
     TABLEAU DE BORD
     ========================================================= */
  function renderDashboard() {
    const P = C.products;
    const active = P.filter(p => p.active !== false);
    const low = P.filter(p => p.stock <= 3).sort((a, b) => a.stock - b.stock);
    const stockValue = P.reduce((a, p) => a + p.price * Math.max(0, p.stock), 0);
    const withPhotos = P.filter(p => VIEWS.some(v => Store.hasPhoto(p, v.id))).length;
    const byType = Object.keys(TYPES).map(t => [TYPES[t], P.filter(p => p.type === t).length]);
    const maxT = Math.max(1, ...byType.map(x => x[1]));
    const byBrand = C.brands.map(b => [b.name, P.filter(p => p.brandId === b.id).length, b.color]).sort((a, b) => b[1] - a[1]);

    $('#view').innerHTML = `
      <div class="stats">
        <div class="stat"><span>Modèles en ligne</span><b data-count="${active.length}">0</b><small>${P.length - active.length} masqué(s)</small></div>
        <div class="stat"><span>Marques</span><b data-count="${C.brands.length}">0</b><small>&nbsp;</small></div>
        <div class="stat"><span>Paires en stock</span><b data-count="${P.reduce((a, p) => a + Math.max(0, p.stock), 0)}">0</b><small>Valeur : ${stockValue ? Store.formatPrice(stockValue, C.settings) : 'prix à renseigner'}</small></div>
        <div class="stat"><span>Modèles avec photos</span><b data-count="${withPhotos}">0</b><small>sur ${P.length}</small></div>
      </div>
      <div class="dash-grid">
        <section class="box">
          <h3>Répartition par style</h3>
          <div class="bars">${byType.map(([l, n], i) => `<div class="bar"><span>${l}</span><div><i style="--w:${(n / maxT) * 100}%; --d:${i * 80}ms"></i></div><b>${n}</b></div>`).join('')}</div>
        </section>
        <section class="box">
          <h3>Par marque</h3>
          <div class="brand-chips">${byBrand.map(([n, c, col]) => `<span style="--bc:${esc(col)}"><i></i>${esc(n)} <b>${c}</b></span>`).join('')}</div>
        </section>
        <section class="box wide">
          <div class="box-head"><h3>Stock faible (≤ 3 paires)</h3><button class="btn btn-ghost sm" data-go="products">Gérer les chaussures</button></div>
          ${low.length ? `<div class="mini-list">${low.slice(0, 8).map(p => `
            <button class="mini" data-edit="${p.id}">
              <img src="${Store.imageFor(p, 'profil')}" alt="">
              <span><small>${esc((brandById(p.brandId) || {}).name || '')}</small><b>${esc(p.model)}</b></span>
              <em class="${p.stock <= 0 ? 'out' : 'low'}">${p.stock <= 0 ? 'Épuisé' : p.stock + ' paire(s)'}</em>
            </button>`).join('')}</div>` : '<p class="muted">Aucun modèle en stock faible. 👍</p>'}
        </section>
        <section class="box wide tips">
          <h3>Comment ça marche ?</h3>
          <ol>
            <li><b>Chaussures</b> : ajoutez ou modifiez un modèle (prix, description, pointures, coloris) et importez ses 5 photos : face, profil, dessus, arrière, semelle.</li>
            <li>Chaque enregistrement met <b>immédiatement</b> à jour la boutique ouverte dans ce navigateur.</li>
            <li>Pour publier en ligne pour tous vos clients : <b>Sauvegarde & publication → Exporter data.js</b>, puis remplacez le fichier <code>js/data.js</code> de votre hébergement.</li>
          </ol>
        </section>
      </div>`;
    $$('[data-count]').forEach(animateCount);
    $('#view').onclick = e => {
      const g = e.target.closest('[data-go]'); if (g) go(g.dataset.go);
      const ed = e.target.closest('[data-edit]'); if (ed) openEditor(ed.dataset.edit);
    };
  }

  /* =========================================================
     CHAUSSURES
     ========================================================= */
  function renderProducts() {
    $('#view').innerHTML = `
      <div class="toolbar">
        <input type="search" id="pQ" placeholder="Rechercher un modèle…" value="${esc(listState.q)}">
        <select id="pBrand"><option value="">Toutes les marques</option>${C.brands.map(b => `<option value="${b.id}">${esc(b.name)}</option>`).join('')}</select>
        <select id="pType"><option value="">Tous les styles</option>${Object.entries(TYPES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select>
        <button class="btn btn-primary" id="pNew">+ Nouvelle chaussure</button>
      </div>
      <div class="table-wrap"><table class="table">
        <thead><tr><th>Modèle</th><th>Style</th><th>Univers</th><th>Prix</th><th>Stock</th><th>Photos</th><th title="Affiché sur la page d'accueil">Vedette</th><th title="Visible sur la boutique">En ligne</th><th></th></tr></thead>
        <tbody id="pBody"></tbody>
      </table></div>`;
    $('#pBrand').value = listState.brand;
    $('#pType').value = listState.type;
    const fill = () => {
      const q = listState.q.toLowerCase();
      const list = C.products.filter(p =>
        (!listState.brand || p.brandId === listState.brand) &&
        (!listState.type || p.type === listState.type) &&
        (!q || `${(brandById(p.brandId) || {}).name} ${p.model}`.toLowerCase().includes(q)));
      $('#pBody').innerHTML = list.length ? list.map((p, i) => {
        const photos = VIEWS.filter(v => Store.hasPhoto(p, v.id)).length;
        return `<tr style="--d:${Math.min(i, 15) * 30}ms" data-id="${p.id}">
          <td><button class="cell-model" data-edit="${p.id}"><img src="${Store.imageFor(p, 'profil')}" alt=""><span><small>${esc((brandById(p.brandId) || {}).name || '—')}</small><b>${esc(p.model)}</b></span></button></td>
          <td>${TYPES[p.type] || p.type}</td>
          <td>${p.gender.map(g => GENDERS[g]).join(', ')}</td>
          <td><b>${price(p.price)}</b>${p.oldPrice > p.price ? `<br><s class="muted">${price(p.oldPrice)}</s>` : ''}</td>
          <td><span class="pill ${p.stock <= 0 ? 'out' : p.stock <= 3 ? 'low' : 'ok'}">${p.stock}</span></td>
          <td><span class="photo-count ${photos === 5 ? 'full' : ''}">${photos}/5</span></td>
          <td><label class="switch"><input type="checkbox" data-toggle="featured" ${p.featured ? 'checked' : ''}><span></span></label></td>
          <td><label class="switch"><input type="checkbox" data-toggle="active" ${p.active !== false ? 'checked' : ''}><span></span></label></td>
          <td class="row-actions">
            <button data-edit="${p.id}" title="Modifier">✎</button>
            <button data-dup="${p.id}" title="Dupliquer">⧉</button>
            <button data-del="${p.id}" title="Supprimer" class="danger">🗑</button>
          </td></tr>`;
      }).join('') : `<tr><td colspan="9" class="muted center">Aucune chaussure trouvée.</td></tr>`;
    };
    fill();
    $('#pQ').addEventListener('input', e => { listState.q = e.target.value; fill(); });
    $('#pBrand').addEventListener('change', e => { listState.brand = e.target.value; fill(); });
    $('#pType').addEventListener('change', e => { listState.type = e.target.value; fill(); });
    $('#pNew').addEventListener('click', () => openEditor(null));
    $('#view').onclick = async e => {
      const ed = e.target.closest('[data-edit]'); if (ed) return openEditor(ed.dataset.edit);
      const du = e.target.closest('[data-dup]');
      if (du) {
        const src = C.products.find(p => p.id === du.dataset.dup);
        const copy = Store.clone(src);
        copy.id = Store.uid('p'); copy.model = src.model + ' (copie)'; copy.createdAt = Date.now(); copy.featured = false;
        C.products.splice(C.products.indexOf(src) + 1, 0, copy);
        await persist('Modèle dupliqué'); fill();
        return;
      }
      const de = e.target.closest('[data-del]');
      if (de) {
        const p = C.products.find(x => x.id === de.dataset.del);
        if (await confirmBox('Supprimer ce modèle ?', `« ${p.model} » sera retiré définitivement de la boutique.`, 'Supprimer')) {
          const row = de.closest('tr'); row.classList.add('removing');
          setTimeout(async () => { C.products = C.products.filter(x => x !== p); await persist('Modèle supprimé'); fill(); }, 350);
        }
      }
    };
    $('#view').onchange = async e => {
      const t = e.target.closest('[data-toggle]');
      if (!t) return;
      const p = C.products.find(x => x.id === t.closest('tr').dataset.id);
      p[t.dataset.toggle] = t.checked;
      await persist(t.dataset.toggle === 'active' ? (t.checked ? 'Modèle visible sur la boutique' : 'Modèle masqué de la boutique') : (t.checked ? 'Ajouté à la sélection' : 'Retiré de la sélection'));
    };
  }

  /* ---------- Éditeur de chaussure ---------- */
  function blankProduct() {
    const b = C.brands[0];
    return {
      id: '', brandId: b ? b.id : '', model: '', type: 'basket', gender: ['homme'],
      price: 0, oldPrice: 0, description: '', sizes: PRESETS.Homme.slice(),
      colors: [{ name: 'Coloris principal', hex: '#f2f2f2' }], stock: 10,
      featured: false, isNew: true, active: true,
      art: { upper: '#f2f2f2', accent: '#d4af5f', sole: '#ffffff', lace: '#ffffff' }, images: {}
    };
  }

  function openEditor(id) {
    const orig = id ? C.products.find(p => p.id === id) : null;
    const d = orig ? Store.clone(orig) : blankProduct();
    d.images = d.images || {}; d.art = d.art || {};
    const panel = $('#panel');

    panel.innerHTML = `
      <header class="panel-head">
        <div><small class="muted">${orig ? 'Modifier' : 'Nouvelle chaussure'}</small><h2 id="edTitle">${esc(orig ? orig.model : 'Nouveau modèle')}</h2></div>
        <button class="icon-btn" id="edClose" aria-label="Fermer">✕</button>
      </header>
      <form class="panel-body" id="edForm" novalidate>
        <section class="ed-section">
          <h3>Photos du modèle <span class="muted">— 5 vues</span></h3>
          <p class="muted small">Importez une photo pour chaque angle (glisser-déposer accepté). Sans photo, une illustration aux couleurs du modèle est affichée.</p>
          <div class="photo-grid" id="photoGrid"></div>
          <label class="bulk"><input type="file" accept="image/*" multiple id="bulkInput" hidden><span>⇪ Importer plusieurs photos d'un coup</span><small class="muted">dans l'ordre : face, profil, dessus, arrière, semelle</small></label>
        </section>
        <section class="ed-section">
          <h3>Vue 360° <span class="muted">— facultatif</span></h3>
          <p class="muted small">Faites le tour de la chaussure en prenant 12 à 36 photos (même distance, même lumière, fond uni). Importez-les toutes d'un coup : elles sont rangées dans l'ordre de leur nom de fichier.</p>
          <div id="spinAdmin" class="spin-admin"></div>
          <div class="spin-actions">
            <label class="bulk"><input type="file" accept="image/*" multiple id="spinInput" hidden><span>⟳ Importer les photos 360°</span><small class="muted">sélectionnez toutes les photos de la série</small></label>
            <button type="button" class="btn btn-ghost sm danger-text" id="spinClear" hidden>Supprimer la vue 360°</button>
          </div>
        </section>

        <section class="ed-section">
          <h3>Informations</h3>
          <div class="row2">
            <label class="field"><span>Marque *</span><select name="brandId">${C.brands.map(b => `<option value="${b.id}">${esc(b.name)}</option>`).join('')}</select></label>
            <label class="field"><span>Nom du modèle *</span><input name="model" value="${esc(d.model)}" required placeholder="ex : Air Max 90"></label>
          </div>
          <div class="field"><span>Style *</span><div class="seg" id="typeSeg">${Object.entries(TYPES).map(([k, v]) => `<button type="button" data-type="${k}" class="${d.type === k ? 'on' : ''}">${v}</button>`).join('')}</div></div>
          <div class="field"><span>Univers *</span><div class="seg" id="genderSeg">${Object.entries(GENDERS).map(([k, v]) => `<button type="button" data-gender="${k}" class="${d.gender.includes(k) ? 'on' : ''}">${v}</button>`).join('')}</div></div>
          <label class="field"><span>Description</span><textarea name="description" rows="4" placeholder="Matières, confort, points forts…">${esc(d.description)}</textarea></label>
        </section>

        <section class="ed-section">
          <h3>Prix & stock</h3>
          <div class="row3">
            <label class="field"><span>Prix (${esc(C.settings.currency)})</span><input name="price" type="number" min="0" step="500" value="${d.price || ''}" placeholder="vide = prix sur demande"></label>
            <label class="field"><span>Ancien prix <small class="muted">(promo)</small></span><input name="oldPrice" type="number" min="0" step="500" value="${d.oldPrice || ''}" placeholder="facultatif"></label>
            <label class="field"><span>Stock (paires)</span><input name="stock" type="number" min="0" step="1" value="${d.stock}"></label>
          </div>
          <div class="toggles">
            <label class="switch-line"><label class="switch"><input type="checkbox" name="isNew" ${d.isNew ? 'checked' : ''}><span></span></label>Badge « Nouveau »</label>
            <label class="switch-line"><label class="switch"><input type="checkbox" name="featured" ${d.featured ? 'checked' : ''}><span></span></label>Mettre en vedette (accueil)</label>
            <label class="switch-line"><label class="switch"><input type="checkbox" name="active" ${d.active !== false ? 'checked' : ''}><span></span></label>Visible sur la boutique</label>
          </div>
        </section>

        <section class="ed-section">
          <h3>Pointures disponibles</h3>
          <div class="presets">${Object.keys(PRESETS).map(k => `<button type="button" class="btn btn-ghost sm" data-preset="${k}">+ ${k}</button>`).join('')}<button type="button" class="btn btn-ghost sm" data-preset="clear">Effacer</button></div>
          <div class="size-pick" id="sizePick">${SIZE_RANGE.map(s => `<button type="button" data-size="${s}" class="${d.sizes.includes(s) ? 'on' : ''}">${s}</button>`).join('')}</div>
        </section>

        <section class="ed-section">
          <h3>Coloris proposés</h3>
          <div id="colorList" class="color-list"></div>
          <button type="button" class="btn btn-ghost sm" id="addColor">+ Ajouter un coloris</button>
        </section>

        <section class="ed-section">
          <h3>Couleurs de l'illustration <span class="muted">— utilisées sans photo</span></h3>
          <div class="art-row">
            ${[['upper', 'Tige'], ['accent', 'Détails'], ['sole', 'Semelle'], ['lace', 'Lacets']].map(([k, l]) => `<label class="color-field"><input type="color" data-art="${k}" value="${esc(d.art[k] || '#ffffff')}"><span>${l}</span></label>`).join('')}
          </div>
        </section>
      </form>
      <footer class="panel-foot">
        ${orig ? '<button type="button" class="btn btn-ghost danger-text" id="edDelete">Supprimer</button>' : '<span></span>'}
        <div><button type="button" class="btn btn-ghost" id="edCancel">Annuler</button><button type="button" class="btn btn-primary" id="edSave">${orig ? 'Enregistrer les modifications' : 'Ajouter à la boutique'}</button></div>
      </footer>`;

    const form = $('#edForm');
    form.brandId.value = d.brandId;

    /* Photos */
    const renderPhotos = () => {
      $('#photoGrid').innerHTML = VIEWS.map(v => {
        const has = Store.hasPhoto(d, v.id);
        return `<div class="photo-slot ${has ? 'has' : ''}" data-slot="${v.id}">
          <img src="${Store.imageFor(d, v.id)}" alt="">
          <span class="slot-label">${v.label}</span>
          ${has ? '' : '<span class="slot-badge">Illustration</span>'}
          <div class="slot-actions">
            <label class="slot-btn">${has ? 'Remplacer' : 'Importer'}<input type="file" accept="image/*" data-file="${v.id}" hidden></label>
            ${has ? `<button type="button" class="slot-btn danger" data-rmphoto="${v.id}">Retirer</button>` : ''}
          </div>
          <div class="slot-drop">Déposez la photo ici</div>
        </div>`;
      }).join('');
    };
    renderPhotos();

    const setPhoto = async (view, file) => {
      const slot = $(`[data-slot="${view}"]`);
      slot && slot.classList.add('loading');
      try {
        d.images[view] = await compressImage(file);
        renderPhotos();
        const s = $(`[data-slot="${view}"]`); s && s.classList.add('pop');
      } catch (e) { toast('Ce fichier n\'est pas une image valide.', 'warn'); slot && slot.classList.remove('loading'); }
    };

    const pg = $('#photoGrid');
    pg.addEventListener('change', e => { const f = e.target.closest('[data-file]'); if (f && f.files[0]) setPhoto(f.dataset.file, f.files[0]); });
    pg.addEventListener('click', e => { const r = e.target.closest('[data-rmphoto]'); if (r) { delete d.images[r.dataset.rmphoto]; renderPhotos(); } });
    pg.addEventListener('dragover', e => { const s = e.target.closest('[data-slot]'); if (s) { e.preventDefault(); s.classList.add('over'); } });
    pg.addEventListener('dragleave', e => { const s = e.target.closest('[data-slot]'); if (s) s.classList.remove('over'); });
    pg.addEventListener('drop', e => {
      const s = e.target.closest('[data-slot]'); if (!s) return;
      e.preventDefault(); s.classList.remove('over');
      const f = e.dataTransfer.files[0]; if (f) setPhoto(s.dataset.slot, f);
    });
    $('#bulkInput').addEventListener('change', async e => {
      const files = [...e.target.files].slice(0, VIEWS.length);
      for (let i = 0; i < files.length; i++) await setPhoto(VIEWS[i].id, files[i]);
      if (files.length) toast(`${files.length} photo(s) importée(s)`);
      e.target.value = '';
    });

    /* Vue 360° */
    d.spin = Array.isArray(d.spin) ? d.spin.slice() : [];
    const renderSpin = () => {
      const box = $('#spinAdmin');
      $('#spinClear').hidden = !d.spin.length;
      if (!d.spin.length) { box.innerHTML = '<p class="muted small">Aucune vue 360° pour ce modèle.</p>'; return; }
      box.innerHTML = `<div class="spin-prev"><img id="spinPrevImg" src="${d.spin[0]}" alt=""><span class="spin-count">${d.spin.length} photos${d.spin.length < 6 ? ' — il en faut au moins 6' : ''}</span></div>
        <input type="range" id="spinPrevRange" min="0" max="${d.spin.length - 1}" value="0" aria-label="Aperçu de la rotation">`;
      $('#spinPrevRange').addEventListener('input', e => { $('#spinPrevImg').src = d.spin[+e.target.value]; });
    };
    renderSpin();
    $('#spinInput').addEventListener('change', async e => {
      const files = [...e.target.files].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
      e.target.value = '';
      if (!files.length) return;
      if (files.length < 6) toast('Importez au moins 6 photos pour une vue 360° (idéalement 24 à 36).', 'warn');
      $('#spinAdmin').innerHTML = '<p class="muted small" id="spinProg">Préparation des photos…</p>';
      const out = [];
      for (let i = 0; i < files.length; i++) {
        try { out.push(await compressImage(files[i], 1000)); } catch (err) { /* fichier ignoré */ }
        const pr = $('#spinProg'); if (pr) pr.textContent = `Préparation des photos… ${i + 1} / ${files.length}`;
      }
      d.spin = out;
      renderSpin();
      toast(`${out.length} photos 360° prêtes — cliquez sur Enregistrer`);
    });
    $('#spinClear').addEventListener('click', () => { d.spin = []; renderSpin(); });

    /* Style / univers */
    $('#typeSeg').addEventListener('click', e => {
      const b = e.target.closest('[data-type]'); if (!b) return;
      d.type = b.dataset.type;
      $$('#typeSeg button').forEach(x => x.classList.toggle('on', x === b));
      renderPhotos();
    });
    $('#genderSeg').addEventListener('click', e => {
      const b = e.target.closest('[data-gender]'); if (!b) return;
      const g = b.dataset.gender;
      d.gender = d.gender.includes(g) ? d.gender.filter(x => x !== g) : [...d.gender, g];
      b.classList.toggle('on', d.gender.includes(g));
    });

    /* Pointures */
    const syncSizes = () => $$('#sizePick button').forEach(b => b.classList.toggle('on', d.sizes.includes(+b.dataset.size)));
    $('#sizePick').addEventListener('click', e => {
      const b = e.target.closest('[data-size]'); if (!b) return;
      const s = +b.dataset.size;
      d.sizes = d.sizes.includes(s) ? d.sizes.filter(x => x !== s) : [...d.sizes, s].sort((a, b2) => a - b2);
      syncSizes();
    });
    $$('[data-preset]').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.preset;
      d.sizes = k === 'clear' ? [] : [...new Set([...d.sizes, ...PRESETS[k]])].sort((a, b2) => a - b2);
      syncSizes();
    }));

    /* Coloris */
    const renderColors = () => {
      $('#colorList').innerHTML = d.colors.map((c, i) => `
        <div class="color-row">
          <input type="color" data-ci="${i}" data-k="hex" value="${esc(c.hex)}">
          <input type="text" data-ci="${i}" data-k="name" value="${esc(c.name)}" placeholder="Nom du coloris">
          <button type="button" class="icon-btn sm" data-rmcolor="${i}" aria-label="Retirer">✕</button>
        </div>`).join('') || '<p class="muted small">Aucun coloris.</p>';
    };
    renderColors();
    $('#colorList').addEventListener('input', e => { const t = e.target.closest('[data-ci]'); if (t) d.colors[+t.dataset.ci][t.dataset.k] = t.value; });
    $('#colorList').addEventListener('click', e => { const r = e.target.closest('[data-rmcolor]'); if (r) { d.colors.splice(+r.dataset.rmcolor, 1); renderColors(); } });
    $('#addColor').addEventListener('click', () => { d.colors.push({ name: '', hex: '#111111' }); renderColors(); });

    /* Couleurs illustration (aperçu en direct) */
    let artT;
    $$('[data-art]').forEach(inp => inp.addEventListener('input', () => {
      d.art[inp.dataset.art] = inp.value;
      clearTimeout(artT); artT = setTimeout(renderPhotos, 60);
    }));
    form.model.addEventListener('input', () => { $('#edTitle').textContent = form.model.value || 'Nouveau modèle'; });

    /* Enregistrer */
    const save = async () => {
      const errors = [];
      d.brandId = form.brandId.value;
      d.model = form.model.value.trim();
      d.description = form.description.value.trim();
      d.price = Math.max(0, Math.round(+form.price.value || 0));
      d.oldPrice = Math.max(0, Math.round(+form.oldPrice.value || 0));
      d.stock = Math.max(0, Math.round(+form.stock.value || 0));
      d.isNew = form.isNew.checked; d.featured = form.featured.checked; d.active = form.active.checked;
      d.colors = d.colors.filter(c => c.name.trim());
      if (!d.brandId) errors.push('Choisissez une marque (créez-en une dans « Marques »).');
      if (!d.model) errors.push('Indiquez le nom du modèle.');
      if (!d.gender.length) errors.push('Choisissez au moins un univers (homme ou femme).');
      if (errors.length) { toast(errors[0], 'warn'); const f = $('.panel'); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); return; }
      if (orig) {
        Object.assign(orig, d);
      } else {
        let base = d.brandId + '-' + Store.slugify(d.model), idv = base, n = 2;
        while (C.products.some(p => p.id === idv)) idv = base + '-' + n++;
        d.id = idv; d.createdAt = Date.now();
        C.products.unshift(d);
      }
      if (await persist(orig ? 'Modifications enregistrées — boutique mise à jour' : 'Nouvelle chaussure ajoutée à la boutique')) {
        closePanel(); render();
      }
    };
    $('#edSave').addEventListener('click', save);
    form.addEventListener('submit', e => { e.preventDefault(); save(); });
    $('#edCancel').addEventListener('click', closePanel);
    $('#edClose').addEventListener('click', closePanel);
    const del = $('#edDelete');
    del && del.addEventListener('click', async () => {
      if (await confirmBox('Supprimer ce modèle ?', `« ${orig.model} » sera retiré définitivement de la boutique.`, 'Supprimer')) {
        C.products = C.products.filter(p => p !== orig);
        await persist('Modèle supprimé'); closePanel(); render();
      }
    });

    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('panel-open');
    panel.scrollTop = 0;
  }

  function closePanel() {
    document.body.classList.remove('panel-open');
    $('#panel').setAttribute('aria-hidden', 'true');
  }

  /* =========================================================
     MARQUES
     ========================================================= */
  function renderBrands() {
    $('#view').innerHTML = `
      <div class="toolbar"><p class="muted grow">Les chaussures sont classées par marque puis par modèle sur la boutique.</p><button class="btn btn-primary" id="bNew">+ Nouvelle marque</button></div>
      <div class="brand-cards">${C.brands.map((b, i) => {
        const n = C.products.filter(p => p.brandId === b.id).length;
        return `<article class="brand-card" style="--bc:${esc(b.color || '#d4af5f')}; --d:${i * 50}ms">
          ${b.logo ? `<span class="b-logo" style="background:${esc(b.logoBg || '#fff')}"><img src="${esc(b.logo)}" alt=""></span>` : `<span class="b-initial">${esc(b.name.charAt(0))}</span>`}
          <div class="grow"><b>${esc(b.name)}</b><p class="muted small">${esc(b.description || '')}</p><small>${n} modèle${n > 1 ? 's' : ''}</small></div>
          <div class="row-actions"><button data-bedit="${b.id}" title="Modifier">✎</button><button data-bdel="${b.id}" class="danger" title="Supprimer">🗑</button></div>
        </article>`;
      }).join('')}</div>`;
    $('#bNew').addEventListener('click', () => openBrandEditor(null));
    $('#view').onclick = async e => {
      const ed = e.target.closest('[data-bedit]'); if (ed) return openBrandEditor(ed.dataset.bedit);
      const de = e.target.closest('[data-bdel]');
      if (de) {
        const b = brandById(de.dataset.bdel);
        const n = C.products.filter(p => p.brandId === b.id).length;
        if (n) return toast(`Impossible : ${n} chaussure(s) utilisent encore la marque ${b.name}. Changez-les de marque ou supprimez-les d'abord.`, 'warn');
        if (await confirmBox('Supprimer cette marque ?', `La marque « ${b.name} » sera supprimée.`, 'Supprimer')) {
          C.brands = C.brands.filter(x => x !== b);
          await persist('Marque supprimée'); render();
        }
      }
    };
  }

  function openBrandEditor(id) {
    const orig = id ? brandById(id) : null;
    const d = orig ? Store.clone(orig) : { id: '', name: '', color: '#d4af5f', description: '' };
    $('#panel').innerHTML = `
      <header class="panel-head"><div><small class="muted">${orig ? 'Modifier' : 'Nouvelle'} marque</small><h2>${esc(orig ? orig.name : 'Nouvelle marque')}</h2></div><button class="icon-btn" id="edClose">✕</button></header>
      <form class="panel-body" id="bForm">
        <section class="ed-section">
          <label class="field"><span>Nom de la marque *</span><input name="name" value="${esc(d.name)}" required></label>
          <label class="field"><span>Description courte</span><textarea name="description" rows="3">${esc(d.description)}</textarea></label>
          <label class="color-field big"><input type="color" name="color" value="${esc(d.color)}"><span>Couleur de la marque (badges, survols)</span></label>
          <div class="field"><span>Logo de la marque</span>
            <div class="logo-edit">
              <span class="b-logo big" id="bLogoPrev" style="background:${esc(d.logoBg || '#ffffff')}">${d.logo ? `<img src="${esc(d.logo)}" alt="">` : '<em class="muted small">Aucun logo</em>'}</span>
              <div class="logo-actions">
                <label class="btn btn-ghost sm">${d.logo ? 'Remplacer' : 'Importer'} le logo<input type="file" accept="image/*" id="bLogoFile" hidden></label>
                ${d.logo ? '<button type="button" class="btn btn-ghost sm" id="bLogoRm">Retirer</button>' : ''}
                <label class="color-field"><input type="color" name="logoBg" value="${esc(d.logoBg || '#ffffff')}"><span>Fond du logo</span></label>
              </div>
            </div>
          </div>
          <div class="brand-preview" id="bPrev" style="--bc:${esc(d.color)}"><span class="b-initial">${esc((d.name || 'M').charAt(0))}</span><b>${esc(d.name || 'Aperçu')}</b></div>
        </section>
      </form>
      <footer class="panel-foot"><span></span><div><button class="btn btn-ghost" id="edCancel">Annuler</button><button class="btn btn-primary" id="bSave">Enregistrer</button></div></footer>`;
    const f = $('#bForm');
    const prev = () => { const p = $('#bPrev'); p.style.setProperty('--bc', f.color.value); p.querySelector('b').textContent = f.name.value || 'Aperçu'; p.querySelector('.b-initial').textContent = (f.name.value || 'M').charAt(0); };
    f.addEventListener('input', prev);
    const lp = $('#bLogoPrev');
    f.logoBg.addEventListener('input', () => { lp.style.background = f.logoBg.value; });
    $('#bLogoFile').addEventListener('change', async e => {
      const file = e.target.files[0]; if (!file) return;
      try {
        d.logo = await compressImage(file, 600);
        lp.innerHTML = `<img src="${d.logo}" alt="">`;
        lp.classList.remove('pop'); void lp.offsetWidth; lp.classList.add('pop');
      } catch (err) { toast('Ce fichier n\'est pas une image valide.', 'warn'); }
    });
    const rm = $('#bLogoRm');
    rm && rm.addEventListener('click', () => { d.logo = ''; lp.innerHTML = '<em class="muted small">Aucun logo</em>'; rm.remove(); });
    const save = async () => {
      const name = f.name.value.trim();
      if (!name) return toast('Indiquez le nom de la marque.', 'warn');
      const extra = { logo: d.logo || '', logoBg: f.logoBg.value };
      if (orig) Object.assign(orig, { name, description: f.description.value.trim(), color: f.color.value }, extra);
      else {
        let base = Store.slugify(name), idv = base, n = 2;
        while (C.brands.some(b => b.id === idv)) idv = base + '-' + n++;
        C.brands.push(Object.assign({ id: idv, name, description: f.description.value.trim(), color: f.color.value }, extra));
      }
      if (await persist(orig ? 'Marque modifiée' : 'Marque ajoutée')) { closePanel(); render(); }
    };
    f.addEventListener('submit', e => { e.preventDefault(); save(); });
    $('#bSave').addEventListener('click', save);
    $('#edCancel').addEventListener('click', closePanel);
    $('#edClose').addEventListener('click', closePanel);
    document.body.classList.add('panel-open');
    $('#panel').setAttribute('aria-hidden', 'false');
  }

  /* =========================================================
     PARAMÈTRES
     ========================================================= */
  function renderSettings() {
    const s = C.settings;
    const f = (name, label, ph = '', type = 'text') => `<label class="field"><span>${label}</span><input name="${name}" type="${type}" value="${esc(s[name] || '')}" placeholder="${esc(ph)}"></label>`;
    $('#view').innerHTML = `
      <form id="sForm" class="settings">
        <section class="box">
          <h3>Boutique</h3>
          ${f('shopName', 'Nom de la boutique')}
          ${f('tagline', 'Slogan')}
          <div class="row2">
            ${f('currency', 'Devise', 'FCFA')}
            <label class="field"><span>Position de la devise</span><select name="currencyPosition"><option value="after">Après le prix (25 000 FCFA)</option><option value="before">Avant le prix (€ 25)</option></select></label>
          </div>
          ${f('announcement', 'Bandeau d\'annonce (haut du site)')}
          <p class="muted small">Séparez plusieurs messages par « • » : ils défilent un par un.</p>
          <div class="row2">${f('promoText', 'Texte du compte à rebours', 'Offres de la semaine : encore')}${f('promoEnd', 'Fin du compte à rebours', 'weekly, ou 2026-12-31 23:59')}</div>
          <p class="muted small">« weekly » = jusqu'au lundi suivant (se renouvelle chaque semaine). Laissez le texte vide pour masquer le compte à rebours.</p>
        </section>
        <section class="box">
          <h3>Page d'accueil</h3>
          ${f('heroTitle', 'Grand titre')}
          <label class="field"><span>Sous-titre</span><textarea name="heroSubtitle" rows="3">${esc(s.heroSubtitle)}</textarea></label>
        </section>
        <section class="box">
          <h3>Contact & commandes</h3>
          ${f('whatsapp', 'Numéro WhatsApp (avec indicatif, ex : 22670000000)', '226 70 00 00 00')}
          <p class="muted small">Les commandes du panier sont envoyées sur ce numéro WhatsApp.</p>
          <div class="row2">${f('phone', 'Téléphone')}${f('email', 'E-mail', '', 'email')}</div>
          ${f('address', 'Adresse de la boutique')}
          <div class="row2">${f('instagram', 'Lien Instagram', 'https://instagram.com/…')}${f('facebook', 'Lien Facebook')}</div>
          <div class="row2">${f('tiktok', 'Lien TikTok', 'https://www.tiktok.com/@…')}${f('snapchat', 'Lien Snapchat', 'https://www.snapchat.com/add/…')}</div>
        </section>
        <div class="sticky-save"><button class="btn btn-primary" type="submit">Enregistrer les paramètres</button></div>
      </form>
      <form id="pwForm" class="box narrow">
        <h3>Changer le mot de passe admin</h3>
        <label class="field"><span>Nouveau mot de passe</span><input type="password" name="p1" minlength="6" required></label>
        <label class="field"><span>Confirmer</span><input type="password" name="p2" minlength="6" required></label>
        <button class="btn btn-ghost" type="submit">Mettre à jour</button>
        <p class="muted small">Le mot de passe est enregistré dans ce navigateur.</p>
      </form>`;
    const sf = $('#sForm');
    sf.currencyPosition.value = s.currencyPosition || 'after';
    sf.addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(sf);
      for (const [k, v] of fd.entries()) C.settings[k] = String(v).trim();
      await persist('Paramètres enregistrés');
    });
    $('#pwForm').addEventListener('submit', async e => {
      e.preventDefault();
      const f2 = e.target;
      if (f2.p1.value.length < 6) return toast('6 caractères minimum.', 'warn');
      if (f2.p1.value !== f2.p2.value) return toast('Les deux mots de passe ne correspondent pas.', 'warn');
      if (!mem.set('localStorage', HASH_KEY, await hash(f2.p1.value))) return toast('Impossible d\'enregistrer le mot de passe dans ce navigateur.', 'warn');
      f2.reset(); toast('Mot de passe modifié');
    });
  }

  /* =========================================================
     SAUVEGARDE & PUBLICATION
     ========================================================= */
  async function renderData() {
    let usage = '';
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const est = await navigator.storage.estimate();
        usage = `${(est.usage / 1048576).toFixed(1)} Mo utilisés sur ${(est.quota / 1048576).toFixed(0)} Mo disponibles`;
      }
    } catch (e) { /* ignore */ }
    const size = (new Blob([JSON.stringify(C)]).size / 1048576).toFixed(2);
    $('#view').innerHTML = `
      <div class="data-grid">
        <section class="box">
          <span class="data-ico">🌍</span>
          <h3>Publier en ligne pour tous les clients</h3>
          <p class="muted">Les modifications sont enregistrées dans <b>ce navigateur</b>. Pour que tous vos visiteurs les voient sur le site hébergé :</p>
          <ol class="steps"><li>Cliquez sur « Exporter data.js ».</li><li>Remplacez le fichier <code>js/data.js</code> de votre hébergement par celui téléchargé.</li><li>C'est en ligne !</li></ol>
          <button class="btn btn-primary" id="exportJs">Exporter data.js</button>
          <p class="muted small">Taille du catalogue : ${size} Mo (photos incluses).</p>
        </section>
        <section class="box">
          <span class="data-ico">💾</span>
          <h3>Sauvegarde</h3>
          <p class="muted">Téléchargez une copie complète (chaussures, photos, marques, paramètres) ou restaurez-en une.</p>
          <div class="btn-row">
            <button class="btn btn-ghost" id="exportJson">Télécharger une sauvegarde</button>
            <label class="btn btn-ghost">Restaurer une sauvegarde<input type="file" accept=".json,application/json" id="importJson" hidden></label>
          </div>
          ${usage ? `<p class="muted small">Stockage : ${usage}</p>` : ''}
        </section>
        <section class="box danger-box">
          <span class="data-ico">↺</span>
          <h3>Réinitialiser</h3>
          <p class="muted">Revenir au catalogue d'origine du fichier <code>data.js</code>. Les modifications non exportées seront perdues.</p>
          <button class="btn btn-danger" id="resetAll">Réinitialiser le catalogue</button>
        </section>
      </div>`;

    $('#exportJs').addEventListener('click', async () => {
      C.publishedAt = Date.now();
      await persist('Catalogue prêt à publier');
      const header = `/* ONE OFF SNEAKERS — catalogue publié le ${new Date().toLocaleString('fr-FR')} (généré depuis l'espace propriétaire) */\n`;
      download('data.js', header + 'window.DEFAULT_CATALOG = ' + JSON.stringify(C, null, 1) + ';\n', 'text/javascript');
    });
    $('#exportJson').addEventListener('click', () => {
      download(`oneoff-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(C), 'application/json');
    });
    $('#importJson').addEventListener('change', async e => {
      const file = e.target.files[0]; if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        if (!Array.isArray(data.products) || !Array.isArray(data.brands)) throw new Error('format');
        if (!(await confirmBox('Restaurer cette sauvegarde ?', `${data.products.length} chaussures et ${data.brands.length} marques remplaceront le catalogue actuel.`, 'Restaurer'))) return;
        data.publishedAt = Math.max(data.publishedAt || 0, (window.DEFAULT_CATALOG.publishedAt || 0));
        C = data;
        await persist('Sauvegarde restaurée'); render();
      } catch (err) { toast('Fichier de sauvegarde invalide.', 'warn'); }
      e.target.value = '';
    });
    $('#resetAll').addEventListener('click', async () => {
      if (!(await confirmBox('Tout réinitialiser ?', 'Le catalogue reviendra à la version du fichier data.js. Cette action est irréversible.', 'Réinitialiser'))) return;
      await Store.reset();
      C = await Store.load();
      toast('Catalogue réinitialisé'); render();
    });
  }

  initLogin();
})();
