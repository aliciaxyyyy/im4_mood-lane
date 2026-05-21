<?php
require_once("../system/config.php");

$id = $_GET['id'];

$sql = "DELETE FROM kids WHERE id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$id]);

echo json_encode(["status" => "success"]);
?>