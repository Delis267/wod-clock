# language: de
Funktionalität: Rundenzeiten im AMRAP-Ergebnis
  Nach einem AMRAP stehen die getippten Runden mit ihren Zeiten auch im Ergebnis,
  damit man die Zwischenzeiten in Ruhe nachlesen kann. Die Liste ist chronologisch, Runde 1 oben.
  Bei mehreren Sätzen zählen die Zeiten ab Beginn des jeweiligen Satzes.

  Szenario: Die Rundenzeiten stehen im Ergebnis
    Angenommen der Countdown ist aus
    Und AMRAP dauert 5 Minuten
    Wenn ich "AMRAP" starte
    Und ich tippe Runden bei 1:00, 2:10 und 3:30
    Und 120 Sekunden vergehen
    Dann erscheint das Ergebnis "Time!"
    Und das Ergebnis zeigt "Runden in 5:00" mit "3"
    Und die Rundenliste im Ergebnis lautet:
      | Runde | Zeit | Gesamt |
      | 1     | 1:00 | 1:00   |
      | 2     | 1:10 | 2:10   |
      | 3     | 1:20 | 3:30   |

  Szenario: Bei mehreren Sätzen stehen die Runden je Satz im Ergebnis
    Angenommen der Countdown ist aus
    Und AMRAP dauert 2 Minuten
    Und AMRAP hat 2 Sätze mit 60 Sekunden Rest dazwischen
    Wenn ich "AMRAP" starte
    Und ich tippe Runden bei 0:50, 1:40 und 3:45
    Und 90 Sekunden vergehen
    Dann erscheint das Ergebnis "Time!"
    Und die Rundenliste im Ergebnis lautet:
      | Satz | Runde | Zeit | Gesamt |
      | 1    | 1     | 0:50 | 0:50   |
      | 1    | 2     | 0:50 | 1:40   |
      | 2    | 1     | 0:45 | 0:45   |

  Szenario: Ohne getippte Runde gibt es keine Rundenliste
    Angenommen der Countdown ist aus
    Und AMRAP dauert 1 Minute
    Wenn ich "AMRAP" starte
    Und 70 Sekunden vergehen
    Dann erscheint das Ergebnis "Time!"
    Und im Ergebnis gibt es keine Rundenliste
