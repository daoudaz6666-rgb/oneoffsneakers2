/* =========================================================
   ONE OFF SNEAKERS — Illustrations vectorielles des chaussures
   Génère une image SVG par TYPE de chaussure et par VUE
   (face, profil, dessus, arrière, semelle) avec les couleurs
   du modèle. Utilisée tant que le propriétaire n'a pas
   importé ses propres photos depuis la page admin.
   ========================================================= */
(function (global) {
  'use strict';

  const VIEWS = [
    { id: 'face', label: 'Face' },
    { id: 'profil', label: 'Profil' },
    { id: 'dessus', label: 'Dessus' },
    { id: 'arriere', label: 'Arrière' },
    { id: 'semelle', label: 'Semelle' }
  ];

  const TYPES = {
    basket: 'Baskets',
    sandale: 'Sandales',
    mocassin: 'Mocassins',
    bottes: 'Bottes',
    soulier: 'Souliers'
  };

  function shade(hex, p) {
    hex = String(hex || '#888888').replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    const n = parseInt(hex, 16);
    if (isNaN(n)) return '#888888';
    const rgb = [n >> 16, (n >> 8) & 255, n & 255];
    const f = v => Math.max(0, Math.min(255, Math.round(p < 0 ? v * (1 + p / 100) : v + (255 - v) * p / 100)));
    return '#' + rgb.map(v => f(v).toString(16).padStart(2, '0')).join('');
  }

  const OUTLINE = 'M58 150 C56 112 98 98 160 104 C240 110 318 96 356 124 C384 146 380 186 350 198 C306 214 238 196 166 196 C104 196 60 190 58 150 Z';
  const SOLE_UNDER = `<path d="${OUTLINE}" transform="translate(-11 -7.5) scale(1.05)"`;

  function defs(c) {
    return `<defs>
<linearGradient id="u" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(c.upper, 22)}"/><stop offset="1" stop-color="${shade(c.upper, -18)}"/></linearGradient>
<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(c.sole, 12)}"/><stop offset="1" stop-color="${shade(c.sole, -16)}"/></linearGradient>
<pattern id="t" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="12" fill="${c.sole}"/><rect width="5" height="12" fill="${shade(c.sole, -24)}"/></pattern>
</defs>`;
  }

  /* ---------------- PROFIL ---------------- */
  function profil(type, c) {
    const k = shade(c.upper, -45), L = c.lace || '#ffffff';
    switch (type) {
      case 'basket': {
        const pts = [[194, 122], [214, 135], [236, 145], [258, 153], [280, 160]];
        const laces = pts.map(([x, y]) => `<circle cx="${x - 9}" cy="${y + 8}" r="2.4" fill="${k}"/><line x1="${x - 8}" y1="${y + 7}" x2="${x + 8}" y2="${y - 7}" stroke="${L}" stroke-width="5" stroke-linecap="round"/>`).join('');
        return `
<path d="M34 214 L380 214 Q392 232 374 246 Q362 252 330 252 L72 252 Q36 252 32 232 Z" fill="url(#s)" stroke="${shade(c.sole, -30)}" stroke-width="2"/>
<path d="M36 229 L386 229" stroke="${shade(c.sole, -22)}" stroke-width="2"/>
<path d="M44 218 C38 168 44 124 72 112 C98 102 126 110 142 126 C152 112 168 98 188 104 C204 109 208 126 218 136 C258 154 324 164 358 182 C382 194 384 214 376 218 Z" fill="url(#u)" stroke="${k}" stroke-width="2"/>
<path d="M300 166 C340 172 372 188 378 214 L326 214 C326 192 316 178 300 166 Z" fill="${shade(c.upper, -10)}" stroke="${k}" stroke-width="1.5"/>
<path d="M44 218 C40 182 44 150 58 132 C76 140 92 146 100 152 C96 180 98 200 106 218 Z" fill="${shade(c.upper, -14)}" stroke="${k}" stroke-width="1.5"/>
<path d="M112 206 C168 204 236 176 312 150 C262 190 196 214 132 216 Z" fill="${c.accent}" stroke="${shade(c.accent, -30)}" stroke-width="1.5"/>
<path d="M72 112 C98 102 126 110 142 126" fill="none" stroke="${shade(c.upper, -35)}" stroke-width="6" stroke-linecap="round"/>
<rect x="37" y="118" width="14" height="40" rx="5" fill="${c.accent}"/>
${laces}
<path d="M70 140 C140 132 220 150 350 186" fill="none" stroke="#fff" stroke-width="8" opacity=".14" stroke-linecap="round"/>`;
      }
      case 'soulier':
        return `
<path d="M46 218 L372 218 Q382 226 368 232 L128 232 L120 252 L58 252 L54 232 Q44 228 46 218 Z" fill="url(#s)" stroke="${shade(c.sole, -30)}" stroke-width="2"/>
<path d="M56 234 L122 234 L118 252 L58 252 Z" fill="${shade(c.sole, -25)}"/>
<path d="M52 220 C46 186 54 152 80 146 L132 144 C150 144 160 134 176 136 C220 142 288 166 344 186 C374 196 380 214 368 220 Z" fill="url(#u)" stroke="${k}" stroke-width="2"/>
<path d="M150 142 C168 172 196 196 226 220" fill="none" stroke="${k}" stroke-width="1.6"/>
<path d="M300 172 C318 184 324 202 320 220" fill="none" stroke="${k}" stroke-width="1.6"/>
<path d="M60 212 L362 212" stroke="${shade(c.upper, 30)}" stroke-width="1.4" stroke-dasharray="4 4"/>
<line x1="170" y1="146" x2="186" y2="140" stroke="${L}" stroke-width="3" stroke-linecap="round"/>
<line x1="180" y1="154" x2="196" y2="146" stroke="${L}" stroke-width="3" stroke-linecap="round"/>
<line x1="190" y1="162" x2="206" y2="152" stroke="${L}" stroke-width="3" stroke-linecap="round"/>
<path d="M84 160 C150 150 250 170 340 194" fill="none" stroke="#fff" stroke-width="7" opacity=".16" stroke-linecap="round"/>`;
      case 'mocassin':
        return `
<path d="M46 220 L372 220 Q380 228 366 234 L110 234 L106 250 L60 250 L56 234 Q44 230 46 220 Z" fill="url(#s)" stroke="${shade(c.sole, -30)}" stroke-width="2"/>
<path d="M52 222 C48 196 58 172 92 168 C140 166 168 156 206 156 C262 156 322 172 356 188 C378 198 378 216 366 222 Z" fill="url(#u)" stroke="${k}" stroke-width="2"/>
<path d="M204 160 C250 150 310 166 338 188" fill="none" stroke="${shade(c.upper, 35)}" stroke-width="1.6" stroke-dasharray="4 3"/>
<path d="M170 172 C210 166 250 170 280 178 L278 192 C250 184 210 180 172 186 Z" fill="${c.accent}" stroke="${k}" stroke-width="1.4"/>
<ellipse cx="226" cy="178" rx="12" ry="3.4" fill="${shade(c.accent, -45)}"/>
<path d="M60 214 L364 214" stroke="${shade(c.upper, 30)}" stroke-width="1.3" stroke-dasharray="4 4"/>
<path d="M96 180 C170 172 260 180 350 200" fill="none" stroke="#fff" stroke-width="6" opacity=".15" stroke-linecap="round"/>`;
      case 'sandale':
        return `
<path d="M70 214 C64 160 90 130 130 132 C150 140 160 175 160 212" fill="none" stroke="${c.upper}" stroke-width="14" stroke-linecap="round"/>
<path d="M170 214 C180 160 230 150 250 212" fill="none" stroke="${shade(c.upper, -12)}" stroke-width="14" stroke-linecap="round"/>
<path d="M254 214 C266 168 318 168 338 210" fill="none" stroke="${c.upper}" stroke-width="14" stroke-linecap="round"/>
<rect x="118" y="124" width="22" height="16" rx="4" fill="none" stroke="${c.accent}" stroke-width="4"/>
<rect x="216" y="152" width="20" height="14" rx="4" fill="none" stroke="${c.accent}" stroke-width="4"/>
<path d="M40 222 C40 212 60 208 90 210 L340 206 C372 204 386 214 380 224 Z" fill="${shade(c.sole, 25)}" stroke="${shade(c.sole, -20)}" stroke-width="1.5"/>
<path d="M38 222 L382 222 Q388 238 370 246 L60 246 Q36 244 38 222 Z" fill="url(#s)" stroke="${shade(c.sole, -30)}" stroke-width="2"/>`;
      case 'nu-pieds':
      default:
        return `
<path d="M36 224 C36 212 60 210 90 212 L346 208 C376 206 390 218 382 232 Q376 246 350 246 L66 246 Q36 246 36 224 Z" fill="url(#s)" stroke="${shade(c.sole, -30)}" stroke-width="2"/>
<path d="M44 222 C60 214 90 214 120 215 L340 211 C362 210 376 214 378 220" fill="none" stroke="${shade(c.sole, 30)}" stroke-width="3"/>
<path d="M186 216 C192 164 240 146 290 154 C320 160 340 184 344 212 Z" fill="url(#u)" stroke="${k}" stroke-width="2"/>
<path d="M212 200 C228 176 270 168 318 184" fill="none" stroke="${c.accent}" stroke-width="9" stroke-linecap="round"/>
<path d="M206 176 C230 160 270 158 300 166" fill="none" stroke="#fff" stroke-width="5" opacity=".2" stroke-linecap="round"/>`;
    }
  }

  /* ---------------- FACE ---------------- */
  function face(type, c) {
    const k = shade(c.upper, -45), L = c.lace || '#ffffff';
    switch (type) {
      case 'basket': {
        const laces = [124, 137, 150, 163].map(y => `<line x1="182" y1="${y}" x2="218" y2="${y}" stroke="${L}" stroke-width="5" stroke-linecap="round"/>`).join('');
        return `
<path d="M110 222 Q108 254 150 255 L250 255 Q292 254 290 222 Z" fill="url(#s)" stroke="${shade(c.sole, -30)}" stroke-width="2"/>
<path d="M112 236 L288 236" stroke="${shade(c.sole, -22)}" stroke-width="2"/>
<path d="M116 226 C110 170 130 110 200 104 C270 110 290 170 284 226 Z" fill="url(#u)" stroke="${k}" stroke-width="2"/>
<path d="M130 224 C134 192 168 176 200 176 C232 176 266 192 270 224 Z" fill="${shade(c.upper, -10)}" stroke="${k}" stroke-width="1.5"/>
<ellipse cx="200" cy="112" rx="42" ry="10" fill="${shade(c.upper, -55)}"/>
<path d="M178 108 C176 78 224 78 222 108 L218 170 L182 170 Z" fill="${shade(c.upper, 8)}" stroke="${k}" stroke-width="1.5"/>
${laces}
<path d="M118 200 C124 170 136 150 150 140" fill="none" stroke="${c.accent}" stroke-width="8" stroke-linecap="round"/>
<path d="M282 200 C276 170 264 150 250 140" fill="none" stroke="${c.accent}" stroke-width="8" stroke-linecap="round"/>`;
      }
      case 'soulier':
        return `
<path d="M128 230 Q126 252 150 253 L250 253 Q274 252 272 230 Z" fill="url(#s)" stroke="${shade(c.sole, -30)}" stroke-width="2"/>
<path d="M132 232 C126 194 148 152 200 148 C252 152 274 194 268 232 Z" fill="url(#u)" stroke="${k}" stroke-width="2"/>
<ellipse cx="200" cy="155" rx="38" ry="8" fill="${shade(c.upper, -55)}"/>
<path d="M140 224 C150 200 250 200 260 224" fill="none" stroke="${k}" stroke-width="1.6"/>
${[168, 178, 188].map(y => `<line x1="186" y1="${y}" x2="214" y2="${y}" stroke="${L}" stroke-width="3" stroke-linecap="round"/>`).join('')}
<path d="M160 176 C170 166 186 162 196 162" fill="none" stroke="#fff" stroke-width="5" opacity=".2" stroke-linecap="round"/>`;
      case 'mocassin':
        return `
<path d="M124 232 Q124 251 146 252 L254 252 Q276 251 276 232 Z" fill="url(#s)" stroke="${shade(c.sole, -30)}" stroke-width="2"/>
<path d="M128 234 C122 204 146 172 200 168 C254 172 278 204 272 234 Z" fill="url(#u)" stroke="${k}" stroke-width="2"/>
<ellipse cx="200" cy="175" rx="46" ry="9" fill="${shade(c.upper, -55)}"/>
<path d="M150 226 C150 196 250 196 250 226" fill="none" stroke="${shade(c.upper, 35)}" stroke-width="1.6" stroke-dasharray="4 3"/>
<path d="M148 194 L252 194 L248 206 L152 206 Z" fill="${c.accent}" stroke="${k}" stroke-width="1.2"/>
<ellipse cx="200" cy="200" rx="12" ry="3" fill="${shade(c.accent, -45)}"/>`;
      case 'sandale':
        return `
<path d="M130 230 C135 180 265 180 270 230" fill="none" stroke="${c.upper}" stroke-width="16"/>
<path d="M144 230 C152 150 248 150 256 230" fill="none" stroke="${shade(c.upper, -15)}" stroke-width="12"/>
<rect x="248" y="186" width="18" height="14" rx="3" fill="none" stroke="${c.accent}" stroke-width="4"/>
<path d="M118 230 Q118 252 140 252 L260 252 Q282 252 282 230 Z" fill="url(#s)" stroke="${shade(c.sole, -30)}" stroke-width="2"/>
<ellipse cx="200" cy="230" rx="82" ry="7" fill="${shade(c.sole, 25)}"/>`;
      case 'nu-pieds':
      default:
        return `
<path d="M126 232 C130 162 270 162 274 232 Z" fill="url(#u)" stroke="${k}" stroke-width="2"/>
<path d="M140 214 C150 186 250 186 260 214" fill="none" stroke="${c.accent}" stroke-width="9" stroke-linecap="round"/>
<path d="M116 232 Q116 252 140 252 L260 252 Q284 252 284 232 Z" fill="url(#s)" stroke="${shade(c.sole, -30)}" stroke-width="2"/>
<ellipse cx="200" cy="232" rx="84" ry="6" fill="${shade(c.sole, 28)}"/>`;
    }
  }

  /* ---------------- DESSUS ---------------- */
  function dessus(type, c) {
    const k = shade(c.upper, -45), L = c.lace || '#ffffff';
    switch (type) {
      case 'basket': {
        let laces = '';
        [160, 182, 204, 226].forEach(x => {
          laces += `<line x1="${x}" y1="138" x2="${x + 14}" y2="162" stroke="${L}" stroke-width="4.5" stroke-linecap="round"/><line x1="${x}" y1="162" x2="${x + 14}" y2="138" stroke="${L}" stroke-width="4.5" stroke-linecap="round"/>`;
        });
        return `
${SOLE_UNDER} fill="${c.sole}" stroke="${shade(c.sole, -30)}" stroke-width="2"/>
<path d="${OUTLINE}" fill="url(#u)" stroke="${k}" stroke-width="2"/>
<path d="M300 106 C330 120 336 180 300 196" fill="none" stroke="${k}" stroke-width="1.6"/>
<ellipse cx="100" cy="150" rx="40" ry="27" fill="${shade(c.upper, -55)}"/>
<ellipse cx="96" cy="150" rx="30" ry="19" fill="${shade(c.sole, 20)}"/>
<rect x="142" y="130" width="112" height="40" rx="15" fill="${shade(c.upper, 8)}" stroke="${k}" stroke-width="1.5"/>
${laces}
<path d="M150 104 C200 112 260 108 300 106" fill="none" stroke="${c.accent}" stroke-width="7" stroke-linecap="round"/>`;
      }
      case 'soulier':
        return `
${SOLE_UNDER} fill="${c.sole}" stroke="${shade(c.sole, -30)}" stroke-width="2"/>
<path d="${OUTLINE}" fill="url(#u)" stroke="${k}" stroke-width="2"/>
<ellipse cx="106" cy="150" rx="36" ry="24" fill="${shade(c.upper, -55)}"/>
<path d="M200 118 C216 138 216 162 200 182" fill="none" stroke="${k}" stroke-width="1.6"/>
<path d="M300 112 C322 134 322 166 300 192" fill="none" stroke="${k}" stroke-width="1.6"/>
${[152, 166, 180].map(x => `<line x1="${x}" y1="140" x2="${x}" y2="160" stroke="${L}" stroke-width="3.5" stroke-linecap="round"/>`).join('')}
<path d="M220 120 C260 116 300 118 330 128" fill="none" stroke="#fff" stroke-width="6" opacity=".18" stroke-linecap="round"/>`;
      case 'mocassin':
        return `
${SOLE_UNDER} fill="${c.sole}" stroke="${shade(c.sole, -30)}" stroke-width="2"/>
<path d="${OUTLINE}" fill="url(#u)" stroke="${k}" stroke-width="2"/>
<ellipse cx="114" cy="150" rx="48" ry="28" fill="${shade(c.upper, -55)}"/>
<ellipse cx="110" cy="150" rx="38" ry="20" fill="${shade(c.sole, 15)}"/>
<ellipse cx="286" cy="150" rx="58" ry="34" fill="none" stroke="${shade(c.upper, 35)}" stroke-width="1.8" stroke-dasharray="5 3"/>
<rect x="188" y="124" width="30" height="52" rx="6" fill="${c.accent}" stroke="${k}" stroke-width="1.3"/>
<rect x="199" y="138" width="8" height="24" rx="3" fill="${shade(c.accent, -45)}"/>`;
      case 'sandale':
        return `
${SOLE_UNDER} fill="${c.sole}" stroke="${shade(c.sole, -30)}" stroke-width="2"/>
<path d="${OUTLINE}" fill="${shade(c.sole, 28)}" stroke="${shade(c.sole, -20)}" stroke-width="1.5"/>
<path d="M70 146 C80 132 100 128 120 130" fill="none" stroke="${shade(c.sole, -10)}" stroke-width="3" opacity=".5"/>
<rect x="268" y="100" width="28" height="104" rx="11" fill="url(#u)" stroke="${k}" stroke-width="1.5"/>
<rect x="188" y="100" width="28" height="100" rx="11" fill="url(#u)" stroke="${k}" stroke-width="1.5"/>
<rect x="84" y="104" width="22" height="90" rx="9" fill="${shade(c.upper, -10)}" stroke="${k}" stroke-width="1.5"/>
<rect x="190" y="108" width="24" height="16" rx="4" fill="none" stroke="${c.accent}" stroke-width="4"/>
<rect x="270" y="108" width="24" height="16" rx="4" fill="none" stroke="${c.accent}" stroke-width="4"/>`;
      case 'nu-pieds':
      default:
        return `
${SOLE_UNDER} fill="${c.sole}" stroke="${shade(c.sole, -30)}" stroke-width="2"/>
<path d="${OUTLINE}" fill="${shade(c.sole, 28)}" stroke="${shade(c.sole, -20)}" stroke-width="1.5"/>
<path d="M226 104 C258 98 300 100 324 110 L324 192 C300 202 258 204 226 196 Z" fill="url(#u)" stroke="${k}" stroke-width="2"/>
<rect x="262" y="104" width="14" height="94" rx="5" fill="${c.accent}"/>`;
    }
  }

  /* ---------------- ARRIÈRE ---------------- */
  function arriere(type, c) {
    const k = shade(c.upper, -45);
    switch (type) {
      case 'basket':
        return `
<path d="M138 222 Q136 254 166 255 L234 255 Q264 254 262 222 Z" fill="url(#s)" stroke="${shade(c.sole, -30)}" stroke-width="2"/>
<path d="M140 236 L260 236" stroke="${shade(c.sole, -22)}" stroke-width="2"/>
<path d="M144 226 C136 170 148 112 200 106 C252 112 264 170 256 226 Z" fill="url(#u)" stroke="${k}" stroke-width="2"/>
<path d="M150 224 C148 196 152 176 160 164 L240 164 C248 176 252 196 250 224 Z" fill="${shade(c.upper, -12)}" stroke="${k}" stroke-width="1.5"/>
<ellipse cx="200" cy="112" rx="34" ry="9" fill="${shade(c.upper, -55)}"/>
<path d="M186 102 L214 102 L212 170 Q200 176 188 170 Z" fill="${c.accent}" stroke="${shade(c.accent, -30)}" stroke-width="1.5"/>
<line x1="170" y1="200" x2="230" y2="200" stroke="#fff" stroke-width="4" opacity=".45" stroke-linecap="round"/>`;
      case 'soulier':
        return `
<path d="M146 226 L254 226 L252 254 L148 254 Z" fill="${shade(c.sole, -20)}" stroke="${shade(c.sole, -35)}" stroke-width="2"/>
<path d="M150 228 C144 196 156 158 200 154 C244 158 256 196 250 228 Z" fill="url(#u)" stroke="${k}" stroke-width="2"/>
<ellipse cx="200" cy="159" rx="32" ry="7" fill="${shade(c.upper, -55)}"/>
<line x1="200" y1="166" x2="200" y2="226" stroke="${k}" stroke-width="1.6"/>
<path d="M160 214 L240 214" stroke="${shade(c.upper, 30)}" stroke-width="1.3" stroke-dasharray="4 4"/>`;
      case 'mocassin':
        return `
<path d="M148 230 L252 230 L250 252 L150 252 Z" fill="${shade(c.sole, -15)}" stroke="${shade(c.sole, -35)}" stroke-width="2"/>
<path d="M150 232 C144 206 158 176 200 172 C242 176 256 206 250 232 Z" fill="url(#u)" stroke="${k}" stroke-width="2"/>
<ellipse cx="200" cy="177" rx="36" ry="8" fill="${shade(c.upper, -55)}"/>
<path d="M176 200 Q200 210 224 200" fill="none" stroke="${shade(c.upper, 35)}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
      case 'sandale':
        return `
<path d="M150 234 C150 180 250 180 250 234" fill="none" stroke="${c.upper}" stroke-width="14"/>
<rect x="236" y="194" width="20" height="16" rx="4" fill="none" stroke="${c.accent}" stroke-width="4"/>
<path d="M140 232 L260 232 Q262 252 244 254 L156 254 Q138 252 140 232 Z" fill="url(#s)" stroke="${shade(c.sole, -30)}" stroke-width="2"/>
<ellipse cx="200" cy="232" rx="60" ry="5" fill="${shade(c.sole, 25)}"/>`;
      case 'nu-pieds':
      default:
        return `
<path d="M150 236 C160 186 240 186 250 236" fill="none" stroke="${shade(c.upper, -10)}" stroke-width="22" opacity=".85"/>
<path d="M140 236 Q140 254 162 254 L238 254 Q260 254 260 236 Z" fill="url(#s)" stroke="${shade(c.sole, -30)}" stroke-width="2"/>
<ellipse cx="200" cy="236" rx="60" ry="5" fill="${shade(c.sole, 28)}"/>`;
    }
  }

  /* ---------------- SEMELLE ---------------- */
  function semelle(type, c) {
    const d = shade(c.sole, -30);
    if (type === 'basket') {
      return `
<path d="${OUTLINE}" fill="url(#t)" stroke="${d}" stroke-width="2.5"/>
<path d="${OUTLINE}" fill="none" stroke="${shade(c.sole, 20)}" stroke-width="6" transform="translate(11 7.5) scale(.95)"/>
<ellipse cx="110" cy="150" rx="40" ry="30" fill="${shade(c.sole, -8)}" stroke="${d}" stroke-width="1.5"/>
<circle cx="300" cy="150" r="24" fill="none" stroke="${d}" stroke-width="3"/>
<circle cx="300" cy="150" r="12" fill="none" stroke="${d}" stroke-width="2"/>
<rect x="180" y="138" width="44" height="24" rx="6" fill="${c.accent}" opacity=".9"/>`;
    }
    if (type === 'soulier' || type === 'mocassin') {
      return `
<path d="${OUTLINE}" fill="url(#s)" stroke="${d}" stroke-width="2.5"/>
<path d="${OUTLINE}" fill="none" stroke="${shade(c.sole, 25)}" stroke-width="1.5" stroke-dasharray="4 4" transform="translate(11 7.5) scale(.95)"/>
<path d="M58 150 C56 118 82 106 122 106 L142 106 L142 194 L122 194 C82 194 60 182 58 150 Z" fill="${shade(c.sole, -28)}"/>
<path d="M260 132 C290 128 320 134 340 150" fill="none" stroke="${shade(c.sole, 20)}" stroke-width="2" opacity=".5"/>`;
    }
    return `
<path d="${OUTLINE}" fill="url(#s)" stroke="${d}" stroke-width="2.5"/>
${[100, 150, 200, 250, 300].map(x => `<path d="M${x} 118 L${x} 182" stroke="${shade(c.sole, -20)}" stroke-width="5" stroke-linecap="round" opacity=".55"/>`).join('')}
<path d="${OUTLINE}" fill="none" stroke="${shade(c.sole, 18)}" stroke-width="4" transform="translate(11 7.5) scale(.95)"/>`;
  }

  const RENDER = { profil, face, dessus, arriere, semelle };

  function svg(type, view, art) {
    const c = Object.assign({ upper: '#e8e8e8', accent: '#d4af5f', sole: '#f2f2f2', lace: '#ffffff' }, art || {});
    if (type === 'bottes') type = 'soulier';
    const fn = RENDER[view] || profil;
    const shadow = view === 'dessus' || view === 'semelle'
      ? `<ellipse cx="218" cy="232" rx="170" ry="9" fill="#000" opacity=".10"/>`
      : `<ellipse cx="210" cy="262" rx="${view === 'profil' ? 175 : 100}" ry="9" fill="#000" opacity=".14"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 290">${defs(c)}${shadow}<g transform="translate(4 0)">${fn(type, c)}</g></svg>`;
  }

  const cache = new Map();
  function uri(type, view, art) {
    const key = type + '|' + view + '|' + JSON.stringify(art || {});
    if (!cache.has(key)) {
      if (cache.size > 600) cache.clear();
      cache.set(key, 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg(type, view, art)));
    }
    return cache.get(key);
  }

  global.ShoeArt = { VIEWS, TYPES, svg, uri, shade };
})(window);
