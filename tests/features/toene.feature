# language: de
Funktionalität: Töne
  Die Töne bleiben bewusst sparsam. 3-2-1 piept nur im Countdown vor dem Start.
  Während des Workouts gibt es nur einen Ton beim Wechsel zwischen Work und Rest, dazu den Buzzer am Ende
  und einen kurzen Klick, wenn man eine Runde tippt.
  Kein 3-2-1 vor jedem Wechsel, kein Doppelpiep 10 Sekunden vor Schluss, kein Ton zur Halbzeit.

  Grundlage:
    Angenommen die Töne sind an

  Szenario: Tabata: 3-2-1 nur im Countdown, danach nur die Wechsel
    Angenommen der Countdown ist 5 Sekunden
    Und Tabata ist eingestellt auf 20 Sekunden Work, 10 Sekunden Rest und 2 Runden
    Wenn ich "Tabata" starte
    Und 60 Sekunden vergehen
    Dann waren diese Töne zu hören: "3, 2, 1, Work, Rest, Work, Ende"

  Szenario: Ohne Countdown gibt es kein 3-2-1
    Angenommen der Countdown ist aus
    Und Tabata ist eingestellt auf 20 Sekunden Work, 10 Sekunden Rest und 2 Runden
    Wenn ich "Tabata" starte
    Und 60 Sekunden vergehen
    Dann waren diese Töne zu hören: "Work, Rest, Work, Ende"

  Szenario: AMRAP: kein Ton zur Halbzeit und keiner 10 Sekunden vor Schluss
    Angenommen der Countdown ist aus
    Und AMRAP dauert 5 Minuten
    Wenn ich "AMRAP" starte
    Und ich tippe Runden bei 2:00 und 4:00
    Und 70 Sekunden vergehen
    Dann waren diese Töne zu hören: "Work, Runde, Runde, Ende"

  Szenario: EMOM: ein Ton zu Beginn jedes Intervalls
    Angenommen der Countdown ist aus
    Wenn ich "EMOM" starte
    Und 250 Sekunden vergehen
    Dann waren diese Töne zu hören: "Work, Work, Work, Work, Work"

  Szenario: Mehrere AMRAP-Sätze: Wechsel zum Rest und zurück
    Angenommen der Countdown ist aus
    Und AMRAP dauert 1 Minute
    Und AMRAP hat 2 Sätze mit 30 Sekunden Rest dazwischen
    Wenn ich "AMRAP" starte
    Und 160 Sekunden vergehen
    Dann waren diese Töne zu hören: "Work, Rest, Work, Ende"
