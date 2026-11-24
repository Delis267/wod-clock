# language: de
Funktionalität: Ablauf-Leiste in der laufenden Uhr
  Unten in der Uhr zeigt eine Leiste den Ablauf des Workouts, wie beim Einstellen: rot für Work, grün für Rest.
  Erledigtes wird gedimmt, ein Strich zeigt, wo man gerade steht. Getippte Runden erscheinen als Striche.
  Der Countdown vor dem Start gehört nicht dazu.
  Bei For Time mit Time Cap und Rundenziel teilt die Leiste den Cap gleichmäßig auf die Runden auf.
  Das ist das Tempo, mit dem man genau im Cap fertig wird.

  Szenario: Tabata zeigt Work und Rest im Wechsel
    Angenommen der Countdown ist aus
    Und Tabata ist eingestellt auf 20 Sekunden Work, 10 Sekunden Rest und 3 Runden
    Wenn ich "Tabata" starte
    Dann zeigt die Ablauf-Leiste die Abschnitte "Work 0:20, Rest 0:10, Work 0:20, Rest 0:10, Work 0:20"
    Wenn 45 Sekunden vergehen
    Dann steht die Ablauf-Leiste bei 0:45 von 1:20

  Szenario: Der Countdown gehört nicht zur Leiste
    Angenommen der Countdown ist 10 Sekunden
    Und Tabata ist eingestellt auf 20 Sekunden Work, 10 Sekunden Rest und 2 Runden
    Wenn ich "Tabata" starte
    Und 5 Sekunden vergehen
    Dann steht die Ablauf-Leiste bei 0:00 von 0:50
    Wenn 10 Sekunden vergehen
    Dann steht die Ablauf-Leiste bei 0:05 von 0:50

  Szenario: EMOM zeigt einen Abschnitt pro Intervall
    Angenommen der Countdown ist aus
    Wenn ich "EMOM" starte
    Und 150 Sekunden vergehen
    Dann hat die Ablauf-Leiste 10 Abschnitte
    Und die Ablauf-Leiste steht bei 2:30 von 10:00

  Szenario: AMRAP zeigt getippte Runden als Striche, auch über mehrere Sätze
    Angenommen der Countdown ist aus
    Und AMRAP dauert 2 Minuten
    Und AMRAP hat 2 Sätze mit 60 Sekunden Rest dazwischen
    Wenn ich "AMRAP" starte
    Dann zeigt die Ablauf-Leiste die Abschnitte "Work 2:00, Rest 1:00, Work 2:00"
    Wenn ich tippe Runden bei 0:50, 1:40 und 3:45
    Dann zeigt die Ablauf-Leiste Rundenstriche bei 0:50, 1:40 und 3:45

  Szenario: For Time mit Time Cap und Rundenziel teilt den Cap auf die Runden auf
    Angenommen der Countdown ist aus
    Und For Time hat 5 Runden als Ziel und 20 Minuten Cap
    Wenn ich "For Time" starte
    Dann zeigt die Ablauf-Leiste die Abschnitte "Work 4:00, Work 4:00, Work 4:00, Work 4:00, Work 4:00"
    Wenn ich tippe Runden bei 4:30 und 7:50
    Und 70 Sekunden vergehen
    Dann steht die Ablauf-Leiste bei 9:00 von 20:00
    Und die Ablauf-Leiste zeigt Rundenstriche bei 4:30 und 7:50

  Szenario: For Time nur mit Time Cap zeigt einen Balken bis zum Cap
    Angenommen der Countdown ist aus
    Und For Time hat kein Rundenziel und 10 Minuten Cap
    Wenn ich "For Time" starte
    Und ich tippe Runden bei 2:00
    Dann zeigt die Ablauf-Leiste die Abschnitte "Work 10:00"
    Und die Ablauf-Leiste zeigt Rundenstriche bei 2:00

  Szenario: For Time nur mit Rundenziel zeigt erledigte Runden, ohne Zeit
    Angenommen der Countdown ist aus
    Und For Time hat 5 Runden als Ziel und kein Cap
    Wenn ich "For Time" starte
    Und ich tippe Runden bei 2:00 und 4:10
    Dann hat die Ablauf-Leiste 5 Abschnitte
    Und in der Ablauf-Leiste sind 2 Runden erledigt

  Szenario: For Time ohne Cap und ohne Rundenziel hat keine Leiste
    Angenommen der Countdown ist aus
    Und For Time hat kein Cap und kein Rundenziel
    Wenn ich "For Time" starte
    Dann gibt es keine Ablauf-Leiste

  Szenario: Ein gelöschter Fehltipp verschwindet auch aus der Leiste
    Angenommen der Countdown ist aus
    Wenn ich "AMRAP" starte
    Und ich tippe Runden bei 2:00, 2:05 und 4:10
    Und ich auf das × von Runde 2 tippe
    Und ich auf das × von Runde 2 tippe
    Dann zeigt die Ablauf-Leiste Rundenstriche bei 2:00 und 4:10
