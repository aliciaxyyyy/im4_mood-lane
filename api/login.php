<?php  
ini_set('session.cookie_secure', 1);
session_start();
header('Content-Type: application/json');

require_once '../system/config.php';

if ($_SERVER ['REQUEST_METHOD'] === 'POST'){
    // // hier wollen wir die Variablen entpacken

    $data = json_decode(file_get_contents ("php://input"), true);
    //hier Daten entpacken

    $email = $data['email'];
    $password = $data ['password'];

    // $insert = $pdo->prepare("INSERT INTO users (email, password) VALUES (:email, :pass)");
    // $insert->execute([
    //     ":email" => $email,
    //     ":pass" => $password
    // ]);

    //checken ob schon registriert
    $stmt = $pdo-> prepare ("SELECT id, email, password FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            "status" => "error",
            "message" => "Email not registered"
        ]);
        exit;
    }

    // veryify password
    if ($user && password_verify($password, $user['password'])) {
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];

        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
    }
} else {
    echo json_encode (["status" => "error", "message" => "Invalid request method"]);
}
?>