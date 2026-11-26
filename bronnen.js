/* Bronnenpagina: alles wat de scan heeft bekeken, met filter per sector. */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const laad = pad => fetch(pad, { cache: "no-cache" }).then(r => r.json());
  const datum = (d, benaderd) => benaderd
    ? String(new Date(d).getFullYear())
    : new Date(d).toLocaleDateString("nl-NL", { month: "long", year: "numeric" });
  const BRONTYPE = { planbureau: "planbureau", overheid: "overheid / adviesraad", wetenschap: "wetenschap", internationaal: "internationale organisatie", onderzoeksbureau: "onderzoeksbureau", consultancy: "consultancy", commercieel: "commercieel onderzoek" };
  const BEREIK = { nl: "Nederland", eu: "Europa", mondiaal: "mondiaal" };
  const hexNaarRgb = h => h.match(/[0-9a-f]{2}/gi).map(x => parseInt(x, 16));

  Promise.all([laad("data/sectoren.json"), laad("data/bronnen-log.json"), laad("data/organisaties.json"), laad("data/config.json").catch(() => ({}))])
    .then(([DATA, LOG, ORG, CONFIG]) => {
      // Gewichten per rapport per sector
      const perRapport = {};
      for (const s of DATA.sectoren) {
        for (const r of window.Weging.bereken(DATA, s)) {
          (perRapport[r.id] ||= []).push({ sector: s, aandeel: r.aandeel });
        }
      }

      // Voorstelknop
      const knop = $("voorstel-knop");
      if (CONFIG.github_repo) knop.href = `https://github.com/${CONFIG.github_repo}/issues/new?template=bron-voorstellen.yml`;
      else { knop.classList.add("uit"); knop.title = "Beschikbaar zodra de site online staat"; knop.removeAttribute("href"); }

      $("bijgewerkt").textContent = "Bijgewerkt " + new Date(DATA.bijgewerkt).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });

      // Filters
      let filter = null;
      const filters = $("filters");
      const maakFilter = (label, sector) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "filter"; b.textContent = label;
        b.setAttribute("aria-pressed", String(sector === null));
        if (sector) b.style.setProperty("--kleur", sector.kleur);
        b.addEventListener("click", () => {
          filter = sector;
          [...filters.children].forEach(x => x.setAttribute("aria-pressed", String(x === b)));
          const rgb = hexNaarRgb(sector ? sector.kleur : "#ffc46b");
          document.documentElement.style.setProperty("--licht-rgb", rgb.join(", "));
          if (window.Kaart) window.Kaart.kleur(rgb);
          toon();
        });
        filters.appendChild(b);
      };
      maakFilter("Alle sectoren", null);
      DATA.sectoren.forEach(s => maakFilter(s.naam, s));

      function bronItem(titel, url, meta, reden, chips) {
        const li = document.createElement("li");
        li.className = "bron";
        const a = document.createElement("a");
        a.className = "bron-titel"; a.href = url; a.target = "_blank"; a.rel = "noopener"; a.textContent = titel;
        li.appendChild(a);
        const m = document.createElement("div"); m.className = "bron-meta"; m.textContent = meta; li.appendChild(m);
        if (reden) { const r = document.createElement("div"); r.className = "bron-reden"; r.textContent = reden; li.appendChild(r); }
        if (chips && chips.length) {
          const c = document.createElement("div"); c.className = "chips";
          for (const { sector, aandeel } of chips) {
            const s = document.createElement("span"); s.className = "chip";
            s.style.setProperty("--kleur", sector.kleur);
            s.textContent = `${sector.naam} · ${Math.round(aandeel * 100)}%`;
            c.appendChild(s);
          }
          li.appendChild(c);
        }
        return li;
      }
      function vul(ul, items, telId) {
        ul.innerHTML = "";
        items.forEach((li, i) => { li.style.animationDelay = `${Math.min(i, 12) * 35}ms`; ul.appendChild(li); });
        if (!items.length) { const li = document.createElement("li"); li.className = "leeg"; li.textContent = "Niets in deze categorie."; ul.appendChild(li); }
        $(telId).textContent = items.length;
      }

      function toon() {
        const opgenomen = Object.entries(DATA.rapporten)
          .filter(([id]) => perRapport[id] && (!filter || perRapport[id].some(x => x.sector.id === filter.id)))
          .sort(([, a], [, b]) => new Date(b.datum) - new Date(a.datum))
          .map(([id, r]) => bronItem(r.titel, r.url,
            `${r.organisatie} · ${datum(r.datum, r.datum_benaderd)} · ${BRONTYPE[r.brontype] || r.brontype} · ${BEREIK[r.bereik] || r.bereik}`,
            r.kern,
            perRapport[id].filter(x => !filter || x.sector.id === filter.id).sort((a, b) => b.aandeel - a.aandeel)));
        vul($("opgenomen"), opgenomen, "n-opgenomen");

        const log = LOG.bronnen || [];
        vul($("beoordelen"), log.filter(b => b.status === "te-beoordelen").map(b => bronItem(b.titel, b.url, `${b.organisatie} · bekeken ${datum(b.bekeken)}`, b.reden)), "n-beoordelen");
        vul($("afgewezen"), log.filter(b => b.status === "afgewezen").map(b => bronItem(b.titel, b.url, `${b.organisatie} · bekeken ${datum(b.bekeken)}`, b.reden)), "n-afgewezen");
      }
      toon();

      const totaal = Object.keys(perRapport).length + (LOG.bronnen || []).length;
      $("telling").textContent = `Tot nu toe ${totaal} bronnen bekeken.`;

      // Organisaties
      const ul = $("organisaties");
      for (const o of ORG.organisaties) {
        const li = document.createElement("li");
        const naam = document.createElement(o.website ? "a" : "span");
        if (o.website) { naam.href = o.website; naam.target = "_blank"; naam.rel = "noopener"; }
        naam.textContent = o.naam;
        const s = document.createElement("span"); s.className = "soort"; s.textContent = BRONTYPE[o.soort] || o.soort;
        li.append(naam, s); ul.appendChild(li);
      }

      // Uitleg weging
      const m = DATA.methode;
      const fmt = obj => Object.entries(obj).map(([k, v]) => `${BRONTYPE[k] || BEREIK[k] || k} ${String(v).replace(".", ",")}`).join(" · ");
      const factoren = [
        ["Recentheid", `Een rapport verliest elke ${m.halfwaardetijd_maanden} maanden de helft van zijn gewicht. Zo tellen nieuwe inzichten zwaarder.`],
        ["Bereik", fmt(m.bereik)],
        ["Sector", `specifiek over de sector ${String(m.specificiteit.sector).replace(".", ",")} · algemeen ${String(m.specificiteit.generiek).replace(".", ",")}`],
        ["Soort bron", fmt(m.brontype)]
      ];
      const dl = $("factoren");
      for (const [dt, dd] of factoren) {
        const t = document.createElement("dt"); t.textContent = dt;
        const d = document.createElement("dd"); d.textContent = dd;
        dl.append(t, d);
      }
    });
})();
