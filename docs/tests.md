# Tests

## Strategie

Das Verhalten der App ist als lesbare Spezifikation in `tests/features/*.feature` beschrieben, auf Deutsch
im Gherkin-Stil. Diese Specs sind gleichzeitig die Tests: Sie bedienen die echte App wie ein Mensch und
prüfen, was sichtbar ist. Interne Funktionen werden nicht einzeln getestet.

- Keine Abhängigkeiten, nur Node und Chrome oder Edge.
- Die Uhr läuft im Test simuliert, Wartezeiten dauern also keine echte Zeit.
- Die Tests greifen über sichtbare Texte, `aria-label` und eigene `data-*`-Haken auf die App zu, nicht über
  CSS-Klassen. Das Design lässt sich ändern, ohne Tests anzupassen.
- In der CI laufen sie vor jedem Deploy und bei Pull Requests. Veröffentlicht wird nur, wenn alle bestehen.

Bei Tönen prüfen die Specs, welcher Ton wann ausgelöst wird (`window.__snd`, nur im Test vorhanden), nicht den Klang.
Nicht abgedeckt: der Klang selbst, Vibration, echtes Zeitverhalten im Hintergrund und das iPhone selbst.

## So funktioniert es

`node tests/run.js` startet einen kleinen Webserver und einen unsichtbaren Chrome. Für jedes Szenario wird
die App frisch geladen, jeder Satz wird über `tests/steps.js` (Glue-Code) in Klicks oder Prüfungen übersetzt.
Am Ende stehen ✓ oder ✗ im Terminal.

```
node tests/run.js              # alle Specs
node tests/run.js loeschen     # nur Dateien mit „loeschen“ im Namen
node tests/run.js --alle       # jeden Schritt ausgeben
```

## Beispiel

Spec in `tests/features/runden-loeschen.feature`:

```gherkin
Szenario: Der zweite Tipp löscht, die Runde verschmilzt mit der nächsten
  Wenn ich auf das × von Runde 2 tippe
  Und ich auf das × von Runde 2 tippe
  Dann zeigt der Rundenzähler 2
```

Glue-Code in `tests/steps.js` (vereinfacht):

```js
step('ich auf das × von Runde {int} tippe', (w, n) => w.$(`[data-del="${n-1}"]`).click());
step('zeigt der Rundenzähler {int}', (w, n) => eq(w.$('#ledR').getAttribute('aria-label'), String(n), 'Rundenzähler'));
```

Ein neuer Satz in einer Spec braucht eine passende `step(...)`-Zeile. Fehlt sie, meldet der Lauf das.
