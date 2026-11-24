# language: de
Funktionalität: Zeiten im Scrollrad einstellen
  Das Scrollrad bietet Zeiten in 5-Sekunden-Schritten an. Was man dort wählt, gilt auch so, ab 5 Sekunden.
  Kurze Zeiten sind im Training selten sinnvoll, aber praktisch zum Ausprobieren.
  Nur wo 0 etwas bedeutet, bleibt 0 erhalten: kein Rest, kein Time Cap. Sonst wird aus 0:00 das Minimum 0:05.

  Szenariogrundriss: <Feld> bei <Modus> übernimmt <Zeit> unverändert
    Wenn ich den Modus "<Modus>" wähle
    Und ich "<Feld>" im Scrollrad auf <Zeit> stelle
    Dann zeigt das Feld "<Feld>" <Zeit>

    Beispiele:
      | Modus    | Feld      | Zeit |
      | AMRAP    | Dauer     | 0:05 |
      | AMRAP    | Dauer     | 0:10 |
      | AMRAP    | Dauer     | 0:15 |
      | For Time | Time Cap  | 0:05 |
      | EMOM     | Intervall | 0:05 |
      | Tabata   | Work      | 0:05 |
      | Tabata   | Rest      | 0:00 |

  Szenariogrundriss: 0:00 wird bei <Feld> zum Minimum 0:05
    Wenn ich den Modus "<Modus>" wähle
    Und ich "<Feld>" im Scrollrad auf 0:00 stelle
    Dann zeigt das Feld "<Feld>" 0:05

    Beispiele:
      | Modus  | Feld      |
      | AMRAP  | Dauer     |
      | EMOM   | Intervall |
      | Tabata | Work      |

  Szenario: Time Cap 0:00 heißt ohne Cap
    Wenn ich den Modus "For Time" wähle
    Und ich "Time Cap" im Scrollrad auf 0:00 stelle
    Dann zeigt das Feld "Time Cap" "ohne"

  Szenario: Ein AMRAP über 10 Sekunden endet nach 10 Sekunden
    Angenommen der Countdown ist aus
    Wenn ich den Modus "AMRAP" wähle
    Und ich "Dauer" im Scrollrad auf 0:10 stelle
    Und ich "AMRAP" starte
    Dann zeigt die Uhr die Zeit 0:10
    Wenn 10 Sekunden vergehen
    Dann erscheint das Ergebnis "Time!"
    Und das Ergebnis zeigt "Runden in 0:10" mit "0"
