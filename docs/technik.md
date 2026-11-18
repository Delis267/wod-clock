# Technik

## Überblick

- Vanilla JavaScript als ES-Module, kein Framework, kein Build-Schritt
- Töne werden live mit der Web Audio API erzeugt, keine Sounddateien
- Speicherung in `localStorage`, kein Server, kein Tracking
- Offline-fähig über einen Service Worker (`sw.js`), installierbar als Web-App (`manifest.webmanifest`)
- Schriften: Archivo und Barlow Condensed über Google Fonts (SIL Open Font License)

## Lokal starten

Die App über einen Webserver öffnen, z. B. `npx serve`. Über `file://` laden die Module nicht.

Tests: `node tests/run.js`, siehe [tests.md](tests.md).

## Projektstruktur

```
wod-clock/
├── .github/workflows/
│   └── pages.yml          # Specs, Build und Deploy auf GitHub Pages
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
├── docs/
│   ├── technik.md         # diese Datei
│   └── tests.md           # Teststrategie und Beispiel
├── tests/
│   ├── features/          # Specs als .feature-Dateien
│   ├── steps.js           # Glue-Code: verbindet jeden Satz mit der App
│   ├── run.js             # startet Test-Server und Chrome, gibt das Ergebnis aus
│   └── lib/               # Mini-Gherkin-Parser, simulierte Uhr, Runner-Seite
├── sw.js                  # Service Worker für Offline-Nutzung
├── manifest.webmanifest   # Name, Icons, Vollbild für den Home-Bildschirm
├── .nojekyll              # nur nötig, falls ohne Actions direkt aus dem Branch veröffentlicht wird
├── icons/                 # App-Icons und Favicon
├── screenshots/           # Bilder für die README
├── README.md
└── LICENSE
```

## Auf GitHub Pages veröffentlichen

Der Workflow `.github/workflows/pages.yml` („Specs und Deploy“) führt bei jedem Push auf `main` zuerst die
Specs aus und veröffentlicht die Seite nur, wenn alle bestehen. Bei Pull Requests laufen nur die Specs.

Einmalig einrichten:

1. Öffentliches Repository anlegen und alle Dateien hochladen, inklusive `.github/`
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**
3. Unter **Actions** läuft „Specs und Deploy“, nach ca. 1 Minute ist der Timer erreichbar unter
   `https://delis267.github.io/wod-clock/`

### Updates und Cache

Datei ändern, committen, pushen. Der Workflow setzt bei jedem Deploy automatisch eine neue Cache-Version
in `sw.js` (Commit-Hash). Installierte Apps laden das Update beim übernächsten Öffnen: Beim ersten Öffnen
kommt noch die alte Version aus dem Cache, während die neue im Hintergrund geladen wird. Auf dem iPhone
die App dafür ganz schließen (aus dem App-Switcher wischen) und wieder öffnen.

**Neue Datei angelegt?** Dann an zwei Stellen eintragen, sonst fehlt sie online bzw. offline:
in `sw.js` unter `ASSETS` und, falls sie in einem neuen Ordner liegt, im `cp`-Befehl von `pages.yml`.

<details>
<summary>Alternative ohne Actions</summary>

Settings → Pages → Source: **Deploy from a branch**, Branch `main`, Ordner `/ (root)`.
Dann bei jedem Update in `sw.js` die Versionsnummer von Hand erhöhen, z. B. `wod-clock-v3`.
Die Specs laufen in diesem Fall nicht automatisch.
</details>
