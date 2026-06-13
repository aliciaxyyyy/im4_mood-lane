<?php
// API endpoint to retrieve entries for a specific chip_id between two dates provided as query parameters.
require_once("../system/config.php");

$sql = "SELECT * FROM entries WHERE chip_id = ? AND created_at BETWEEN ? AND ? ORDER BY created_at DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute([$_GET['chip_id'], $_GET['start_date'], $_GET['end_date']]);
$entries = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(["status" => "success", "entries" => $entries]);

?>