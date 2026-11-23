/* =========================================================
   ONE OFF SNEAKERS — Stockage partagé boutique <-> admin
   Le catalogue modifié par l'admin est enregistré dans IndexedDB
   (gère de grosses photos). La boutique relit ce catalogue et se
   met à jour en direct (BroadcastChannel + événement storage).
   ========================================================= */
(function (global) {
  'use strict';

  const DB_NAME = 'oneoff-sneakers';
  const STORE = 'kv';
  const KEY = 'catalog';
  const PING = 'oos-catalog-updated';

  let dbPromise = null;
  function db() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        if (!('indexedDB' in global)) return reject(new Error('IndexedDB indisponible'));
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    return dbPromise;
  }

  async function idbGet(key) {
    const d = await db();
    return new Promise((resolve, reject) => {
      const r = d.transaction(STORE, 'readonly').objectStore(STORE).get(key);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
  }

  async function idbSet(key, value) {
    const d = await db();
    return new Promise((resolve, reject) => {
      const tx = d.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function idbDel(key) {
    const d = await db();
    return new Promise((resolve, reject) => {
      const tx = d.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  const clone = o => JSON.parse(JSON.stringify(o));

  function normalize(c) {
    const def = global.DEFAULT_CATALOG;
    c.settings = Object.assign({}, def.settings, c.settings || {});
    c.brands = Array.isArray(c.brands) ? c.brands : [];
    c.products = (Array.isArray(c.products) ? c.products : []).map(p => Object.assign({
      gender: [], sizes: [], colors: [], images: {}, art: {}, stock: 0,
      price: 0, oldPrice: 0, description: '', active: true, featured: false, isNew: false
    }, p));
    return c;
  }

  async function load() {
    const def = global.DEFAULT_CATALOG;
    try {
      const stored = await idbGet(KEY);
      if (stored && (stored.publishedAt || 0) >= (def.publishedAt || 0)) return normalize(stored);
    } catch (e) { console.warn('[Store] lecture impossible, catalogue par défaut utilisé', e); }
    return normalize(clone(def));
  }

  const channel = 'BroadcastChannel' in global ? new BroadcastChannel('oneoff-sneakers') : null;

  async function save(catalog) {
    catalog.updatedAt = Date.now();
    await idbSet(KEY, catalog);
    try { channel && channel.postMessage({ type: 'updated', at: catalog.updatedAt }); } catch (e) { /* ignore */ }
    try { localStorage.setItem(PING, String(catalog.updatedAt)); } catch (e) { /* ignore */ }
  }

  async function reset() {
    await idbDel(KEY);
    try { channel && channel.postMessage({ type: 'updated', at: Date.now() }); } catch (e) { /* ignore */ }
    try { localStorage.setItem(PING, String(Date.now())); } catch (e) { /* ignore */ }
  }

  function onChange(cb) {
    let t;
    const fire = () => { clearTimeout(t); t = setTimeout(cb, 80); };
    channel && channel.addEventListener('message', e => e.data && e.data.type === 'updated' && fire());
    global.addEventListener('storage', e => e.key === PING && fire());
  }

  function imageFor(p, view) {
    const src = p && p.images && p.images[view];
    return src || global.ShoeArt.uri(p.type, view, p.art);
  }

  function hasPhoto(p, view) { return !!(p && p.images && p.images[view]); }

  /* Vues à afficher : uniquement celles qui ont une vraie photo si le modèle
     en possède au moins une, sinon les 5 illustrations. */
  function viewsFor(p) {
    const order = ['profil', 'face', 'dessus', 'arriere', 'semelle'];
    const withPhoto = order.map(id => global.ShoeArt.VIEWS.find(v => v.id === id)).filter(v => hasPhoto(p, v.id));
    return withPhoto.length ? withPhoto : global.ShoeArt.VIEWS;
  }

  function priceLabel(n, s) { return Number(n) > 0 ? formatPrice(n, s) : 'Prix sur demande'; }

  function formatPrice(n, s) {
    const v = Math.round(Number(n) || 0).toLocaleString('fr-FR').replace(/[  ]/g, ' ');
    const cur = (s && s.currency) || 'FCFA';
    return s && s.currencyPosition === 'before' ? `${cur} ${v}` : `${v} ${cur}`;
  }

  function slugify(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
  }

  function uid(prefix = 'p') {
    return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  global.Store = { load, save, reset, onChange, imageFor, hasPhoto, viewsFor, priceLabel, formatPrice, slugify, uid, clone };
})(window);
