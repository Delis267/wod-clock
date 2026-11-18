# language: de
Funktionalität: Phasenanzeige
  Oben in der Uhr steht WORK oder REST. Im Countdown bleibt die Stelle leer.
  Die Titelzeile zeigt immer den Namen des Workouts.

  Szenario: Countdown ohne Phase, danach WORK
    Angenommen der Countdown ist 10 Sekunden
    Wenn ich "AMRAP" starte
    Dann zeigt die Uhr keine Phase
    Und die Uhr zeigt die Zeit 0:10
    Und der Titel lautet "AMRAP 12"
    Wenn 10 Sekunden vergehen
    Dann zeigt die Uhr "WORK"
    Und die Uhr zeigt die Zeit 12:00
    Und der Titel lautet "AMRAP 12"

  Szenario: Tabata wechselt zwischen WORK und REST
    Angenommen der Countdown ist aus
    Und Tabata ist eingestellt auf 20 Sekunden Work, 10 Sekunden Rest und 8 Runden
    Wenn ich "Tabata" starte
    Dann zeigt die Uhr "WORK"
    Und der Rundenzähler zeigt 1
    Wenn 20 Sekunden vergehen
    Dann zeigt die Uhr "REST"
    Und die Uhr zeigt die Zeit 0:10
    Wenn 10 Sekunden vergehen
    Dann zeigt die Uhr "WORK"
    Und der Rundenzähler zeigt 2

  Szenario: Beim Beenden zeigt der Titel kurz einen Hinweis
    Angenommen der Countdown ist aus
    Wenn ich "EMOM" starte
    Und ich auf "Beenden" tippe
    Dann lautet der Titel "Nochmal tippen zum Beenden"
    Wenn 3 Sekunden vergehen
    Dann lautet der Titel "EMOM 10"
