<p align="center">
  <img src="icons/icon-512.png" width="120" alt="wod-clock Icon">
</p>

<h1 align="center">wod-clock</h1>

<p align="center">
  Minimalistischer Workout-Timer für CrossFit und Functional Fitness.<br>
  For Time, AMRAP, EMOM und Tabata – im Look der LED-Wanduhr aus der Box.
</p>

<p align="center">
  <b><a href="https://delis267.github.io/wod-clock/">→ Timer öffnen</a></b>
</p>

<p align="center">
  <img src="screenshots/einstellen.png" width="240" alt="Timer einstellen">
  &nbsp;
  <img src="screenshots/for-time.png" width="240" alt="For Time mit Rundenzähler">
</p>
<p align="center">
  <img src="screenshots/amrap-quer.png" width="500" alt="AMRAP im Querformat">
</p>

## Funktionen

- **Vier Modi**
  - **For Time** – Stoppuhr mit optionalem Time Cap und Rundenziel (z. B. 5 RFT)
  - **AMRAP** – Dauer frei wählbar, optional mehrere Sätze mit Rest dazwischen
  - **EMOM** – jede Runde startet im gewählten Intervall (EMOM, E2MOM, E3MOM …)
  - **Tabata** – Work, Rest, Runden und Sätze; Standard ist klassisch 20/10 × 8
- **7-Segment-Wanduhr** hochkant und quer, Rot für Work, Grün für Rest, Bernstein für Runden
- **Uhr antippen**
  - AMRAP / For Time: Tippen zählt eine Runde, lange halten pausiert
  - EMOM / Tabata: Tippen pausiert
  - Zwischenzeiten pro Runde, schnellste Runde markiert, „Zurück“ für Fehltipps
- **Box-Buzzer**: 3-2-1-Piepen, Buzzer bei Start und Ende, Doppelpiep 10 s vor Schluss
- **Gespeichert**: Workout-Zähler, Favoriten und die letzten 10 Timer in CrossFit-Kurzschreibweise
- **Hell- und Dunkelmodus** (automatisch oder fest), läuft ohne Scrollen auf dem Handy
- **Offline-fähig** nach dem ersten Aufruf, installierbar auf dem Home-Bildschirm

## Auf dem Handy installieren

1. Link im Browser öffnen
2. **iPhone (Safari):** Teilen → „Zum Home-Bildschirm“
   **Android (Chrome):** Menü ⋮ → „App installieren“ bzw. „Zum Startbildschirm hinzufügen“
3. wod-clock vom Home-Bildschirm starten – dann im Vollbild ohne Browserleiste

## Technik

- Vanilla JavaScript als ES-Module, kein Framework, kein Build-Schritt
- Lokal testen über einen Webserver, z. B. `npx serve` (Module laden nicht über `file://`)
- Töne werden live mit der Web Audio API erzeugt, keine Sounddateien
- Speicherung in `localStorage`, keine Server, kein Tracking
- Schriften: Archivo und Barlow Condensed über Google Fonts (SIL Open Font License)

## Specs (Tests)

Das Verhalten ist als lesbare Spezifikation in `tests/features/*.feature` beschrieben, auf Deutsch im
Gherkin-Stil (`Angenommen` / `Wenn` / `Dann`). Die Specs sind ausführbar:

```
node tests/run.js              # alle Specs
node tests/run.js loeschen     # nur Dateien, deren Name „loeschen“ enthält
node tests/run.js --alle       # jeden Schritt ausgeben
```

Keine Abhängigkeiten, nur Node (ab 16) und Chrome oder Edge (anderer Pfad: Umgebungsvariable `CHROME`).
Die Uhr läuft im Test simuliert, „Wenn 90 Sekunden vergehen“ dauert also keine echte Zeit.
Ein neuer Satz in einer `.feature`-Datei braucht eine passende Definition in `tests/steps.js` (Glue-Code);
fehlt sie, sagt der Lauf das.

## Auf GitHub Pages veröffentlichen

Das Repo bringt einen fertigen GitHub-Actions-Workflow mit (`.github/workflows/pages.yml`).
Er veröffentlicht die Seite bei jedem Push auf `main` automatisch.

1. Neues öffentliches Repository `wod-clock` anlegen
2. Alle Dateien dieses Ordners hochladen, inklusive `.github/` (Struktur unten)
3. **Settings → Pages → Build and deployment → Source: GitHub Actions**
4. Unter **Actions** läuft „Deploy to GitHub Pages“ – nach ca. 1 Minute ist der Timer erreichbar unter
   `https://delis267.github.io/wod-clock/`

```
wod-clock/
├── .github/workflows/
│   └── pages.yml          # Build & Deploy auf GitHub Pages
├── index.html             # HTML-Gerüst aller Screens
├── css/app.css            # Styles
├── js/
│   ├── main.js            # Einstieg: lädt die Screens, Theme, Service Worker
│   ├── util.js            # Helfer: DOM, Zeitformat, localStorage
│   ├── led.js             # 7-Segment-Anzeige
│   ├── state.js           # Einstellungen, Favoriten, Verlauf, Zähler
│   ├── workout.js         # Fachlogik ohne DOM: Modi, Bezeichnungen, Ablauf
│   ├── sound.js           # Töne, Vibration, Bildschirm wach halten
│   ├── wheel.js           # Scrollrad-Dialog
│   ├── setup.js           # Screen „Timer einstellen“
│   ├── saved.js           # Screen „Gespeichert“
│   └── run.js             # laufender Timer und Ergebnis-Screen
├── docs/bedienlogik.md    # was welche Eingabe im Timer bewirkt
├── tests/
│   ├── features/          # Specs als .feature-Dateien (lesbar wie eine Spezifikation)
│   ├── steps.js           # Glue-Code: verbindet jeden Satz mit der App
│   ├── run.js             # startet Test-Server und Chrome, gibt das Ergebnis aus
│   └── lib/               # Mini-Gherkin-Parser, simulierte Uhr, Runner-Seite
├── sw.js                  # Service Worker für Offline-Nutzung
├── manifest.webmanifest   # Name, Icons, Vollbild für den Home-Bildschirm
├── .nojekyll              # nur nötig, falls ohne Actions direkt aus dem Branch veröffentlicht wird
├── icons/                 # App-Icons und Favicon
├── screenshots/           # Bilder für diese README
├── README.md
└── LICENSE
```

### Updates veröffentlichen (Cache updaten)

Datei ändern, committen, pushen – fertig. Der Workflow setzt bei jedem Deploy automatisch eine
neue Cache-Version in `sw.js` (Commit-Hash), damit installierte Apps das Update beim nächsten Öffnen laden.

**Neue Datei angelegt?** Dann an zwei Stellen eintragen, sonst fehlt sie online bzw. offline:
in `sw.js` unter `ASSETS` und, falls sie in einem neuen Ordner liegt, im `cp`-Befehl von `.github/workflows/pages.yml`.

<details>
<summary>Alternative ohne Actions</summary>

Settings → Pages → Source: **Deploy from a branch**, Branch `main`, Ordner `/ (root)`.
Dann bei jedem Update in `sw.js` die Versionsnummer von Hand erhöhen, z. B. `wod-clock-v2`.
</details>

## Lizenz

[MIT](LICENSE)
