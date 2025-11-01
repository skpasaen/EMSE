# EMSE Wintersemester 2025

Das ist das Default-Projekt für das eigene Experiment. In dem Experiment werden die Zeilen


    "Hello, world + random number: " + irgendeine Zufallszahl von 0-9<br>
    Hier eine zusätzliche HTML Zeile

oder die Zeile

    "Exit world + random number: " + irgendeine Zufallszahl von 0-9
  
ausgegeben. Wenn Hello, word angezeigt wird, soll die Taste [1] gedrückt werden,
ansonsten die Taste 2.

- Das File "experimentation_lib.js" ist die verwendete Library. Diese muss nicht angefasst werden.

- In der Datei "experiment.js" steht der Code, der das Experiment ausmacht. Die Kommentare in der Datei sollten helfen zu verstehen, wo Code angefasst werden muss.

Am Ende des Experiments wird eine csv-Datei ausgegeben, die in der ersten Spalte den Namen der ersten Variablen hat. Die letzte Spalte enthält die gemessene Zeit für jede Aufgabe (Zeit von der Anzeige bis zum Drücken der richtigen Taste)

Wenn ihr an euch Daten gesammlt habt, diese in Jamovi laden, dort eine ANOVA durchführen (abhängige Variable ist die Zeit, unabhängige Variable eure erste Variable).