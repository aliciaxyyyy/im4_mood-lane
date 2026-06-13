<?php
// API endpoint called by the physocal device to save new emotion entries into the database. It receives JSON data via HTTP POST, decodes it, and inserts the relevant information into the `entries` table in the database.

require_once("../system/config.php");
// echo "This script receives HTTP POST messages and pushes their content into the database.";



###################################### Empfangen der JSON-Daten

$inputJSON = file_get_contents('php://input'); // JSON-Daten aus dem Body der Anfrage
$input = json_decode($inputJSON, true); 


###################################### receiving a post request from a HTML form, later from ESP

$user = $input["kind"];         // Hol den Wert an der Stelle "emotion" aus dem JS-Objekt (ehemals JSON-String)
$emotion = $input["emotion"];         // Hol den Wert an der Stelle "emotion" aus dem JS-Objekt (ehemals JSON-String)
# insert new user into db
$sql = "INSERT INTO entries (chip_id, emotion) VALUES (?, ?)";
$stmt = $pdo->prepare($sql);
$stmt->execute([$user, $emotion]);

?>