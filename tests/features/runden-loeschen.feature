# language: de
Funktionalität: Fehltipp in der Rundenliste löschen
  Bei AMRAP und For Time steht unter der Uhr die Liste der getippten Runden.
  Ein × löscht eine Runde, aber erst nach einem zweiten Tippen.
  Gespeichert sind die Tipp-Zeitpunkte, deshalb verschmilzt eine gelöschte Runde mit der folgenden.

  Grundlage:
    Angenommen der Countdown ist aus
    Und ich "AMRAP" starte
    Und ich tippe Runden bei 2:00, 2:05 und 4:10

  Szenario: Die Liste zeigt die neueste Runde oben
    Dann lautet die Rundenliste:
      | Runde | Zeit | Gesamt |
      | 3     | 2:05 | 4:10   |
      | 2     | 0:05 | 2:05   |
      | 1     | 2:00 | 2:00   |

  Szenario: Der erste Tipp aufs × markiert nur
    Wenn ich auf das × von Runde 2 tippe
    Dann ist Runde 2 zum Löschen markiert
    Und der Rundenzähler zeigt 3

  Szenario: Der zweite Tipp löscht, die Runde verschmilzt mit der nächsten
    Wenn ich auf das × von Runde 2 tippe
    Und ich auf das × von Runde 2 tippe
    Dann zeigt der Rundenzähler 2
    Und die Rundenliste lautet:
      | Runde | Zeit | Gesamt |
      | 2     | 2:10 | 4:10   |
      | 1     | 2:00 | 2:00   |

  Szenario: Ohne zweiten Tipp verfällt die Markierung nach 2,5 Sekunden
    Wenn ich auf das × von Runde 2 tippe
    Und 3 Sekunden vergehen
    Dann ist keine Runde zum Löschen markiert
    Und der Rundenzähler zeigt 3

  Szenario: Auch im pausierten Zustand lässt sich löschen
    Wenn ich die Uhr lange drücke
    Dann ist die Uhr pausiert
    Wenn ich auf das × von Runde 1 tippe
    Und ich auf das × von Runde 1 tippe
    Dann zeigt der Rundenzähler 2
    Und die Rundenliste lautet:
      | Runde | Zeit | Gesamt |
      | 2     | 2:05 | 4:10   |
      | 1     | 2:05 | 2:05   |
