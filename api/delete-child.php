<?php
// API endpoint to delete a child from the database based on the provided ID in the query parameter.
require_once("../system/config.php");

$id = $_GET['id'];

$sql = "DELETE FROM kids WHERE id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$id]);

echo json_encode(["status" => "success"]);
?>