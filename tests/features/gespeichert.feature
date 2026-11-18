# language: de
Funktionalität: Verlauf und Favoriten
  Jeder gestartete Timer landet im Verlauf (die letzten 10). Favoriten werden per Stern angelegt.

  Szenario: Lange Listen werden vollständig angezeigt und die Seite scrollt
    Angenommen der Verlauf enthält 10 Workouts
    Und es gibt 6 Favoriten
    Wenn ich auf "Favoriten und Verlauf" tippe
    Dann ist die Liste "Verlauf" vollständig sichtbar
    Und die Liste "Favoriten" ist vollständig sichtbar
    Und die Seite lässt sich scrollen

  Szenario: Ein gestartetes Workout steht oben im Verlauf
    Angenommen der Countdown ist aus
    Und der Verlauf enthält 3 Workouts
    Wenn ich "AMRAP" starte
    Und ich auf "Beenden" tippe
    Und ich auf "Beenden" tippe
    Und ich auf "Favoriten und Verlauf" tippe
    Dann steht "AMRAP 12" ganz oben im Verlauf
