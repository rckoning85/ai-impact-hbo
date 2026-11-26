/* Weging van rapporten. Uitleg: METHODE.md.
   Gewicht = recentheid × bereik (NL/EU/mondiaal) × sectorspecificiteit × brontype,
   daarna omgerekend naar een aandeel binnen de sector. */
window.Weging = {
  bereken(DATA, sector, nu = new Date()) {
    const m = DATA.methode;
    const rij = sector.rapporten.map(koppeling => {
      const r = DATA.rapporten[koppeling.id];
      if (!r) return null;
      const maanden = Math.max(0, (nu - new Date(r.datum)) / (1000 * 60 * 60 * 24 * 30.44));
      const recent = Math.pow(0.5, maanden / m.halfwaardetijd_maanden);
      const ruwe = recent
        * (m.bereik[r.bereik] ?? 0.5)
        * (m.specificiteit[koppeling.specificiteit] ?? 0.6)
        * (m.brontype[r.brontype] ?? 0.8);
      return { ...r, id: koppeling.id, specificiteit: koppeling.specificiteit, ruwe };
    }).filter(r => r && r.ruwe >= m.drempel);
    const totaal = rij.reduce((s, r) => s + r.ruwe, 0) || 1;
    return rij.map(r => ({ ...r, aandeel: r.ruwe / totaal })).sort((a, b) => b.aandeel - a.aandeel);
  }
};
