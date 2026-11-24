# language: de
Funktionalität: Ergebnisliste
  Unter „Gespeichert“ stehen die Ergebnisse der letzten 10 fertigen Workouts, das neueste oben.
  Ein Workout zählt als fertig, wenn es von selbst endet oder bei For Time mit „Fertig“ beendet wird.
  Abgebrochene Workouts landen nicht in der Liste. Bei AMRAP und For Time lässt sich ein Eintrag
  aufklappen und zeigt die Rundenzeiten.

  Szenario: Ein fertiges Workout steht oben in den Ergebnissen
    Angenommen der Countdown ist aus
    Und For Time hat 3 Runden als Ziel und kein Cap
    Wenn ich "For Time" starte
    Und ich tippe Runden bei 1:00, 2:10 und 3:30
    Und ich auf "Zum Timer" tippe
    Und ich auf "Favoriten und Verlauf" tippe
    Dann hat die Ergebnisliste 1 Eintrag
    Und das oberste Ergebnis ist "3 RFT" mit "3:30 · 3 Runden"

  Szenario: Ein abgebrochenes Workout landet nicht in den Ergebnissen
    Angenommen der Countdown ist aus
    Wenn ich "AMRAP" starte
    Und ich tippe Runden bei 2:00
    Und ich auf "Beenden" tippe
    Und ich auf "Beenden" tippe
    Und ich auf "Favoriten und Verlauf" tippe
    Dann hat die Ergebnisliste 0 Einträge
    Und ich sehe "Noch keine Ergebnisse"

  Szenario: Die Liste behält nur die letzten 10 Workouts
    Angenommen der Countdown ist aus
    Und die Ergebnisliste enthält 10 Workouts
    Und AMRAP dauert 1 Minute
    Wenn ich "AMRAP" starte
    Und ich tippe Runden bei 0:20 und 0:45
    Und 30 Sekunden vergehen
    Und ich auf "Zum Timer" tippe
    Und ich auf "Favoriten und Verlauf" tippe
    Dann hat die Ergebnisliste 10 Einträge
    Und das oberste Ergebnis ist "AMRAP 1" mit "2 Runden"

  Szenario: Aufklappen zeigt die Rundenzeiten
    Angenommen der Countdown ist aus
    Und AMRAP dauert 2 Minuten
    Und AMRAP hat 2 Sätze mit 60 Sekunden Rest dazwischen
    Wenn ich "AMRAP" starte
    Und ich tippe Runden bei 0:50, 1:40 und 3:45
    Und 90 Sekunden vergehen
    Und ich auf "Zum Timer" tippe
    Und ich auf "Favoriten und Verlauf" tippe
    Dann ist das oberste Ergebnis "2 × AMRAP 2" mit "3 Runden"
    Und es sind keine Rundenzeiten aufgeklappt
    Wenn ich das oberste Ergebnis aufklappe
    Dann lauten die Rundenzeiten des obersten Ergebnisses:
      | Satz | Runde | Zeit | Gesamt |
      | 1    | 1     | 0:50 | 0:50   |
      | 1    | 2     | 0:50 | 1:40   |
      | 2    | 1     | 0:45 | 0:45   |
    Wenn ich das oberste Ergebnis aufklappe
    Dann sind keine Rundenzeiten aufgeklappt

  Szenario: „Letzte Runde zurück“ nimmt das Ergebnis wieder heraus
    Angenommen der Countdown ist aus
    Und For Time hat 2 Runden als Ziel und kein Cap
    Wenn ich "For Time" starte
    Und ich tippe Runden bei 0:30 und 1:00
    Und ich auf "Versehentlich? Letzte Runde zurück" tippe
    Und ich auf "Beenden" tippe
    Und ich auf "Beenden" tippe
    Und ich auf "Favoriten und Verlauf" tippe
    Dann hat die Ergebnisliste 0 Einträge

  Szenario: Tabata zeigt die Work-Zeit
    Angenommen der Countdown ist aus
    Und Tabata ist eingestellt auf 20 Sekunden Work, 10 Sekunden Rest und 2 Runden
    Wenn ich "Tabata" starte
    Und 60 Sekunden vergehen
    Und ich auf "Zum Timer" tippe
    Und ich auf "Favoriten und Verlauf" tippe
    Dann ist das oberste Ergebnis "20/10 × 2" mit "Work 0:40"
