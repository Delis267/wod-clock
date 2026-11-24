# language: de
Funktionalität: Countdown direkt beim Einstellen wählen
  Der Countdown vor dem Start lässt sich in jedem Modus direkt über dem Start-Knopf wählen: 3, 5, 10 oder 30 Sekunden.
  Die Wahl gilt für alle Modi und bleibt gespeichert. Im Menü „Gespeichert“ steht er nicht mehr.

  Szenariogrundriss: Countdown bei <Modus> wählen
    Angenommen der Countdown ist 10 Sekunden
    Wenn ich den Modus "<Modus>" wähle
    Und ich den Countdown auf 5 Sekunden stelle
    Und ich "<Modus>" starte
    Dann zeigt die Uhr keine Phase
    Und die Uhr zeigt die Zeit 0:05
    Wenn 5 Sekunden vergehen
    Dann zeigt die Uhr "WORK"

    Beispiele:
      | Modus    |
      | For Time |
      | AMRAP    |
      | EMOM     |
      | Tabata   |

  Szenario: Die Wahl gilt für alle Modi
    Angenommen der Countdown ist 10 Sekunden
    Wenn ich den Modus "Tabata" wähle
    Und ich den Countdown auf 30 Sekunden stelle
    Und ich den Modus "AMRAP" wähle
    Dann ist beim Countdown 30 Sekunden gewählt

  Szenario: Im Menü steht der Countdown nicht mehr
    Wenn ich auf "Favoriten und Verlauf" tippe
    Dann steht nirgends "Countdown"
