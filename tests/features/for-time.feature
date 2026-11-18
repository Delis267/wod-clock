# language: de
Funktionalität: For Time beenden
  Bei For Time beendet der Knopf „Fertig“ das Workout. Damit man nicht aus Versehen
  beendet, braucht er eine Bestätigung. Andere Knöpfe gibt es unter der Uhr nicht.

  Szenariogrundriss: Unter der Uhr gibt es bei <Modus> keine Knöpfe
    Angenommen der Countdown ist aus
    Wenn ich "<Modus>" starte
    Dann gibt es unter der Uhr keine Knöpfe

    Beispiele:
      | Modus  |
      | Tabata |
      | EMOM   |
      | AMRAP  |

  Szenario: Im Countdown ist „Fertig“ ausgeblendet
    Angenommen der Countdown ist 5 Sekunden
    Und For Time hat kein Cap und kein Rundenziel
    Wenn ich "For Time" starte
    Dann gibt es unter der Uhr keine Knöpfe
    Wenn 5 Sekunden vergehen
    Dann ist unter der Uhr nur der Knopf "Fertig" zu sehen

  Szenario: „Fertig“ braucht eine Bestätigung
    Angenommen der Countdown ist 5 Sekunden
    Und For Time hat kein Cap und kein Rundenziel
    Wenn ich "For Time" starte
    Und 95 Sekunden vergehen
    Und ich auf "Fertig" tippe
    Dann steht auf dem Knopf "Sicher? Nochmal tippen"
    Und es ist kein Ergebnis zu sehen
    Wenn ich auf "Sicher? Nochmal tippen" tippe
    Dann erscheint das Ergebnis "Time!"
    Und das Ergebnis zeigt "Deine Zeit" mit "1:30"

  Szenario: Ohne Bestätigung springt der Knopf zurück
    Angenommen der Countdown ist aus
    Und For Time hat kein Cap und kein Rundenziel
    Wenn ich "For Time" starte
    Und ich auf "Fertig" tippe
    Und 3 Sekunden vergehen
    Dann steht auf dem Knopf "Fertig"
    Und es ist kein Ergebnis zu sehen

  Szenario: Mit Rundenziel beendet die letzte Runde das Workout
    Angenommen der Countdown ist 5 Sekunden
    Und For Time hat 3 Runden als Ziel und kein Cap
    Wenn ich "For Time" starte
    Und ich tippe Runden bei 1:00, 2:10 und 3:30
    Dann erscheint das Ergebnis "Time!"
    Und das Ergebnis zeigt "Deine Zeit" mit "3:30"
    Und das Ergebnis zeigt "Runden" mit "3"
