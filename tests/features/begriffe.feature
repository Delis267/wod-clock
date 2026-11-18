# language: de
Funktionalität: Begriffe Work und Rest
  Die App nutzt durchgängig Work und Rest, wie im CrossFit üblich.
  „Pausiert“ meint dagegen das Anhalten der Uhr und bleibt deutsch.

  Szenario: Tabata stellt Work und Rest ein
    Wenn ich den Modus "Tabata" wähle
    Dann sehe ich "Work"
    Und ich sehe "Rest"
    Und nirgends steht "Arbeit"
    Und nirgends steht "Pause"

  Szenario: AMRAP mit mehreren Sätzen hat Rest zwischen den Sätzen
    Angenommen AMRAP hat 2 Sätze mit 60 Sekunden Rest dazwischen
    Wenn ich den Modus "AMRAP" wähle
    Dann sehe ich "Rest zwischen Sätzen"
    Und nirgends steht "Pause"
