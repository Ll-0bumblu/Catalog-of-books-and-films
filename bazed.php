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
