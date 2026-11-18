# Bedienlogik im Timer-Screen

Diese Matrix zeigt, was jede Eingabe im laufenden Timer bewirkt, je nach Modus, Phase und Pausenzustand. Maßgeblich ist der Code in [js/run.js](../js/run.js), vor allem `tapClock()`, `togglePause()` und `draw()`. Den Ablauf der Phasen erzeugt `build()` in [js/workout.js](../js/workout.js).

## Phasen je Modus

| Modus | Ablauf |
|---|---|
| **Tabata** | Countdown → (Work → Rest) × Runden → Rest zwischen Sätzen → nächster Satz … |
| **EMOM** | Countdown → Work (1 Intervall pro Runde) × Runden |
| **AMRAP** | Countdown → Work → Rest zwischen Sätzen → nächster Satz … |
| **For Time** | Countdown → Work (bis Cap, Rundenziel oder „Fertig“) |

Der Countdown entfällt, wenn er in den Einstellungen auf „aus“ steht. Tabata und EMOM laufen fest nach Zeit. AMRAP und For Time zählen Runden per Tippen und heißen im Code „Lap-Modi“ (`lapMode()`).

## Eingabe-Matrix

`–` heißt: keine Wirkung.

### Uhr kurz antippen

| Phase | Tabata / EMOM | AMRAP / For Time |
|---|---|---|
| Countdown, läuft | pausiert | pausiert |
| Countdown, pausiert | setzt fort | setzt fort |
| Work, läuft | pausiert | zählt eine Runde (Ton, Vibration, Aufblitzen) |
| Work, pausiert | setzt fort | – (fortsetzen nur mit langem Drücken) |
| Rest, läuft | pausiert | pausiert (nur AMRAP hat Rest zwischen Sätzen) |
| Rest, pausiert | setzt fort | setzt fort |

Bei For Time mit Rundenziel beendet die Runde, die das Ziel erreicht, das Workout sofort. Auf dem Ergebnis-Screen lässt sich das mit „Rückgängig“ zurücknehmen.

### Uhr lange drücken (≥ 550 ms)

| Phase | Tabata / EMOM | AMRAP / For Time |
|---|---|---|
| jede Phase, läuft | pausiert (wie Antippen, beim Loslassen) | pausiert (Vibration, kein Rundenzähler) |
| jede Phase, pausiert | setzt fort (beim Loslassen) | setzt fort |

### Knöpfe unter der Uhr

Es gibt nur einen Knopf, und nur bei For Time. Er ist nur in der Work-Phase sichtbar und im Countdown ausgeblendet. Sein Platz bleibt dabei frei, damit die Uhr nicht springt. Tabata, EMOM und AMRAP haben keine Knöpfe unter der Uhr.

| Knopf | Modus | Work (läuft oder pausiert) | Countdown |
|---|---|---|---|
| **Fertig** | nur For Time | 1. Tippen: „Sicher? Nochmal tippen“, 2. Tippen innerhalb von 2,5 s: Workout beenden | ausgeblendet |

### Rundenliste: Fehltipp löschen (AMRAP, For Time)

In der Work-Phase steht unter der Uhr die Liste der getippten Runden, im Lauf und im pausierten Zustand. Jede Zeile hat rechts ein ×.

| Aktion | Wirkung |
|---|---|
| 1. Tippen aufs × | Zeile wird rot markiert, statt der Zeit steht „Löschen?“ |
| 2. Tippen aufs × derselben Zeile innerhalb von 2,5 s | Runde wird gelöscht |
| kein 2. Tippen | Markierung verfällt nach 2,5 s, nichts wird gelöscht |
| Tippen aufs × einer anderen Zeile | markiert stattdessen diese Zeile |

Gespeichert sind die Tipp-Zeitpunkte (`R.laps`), nicht die Rundenzeiten. Eine gelöschte Runde verschmilzt deshalb mit der folgenden. Beispiel: Tipps bei 2:00, 2:05 (Fehltipp) und 4:10 ergeben nach dem Löschen die Runden 2:00 und 2:10. Gesamtzeiten, Rundenzähler und die Markierung der besten Runde passen sich automatisch an.

Einen eigenen „Zurück“-Knopf gibt es nicht mehr. Zusätzlich bietet der Ergebnis-Screen „Versehentlich? Letzte Runde zurück“ an, wenn For Time mit Rundenziel durch das Tippen der letzten Runde endet.

### Kopfzeile (immer verfügbar)

| Knopf | Wirkung |
|---|---|
| **✕ Beenden** | 1. Tippen: Titel zeigt „Nochmal tippen zum Beenden“, 2. Tippen innerhalb von 2,5 s: zurück zur Einstellung. Nach Workout-Ende schließt ein Tippen sofort. |
| **Ton** | schaltet die Signaltöne an oder aus, in jeder Phase |

## Phasenanzeige

Oben mittig in der Uhr steht **WORK** (rot) oder **REST** (grün), im Countdown bleibt die Stelle leer. Die Titelzeile zeigt immer den Workout-Namen (z. B. „Tabata“), nach dem ersten Tippen auf ✕ kurz „Nochmal tippen zum Beenden“.

## Hinweistext unter der Uhr

| Zustand | Tabata / EMOM | AMRAP / For Time |
|---|---|---|
| Work, läuft | „Uhr antippen pausiert“ | „Tippen zählt eine Runde, lange halten pausiert“ und Rundenliste |
| Work, pausiert | „Antippen setzt fort“ | „Lange halten setzt fort“ und Rundenliste |
| Countdown / Rest, läuft | „Uhr antippen pausiert“ | „Uhr antippen pausiert“ |
| Countdown / Rest, pausiert | „Antippen setzt fort“ | „Antippen setzt fort“ |

## Warum Tippen in der Work-Phase der Lap-Modi nicht fortsetzt

In AMRAP und For Time ist Tippen in der Work-Phase die Rundenzählung. Würde ein Tippen im pausierten Zustand fortsetzen, könnte ein versehentliches Doppeltippen gleichzeitig fortsetzen und eine Runde zählen. Deshalb setzt dort nur langes Drücken fort. Außerhalb der Work-Phase gibt es nichts zu zählen, daher pausiert und startet dort ein einfaches Tippen.
