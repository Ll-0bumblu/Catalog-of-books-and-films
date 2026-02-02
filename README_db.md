# База данных MovieBook

## Обзор

База данных movie_book_bd предназначена для веб-приложения, которое позволяет пользователям:

- Регистрироваться в системе
- Добавлять книги и фильмы в свой личный список
- Ставить оценки от 1 до 5
- Добавлять заметки к каждому элементу
- Просматривать свой список добавленных элементов

### Спецификации подключения

- Хост: localhost
- Порт: 5432
- База данных: movie_book_bd
- Пользователь: postgres
- Пароль: 1365244

## Автоматическая инициализация

При первом запуске происходит следующее:

1. **Проверка существования базы данных**

```php
 // Пробуем подключиться к существующей базе
$dsn = "pgsql:host={$this->host};port={$this->port};dbname={$this->dbname}";
$this->pdo = new PDO($dsn, $this->user, $this->password);
$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
 // Если база не существует → переходит к созданию
 ```
2. **Создание базы данных (если не существует)**

```php
// Подключается к системной базе postgres
$dsn = "pgsql:host={$this->host};port={$this->port};dbname=postgres";
$temp_pdo = new PDO($dsn, $this->user, $this->password);
$temp_pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
// Создает новую базу
$temp_pdo->exec("CREATE DATABASE {$this->dbname}");
```

3. **Создание таблиц**

```php
// 1. Таблица users
$this->pdo->exec("
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
    )
");

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
 ```
  
## Детальное описание таблиц

### Таблица users

Хранит информацию о зарегистрированных пользователях.

| Поле          | Тип          | Ограничения     | Описание                   |
| :------------ | :----------- | :-------------- | :------------------------- |
| id            | SERIAL       | PRIMARY KEY     | Уникальный ID пользователя |
| email         | VARCHAR(255) | UNIQUE NOT NULL | Электронная почта          |
| password_hash | TEXT         | NOT NULL        | Хеш пароля                 |
| created_at    | TIMESTAMP    | DEFAULT NOW()   | Дата регистрации           |

Пример данных:

```sql
id: 2
email: "user1@test.com"
password_hash: "$2y$10$epiIrZOlKsUSHO4gydzXIOvyikIsGqWSaJ1t.7NeaDsNRqHR65ihS"
created_at: "2026-02-02 12:40:30.156833"
```

### Таблица items

Хранит записи о книгах и фильмах.

| Поле       | Тип           | Ограничения                       | Описание                          |
| :--------- | :------------ | :-------------------------------- | :-------------------------------- |
| id         | SERIAL        | PRIMARY KEY                       | Уникальный ID записи              |
| user_id    | INTEGER       | FOREIGN KEY NOT NULL              | ID владельца (ссылка на users.id) |
| title      | VARCHAR(255)  | NOT NULL                          | Название книги/фильма             |
| type       | VARCHAR(10)   | CHECK (type IN ('book', 'movie')) | Тип: 'book' или 'movie'           |
| rating     | INTEGER CHECK | (rating BETWEEN 1 AND 5)          | Оценка от 1 до 5                  |
| note       | TEXT          | —                                 | Дополнительные заметки            |
| date       | DATE          | DEFAULT CURRENT_DATE              | Дата добавления                   |
| created_at | TIMESTAMP     | DEFAULT NOW()                     | Дата создания записи              |

Примеры записей:

```sql
-- Книга
id: 3
user_id: 2
title: "Книга 1"
type: "book"
rating: 5
note: "Отличная книга"
date: "2024-01-01"
created_at: "2026-02-02 12:40:30.156833"

-- Фильм
id: 8
user_id: 4
title: "Фильм 3"
type: "movie"
rating: 3
note: "Нормальный фильм"
date: "2024-02-03"
created_at: "2026-02-02 12:40:30.156833"
```


