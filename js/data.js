/* =========================================================
   ONE OFF SNEAKERS — Catalogue par défaut
   Ce fichier est le catalogue "publié" lu par tous les visiteurs.
   Depuis l'admin (onglet Données > "Exporter data.js"), vous pouvez
   régénérer ce fichier avec toutes vos modifications puis le
   remplacer ici avant de mettre le site en ligne.
   ========================================================= */
window.DEFAULT_CATALOG = (function () {
  const S = {
    homme: [39, 40, 41, 42, 43, 44, 45, 46],
    femme: [36, 37, 38, 39, 40, 41],
    enfant: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35]
  };
  const sizesFor = g => [...new Set(g.flatMap(x => S[x]))].sort((a, b) => a - b);
  const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const BASE = 1763600000000;
  let n = 0;

  const P = (brandId, model, type, gender, price, oldPrice, art, x = {}) => ({
    id: brandId + '-' + slug(model),
    brandId, model, type, gender,
    price, oldPrice: oldPrice || 0,
    description: x.description || '',
    sizes: x.sizes || sizesFor(gender),
    colors: x.colors || [{ name: x.colorName || 'Coloris principal', hex: art.upper }],
    stock: x.stock ?? 12,
    featured: !!x.featured,
    isNew: !!x.isNew,
    active: true,
    art,
    images: {},
    createdAt: BASE - (n++) * 86400000
  });

  /* Modèles avec les vraies photos de la boutique (dossier photos/).
     Prix 0 = « Prix sur demande » tant que le propriétaire ne l'a pas saisi. */
  const SLOTS = ['profil', 'face', 'dessus', 'arriere', 'semelle'];
  const R = (brandId, model, type, gender, photos, art, x = {}) => {
    const p = P(brandId, model, type, gender, x.price || 0, 0, art, Object.assign({ stock: 5 }, x));
    photos.forEach((f, i) => { p.images[SLOTS[i]] = 'photos/' + (/\.\w+$/.test(f) ? f : f + '.jpg'); });
    return p;
  };

  const brands = [
    { id: 'dior', name: 'Dior', color: '#1f2a44', description: 'Les sneakers de la maison parisienne : B22, B30…' },
    { id: 'balenciaga', name: 'Balenciaga', color: '#222222', description: 'Silhouettes techniques et oversize.' },
    { id: 'lanvin', name: 'Lanvin', color: '#7fc8c0', description: 'La Curb et ses lacets XXL.' },
    { id: 'hermes', name: 'Hermès', color: '#f37021', description: 'Sandales en cuir iconiques.' },
    { id: 'amiri', name: 'Amiri', color: '#3a3a3a', description: 'Le luxe streetwear de Los Angeles.' },
    { id: 'maison-mihara-yasuhiro', name: 'Maison Mihara Yasuhiro', color: '#b91c1c', description: 'Semelles « fondues » et toile vintage.' },
    { id: 'bape', name: 'Bape', color: '#3f6b2a', description: 'A Bathing Ape et sa Bape Sta étoilée.' },
    { id: 'autres', name: 'Autres', color: '#666666', description: 'Modèles à classer.' },
    { id: 'saucony', name: 'Saucony', color: '#c8102e', description: 'Running américain depuis 1898, et ses rétro-runners ProGrid.' },
    { id: 'bottega-veneta', name: 'Bottega Veneta', color: '#2e6b3a', description: 'Le luxe discret italien, des sneakers techniques au design radical.' },
    { id: 'crocs', name: 'Crocs', color: '#3aa335', description: 'Le sabot ultra-léger et confortable, à personnaliser avec des Jibbitz.' },
    { id: 'ferragamo', name: 'Ferragamo', color: '#8a1c1c', description: 'L\'élégance italienne et le mors Gancini.' },
    { id: 'loro-piana', name: 'Loro Piana', color: '#8a7560', description: 'Le mocassin Summer Walk, en daim d\'une douceur absolue.' },
    { id: 'tods', name: 'Tod\'s', color: '#6b4a2b', description: 'Le Gommino et ses picots de caoutchouc iconiques.' },
    { id: 'jm-weston', name: 'J.M. Weston', color: '#2b1d14', description: 'Le savoir-faire du mocassin français, cousu Goodyear.' },
    { id: 'jordan', name: 'Jordan', color: '#c8102e', description: 'Air Jordan : la légende du basket, des parquets à la rue.' },
    { id: 'nike', name: 'Nike', color: '#ff5a1f', description: 'Performance et culture street depuis 1964.' },
    { id: 'adidas', name: 'Adidas', color: '#2b59ff', description: 'Les trois bandes, entre sport et lifestyle.' },
    { id: 'new-balance', name: 'New Balance', color: '#8a8f98', description: 'Le confort premium, fabriqué pour durer.' },
    { id: 'asics', name: 'Asics', color: '#1e40ff', description: 'Technologie GEL et héritage running japonais.' },
    { id: 'converse', name: 'Converse', color: '#111111', description: 'La toile iconique de toutes les générations.' },
    { id: 'vans', name: 'Vans', color: '#c8102e', description: 'L\'ADN skate, off the wall.' },
    { id: 'timberland', name: 'Timberland', color: '#d18a2c', description: 'Cuir robuste et finitions authentiques.' },
  ];

  /* Logos des marques (dossier img/marques) + couleur de fond du logo */
  const LOGOS = {
    nike: '#ffffff', hermes: '#e57d15', asics: '#ffffff', 'new-balance': '#2b2b2b', 'loro-piana': '#943f20',
    adidas: '#ffffff', ferragamo: '#ffffff', crocs: '#ffffff', 'bottega-veneta': '#ffffff', converse: '#2e2e2e', dior: '#2a2a2a',
    puma: '#ffffff', amiri: '#ffffff', 'maison-mihara-yasuhiro': '#ffffff', saucony: '#ffffff', tods: '#ffffff', bape: '#ffffff',
    'jm-weston': '#ffffff', jordan: '#ffffff', vans: '#000000', clarks: '#ffffff', birkenstock: '#303030', timberland: '#ffffff'
  };
  brands.forEach(b => { if (LOGOS[b.id]) { b.logo = 'img/marques/' + b.id + '.png'; b.logoBg = LOGOS[b.id]; } });

  const HF = ['homme', 'femme'];
  const products = [
    /* ---------- Dior ---------- */
    R('dior', 'B30 Noir / Blanc', 'basket', HF, ['dior-b30-noir-blanc', 'dior-b30-noir-blanc-2.png'],{ upper: '#151515', accent: '#ffffff', sole: '#f2f2f2' }, { featured: true, isNew: true, colorName: 'Noir / Blanc' }),
    R('dior', 'B30 Argent', 'basket', HF, ['dior-b30-argent'], { upper: '#c9ccd1', accent: '#1a1a1a', sole: '#f2f2f2' }, { featured: true, colorName: 'Argent' }),
    R('dior', 'B30 Gris', 'basket', HF, ['dior-b30-gris'], { upper: '#7d7a76', accent: '#d9e6e2', sole: '#2a2a2a' }, { colorName: 'Gris' }),
    R('dior', 'B30 Noir réfléchissant', 'basket', HF, ['dior-b30-noir-reflechissant'], { upper: '#111111', accent: '#9a9a9a', sole: '#111111' }, { colorName: 'Noir' }),
    R('dior', 'B30 Vert menthe', 'basket', HF, ['dior-b30-menthe'], { upper: '#d7ece6', accent: '#9fd9c9', sole: '#eef3f1' }, { colorName: 'Vert menthe' }),
    R('dior', 'B22 Noir', 'basket', HF, ['dior-b22-noir'], { upper: '#141414', accent: '#bfbfbf', sole: '#111111' }, { featured: true, colorName: 'Noir' }),
    R('dior', 'B22 Blanc / Rose', 'basket', HF, ['dior-b22-blanc-rose-1', 'dior-b22-blanc-rose-2'], { upper: '#e9e9e9', accent: '#f2b8c6', sole: '#ffffff' }, { isNew: true, colorName: 'Blanc / Gris / Rose' }),
    R('dior', 'B22 Gris', 'basket', HF, ['dior-b22-gris'], { upper: '#a7a7a7', accent: '#8a8a8a', sole: '#a7a7a7' }, { colorName: 'Gris' }),
    R('dior', 'B22 Crème / Semelle bleue', 'basket', HF, ['dior-b22-creme-bleu'], { upper: '#f1ece0', accent: '#b9c8e8', sole: '#2fa4e7' }, { colorName: 'Crème / Bleu' }),

    R('dior', 'B30 Gris bleu / Noir', 'basket', HF, ['dior-b30-gris-bleu-noir.png'], { upper: '#8a94a8', accent: '#e6e6e6', sole: '#151515' }, { colorName: 'Gris bleu / Noir' }),
    R('dior', 'B27 Low Gris / Oblique', 'basket', HF, ['dior-b27-gris-oblique.png'], { upper: '#b5b8bc', accent: '#2b3550', sole: '#ffffff' }, { isNew: true, colorName: 'Gris / Blanc / Oblique', description: 'Sneaker basse en cuir avec empiècement jacquard Dior Oblique et semelle gomme.' }),
    R('dior', 'Sneaker Oblique Marine', 'basket', HF, ['dior-sneaker-oblique-marine.png'], { upper: '#1f2a55', accent: '#e8e8f0', sole: '#f2ede2' }, { colorName: 'Bleu marine', description: 'Sneaker en daim et jacquard Dior Oblique, lacets épais.' }),
    R('dior', 'Sneaker Oblique Noir', 'basket', HF, ['dior-sneaker-oblique-noir.png'], { upper: '#151515', accent: '#2a2a2a', sole: '#151515' }, { colorName: 'Noir', description: 'Sneaker en cuir avec motif Dior Oblique en relief, lacets épais.' }),
    R('dior', 'Aqua Oblique', 'sandale', ['homme'], ['dior-aqua-oblique.png'], { upper: '#2b3550', accent: '#c0c0c0', sole: '#151515' }, { colorName: 'Oblique bleu / Noir', description: 'Sandale à deux brides en jacquard Dior Oblique, boucles métal et semelle confort.' }),
    R('dior', 'Alpha Oblique Denim', 'sandale', ['homme'], ['dior-alpha-oblique-denim.png'], { upper: '#3f5a85', accent: '#c9d4e6', sole: '#26355a' }, { colorName: 'Bleu denim', description: 'Claquette à bride en jacquard Dior Oblique effet denim.' }),
    R('dior', 'Dway Toile de Jouy Gris', 'sandale', ['femme'], ['dior-dway-toile-de-jouy-gris.png'], { upper: '#a9a9ae', accent: '#ffffff', sole: '#e8e4dc' }, { featured: true, colorName: 'Gris / Toile de Jouy', description: 'Mule brodée « CHRISTIAN DIOR PARIS », semelle imprimée Toile de Jouy.' }),
    R('dior', 'Sandale à talon nœud', 'sandale', ['femme'], ['dior-talon-noeud-blanc-noir.png'], { upper: '#f2ede2', accent: '#151515', sole: '#151515' }, { isNew: true, colorName: 'Blanc / Noir', description: 'Sandale à talon, rubans brodés Dior noués en nœud.' }),
    R('dior', 'Sandale à talon brodée Noir', 'sandale', ['femme'], ['dior-talon-brode-noir.png'], { upper: '#151515', accent: '#c9a227', sole: '#151515' }, { colorName: 'Noir / Doré', description: 'Sandale à talon fin, brides brodées Dior.' }),

    /* ---------- Arrivage du 20/11 (photos du dossier) ---------- */
    R('asics', 'Gel-Kayano 14 Crème / Rose', 'basket', HF, ['asics-gel-kayano-14-creme-rose'], { upper: '#efeae0', accent: '#d94f8a', sole: '#ffffff' }, { featured: true, isNew: true, colorName: 'Crème / Argent / Rose', description: 'Silhouette running rétro des années 2000, mesh respirant, overlays argentés et amorti GEL au talon.' }),
    R('asics', 'Gel-1130 Blanc / Bleu', 'basket', HF, ['asics-gel-1130-blanc-bleu'], { upper: '#ffffff', accent: '#1e6fd9', sole: '#ffffff' }, { colorName: 'Blanc / Bleu', description: 'Inspirée du running des années 2010, légère et confortable avec ses technologies GEL et TRUSSTIC.' }),
    R('asics', 'Running Gris / Argent', 'basket', HF, ['asics-gt-gris-argent'], { upper: '#8f959c', accent: '#c9cdd2', sole: '#3a3f45' }, { colorName: 'Gris / Argent', description: 'Runner rétro Asics en mesh et overlays argentés.' }),
    R('nike', 'Air Max 95 Triple Noir', 'basket', HF, ['nike-air-max-95-noir'], { upper: '#151515', accent: '#151515', sole: '#151515' }, { featured: true, colorName: 'Noir', description: 'Le design inspiré du corps humain, amorti Air visible à l\'avant et au talon.' }),
    R('nike', 'Air Max 95 Corteiz Marine / Rose', 'basket', HF, ['nike-air-max-95-corteiz'], { upper: '#5e6670', accent: '#e8559b', sole: '#1f2a55' }, { isNew: true, colorName: 'Gris / Marine / Rose', description: 'La collaboration Corteiz sur l\'Air Max 95, dégradé de gris et touches de rose.' }),
    R('new-balance', '1906R Beige / Argent', 'basket', HF, ['nb-1906r-beige'], { upper: '#e6dfd0', accent: '#b9bec4', sole: '#e6dfd0' }, { isNew: true, colorName: 'Beige / Argent', description: 'Runner technique années 2000, amorti ABZORB et N-ergy, overlays métallisés.' }),
    R('new-balance', '1906R Noir', 'basket', HF, ['nb-1906r-noir'], { upper: '#151515', accent: '#2a2a2a', sole: '#151515' }, { colorName: 'Noir', description: 'Runner technique années 2000, amorti ABZORB et N-ergy.' }),
    R('adidas', 'SFTM-001 Marron / Noir', 'basket', HF, ['adidas-sftm-001-marron-noir'], { upper: '#4a3528', accent: '#1a1a1a', sole: '#e8e0d0' }, { isNew: true, colorName: 'Marron / Noir', description: 'Collaboration adidas x Song for the Mute : runner technique aux finitions brutes.' }),
    R('saucony', 'ProGrid Gris / Argent', 'basket', HF, ['saucony-progrid-gris-argent'], { upper: '#8a8478', accent: '#c9cdd2', sole: '#e8e4dc' }, { colorName: 'Gris / Argent', description: 'Rétro-runner Saucony, mesh et overlays argentés, amorti ProGrid.' }),
    R('saucony', 'ProGrid Noir / Argent', 'basket', HF, ['saucony-progrid-noir-argent'], { upper: '#151515', accent: '#c9cdd2', sole: '#8a8f95' }, { featured: true, colorName: 'Noir / Argent', description: 'Rétro-runner Saucony, mesh et overlays argentés, amorti ProGrid.' }),
    R('converse', 'SHAI 001 Bleu ciel', 'basket', HF, ['converse-shai-001-bleu-ciel'], { upper: '#a8d4ee', accent: '#7fb8e0', sole: '#a8d4ee' }, { isNew: true, colorName: 'Bleu ciel', description: 'La chaussure signature de Shai Gilgeous-Alexander, tige zippée au design futuriste.' }),
    R('crocs', 'Classic Clog (coloris variés)', 'sandale', ['homme', 'femme'], ['crocs-classic-coloris-1', 'crocs-classic-coloris-2'], { upper: '#2ea8e8', accent: '#e83a2e', sole: '#2ea8e8' }, { colorName: 'Plusieurs coloris', colors: [{ name: 'Noir', hex: '#151515' }, { name: 'Bleu ciel', hex: '#2ea8e8' }, { name: 'Bleu roi', hex: '#1f3fd0' }, { name: 'Rouge', hex: '#e83a2e' }, { name: 'Marron', hex: '#5a4030' }, { name: 'Kaki', hex: '#3f5a3a' }, { name: 'Gris', hex: '#6b747c' }, { name: 'Os', hex: '#e6dfc8' }], description: 'Le sabot iconique en Croslite, disponible en nombreux coloris. Précisez votre couleur à la commande.' }),

    /* ---------- Bottega Veneta ---------- */
    R('bottega-veneta', 'Trail Blanc / Rouge', 'basket', HF, ['bottega-trail-blanc-rouge.png'], { upper: '#f5f3ee', accent: '#d0141e', sole: '#ffffff' }, { featured: true, isNew: true, colorName: 'Blanc / Rouge', description: 'Sneaker au laçage tressé apparent, semelle sculptée ultra-confortable.' }),
    R('bottega-veneta', 'Orbit Argent', 'basket', HF, ['bottega-orbit-argent.png'], { upper: '#d9dce0', accent: '#8a94a8', sole: '#d9a066' }, { colorName: 'Argent / Blanc', description: 'Runner technique en mesh et empiècements métallisés, semelle gomme.' }),
    R('bottega-veneta', 'Orbit Bordeaux / Bleu', 'basket', HF, ['bottega-orbit-bordeaux-bleu.png'], { upper: '#9fc0e8', accent: '#6b1f2a', sole: '#d9a066' }, { colorName: 'Bleu ciel / Bordeaux', description: 'Runner technique en mesh et empiècements métallisés, semelle gomme.' }),
    R('bottega-veneta', 'Speedster Blanc / Noir', 'basket', HF, ['bottega-speedster-blanc-noir.png'], { upper: '#ffffff', accent: '#2a2a2a', sole: '#ffffff' }, { colorName: 'Blanc / Noir', description: 'Sneaker en cuir et mesh sur semelle épaisse crantée.' }),
    R('bottega-veneta', 'Speedster Noir', 'basket', HF, ['bottega-speedster-noir.png'], { upper: '#151515', accent: '#151515', sole: '#151515' }, { colorName: 'Noir', description: 'Sneaker en cuir sur semelle épaisse crantée.' }),

    /* ---------- Vans ---------- */
    R('vans', 'Old Skool Noir / Blanc', 'basket', ['homme', 'femme'], ['vans-old-skool-noir-1.png', 'vans-old-skool-noir-2.png'], { upper: '#121212', accent: '#ffffff', sole: '#ffffff' }, { featured: true, colorName: 'Noir / Blanc', description: 'Daim et toile, Sidestripe emblématique et semelle gaufrée pour une adhérence parfaite.' }),
    R('vans', 'Knu Skool Vert', 'basket', HF, ['vans-knu-skool-vert.png'], { upper: '#3f5a2a', accent: '#ffffff', sole: '#ffffff' }, { isNew: true, colorName: 'Vert', description: 'L\'Old Skool version années 90 : languette rembourrée, gros lacets et Sidestripe en relief.' }),
    R('vans', 'Knu Skool Noir / Rouge', 'basket', HF, ['vans-knu-skool-noir-rouge.png'], { upper: '#151515', accent: '#d0141e', sole: '#ffffff' }, { colorName: 'Noir / Rouge', description: 'L\'Old Skool version années 90 : languette rembourrée, gros lacets et Sidestripe en relief.' }),
    R('vans', 'Sk8-Hi Marguerites Marine', 'basket', HF, ['vans-sk8-hi-marguerites-marine.png'], { upper: '#1f2f55', accent: '#c9a26b', sole: '#f2ede2' }, { colorName: 'Marine / Damier marguerites', description: 'La montante Sk8-Hi avec damier à marguerites et semelle vintage.' }),

    /* ---------- Converse ---------- */
    R('converse', 'Chuck 70 Hi Noir', 'basket', ['homme', 'femme'], ['converse-chuck-70-hi-noir-1.png', 'converse-chuck-70-hi-noir-2.png'], { upper: '#151515', accent: '#f2ede2', sole: '#f2ede2' }, { featured: true, colorName: 'Noir / Écru', description: 'La version premium de la Chuck Taylor : toile épaisse, semelle vintage brillante.' }),
    R('converse', 'Chuck Taylor All Star Basse Noir', 'basket', ['homme', 'femme'], ['converse-chuck-taylor-ox-noir.png'], { upper: '#151515', accent: '#ffffff', sole: '#ffffff' }, { colorName: 'Noir', description: 'Toile robuste, bout caoutchouc : l\'original depuis 1917.' }),
    R('converse', 'Chuck 70 Plus Hi Noir', 'basket', HF, ['converse-chuck-70-plus-hi-noir.png'], { upper: '#151515', accent: '#f2ede2', sole: '#f2ede2' }, { colorName: 'Noir', description: 'La Chuck 70 déstructurée : coutures décalées et semelle superposée.' }),
    R('converse', 'Chuck Taylor Plateforme Hi Noir', 'basket', ['femme'], ['converse-plateforme-hi-noir.png'], { upper: '#151515', accent: '#ffffff', sole: '#ffffff' }, { colorName: 'Noir / Blanc', description: 'La Chuck Taylor montante sur semelle plateforme.' }),
    R('converse', 'Run Star Hike Hi Moutarde brodée', 'basket', ['femme'], ['converse-run-star-hike-moutarde-2.png', 'converse-run-star-hike-moutarde-1.png'], { upper: '#c08a1e', accent: '#f2ede2', sole: '#f2ede2' }, { isNew: true, colorName: 'Moutarde / Écru', description: 'La Run Star Hike et sa semelle crantée, toile brodée de motifs géométriques.' }),

    /* ---------- Balenciaga ---------- */
    R('balenciaga', 'Track Kaki', 'basket', HF, ['balenciaga-track-kaki'], { upper: '#5d6b3a', accent: '#4a5530', sole: '#5d6b3a' }, { featured: true, colorName: 'Kaki' }),
    R('balenciaga', 'Track Blanc', 'basket', HF, ['balenciaga-track-blanc'], { upper: '#f2f2f0', accent: '#d9d9d9', sole: '#ffffff' }, { colorName: 'Blanc' }),
    R('balenciaga', 'Track Bleu ciel', 'basket', HF, ['balenciaga-track-bleu-ciel'], { upper: '#8fb8de', accent: '#6f9cc8', sole: '#8fb8de' }, { isNew: true, colorName: 'Bleu ciel' }),
    R('balenciaga', 'Track (coloris variés)', 'basket', HF, ['balenciaga-track-coloris'], { upper: '#e8e2d6', accent: '#e83e8c', sole: '#e8e2d6' }, { colorName: 'Plusieurs coloris' }),
    R('balenciaga', 'Track.2 Bleu / Blanc', 'basket', HF, ['balenciaga-track2-bleu'], { upper: '#1d4ed8', accent: '#ffffff', sole: '#e5e7eb' }, { colorName: 'Bleu / Blanc' }),

    /* ---------- Lanvin ---------- */
    R('lanvin', 'Curb Beige', 'basket', HF, ['lanvin-curb-beige'], { upper: '#ddd6c8', accent: '#bdb6a8', sole: '#efebe3' }, { featured: true, colorName: 'Beige' }),
    R('lanvin', 'Curb Blanc / Bleu', 'basket', HF, ['lanvin-curb-blanc-bleu'], { upper: '#f2f2f2', accent: '#5aa6b0', sole: '#ffffff' }, { isNew: true, colorName: 'Blanc / Bleu' }),
    R('lanvin', 'Curb Gris', 'basket', HF, ['lanvin-curb-gris'], { upper: '#d4d6d9', accent: '#a9b4c2', sole: '#c9c9c9' }, { colorName: 'Gris' }),

    /* ---------- Hermès ---------- */
    R('hermes', 'Izmir Noir', 'sandale', ['homme'], ['hermes-izmir-noir'], { upper: '#151515', accent: '#151515', sole: '#222222' }, { featured: true, colorName: 'Noir' }),
    R('hermes', 'Izmir Marine', 'sandale', ['homme'], ['hermes-izmir-marine'], { upper: '#1b2540', accent: '#1b2540', sole: '#a9c9e8' }, { colorName: 'Marine / Bleu ciel' }),
    R('hermes', 'Izmir Bleu', 'sandale', ['homme'], ['hermes-izmir-bleu'], { upper: '#6f8fb8', accent: '#6f8fb8', sole: '#a9c9e8' }, { colorName: 'Bleu' }),
    R('hermes', 'Izmir Blanc', 'sandale', ['homme'], ['hermes-izmir-blanc'], { upper: '#f5f5f5', accent: '#f5f5f5', sole: '#ffffff' }, { colorName: 'Blanc' }),
    R('hermes', 'Izmir Strass Noir', 'sandale', ['homme'], ['hermes-izmir-strass-noir'], { upper: '#1a1a1a', accent: '#bdbdbd', sole: '#1a1a1a' }, { isNew: true, colorName: 'Noir strass' }),
    R('hermes', 'Oran Rouge', 'sandale', ['femme'], ['hermes-oran-rouge.png'], { upper: '#9b2c2c', accent: '#9b2c2c', sole: '#7a2222' }, { featured: true, isNew: true, colorName: 'Rouge', description: 'La sandale iconique au H découpé, en cuir Epsom grainé.' }),
    R('hermes', 'Oran Camel', 'sandale', ['femme'], ['hermes-oran-camel.png'], { upper: '#b36b3c', accent: '#f2e6d8', sole: '#8a4f2a' }, { colorName: 'Camel / surpiqûres blanches', description: 'La sandale iconique au H découpé, cuir lisse et surpiqûres contrastées.' }),
    R('hermes', 'Chypre Noir', 'sandale', ['femme'], ['hermes-chypre-noir.png'], { upper: '#151515', accent: '#151515', sole: '#111111' }, { featured: true, colorName: 'Noir', description: 'Sandale à bride scratch réglable et semelle crantée, le confort version Hermès.' }),
    R('hermes', 'Chypre Rose', 'sandale', ['femme'], ['hermes-chypre-rose.png'], { upper: '#e6b8c4', accent: '#e6b8c4', sole: '#151515' }, { isNew: true, colorName: 'Rose poudré / Noir', description: 'Sandale à bride scratch réglable et semelle crantée, le confort version Hermès.' }),
    R('hermes', 'Santorini Noir', 'sandale', ['femme'], ['hermes-santorini-noir.png'], { upper: '#151515', accent: '#bdbdbd', sole: '#151515' }, { colorName: 'Noir', description: 'Sandale plate en cuir avec bride cheville à boucle palladiée.' }),
    R('hermes', 'Legend Compensée Blanc', 'sandale', ['femme'], ['hermes-legend-compensee-blanc.png'], { upper: '#f4f2ee', accent: '#8a6a4a', sole: '#8a6a4a' }, { colorName: 'Blanc', description: 'Sandale compensée en cuir, talon effet bois et bride cheville réglable.' }),
    R('hermes', 'Sandale boucle H (coloris variés)', 'sandale', ['homme'], ['hermes-sandale-boucle-h'], { upper: '#2a2a2a', accent: '#c0c0c0', sole: '#2a2a2a' }, { colorName: 'Plusieurs coloris' }),

    /* ---------- Adidas ---------- */
    R('adidas', 'Samba Marine / Crème', 'basket', HF, ['adidas-samba-marine-creme.png'], { upper: '#2b3a5c', accent: '#f2ead8', sole: '#6b4a32' }, { featured: true, isNew: true, colorName: 'Marine / Crème', description: 'Née sur les terrains de foot en salle, la Samba et sa semelle gomme sont devenues un classique de la rue.' }),
    R('adidas', 'Samba Crème / Marron', 'basket', HF, ['adidas-samba-creme-marron.png'], { upper: '#efe6c8', accent: '#6b3f26', sole: '#a8704a' }, { colorName: 'Crème / Marron', description: 'Née sur les terrains de foot en salle, la Samba et sa semelle gomme sont devenues un classique de la rue.' }),
    R('adidas', 'Campus 00s Rose', 'basket', ['femme'], ['adidas-campus-00s-rose.png'], { upper: '#e8a6b8', accent: '#ffffff', sole: '#ffffff' }, { isNew: true, colorName: 'Rose / Blanc', description: 'La Campus revisitée façon années 2000 : daim épais, lacets larges et semelle généreuse.' }),
    R('adidas', 'Campus 00s Olive', 'basket', HF, ['adidas-campus-00s-olive.png'], { upper: '#5a5238', accent: '#f2ede2', sole: '#f2ede2' }, { colorName: 'Olive / Marron', description: 'La Campus revisitée façon années 2000 : daim épais, lacets larges et semelle généreuse.' }),
    R('adidas', 'Campus 00s Vert', 'basket', HF, ['adidas-campus-00s-vert.png'], { upper: '#4caf5a', accent: '#f2ede2', sole: '#d9a066' }, { colorName: 'Vert / Crème', description: 'La Campus revisitée façon années 2000 : daim épais, lacets larges et semelle généreuse.' }),
    R('adidas', 'Ultraboost 22 Bleu gris', 'basket', HF, ['adidas-ultraboost-22-bleu-gris.png'], { upper: '#8fb0ba', accent: '#151a2e', sole: '#f2f2f2' }, { colorName: 'Bleu gris / Orange', description: 'Running avec amorti BOOST et tige Primeknit qui épouse le pied.' }),
    R('adidas', 'Ultraboost 5.0 DNA Marine', 'basket', HF, ['adidas-ultraboost-5-marine.png'], { upper: '#1c2140', accent: '#ffffff', sole: '#151515' }, { colorName: 'Marine / Damier', description: 'Running avec amorti BOOST et tige Primeknit qui épouse le pied.' }),

    /* ---------- Crocs ---------- */
    R('crocs', 'Classic Clog Violet', 'sandale', HF, ['crocs-classic-violet.png'], { upper: '#7b3fd0', accent: '#7b3fd0', sole: '#7b3fd0' }, { isNew: true, colorName: 'Violet', description: 'Le sabot iconique en Croslite : léger, confortable et facile à nettoyer.' }),
    R('crocs', 'Classic Clog Marron', 'sandale', HF, ['crocs-classic-marron.png'], { upper: '#3a2a20', accent: '#3a2a20', sole: '#3a2a20' }, { colorName: 'Marron espresso', description: 'Le sabot iconique en Croslite : léger, confortable et facile à nettoyer.' }),
    R('crocs', 'Crocband Noir', 'sandale', HF, ['crocs-crocband-noir.png'], { upper: '#151515', accent: '#ffffff', sole: '#151515' }, { colorName: 'Noir / Blanc', description: 'Le sabot Crocs avec la bande sportive bicolore sur la semelle.' }),
    R('crocs', 'Echo Clog Gris', 'sandale', HF, ['crocs-echo-gris.png'], { upper: '#8f9396', accent: '#151515', sole: '#8f9396' }, { featured: true, colorName: 'Gris / Noir', description: 'Sabot au design sculpté, bride arrière réglable et semelle ondulée.' }),
    R('crocs', 'Echo Clog Olive', 'sandale', HF, ['crocs-echo-olive.png'], { upper: '#6b6e58', accent: '#6b6e58', sole: '#6b6e58' }, { colorName: 'Olive', description: 'Sabot au design sculpté, bride arrière réglable et semelle ondulée.' }),
    R('crocs', 'Classic Clog Noir + Jibbitz', 'sandale', ['homme', 'femme'], ['crocs-classic-kids-noir.png'], { upper: '#2a2a2a', accent: '#ff8a00', sole: '#2a2a2a' }, { colorName: 'Noir', description: 'Le sabot Classic noir, à personnaliser avec des Jibbitz.' }),

    /* ---------- Mocassins de luxe ---------- */
    R('ferragamo', 'Driver Gancini Gris', 'mocassin', ['homme'], ['ferragamo-driver-gancini-gris.png'], { upper: '#5e5a56', accent: '#9a9a9a', sole: '#2a2a2a' }, { colorName: 'Gris anthracite', description: 'Mocassin de conduite en daim avec le mors Gancini en métal.' }),
    R('loro-piana', 'Summer Charms Walk Beige', 'mocassin', HF, ['loropiana-summer-charms-beige.png'], { upper: '#d9c7ad', accent: '#c0c0c0', sole: '#f2ede2' }, { featured: true, isNew: true, colorName: 'Beige', description: 'Mocassin en daim velours, breloques en métal et semelle souple ultra-légère.' }),
    R('loro-piana', 'Summer Charms Walk Marron', 'mocassin', HF, ['loropiana-summer-charms-marron.png'], { upper: '#4a2f22', accent: '#c0c0c0', sole: '#e8dcc0' }, { colorName: 'Marron chocolat', description: 'Mocassin en daim velours, breloques en métal et semelle souple ultra-légère.' }),
    R('loro-piana', 'Summer Charms Walk Taupe', 'mocassin', HF, ['loropiana-summer-charms-taupe.png'], { upper: '#b89a80', accent: '#c9a227', sole: '#f2ede2' }, { colorName: 'Taupe', description: 'Mocassin en daim, col effet croco et breloques dorées.' }),
    R('loro-piana', 'Summer Walk Marine', 'mocassin', HF, ['loropiana-summer-walk-marine-1.png', 'loropiana-summer-walk-marine-2.png'], { upper: '#1b2233', accent: '#1b2233', sole: '#f2ede2' }, { featured: true, colorName: 'Bleu marine', description: 'Le mocassin Summer Walk en daim, sans lacet ni ornement, semelle blanche souple.' }),
    R('loro-piana', 'Summer Walk Beige', 'mocassin', HF, ['loropiana-summer-walk-beige.png'], { upper: '#cdc3b5', accent: '#cdc3b5', sole: '#f2ede2' }, { colorName: 'Beige', description: 'Le mocassin Summer Walk en daim, sans lacet ni ornement, semelle blanche souple.' }),
    R('tods', 'Gommino Lacets Beige', 'mocassin', HF, ['tods-gommino-lacets-beige.png'], { upper: '#c9a77c', accent: '#8a5a3a', sole: '#1a1a1a' }, { colorName: 'Beige', description: 'Mocassin de conduite en daim, lacet décoratif et semelle à picots Gommino.' }),
    R('tods', 'Gommino Marine', 'mocassin', HF, ['tods-gommino-marine.png'], { upper: '#1f2533', accent: '#1f2533', sole: '#1a1a1a' }, { colorName: 'Bleu marine', description: 'Mocassin de conduite en daim avec logo Tod\'s, semelle à picots Gommino.' }),
    R('jm-weston', '180 Moccasin Noir', 'mocassin', ['homme'], ['weston-180-noir-2.png', 'weston-180-noir-1.png'], { upper: '#141414', accent: '#141414', sole: '#1a1a1a' }, { colorName: 'Noir', description: 'Le mocassin à bride iconique, cuir box-calf et montage Goodyear.' }),
    R('hermes', 'Irving Marron', 'mocassin', ['homme'], ['hermes-irving-marron.png'], { upper: '#3a3330', accent: '#c9a227', sole: '#2a2a2a' }, { isNew: true, colorName: 'Marron foncé', description: 'Mocassin de conduite en cuir grainé, boucle H et doublure orange.' }),
    R('hermes', 'Mocassin H Marron', 'mocassin', ['homme'], ['hermes-mocassin-h-marron.png'], { upper: '#3a2620', accent: '#3a2620', sole: '#1a1a1a' }, { colorName: 'Marron', description: 'Mocassin en cuir grainé avec bride découpée en H.' }),

    /* ---------- Asics ---------- */
    R('asics', 'Gel-Kayano 32 Marine', 'basket', HF, ['asics-gel-kayano-32-marine-1.png', 'asics-gel-kayano-32-marine-2.png'], { upper: '#1b2340', accent: '#4fb3e8', sole: '#d9d4f0' }, { featured: true, isNew: true, colorName: 'Marine / Bleu ciel', description: 'Running stable avec mousse FF BLAST+ et PureGEL pour un confort maximal.' }),
    R('asics', 'Gel-Kayano 26 Gris / Rouge', 'basket', HF, ['asics-gel-kayano-26-gris-rouge.png'], { upper: '#cfd2d6', accent: '#c8102e', sole: '#ffffff' }, { colorName: 'Gris / Rouge / Noir' }),
    R('asics', 'Gel-Nimbus Beige / Lavande', 'basket', HF, ['asics-gel-nimbus-beige-lavande.png'], { upper: '#e6e0d4', accent: '#f0a030', sole: '#b9b4f0' }, { isNew: true, colorName: 'Beige / Lavande', description: 'Amorti maximal FF BLAST+ et PureGEL pour les longues distances.' }),
    R('asics', 'Gel-Nimbus 26 Gris / Argent', 'basket', HF, ['asics-gel-nimbus-26-gris-argent.png'], { upper: '#a9b0b8', accent: '#d9d9d9', sole: '#f2f2f2' }, { colorName: 'Gris / Argent', description: 'Amorti maximal FF BLAST+ et PureGEL pour les longues distances.' }),
    R('asics', 'Running FF Turbo² Vert lime', 'basket', HF, ['asics-ff-turbo-vert-lime.png'], { upper: '#cdf5a0', accent: '#111111', sole: '#cfd8e8' }, { colorName: 'Vert lime / Noir', description: 'Chaussure de performance avec mousse FF TURBO² ultra-dynamique.' }),
    R('asics', 'Gel-1130 Gris', 'basket', HF, ['asics-gel-1130-gris.png'], { upper: '#a9aeb5', accent: '#7d848c', sole: '#f2ede2' }, { colorName: 'Gris', description: 'Inspirée du running des années 2010, daim et mesh, amorti GEL.' }),
    R('asics', 'Gel-1130 Blanc / Marine', 'basket', HF, ['asics-gel-1130-blanc-marine.png'], { upper: '#ffffff', accent: '#1b2340', sole: '#f2ede2' }, { colorName: 'Blanc / Marine / Argent', description: 'Inspirée du running des années 2010, légère et confortable avec ses technologies GEL et TRUSSTIC.' }),

    /* ---------- New Balance ---------- */
    R('new-balance', '574 Marine', 'basket', HF, ['nb-574-marine-2.png', 'nb-574-marine-1.png'], { upper: '#1f2f55', accent: '#d9d4c8', sole: '#ffffff' }, { featured: true, colorName: 'Bleu marine', description: 'Le modèle le plus emblématique de New Balance : amorti ENCAP, daim et mesh.' }),
    R('new-balance', '530 Blanc / Marine', 'basket', HF, ['nb-530-blanc-marine-2.png', 'nb-530-blanc-marine-1.png'], { upper: '#ffffff', accent: '#1b2340', sole: '#ffffff' }, { featured: true, colorName: 'Blanc / Argent / Marine', description: 'Running rétro des années 2000, mesh respirant et amorti ABZORB.' }),
    R('new-balance', '530 Gris', 'basket', HF, ['nb-530-gris.png'], { upper: '#bfc2c5', accent: '#8a8d91', sole: '#ffffff' }, { colorName: 'Gris', description: 'Running rétro des années 2000, mesh respirant et amorti ABZORB.' }),
    R('new-balance', '9060 Blanc / Rouge', 'basket', HF, ['nb-9060-blanc-rouge.png'], { upper: '#f2efe8', accent: '#c8102e', sole: '#efe8dc' }, { isNew: true, colorName: 'Blanc / Rouge / Marine', description: 'Semelle sculptée ABZORB et SBS, l\'esprit Y2K poussé à l\'extrême.' }),
    R('new-balance', '9060 Noir', 'basket', HF, ['nb-9060-noir.png'], { upper: '#151515', accent: '#d9cbb0', sole: '#e8e0d0' }, { colorName: 'Noir / Beige' }),
    R('new-balance', '550 Blanc / Vert', 'basket', HF, ['nb-550-blanc-vert.png'], { upper: '#ffffff', accent: '#1f6b3a', sole: '#f1ede4' }, { colorName: 'Blanc / Vert', description: 'Silhouette basket rétro de 1989 remise au goût du jour, cuir premium.' }),
    R('new-balance', '550 Crème / Bleu', 'basket', HF, ['nb-550-creme-bleu.png'], { upper: '#f2ebdc', accent: '#8fa8c8', sole: '#5b6f8f' }, { colorName: 'Crème / Bleu gris', description: 'Silhouette basket rétro de 1989 remise au goût du jour, cuir premium.' }),
    R('new-balance', '550 Blanc / Vert canard', 'basket', HF, ['nb-550-blanc-vert-canard.png'], { upper: '#ffffff', accent: '#1f5f5b', sole: '#1f5f5b' }, { colorName: 'Blanc / Vert canard', description: 'Silhouette basket rétro de 1989 remise au goût du jour, cuir premium.' }),

    /* ---------- Jordan ---------- */
    R('jordan', 'Air Jordan 1 High OG Royal', 'basket', HF, ['jordan-1-high-royal.png'], { upper: '#111111', accent: '#1f4fd8', sole: '#ffffff' }, { featured: true, isNew: true, colorName: 'Noir / Bleu royal' }),
    R('jordan', 'Air Jordan 1 High OG Rouge verni', 'basket', ['femme'], ['jordan-1-high-rouge-verni.png'], { upper: '#f6e9e6', accent: '#c8102e', sole: '#f6e9e6' }, { featured: true, colorName: 'Rouge / Blanc cassé' }),
    R('jordan', 'Air Jordan 1 Low Gris / Blanc', 'basket', HF, ['jordan-1-low-gris-blanc.png'], { upper: '#f2f2f2', accent: '#8f8f8f', sole: '#ffffff' }, { colorName: 'Blanc / Gris' }),

    /* ---------- Nike ---------- */
    R('nike', 'Air Force 1 \'07 Blanc', 'basket', ['homme', 'femme'], ['nike-af1-blanc-1.png', 'nike-af1-blanc-2.png'], { upper: '#fafafa', accent: '#e2e2e2', sole: '#ffffff' }, { featured: true, colorName: 'Triple blanc', description: 'La légende du basket devenue incontournable de la rue. Cuir pleine fleur, semelle cupsole et coussin Air encapsulé.' }),
    R('nike', 'Air Max 90 Noir / Blanc', 'basket', HF, ['nike-air-max-90-noir-blanc.png'], { upper: '#2a2a2e', accent: '#ffffff', sole: '#ffffff' }, { colorName: 'Noir / Blanc', description: 'L\'icône du running des années 90 : amorti Air visible au talon et empiècements en mesh.' }),
    R('nike', 'Air Max 90 Noir / Gris', 'basket', HF, ['nike-air-max-90-noir-gris.png'], { upper: '#1c1c1e', accent: '#8a8d91', sole: '#8a8d91' }, { colorName: 'Noir / Gris' }),
    R('nike', 'Dunk Low Gris / Blanc', 'basket', HF, ['nike-dunk-low-gris-blanc.png'], { upper: '#ffffff', accent: '#b8bcc0', sole: '#ffffff' }, { isNew: true, colorName: 'Blanc / Gris' }),
    R('nike', 'Dunk Low Violet / Gris', 'basket', HF, ['nike-dunk-low-violet.png'], { upper: '#cfcac4', accent: '#5b2a9c', sole: '#ffffff' }, { colorName: 'Violet / Gris' }),
    R('nike', 'Running ZoomX Volt', 'basket', HF, ['nike-zoomx-running-volt.png'], { upper: '#d6f22a', accent: '#111111', sole: '#d6f22a' }, { isNew: true, colorName: 'Volt / Noir', description: 'Chaussure de running avec mousse ZoomX ultra-réactive.' }),
    R('nike', 'Running ZoomX Rose', 'basket', HF, ['nike-zoomx-running-rose.png'], { upper: '#ff3d6a', accent: '#333333', sole: '#ff3d6a' }, { colorName: 'Rose / Noir', description: 'Chaussure de running avec mousse ZoomX ultra-réactive.' }),
    R('nike', 'Ja 1 Orange', 'basket', HF, ['nike-ja1-orange'], { upper: '#ff5a3c', accent: '#1d3c8f', sole: '#ff5a3c' }, { isNew: true, colorName: 'Orange' }),
    R('nike', 'Ja 1 Bleu', 'basket', HF, ['nike-ja1-bleu'], { upper: '#2244dd', accent: '#a7e8d8', sole: '#7fb2ff' }, { colorName: 'Bleu' }),
    R('nike', 'Ja 1 Rose / Jaune', 'basket', HF, ['nike-ja1-rose-jaune'], { upper: '#ff6fb5', accent: '#ffe14d', sole: '#ffb84d' }, { colorName: 'Rose / Jaune' }),

    /* ---------- Timberland ---------- */
    R('timberland', '6-Inch x Supreme Noir', 'bottes', HF, ['timberland-6inch-supreme-noir-1', 'timberland-6inch-supreme-noir-2'], { upper: '#161616', accent: '#c8102e', sole: '#111111' }, { featured: true, colorName: 'Noir' }),
    R('timberland', '6-Inch Premium Blanc', 'bottes', HF, ['timberland-6inch-blanc'], { upper: '#f4f4f4', accent: '#e6e6e6', sole: '#ffffff' }, { colorName: 'Blanc' }),
    R('timberland', '6-Inch Premium Blé & Noir', 'bottes', HF, ['timberland-6inch-noir-ble'], { upper: '#d89a3a', accent: '#1a1a1a', sole: '#c98a3a' }, { colorName: 'Blé / Noir', colors: [{ name: 'Blé', hex: '#d89a3a' }, { name: 'Noir', hex: '#1a1a1a' }] }),
    R('timberland', '6-Inch Smiley', 'bottes', HF, ['timberland-6inch-smiley'], { upper: '#e0a03a', accent: '#f2c97a', sole: '#c98a3a' }, { isNew: true, colorName: 'Blé imprimé' }),
    R('timberland', '6-Inch Damier', 'bottes', HF, ['timberland-6inch-damier'], { upper: '#d89a3a', accent: '#f0d9a8', sole: '#c98a3a' }, { colorName: 'Blé à carreaux' }),

    /* ---------- Amiri / Mihara / Bape ---------- */
    R('amiri', 'Skel Top Low Noir', 'basket', HF, ['amiri-skel-top-low-noir'], { upper: '#151515', accent: '#ffffff', sole: '#ffffff' }, { featured: true, colorName: 'Noir / Blanc' }),
    R('maison-mihara-yasuhiro', 'Toile Kaki', 'basket', HF, ['mihara-toile-kaki'], { upper: '#6b6f4e', accent: '#111111', sole: '#f5f5f0' }, { colorName: 'Kaki' }),
    R('maison-mihara-yasuhiro', 'Toile Rouge', 'basket', HF, ['mihara-toile-rouge'], { upper: '#c8102e', accent: '#ffffff', sole: '#f5f5f0' }, { isNew: true, colorName: 'Rouge' }),
    R('bape', 'Bape Sta Marvel', 'basket', HF, ['bape-sta-marvel'], { upper: '#3aa0e0', accent: '#ffffff', sole: '#1a1a1a' }, { featured: true, colorName: 'Bleu / Noir' }),
    R('bape', 'Bape Sta (coloris variés)', 'basket', HF, ['bape-sta-coloris'], { upper: '#f2f2f2', accent: '#2e8b3e', sole: '#ffffff' }, { colorName: 'Plusieurs coloris' }),

    /* ---------- À identifier (nom à confirmer par la boutique) ---------- */
    R('autres', 'Sneaker denim bleu ciel', 'basket', HF, ['autre-sneaker-denim-ciel'], { upper: '#a9cbe0', accent: '#ffffff', sole: '#ffffff' }, { colorName: 'Bleu ciel' }),
    R('autres', 'Sneaker denim noir', 'basket', HF, ['autre-sneaker-denim-noir'], { upper: '#1f2530', accent: '#ffffff', sole: '#ffffff' }, { colorName: 'Noir' }),
    R('autres', 'Sneaker blanche motif', 'basket', HF, ['autre-sneaker-blanche'], { upper: '#e9e9e9', accent: '#ffffff', sole: '#ffffff' }, { colorName: 'Blanc' }),
    R('autres', 'Runner bleu ciel', 'basket', HF, ['autre-runner-bleu-ciel'], { upper: '#cfe0f2', accent: '#5b8fd0', sole: '#f2f2f2' }, { colorName: 'Bleu ciel / Blanc' }),
    R('timberland', '6-Inch Patchwork Multicolore', 'bottes', HF, ['autre-patchwork-multicolore'], { upper: '#e8a0c0', accent: '#7fd0c0', sole: '#d9b77a' }, { isNew: true, colorName: 'Multicolore', description: 'La botte 6-Inch iconique en patchwork de cuirs colorés, logo Timberland embossé.' }),

  ];

  return {
    version: 1,
    publishedAt: 0,
    settings: {
      shopName: 'ONE OFF SNEAKERS',
      tagline: 'Chaque paire est unique.',
      currency: 'FCFA',
      currencyPosition: 'after',
      heroTitle: 'Marche à ta façon.',
      heroSubtitle: 'Baskets, sandales, mocassins et bottes pour homme et femme. Les plus grandes marques, sélectionnées une par une.',
      announcement: 'Livraison rapide • Paiement à la livraison • Échange sous 7 jours',
      whatsapp: '22665350291',
      phone: '+226 65 35 02 91',
      email: '',
      address: '',
      instagram: '',
      facebook: '',
      tiktok: 'https://www.tiktok.com/@oneoffsneakers_1',
      snapchat: 'https://www.snapchat.com/add/justinbembamba'
    },
    brands,
    products
  };
})();
