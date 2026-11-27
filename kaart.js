/* Gestileerde nachtkaart van Nederland: gloeiende lichtpuntjes op een zwarte achtergrond.
   Alles wordt in de browser getekend; er worden geen externe kaartdiensten gebruikt. */
(function () {
  "use strict";

  // Grove contour van Nederland (lengtegraad, breedtegraad). Gestileerd, niet exact.
  const LAND = [
    [3.37,51.37],[3.53,51.41],[3.44,51.54],[3.52,51.60],[3.70,51.70],[3.86,51.75],[3.95,51.84],[4.05,51.93],
    [4.12,51.99],[4.20,52.05],[4.27,52.11],[4.40,52.22],[4.53,52.38],[4.58,52.47],[4.62,52.62],[4.66,52.80],
    [4.72,52.93],[4.77,52.97],[4.95,52.93],[5.05,52.94],[5.20,53.00],[5.38,53.08],[5.42,53.18],[5.55,53.30],
    [5.90,53.39],[6.20,53.41],[6.50,53.45],[6.70,53.46],[6.87,53.44],[6.94,53.32],[7.10,53.27],[7.21,53.18],
    [7.20,53.00],[7.07,52.85],[7.05,52.64],[6.73,52.65],[6.70,52.52],[7.00,52.46],[7.07,52.36],[7.04,52.24],
    [6.85,52.12],[6.73,52.04],[6.83,51.97],[6.40,51.83],[6.17,51.88],[5.95,51.80],[6.02,51.70],[6.10,51.55],
    [6.22,51.40],[6.09,51.22],[6.17,51.17],[5.95,51.05],[6.08,50.95],[6.08,50.87],[6.02,50.75],[5.69,50.75],
    [5.64,50.85],[5.78,51.02],[5.84,51.15],[5.60,51.25],[5.48,51.29],[5.20,51.32],[5.05,51.47],[4.85,51.42],
    [4.75,51.50],[4.55,51.48],[4.40,51.36],[4.24,51.37],[3.98,51.25],[3.75,51.27],[3.55,51.29],[3.40,51.33]
  ];
  const EILANDEN = [
    [[4.72,53.00],[4.78,53.18],[4.88,53.18],[4.90,53.05],[4.80,52.99]],
    [[4.92,53.25],[5.10,53.32],[5.12,53.29],[4.95,53.22]],
    [[5.15,53.37],[5.55,53.45],[5.58,53.42],[5.20,53.35]],
    [[5.62,53.45],[5.92,53.47],[5.92,53.43],[5.63,53.43]],
    [[6.10,53.48],[6.32,53.50],[6.32,53.47],[6.12,53.46]]
  ];
  const WATER = [
    [[3.50,51.43],[3.70,51.46],[3.95,51.40],[4.20,51.40],[4.25,51.36],[3.95,51.36],[3.70,51.41],[3.53,51.40]],
    [[3.70,51.62],[3.95,51.62],[4.15,51.55],[4.05,51.52],[3.85,51.55],[3.68,51.58]],
    [[3.85,51.75],[4.15,51.72],[4.40,51.72],[4.40,51.70],[4.10,51.68],[3.85,51.70]],
    [[5.05,52.93],[5.38,53.06],[5.42,52.93],[5.63,52.84],[5.58,52.68],[5.45,52.57],[5.28,52.70],[5.15,52.78],[5.07,52.88]],
    [[5.05,52.58],[5.28,52.69],[5.44,52.55],[5.30,52.45],[5.15,52.38],[5.03,52.45]]
  ];

  // Plaatsen: [naam, breedtegraad, lengtegraad, inwoners (afgerond)]
  const PLAATSEN = [
    ["Amsterdam",52.37,4.90,930000],["Rotterdam",51.92,4.48,670000],["Den Haag",52.08,4.30,560000],["Utrecht",52.09,5.12,370000],
    ["Eindhoven",51.44,5.48,240000],["Groningen",53.22,6.57,240000],["Tilburg",51.56,5.09,230000],["Almere",52.37,5.22,220000],
    ["Breda",51.59,4.78,190000],["Nijmegen",51.84,5.86,180000],["Apeldoorn",52.21,5.97,165000],["Arnhem",51.98,5.91,165000],
    ["Haarlem",52.38,4.64,165000],["Hoofddorp",52.30,4.69,160000],["Enschede",52.22,6.89,160000],["Amersfoort",52.16,5.39,160000],
    ["Zaandam",52.44,4.82,160000],["'s-Hertogenbosch",51.69,5.30,160000],["Zwolle",52.51,6.09,130000],["Leiden",52.16,4.49,130000],
    ["Zoetermeer",52.06,4.49,125000],["Leeuwarden",53.20,5.80,125000],["Maastricht",50.85,5.69,120000],["Dordrecht",51.81,4.67,120000],
    ["Ede",52.04,5.66,120000],["Alphen a/d Rijn",52.13,4.66,115000],["Alkmaar",52.63,4.75,110000],["Westland",52.00,4.20,110000],
    ["Emmen",52.79,6.90,108000],["Delft",52.01,4.36,105000],["Venlo",51.37,6.17,100000],["Deventer",52.25,6.16,100000],
    ["Sittard-Geleen",51.00,5.87,90000],["Helmond",51.48,5.66,93000],["Oss",51.77,5.52,93000],["Amstelveen",52.30,4.86,92000],
    ["Hilversum",52.22,5.17,92000],["Heerlen",50.89,5.98,87000],["Lelystad",52.52,5.47,80000],["Purmerend",52.50,4.95,82000],
    ["Schiedam",51.92,4.40,80000],["Gouda",52.01,4.71,75000],["Vlaardingen",51.91,4.34,75000],["Hoorn",52.64,5.06,75000],
    ["Assen",52.99,6.56,70000],["Roosendaal",51.53,4.46,78000],["Spijkenisse",51.85,4.33,73000],["Almelo",52.36,6.66,73000],
    ["Hengelo",52.27,6.79,81000],["Veenendaal",52.03,5.56,67000],["Zeist",52.09,5.23,65000],["Bergen op Zoom",51.49,4.29,68000],
    ["Capelle",51.93,4.58,67000],["Nieuwegein",52.03,5.08,64000],["Katwijk",52.20,4.41,66000],["Roermond",51.19,5.99,59000],
    ["Den Helder",52.96,4.76,56000],["Middelburg",51.50,3.61,49000],["Vlissingen",51.44,3.57,44000],["Goes",51.50,3.89,38000],
    ["Terneuzen",51.34,3.83,54000],["Harderwijk",52.34,5.62,48000],["Doetinchem",51.97,6.29,58000],["Kampen",52.56,5.91,54000],
    ["Heerenveen",52.96,5.92,51000],["Drachten",53.11,6.10,45000],["Sneek",53.03,5.66,34000],["Hoogeveen",52.73,6.48,55000],
    ["Meppel",52.70,6.19,35000],["Tiel",51.89,5.43,42000],["Weert",51.25,5.71,50000],["Wageningen",51.97,5.67,40000],
    ["Zutphen",52.14,6.20,48000],["Winterswijk",51.97,6.72,29000],["Oldenzaal",52.31,6.93,32000],["Veendam",53.10,6.88,28000],
    ["Stadskanaal",52.99,6.95,31000],["Delfzijl",53.33,6.92,25000],["Harlingen",53.17,5.42,16000],["Emmeloord",52.71,5.75,27000],
    ["Dronten",52.52,5.72,42000],["Uden",51.66,5.62,42000],["Waalwijk",51.68,5.07,49000],["Gorinchem",51.83,4.97,37000],
    ["Woerden",52.09,4.88,52000],["Rijswijk",52.04,4.32,57000],["Beverwijk",52.48,4.66,42000],["Enkhuizen",52.70,5.29,18000],
    ["Oosterhout",51.64,4.86,56000],["Valkenswaard",51.35,5.46,31000],["Kerkrade",50.87,6.06,45000],["Nijkerk",52.22,5.49,44000],
    ["Barneveld",52.14,5.59,60000],["Den Burg",53.05,4.80,13000],["West-Terschelling",53.36,5.22,5000],["Nes",53.45,5.77,4000],
    ["Schiermonnikoog",53.48,6.16,1000],["Vlieland",53.30,5.07,1000],["Hellevoetsluis",51.83,4.14,40000],["Zierikzee",51.65,3.92,11000]
  ];

  // Grote verbindingswegen (als dunne lichtsnoeren)
  const WEGEN = [
    ["Amsterdam","Utrecht"],["Amsterdam","Leiden"],["Leiden","Den Haag"],["Den Haag","Rotterdam"],["Rotterdam","Utrecht"],
    ["Utrecht","Amersfoort"],["Amersfoort","Zwolle"],["Utrecht","Arnhem"],["Utrecht","'s-Hertogenbosch"],["'s-Hertogenbosch","Eindhoven"],
    ["Rotterdam","Dordrecht"],["Dordrecht","Breda"],["Breda","Tilburg"],["Tilburg","Eindhoven"],["Eindhoven","Venlo"],
    ["Eindhoven","Roermond"],["Roermond","Maastricht"],["Amersfoort","Apeldoorn"],["Apeldoorn","Deventer"],["Deventer","Hengelo"],
    ["Hengelo","Enschede"],["Zwolle","Assen"],["Assen","Groningen"],["Zwolle","Heerenveen"],["Heerenveen","Leeuwarden"],
    ["Groningen","Leeuwarden"],["Amsterdam","Alkmaar"],["Alkmaar","Den Helder"],["Amsterdam","Almere"],["Almere","Lelystad"],
    ["Arnhem","Nijmegen"],["Breda","Bergen op Zoom"],["Bergen op Zoom","Goes"],["Goes","Middelburg"],["Amsterdam","Haarlem"],
    ["Leiden","Alphen a/d Rijn"],["Alphen a/d Rijn","Utrecht"],["Lelystad","Zwolle"],["Nijmegen","'s-Hertogenbosch"]
  ];

  const LEIDEN = [4.49, 52.16];
  const COS = Math.cos(52.2 * Math.PI / 180);
  const MIN_LON = 3.3, MAX_LON = 7.3, MIN_LAT = 50.7, MAX_LAT = 53.58;

  // Voorspelbare toevalsgenerator: de kaart ziet er bij elk bezoek hetzelfde uit
  let zaad = 20261126;
  const toeval = () => { zaad = (zaad * 1664525 + 1013904223) >>> 0; return zaad / 4294967296; };
  const gauss = () => { let u = 0, v = 0; while (!u) u = toeval(); while (!v) v = toeval(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

  function binnen(p, poly) {
    let in_ = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) in_ = !in_;
    }
    return in_;
  }
  const opLand = p => (binnen(p, LAND) || EILANDEN.some(e => binnen(p, e))) && !WATER.some(w => binnen(p, w));

  // Punten opbouwen: [lon, lat, helderheid, grootte, fase, snelheid]
  const punten = [];
  const voeg = (lon, lat, h, g) => punten.push([lon, lat, h, g, toeval() * Math.PI * 2, 0.4 + toeval() * 1.2]);

  // Platteland: verspreide zwakke lichtjes
  for (let n = 0; n < 16000 && punten.length < 4200; n++) {
    const p = [MIN_LON + toeval() * (MAX_LON - MIN_LON), MIN_LAT + toeval() * (MAX_LAT - MIN_LAT)];
    if (opLand(p)) voeg(p[0], p[1], 0.10 + toeval() * 0.28, 0.35 + toeval() * 0.45);
  }
  // Steden: wolken van lichtjes rond het centrum
  const opNaam = {};
  for (const [naam, lat, lon, inw] of PLAATSEN) {
    opNaam[naam] = [lon, lat];
    const aantal = Math.round(Math.sqrt(inw) / 2.5);
    const sigma = 0.012 * Math.sqrt(inw / 100000) + 0.005;
    for (let i = 0; i < aantal; i++) {
      const dx = gauss(), dy = gauss();
      const r = Math.hypot(dx, dy);
      const p = [lon + dx * sigma / COS, lat + dy * sigma];
      if (!opLand(p)) continue;
      voeg(p[0], p[1], 0.18 + 0.7 * Math.exp(-r * 1.1), 0.35 + toeval() * 0.5);
    }
    // zachte gloed boven het centrum
    punten.push([lon, lat, Math.min(0.32, 0.06 + inw / 2500000), 3 + Math.sqrt(inw) / 70, 0, 0.15, true]);
  }
  // Wegen
  for (const [a, b] of WEGEN) {
    const A = opNaam[a], B = opNaam[b];
    if (!A || !B) continue;
    const len = Math.hypot((B[0] - A[0]) * COS, B[1] - A[1]);
    const stappen = Math.round(len * 160);
    for (let i = 0; i < stappen; i++) {
      const t = toeval();
      const p = [A[0] + (B[0] - A[0]) * t + gauss() * 0.004, A[1] + (B[1] - A[1]) * t + gauss() * 0.003];
      if (opLand(p)) voeg(p[0], p[1], 0.12 + toeval() * 0.18, 0.5 + toeval() * 0.4);
    }
  }

  // ---------- Tekenen ----------
  const canvas = document.getElementById("kaart");
  const ctx = canvas.getContext("2d");
  const rustig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let B = 0, H = 0, dpr = 1, schaal = 1, ox = 0, oy = 0, scherm = [];
  let golfStart = -1e9;
  let naarBinnen = false, verste = 1; // naarBinnen: de golf trekt van buiten naar Leiden toe

  // Voorgetekende gloeisprite in een gegeven kleur: witte kern, gekleurde gloed
  function maakSprite([r, g, b]) {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const s = c.getContext("2d");
    const mix = (t) => `${Math.round(r + (255 - r) * t)},${Math.round(g + (255 - g) * t)},${Math.round(b + (255 - b) * t)}`;
    const grad = s.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, `rgba(${mix(0.75)},1)`);
    grad.addColorStop(0.18, `rgba(${mix(0.2)},.78)`);
    grad.addColorStop(0.45, `rgba(${r},${g},${b},.22)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    s.fillStyle = grad; s.fillRect(0, 0, 64, 64);
    return c;
  }
  let spriteOud = maakSprite([255, 196, 107]);
  let spriteNieuw = spriteOud;

  function maat() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    B = window.innerWidth; H = window.innerHeight;
    canvas.width = B * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const breedte = (MAX_LON - MIN_LON) * COS, hoogte = MAX_LAT - MIN_LAT;
    const smal = B < 700;
    const vakB = smal ? B * 1.05 : B * 0.6, vakH = smal ? H * 0.8 : H * 0.96;
    schaal = Math.min(vakB / breedte, vakH / hoogte);
    const cx = smal ? B * 0.5 : B * 0.68, cy = H * 0.5;
    ox = cx - breedte * schaal / 2; oy = cy - hoogte * schaal / 2;
    scherm = punten.map(p => [ox + (p[0] - MIN_LON) * COS * schaal, oy + (MAX_LAT - p[1]) * schaal]);
    const [lx, ly] = naarScherm(LEIDEN);
    verste = Math.max(...scherm.map(([x, y]) => Math.hypot(x - lx, y - ly))) + schaal * 0.2;
    if (rustig) teken(0);
  }
  const naarScherm = ([lon, lat]) => [ox + (lon - MIN_LON) * COS * schaal, oy + (MAX_LAT - lat) * schaal];

  function teken(t) {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#030304"; ctx.fillRect(0, 0, B, H);
    ctx.globalCompositeOperation = "lighter";
    const eenheid = schaal / 260; // puntgrootte meeschalen met de kaart
    const [lx, ly] = naarScherm(LEIDEN);
    const afgelegd = (t - golfStart) * 0.0009 * schaal; // afgelegde weg van de golf in pixels
    const golfBreedte = schaal * 0.18;
    // Naar buiten: de straal groeit vanaf Leiden. Naar binnen: de straal krimpt van de rand naar Leiden.
    const golfR = naarBinnen ? verste - afgelegd : afgelegd;
    const golfLevend = naarBinnen ? golfR > -golfBreedte * 2 : golfR < schaal * 4.5;
    const sterkte = naarBinnen
      ? 0.45 + 0.55 * Math.min(1, Math.max(0, 1 - golfR / verste)) // zwelt aan richting Leiden
      : Math.max(0, 1 - golfR / (schaal * 4.5));
    if (!golfLevend && spriteOud !== spriteNieuw) spriteOud = spriteNieuw; // golf voorbij: nieuwe kleur overal
    for (let i = 0; i < punten.length; i++) {
      const p = punten[i], [x, y] = scherm[i];
      let h = p[2], sprite = spriteNieuw;
      if (!rustig) h *= 0.82 + 0.18 * Math.sin(t * 0.001 * p[5] + p[4]);
      if (golfLevend) {
        const afstand = Math.hypot(x - lx, y - ly);
        const d = afstand - golfR;
        h += Math.exp(-(d * d) / (golfBreedte * golfBreedte)) * (p[6] ? 0.25 : 0.9) * sterkte;
        // nog niet bereikt door de golf: oude kleur
        if (naarBinnen ? afstand < golfR : afstand > golfR) sprite = spriteOud;
      }
      const r = p[3] * (p[6] ? eenheid * 4 : eenheid * 4.2);
      ctx.globalAlpha = Math.min(1, h);
      ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
  }

  function lus(t) { teken(t); requestAnimationFrame(lus); }

  window.addEventListener("resize", maat);
  maat();
  if (!rustig) requestAnimationFrame(lus);

  window.Kaart = {
    // Nieuwe kleur [r,g,b]. Met direct=true zonder golf (bij het openen van de pagina).
    // Met binnen=true golft het licht naar Leiden toe in plaats van vanuit Leiden naar buiten.
    kleur(rgb, direct, binnen) {
      spriteOud = spriteNieuw;
      spriteNieuw = maakSprite(rgb);
      if (direct || rustig) { spriteOud = spriteNieuw; if (rustig) teken(0); return; }
      naarBinnen = !!binnen;
      golfStart = performance.now();
    }
  };
})();
