/* Pagina-logica: sector kiezen, zin tonen, rapporten wegen en tonen. */
(function () {
  "use strict";

  const $ = id => document.getElementById(id);
  const kiezer = $("kiezer"), knop = $("kiezer-knop"), lijst = $("kiezer-lijst");
  const kern = $("kern"), vaardigheden = $("vaardigheden");
  const fijneMuis = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  let DATA = null, huidige = null, focusIndex = -1, sluitTimer = null;

  // ---------- Weging ----------
  // Zie METHODE.md voor uitleg. Het gewicht van een rapport is het product van vier factoren,
  // daarna omgerekend naar een percentage van het totaal binnen de sector.
  const gewichten = sector => window.Weging.bereken(DATA, sector);

  // ---------- Tonen ----------
  const maand = d => new Date(d).toLocaleDateString("nl-NL", { month: "long", year: "numeric" });

  function toon(id, eerste) {
    const sector = DATA.sectoren.find(s => s.id === id) || DATA.sectoren[0];
    if (huidige && sector.id === huidige.id) return;
    huidige = sector;

    // Sectorkleur: voor de kaart en voor de accenten op de pagina
    const rgb = (sector.kleur || "#ffc46b").match(/[0-9a-f]{2}/gi).map(h => parseInt(h, 16));
    document.documentElement.style.setProperty("--licht-rgb", rgb.join(", "));
    if (window.Kaart) window.Kaart.kleur(rgb, eerste, sector.golf === "naar-leiden");

    $("sector-naam").textContent = sector.naam;
    [...lijst.children].forEach(li => li.setAttribute("aria-selected", String(li.dataset.id === sector.id)));
    document.title = `AI en ${sector.naam.toLowerCase()} · Hogeschool Leiden`;

    const vul = () => {
      kern.textContent = sector.zin;
      $("meer").textContent = sector.vaardigheden.meer.join(" · ");
      $("minder").textContent = sector.vaardigheden.minder.join(" · ");
      kern.classList.remove("weg"); vaardigheden.classList.remove("weg");
      toonRapporten(sector);
    };
    if (eerste) { vul(); return; }
    kern.classList.add("weg"); vaardigheden.classList.add("weg");
    setTimeout(vul, 450);
  }

  function toonRapporten(sector) {
    const rij = gewichten(sector);
    const ol = $("rapport-lijst");
    ol.innerHTML = "";
    rij.forEach((r, i) => {
      const li = document.createElement("li");
      li.className = "rapport";
      const a = document.createElement("a");
      a.href = r.url; a.target = "_blank"; a.rel = "noopener";
      const pct = Math.round(r.aandeel * 100);
      a.innerHTML = `
        <span class="citaat"><span class="citaat-tekst"></span><span class="pagina"></span></span>
        <span class="omslag"><span class="open-rapport">Open rapport ↗</span></span>
        <span class="rapport-onder">
          <span class="rapport-titel"></span>
          <span class="rapport-meta"></span>
          <span class="rapport-gewicht" aria-label="Gewicht ${pct} procent">
            <span class="balk"><span></span></span>
            <span class="procent">${pct}%</span>
          </span>
        </span>`;
      a.setAttribute("aria-label", `${r.titel}, ${r.organisatie}. Opent het rapport in een nieuw tabblad.`);
      a.style.setProperty("--vertraging", `${-(i * 1.3) % 6}s`);

      const citaat = a.querySelector(".citaat");
      // Alleen een letterlijk, gecontroleerd citaat krijgt aanhalingstekens; anders een korte samenvatting
      if (r.citaat && r.citaat.tekst && r.citaat.geverifieerd !== false) {
        a.querySelector(".citaat-tekst").textContent = r.citaat.tekst;
        a.querySelector(".pagina").textContent = r.citaat.pagina ? `p. ${r.citaat.pagina}` : "";
      } else if (r.kern) {
        citaat.classList.add("samenvatting");
        a.querySelector(".citaat-tekst").textContent = r.kern;
        a.querySelector(".pagina").textContent = "samenvatting";
      } else citaat.remove();

      // Voorpagina: echte afbeelding als die er is, anders een getekende voorpagina
      const omslag = a.querySelector(".omslag");
      const getekend = () => {
        const g = document.createElement("span");
        g.className = "omslag-getekend";
        g.innerHTML = `<span class="omslag-org"></span><span class="omslag-titel"></span><span class="omslag-jaar"></span>`;
        g.querySelector(".omslag-org").textContent = r.organisatie;
        g.querySelector(".omslag-titel").textContent = r.titel;
        g.querySelector(".omslag-jaar").textContent = new Date(r.datum).getFullYear();
        omslag.prepend(g);
      };
      if (r.omslag) {
        const img = new Image();
        img.alt = ""; img.loading = "lazy"; img.src = r.omslag;
        img.onerror = () => { img.remove(); getekend(); };
        omslag.prepend(img);
      } else getekend();

      a.querySelector(".rapport-titel").textContent = r.titel;
      a.querySelector(".rapport-meta").textContent = `${r.organisatie} · ${r.datum_benaderd ? new Date(r.datum).getFullYear() : maand(r.datum)}`;
      li.appendChild(a);
      li.dataset.breedte = (r.aandeel / rij[0].aandeel * 100).toFixed(1);
      li.style.transitionDelay = `${(i % 4) * 90}ms`;
      ol.appendChild(li);
      waarnemer.observe(li);
    });
    $("aantal").textContent = rij.length === 1 ? "gebaseerd op 1 rapport" : `gebaseerd op ${rij.length} rapporten`;
    $("opleidingen").textContent = sector.omvat || `Deze sector omvat de opleidingen: ${sector.opleidingen.join(", ")}.`;
  }

  const waarnemer = new IntersectionObserver(items => {
    for (const it of items) if (it.isIntersecting) {
      it.target.classList.add("zichtbaar");
      it.target.querySelector(".balk span").style.width = it.target.dataset.breedte + "%";
      waarnemer.unobserve(it.target);
    }
  }, { threshold: 0.15 });

  // ---------- Sectorkiezer ----------
  function open() {
    clearTimeout(sluitTimer);
    kiezer.classList.add("open"); knop.setAttribute("aria-expanded", "true");
  }
  function sluit() {
    kiezer.classList.remove("open"); knop.setAttribute("aria-expanded", "false");
    focusIndex = -1; markeer();
  }
  function markeer() {
    [...lijst.children].forEach((li, i) => li.classList.toggle("actief-focus", i === focusIndex));
  }
  function kies(id) {
    sluit();
    history.replaceState(null, "", "#" + id);
    toon(id);
  }

  function bouwKiezer() {
    lijst.innerHTML = "";
    for (const s of DATA.sectoren) {
      const li = document.createElement("li");
      li.role = "option"; li.dataset.id = s.id; li.textContent = s.naam; li.tabIndex = -1;
      li.style.setProperty("--kleur", s.kleur || "#ffc46b");
      li.addEventListener("click", () => { kies(s.id); knop.focus(); });
      lijst.appendChild(li);
    }
    if (fijneMuis) {
      kiezer.addEventListener("mouseenter", open);
      kiezer.addEventListener("mouseleave", () => { sluitTimer = setTimeout(sluit, 220); });
    }
    knop.addEventListener("click", () => kiezer.classList.contains("open") ? sluit() : open());
    knop.addEventListener("keydown", e => {
      const n = lijst.children.length;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault(); open();
        focusIndex = (focusIndex + (e.key === "ArrowDown" ? 1 : -1) + n) % n; markeer();
      } else if ((e.key === "Enter" || e.key === " ") && focusIndex >= 0) {
        e.preventDefault(); kies(lijst.children[focusIndex].dataset.id);
      } else if (e.key === "Escape") sluit();
    });
    document.addEventListener("click", e => { if (!kiezer.contains(e.target)) sluit(); });
  }

  // ---------- Start ----------
  fetch("data/sectoren.json", { cache: "no-cache" })
    .then(r => r.json())
    .then(d => {
      DATA = d;
      bouwKiezer();
      $("bijgewerkt").textContent = "Bijgewerkt " + new Date(d.bijgewerkt).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
      // Een link naar een sector (#recht) opent die sector; anders begint de bezoeker bij een willekeurige sector
      const gevraagd = location.hash.slice(1);
      const start = d.sectoren.some(s => s.id === gevraagd)
        ? gevraagd
        : d.sectoren[Math.floor(Math.random() * d.sectoren.length)].id;
      toon(start, true);
      window.addEventListener("hashchange", () => toon(location.hash.slice(1)));
    })
    .catch(() => { kern.textContent = "… dat konden we even niet laden. Probeer het later opnieuw."; });
})();
