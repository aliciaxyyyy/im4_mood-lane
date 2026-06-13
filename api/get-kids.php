<?php
// API endpoint to retrieve all kids from the database and return them as a JSON response.
require_once("../system/config.php");
$sql = "SELECT * FROM kids";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$kids = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "kids" => $kids]);

?>