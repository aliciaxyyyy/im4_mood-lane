<?php
 /*****************************************************
 * Kapitel 12: Website2DB > Schritt 2: Website -> DB
 * load.php
 * Daten als JSON-String vom Formular sender.html (später vom MC) serverseitig empfangen und Daten in die Datenbank einfügen
 * Datenbank-Verbindung
**************************/
require_once("../system/config.php");
// echo "This script receives HTTP POST messages and pushes their content into the database.";

###################################### receiving a post request from a HTML form, later from ESP
# insert new user into db

$sql = "SELECT DATE(created_at) AS ForDate, COUNT(*) AS NumPosts FROM   entries WHERE chip_id = ? GROUP BY DATE(created_at) ORDER BY ForDate";
$stmt = $pdo->prepare($sql);
$stmt->execute([$_GET['chip_id']]);
$entries = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(["status" => "success", "entries" => $entries]);

?>