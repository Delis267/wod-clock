# language: de
Funktionalität: Pausieren und Fortsetzen
  Ein Tippen auf die Uhr pausiert und setzt fort, in jedem Modus und jeder Phase.
  Ausnahme ist Work bei AMRAP und For Time: Dort zählt ein Tippen eine Runde,
  pausiert und fortgesetzt wird mit langem Drücken.

  Szenariogrundriss: Im Countdown pausiert ein Tippen bei <Modus>
    Angenommen der Countdown ist 10 Sekunden
    Wenn ich "<Modus>" starte
    Dann lautet der Hinweis "Uhr antippen pausiert"
    Wenn ich auf die Uhr tippe
    Dann ist die Uhr pausiert
    Und der Hinweis lautet "Antippen setzt fort"
    Wenn 30 Sekunden vergehen
    Dann zeigt die Uhr keine Phase
    Wenn ich auf die Uhr tippe
    Dann läuft die Uhr

    Beispiele:
      | Modus    |
      | Tabata   |
      | EMOM     |
      | AMRAP    |
      | For Time |

  Szenariogrundriss: In Work pausiert ein Tippen bei <Modus>
    Angenommen der Countdown ist aus
    Wenn ich "<Modus>" starte
    Und ich auf die Uhr tippe
    Dann ist die Uhr pausiert
    Und der Hinweis lautet "Antippen setzt fort"
    Wenn ich auf die Uhr tippe
    Dann läuft die Uhr

    Beispiele:
      | Modus  |
      | Tabata |
      | EMOM   |

  Szenariogrundriss: In Work zählt ein Tippen bei <Modus> eine Runde
    Angenommen der Countdown ist aus
    Wenn ich "<Modus>" starte
    Und ich 2-mal auf die Uhr tippe
    Dann läuft die Uhr
    Und der Rundenzähler zeigt 2
    Und der Hinweis lautet "Tippen zählt eine Runde, lange halten pausiert"

    Beispiele:
      | Modus    |
      | AMRAP    |
      | For Time |

  Szenario: In Work bei AMRAP setzt ein Tippen die Pause nicht fort
    Ein versehentliches Doppeltippen soll nicht gleichzeitig fortsetzen und eine Runde zählen.
    Angenommen der Countdown ist aus
    Wenn ich "AMRAP" starte
    Und ich die Uhr lange drücke
    Dann ist die Uhr pausiert
    Und der Hinweis lautet "Lange halten setzt fort"
    Wenn ich auf die Uhr tippe
    Dann ist die Uhr pausiert
    Und der Rundenzähler zeigt 0
    Wenn ich die Uhr lange drücke
    Dann läuft die Uhr
