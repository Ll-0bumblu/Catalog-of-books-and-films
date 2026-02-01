<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password are required']);
    exit;
}

$email = trim($data['email']);
$password = $data['password'];

// Валидация email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit;
}

// Проверка длины пароля
if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must be at least 6 characters']);
    exit;
}

$db = Database::connect();

// Проверка существующего пользователя
$stmt = $db->prepare("SELECT id FROM users WHERE email = :email");
$stmt->execute([':email' => $email]);

if ($stmt->rowCount() > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'User already exists']);
    exit;
}

// Хэширование пароля
$password_hash = password_hash($password, PASSWORD_DEFAULT);

// Создание пользователя
$stmt = $db->prepare("
    INSERT INTO users (email, password_hash) 
    VALUES (:email, :password_hash) 
    RETURNING id, email, created_at
");

$stmt->execute([
    ':email' => $email,
    ':password_hash' => $password_hash
]);

$user = $stmt->fetch();

http_response_code(201);
echo json_encode([
    'message' => 'User registered successfully',
    'user' => [
        'id' => $user['id'],
        'email' => $user['email']
    ]
]);