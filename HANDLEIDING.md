# Handleiding voor de beheerder

Korte uitleg over hoe de site werkt en wat je kunt doen als er iets misgaat. Programmeren is niet nodig.

## Waar staat wat

| Wat | Waar |
|---|---|
| De website | https://rckoning85.github.io/ai-impact-hbo/ |
| Het project (alle bestanden) | https://github.com/rckoning85/ai-impact-hbo |
| De wekelijkse scan | https://claude.ai/code/routines/trig_01N4VgYjbRfnGAp24meXyH68 |
| Hoe bronnen worden gewogen | [METHODE.md](METHODE.md) |
| Wat de scan precies doet | [SCAN.md](SCAN.md) |

## Elke week, vanzelf

Elke maandag om 07:00 (in de zomer 08:00) start de scan in de cloud, op je Claude Pro-abonnement:

1. de scan zoekt nieuw onderzoek, beoordeelt voorstellen, zoekt citaten en maakt voorpagina's;
2. hij zet de wijzigingen op een aparte tak `claude/scan-…`;
3. een controle op GitHub (zonder AI) kijkt of alleen data en voorpagina's zijn gewijzigd en of alles klopt;
4. zo ja, dan staat de nieuwe versie binnen een paar minuten online.

Je hoeft niets te doen. Wil je zien wat er veranderde: open de scan via de link hierboven en kies de laatste run,
of kijk op GitHub bij **Commits**.

## Een bron voorstellen

1. Ga op de site naar **Alle doorzochte bronnen** en klik op **Bron voorstellen**.
2. Kies *Eén rapport* of *Organisatie*, plak de link en klik op **Submit new issue**.
3. Na een minuut staat er een bevestiging. Bij de volgende scan wordt de bron beoordeeld; de uitkomst zie je op de bronnenpagina.

Collega's kunnen ook een bron voorstellen als ze een GitHub-account hebben. Hun voorstel blijft openstaan tot jij het
goedkeurt: open het voorstel op GitHub (tabblad **Issues**), klik rechts bij **Labels** en kies **goedgekeurd**.
Wil je een collega rechtstreeks laten voorstellen, voeg die dan toe via **Settings → Collaborators**.

## De scan meteen laten draaien

Open de scan via de link hierboven en klik op **Run now**.

## Als er iets misgaat

| Wat je ziet | Wat je doet |
|---|---|
| De datum *Bijgewerkt* rechtsonder blijft oud | Open de scan en bekijk de laatste run. Staat daar een fout, vraag Claude in een nieuwe sessie om te helpen en plak de foutmelding. |
| Op GitHub staat bij **Actions** een rood kruisje bij *Scan publiceren* | De controle heeft de wijzigingen tegengehouden; de site blijft zoals hij was. Klik erop om de reden te zien. |
| Een zin of citaat klopt niet | Open het rapport via de site om het na te gaan. Laat het aanpassen door Claude, of pas `data/sectoren.json` op GitHub aan via het potloodje. |
| De site is helemaal leeg of wit | Waarschijnlijk is een databestand beschadigd. Ga op GitHub naar **Commits**, open de laatste wijziging en kies **Revert**, of vraag Claude om hulp. |

## Goed om te weten

- De scan draait op je Pro-abonnement en telt mee voor je gebruikslimiet. Stopt het abonnement, dan stopt de scan;
  de site blijft online met de laatste stand.
- De site gebruikt geen cookies en volgt bezoekers niet. Lettertypes en de kaart worden niet bij externe diensten opgehaald.
- Pauzeren of verwijderen van de scan kan op https://claude.ai/code/routines.
