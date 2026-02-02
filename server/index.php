<?php
class Database
{
    private static $instance = null;
    private $pdo;
    private $host = 'localhost';
    private $port = '5432';
    private $dbname = 'movie_book_bd';
    private $user = 'postgres';
    private $password = '1365244';

    private function __construct()
    {
        $this->connect();
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function connect()
    {
        try {
            // Пробуем подключиться к существующей базе
            $dsn = "pgsql:host={$this->host};port={$this->port};dbname={$this->dbname}";
            $this->pdo = new PDO($dsn, $this->user, $this->password);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            echo "Подключение к базе данных '{$this->dbname}' установлено\n";
            // Проверяем и создаем таблицы
            $this->checkAndCreateTables();
        } catch (PDOException $e) {
            // Если база не существует, создаем ее
            if (strpos($e->getMessage(), 'database "' . $this->dbname . '" does not exist') !== false) {
                echo "База данных не найдена. Создаю новую...\n";
                $this->createDatabase();
                $this->connect(); // Повторно подключаемся
            } else {
                die("Ошибка подключения: " . $e->getMessage());
            }
        }
    }

    private function createDatabase()
    {
        try {
            // Подключаемся к системной базе postgres
            $dsn = "pgsql:host={$this->host};port={$this->port};dbname=postgres";
            $temp_pdo = new PDO($dsn, $this->user, $this->password);
            $temp_pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Создаем базу данных
            $temp_pdo->exec("CREATE DATABASE {$this->dbname}");
            echo "База данных '{$this->dbname}' успешно создана\n";
        } catch (PDOException $e) {
            die("Ошибка создания базы данных: " . $e->getMessage());
        }
    }
    private function checkAndCreateTables()
    {
        try {
            // 1. Таблица users
            $this->pdo->exec("
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT NOW()
                )
            ");
            echo "Таблица 'users' создана\n";

            // 2. Таблица items
            $this->pdo->exec("
                CREATE TABLE IF NOT EXISTS items (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    title VARCHAR(255) NOT NULL,
                    type VARCHAR(10) CHECK (type IN ('book', 'movie')),
                    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
                    note TEXT,
                    date DATE NOT NULL DEFAULT CURRENT_DATE,
                    created_at TIMESTAMP DEFAULT NOW()
                )
            ");
            echo "Таблица 'items' создана\n";
            // $this->createIndexes();

        } catch (PDOException $e) {
            die("Ошибка создания таблиц: " . $e->getMessage());
        }
    }
    public function getConnection()
    {
        return $this->pdo;
    }
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch("$method $uri"){
    case "POST /Register":
        Register();
        break;
    case "POST /Login":
        Login();
        break;
    // case "GET /GetItems":
    //     GetItem();
    //     break;
    // case "POST /CreatItem":
    //     CreatItem();
    //     break;
    default:
        http_response_code(404);
        echo json_encode(["error" => "Not Found"]);
}

function Register(){
    $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode($data);
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

    $database = Database::getInstance();
    $pdo = $database->getConnection();
    
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
}

function Login(){
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required']);
        exit;
    }

    $email = trim($data['email']);
    $password = $data['password'];

    $database = Database::getInstance();
    $pdo = $database->getConnection();


    // Поиск пользователя
    $stmt = $db->prepare("SELECT id, email, password_hash FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        exit;
    }

    // Генерация JWT
    $token = JWTUtil::encode([
        'user_id' => $user['id'],
        'email' => $user['email']
    ]);

    echo json_encode(['message' => 'Login successful']);
}
