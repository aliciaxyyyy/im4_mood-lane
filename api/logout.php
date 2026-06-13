<?php
// API endpoint for user logout. It destroys the user's session and returns a JSON response indicating that the logout was successful.
// logout.php
session_start();
$_SESSION = [];
session_destroy();

// Return a success response instead of redirecting
header('Content-Type: application/json');
echo json_encode(["status" => "success"]);
exit;
?>