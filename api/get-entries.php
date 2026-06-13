<?php
// API endpoint to retrieve all entries for a specific chip_id provided as a query parameter.
require_once("../system/config.php");
$sql = "SELECT * FROM entries WHERE chip_id = ? ORDER BY created_at DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute([$_GET['chip_id']]);
$entries = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(["status" => "success", "entries" => $entries]);

?>