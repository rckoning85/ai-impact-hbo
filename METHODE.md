# Methode

Deze site geeft per sector één zin over de verwachte impact van AI op het Nederlandse werkveld,
gebaseerd op betrouwbaar onderzoek. Dit document legt uit hoe bronnen worden gekozen en gewogen.

## Welke bronnen tellen mee

Alleen onderzoek of beleidsrapporten van betrouwbare instellingen:

- planbureaus, overheid en adviesraden (zoals CPB, SCP, SER, WRR, UWV, CBS, DNB, ministeries);
- universiteiten, hogescholen en publieke onderzoeksinstellingen (zoals ROA, TNO, Rathenau Instituut);
- internationale organisaties (OESO, ILO, Europese Commissie, IMF, World Economic Forum);
- onderzoeksbureaus en brancheorganisaties met eigen onderzoek;
- grote consultancies (zoals McKinsey, PwC, Deloitte, BCG, Accenture, Berenschot, KPMG, EY).

Tellen **niet** mee: opinie, nieuwsberichten, blogs, marketing, en onderzoek dat een leverancier van AI-producten
zelf laat uitvoeren. Een nieuwsbericht mag wel als wegwijzer naar het onderliggende rapport dienen.

Een internationaal rapport telt alleen mee als het iets zegt over Nederland of over vergelijkbare
(West-Europese, rijke) arbeidsmarkten.

## Weging

Per sector krijgt elk rapport een gewicht. Dat is het product van vier factoren:

| Factor | Waarden |
|---|---|
| Recentheid | `0,5 ^ (leeftijd in maanden / 18)`: na 18 maanden de helft, na 36 maanden een kwart |
| Bereik | Nederland 1,0 · Europa 0,7 · mondiaal 0,5 |
| Sector | specifiek over de sector 1,0 · algemeen 0,6 |
| Soort bron | planbureau, overheid, wetenschap, internationaal 1,0 · onderzoeksbureau, consultancy 0,8 · commercieel 0,6 |

Rapporten met een gewicht onder 0,05 vallen af. De overige gewichten worden omgerekend naar een
percentage van het totaal in die sector: dat is het balkje op de site.

De gewichten worden in de browser berekend. Daardoor zakken oudere rapporten vanzelf, ook als er een week
niets nieuws verschijnt. De waarden staan in `data/sectoren.json` onder `methode`.

## De zin en de vaardigheden

De wekelijkse scan leest de rapporten van een sector, met meer aandacht voor rapporten met een hoog gewicht,
en schrijft één zin die aansluit op: *"De impact van AI op de sector … lijkt, op basis van de huidige verwachtingen, …"*.
De zin verandert alleen als het bewijs daar aanleiding toe geeft.

## Citaten

Een citaat staat alleen tussen aanhalingstekens op de site als de scan heeft gecontroleerd dat de zin
letterlijk in de tekst van het rapport staat, op de genoemde pagina. Anders toont de site een korte
samenvatting, gemarkeerd als "samenvatting".

Een rapport kan per sector een eigen citaat hebben, dat specifiek over die sector gaat. Dat gaat voor het
algemene citaat van het rapport. Ook voor dit citaat geldt: alleen als het letterlijk op de genoemde pagina staat.

## Bestanden

| Bestand | Inhoud |
|---|---|
| `data/sectoren.json` | sectoren, zinnen, vaardigheden, opgenomen rapporten en weging |
| `data/bronnen-log.json` | bekeken bronnen die (nog) niet meetellen, met reden |
| `data/organisaties.json` | organisaties die elke week worden doorzocht |
| `data/voorstellen.json` | bronvoorstellen via het formulier |
| `omslagen/` | voorpagina's van rapporten |
