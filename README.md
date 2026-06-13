# Mood Lane
Mood Lane macht Emotionen sichtbar. Durch die Kombination einer spielerischen Murmelbahn mit einer digitalen Auswertung hilft Mood Lane Kindern dabei, ihre Gefühle bewusst wahrzunehmen und auszudrücken. Gleichzeitig erhalten Eltern wertvolle Einblicke in die emotionale Entwicklung ihrer Kinder. So entsteht ein einfaches und motivierendes Werkzeug für mehr Verständnis, Kommunikation und emotionale Förderung im Familienalltag.

## Kurzbeschreibung des Projekts

* **Modul:** Interaktive Medien 4 an der Fachhochschule Graubünden (FS26)  
* **Themenfeld:** IoT-Applikation zum Thema Eltern mit kleinen Kindern  
* **Name des Projekts:** \[*Mood Lane*\]   
* **Team Physical Computing:** \[*Natacha-Anina Krenger, Quincy Enoma*\]   
* **Team WebApp:** \[*Alicia Gregorini, Maya Nikita Baumann*\]

Mood Lane ist ein interaktives Physical-Computing-System, das Eltern dabei unterstützt, die Emotionen ihrer Kinder besser zu verstehen und nachzuvollziehen. Durch eine spielerische Kombination aus einer physischen Murmelbahn und einer Webapplikation können Kinder ihre aktuelle Emotion erfassen und dokumentieren. Die erfassten Daten werden gespeichert und für Eltern übersichtlich visualisiert.

Das System richtet sich insbesondere an jüngere Kinder, die ihre Gefühle noch nicht klar verbal ausdrücken können. Durch die tägliche Nutzung lernen sie, Emotionen bewusst wahrzunehmen, zu benennen und einzuordnen. Gleichzeitig erhalten Eltern wertvolle Einblicke in die emotionale Entwicklung ihrer Kinder.

## Problem & Lösung

### Welches Problem im Alltag von Eltern mit kleinen Kindern wird gelöst? <br>
Viele Kinder im jungen Alter können ihre Emotionen noch nicht ausreichend kommunizieren oder einordnen. Für Eltern ist es deshalb oft schwierig zu verstehen, weshalb ein Kind auf bestimmte Situationen besonders stark reagiert oder scheinbar keine erkennbare Reaktion zeigt.

Dadurch können Missverständnisse entstehen, und wichtige Hinweise auf das emotionale Wohlbefinden eines Kindes bleiben möglicherweise unbemerkt.

### Was ist der „Sinn und Zweck“ des Systems? <br>
Mood Lane ermöglicht es Eltern, die Emotionen ihrer Kinder über einen längeren Zeitraum zu erfassen und nachzuverfolgen. Dadurch können emotionale Muster erkannt und Gespräche über Gefühle gefördert werden.

Kinder lernen mithilfe eines spielerischen Ansatzes, ihre Emotionen zu identifizieren und verschiedenen Gefühlszuständen zuzuordnen. Die Gestaltung orientiert sich dabei an den bekannten Emotionen aus dem Disney-Pixar-Franchise Inside Out. Unterschiedlich farbige Emotionskugeln repräsentieren verschiedene Gefühle und schaffen einen hohen Wiedererkennungswert.

Die physische Interaktion mit der Murmelbahn motiviert Kinder zur regelmässigen Nutzung des Systems. Gleichzeitig entsteht eine einfache und verständliche Methode, Emotionen im Alltag zu dokumentieren.

\[*Bilder / GIFs (optional)*\]

### UX & Konzeption

*In diesem Teil werden die gemeinsamen Schritte aus der UX-Abgabe dokumentiert, damit sich hier alles vollständig an einem Ort befindet (betrifft WebApp und Physical Computing)*

* **Figma:** [Link zum Figma](https://www.figma.com/design/sp9aHmOb6vmgzlygEPm0ih/Mood-Lane-UX?node-id=30-97&p=f&t=RcCNdvFUaCcnoKYK-0)
* **User Flow \+ Screen Flow** (Screenshot aus Figma)
! 

### Welche Features waren angedacht? <br>
* Physical Computing
* Murmelbahn mit unterschiedlich farbigen Emotionskugeln
* Scanner zur Erkennung der gewählten Emotion
* Personalisierte Chip-Karten zur Identifikation verschiedener Kinder
* Statusanzeige mittels Lampe zur Bestätigung eines erfolgreichen Scans
* Webapplikation
* Übersicht über alle erfassten Emotionseinträge
* Darstellung der Daten nach Tag, Woche, Monat und Jahr
* Detailansicht einzelner Einträge und Zeiträume
* Registrierung neuer Kinder/Personen
* Löschen bestehender Kinder/Personen

### Erweiterungsidee

Zusätzlich wurde ein digitales Emotionstagebuch konzipiert. Nach dem Scannen einer Emotion sollte automatisch eine Audioaufnahme starten, in der das Kind kurz erklärt, weshalb es diese Emotion gewählt hat. <br>

Beispielsweise könnte ein Kind erläutern, weshalb es sich geekelt hat oder warum es besonders glücklich war. Dadurch wären neben den Emotionen auch deren Ursachen dokumentiert worden. Dies könnte man in einer zukünftigen weiterentwickelten Version von Mood Lane miteinbauen.

### Nicht umgesetzte Features

Das geplante Audioaufnahme-Feature wurde nicht umgesetzt. <br>

Der Fokus lag während der Entwicklung auf der erfolgreichen Umsetzung der Kernfunktionalitäten des Systems. Die Aufnahme, Speicherung und Verwaltung von Audiodateien hätte zusätzliche technische Komplexität verursacht und den zeitlichen Rahmen des Projekts überschritten. <br>

Darüber hinaus hätten wichtige konzeptionelle Fragen geklärt werden müssen, beispielsweise: <br>

* Ist eine Sprachaufnahme verpflichtend oder freiwillig?
* Wie lange darf eine Aufnahme dauern?
* Wie wird mit sehr jungen Kindern umgegangen, die sich noch nicht verbal ausdrücken können?

Da diese Fragen weitere Anpassungen der Systemarchitektur erfordert hätten, wurde entschieden, den Fokus auf die spielerische und unkomplizierte Erfassung von Emotionen zu legen.

## Setup

* **WebApp:** [Link zur Website](https://moodlane.aliciagregorini.com/login.html)  
* **Video-Dokumentation:** [Link zum Video auf Youtube](https://www.youtube.com/watch?v=I8A1v1qAnEo) 

### Installationsanleitung WebApp
***verständliche** Schritt-für-Schritt-Anleitung für Aussenstehende, um das Projekt zu klonen und auf einem eigenen Server zu installieren*
1. Benötigt wird ein Webhost wie z.B. Infomaniak
2. Darauf muss ein php-Webserver und eine SQL Datenbank aufgesetzt werden
3. Das github Repo muss geklont werden und auf den php-Webserver geladen werden
3. Im phpAdmin der Datenbank muss das moodlane.sql file importiert und ausgeführt werden um die Datenbank zu erstellen 
4. Im Repo muss im Ordner system ein file config.php mit folgendem Inhalt erstellt werden und die Credentials eingefügt werden:
   ```php
   <?php
   // config.php
   $host = '';
   $db   = '';  // Change to your DB name
   $user = '';   // Change to your DB user
   $pass = '';       // Change to your DB pass if needed
   try {
     $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
     $pdo = new PDO($dsn, $user, $pass);
     // Optional: Set error mode
     $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
   } catch (Exception $e) {
   echo "Database connection error: " . $e->getMessage();
   exit;
   }
   ?>
   ```

6. Nachdem auch der physical Teil aufgesetzt ist kann aus der Datenbank in der Tabelle entries die chip_id der Kinder-Karten kopiert werden und damit im Frontend ein neues Kind erstellt werden.

