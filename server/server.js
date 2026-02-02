const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'secret_as_fuck';

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Пути к файлам данных
const USERS_FILE = path.join(__dirname, 'users.json');
const ITEMS_FILE = path.join(__dirname, 'items.json');

// Инициализация файлов данных
async function initDataFiles() {
  try {
    // Проверяем и создаем файл пользователей если нужно
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
    }
    
    // Проверяем и создаем файл записей если нужно
    try {
      await fs.access(ITEMS_FILE);
    } catch {
      await fs.writeFile(ITEMS_FILE, JSON.stringify([], null, 2));
    }
    
  } catch (error) {
    console.error('Ошибка инициализации файлов:', error);
  }
}

// Чтение пользователей
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка чтения', error);
    return [];
  }
}

// Запись пользователей
async function writeUsers(users) {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Ошибка записи', error);
  }
}

// Чтение записей
async function readItems() {
  try {
    const data = await fs.readFile(ITEMS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка чтения', error);
    return [];
  }
}

// Запись записей
async function writeItems(items) {
  try {
    await fs.writeFile(ITEMS_FILE, JSON.stringify(items, null, 2));
  } catch (error) {
    console.error('Ошибка записи', error);
  }
}

// Middleware для проверки JWT
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Токен отсутствует' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Неверный токен' });
  }
};

// Регистрация
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const users = await readUsers();
    
    // Проверка существования пользователя
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: Date.now(),
      email,
      password_hash: hashedPassword,
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    await writeUsers(users);

    res.status(201).json({ 
      message: 'Пользователь успешно зарегистрирован',
      user: { id: newUser.id, email: newUser.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Вход
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const users = await readUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Создание JWT токена
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение списка записей с фильтрацией
app.get('/api/items', authenticateToken, async (req, res) => {
  try {
    const { type, min_rating } = req.query;
    const items = await readItems();
    
    // Фильтрация записей текущего пользователя
    let userItems = items.filter(item => item.user_id === req.userId);
    
    // Применение фильтров
    if (type && (type === 'book' || type === 'movie')) {
      userItems = userItems.filter(item => item.type === type);
    }
    
    if (min_rating) {
      const minRating = parseInt(min_rating);
      if (!isNaN(minRating) && minRating >= 1 && minRating <= 5) {
        userItems = userItems.filter(item => item.rating >= minRating);
      }
    }
    
    // Сортировка по дате создания (новые сначала)
    userItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.json(userItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Создание новой записи
app.post('/api/items', authenticateToken, async (req, res) => {
  try {
    const { title, type, rating, note } = req.body;
    
    // Валидация
    if (!title || !type) {
      return res.status(400).json({ error: 'Название и тип обязательны' });
    }
    
    if (type !== 'book' && type !== 'movie') {
      return res.status(400).json({ error: 'Тип должен быть book или movie' });
    }
    
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Рейтинг должен быть от 1 до 5' });
    }
    
    const items = await readItems();
    
    const newItem = {
      id: Date.now(),
      user_id: req.userId,
      title,
      type,
      rating: rating || null,
      note: note || '',
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };
    
    items.push(newItem);
    await writeItems(items);
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение записи по ID
app.get('/api/items/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const items = await readItems();
    
    const item = items.find(item => item.id === parseInt(id) && item.user_id === req.userId);
    
    if (!item) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }
    
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновление записи
app.put('/api/items/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, rating, note } = req.body;
    
    // Валидация
    if (type && type !== 'book' && type !== 'movie') {
      return res.status(400).json({ error: 'Тип должен быть book или movie' });
    }
    
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Рейтинг должен быть от 1 до 5' });
    }
    
    const items = await readItems();
    const itemIndex = items.findIndex(item => item.id === parseInt(id) && item.user_id === req.userId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }
    
    // Обновление полей
    if (title) items[itemIndex].title = title;
    if (type) items[itemIndex].type = type;
    if (rating !== undefined) items[itemIndex].rating = rating;
    if (note !== undefined) items[itemIndex].note = note;
    items[itemIndex].updated_at = new Date().toISOString();
    
    await writeItems(items);
    
    res.json(items[itemIndex]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удаление записи
app.delete('/api/items/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const items = await readItems();
    
    const itemIndex = items.findIndex(item => item.id === parseInt(id) && item.user_id === req.userId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }
    
    // Удаление записи
    const deletedItem = items.splice(itemIndex, 1);
    await writeItems(items);
    
    res.json({ 
      message: 'Запись успешно удалена',
      item: deletedItem[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение информации о текущем пользователе
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const users = await readUsers();
    const user = users.find(u => u.id === req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json({ id: user.id, email: user.email, created_at: user.created_at });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Запуск сервера
async function startServer() {
  await initDataFiles();
  
  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  });
}

startServer();