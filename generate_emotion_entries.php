<?php
$amount = 60;
$emotions = ["Freude", "Trauer", "Wut", "Angst", "Ekel", "Stolz", "Ueberraschung", "Neutral"];
$earliestDate = strtotime("-180 days");
$now = time();

require_once("system/config.php");

for ($i = 0; $i < $amount; $i++) {
    $sql = "INSERT INTO entries (chip_id, emotion, created_at) VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(["04:E3:9E:20:21:02:89", $emotions[rand(0, count($emotions) - 1)], date("Y-m-d H:i:s", rand($earliestDate, $now))]);
}
?>  