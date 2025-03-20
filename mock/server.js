import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Получаем абсолютный путь к текущему модулю
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);
const jsonServer = require('json-server');
const path = require('path');

// Используем динамический импорт вместо require
const middlewareModule = await import('./middleware.js');
const middleware = middlewareModule.default;

const server = jsonServer.create();
const router = jsonServer.router(join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({
  // Настройка CORS
  cors: {
    origin: '*',
    credentials: false
  }
});

// Отладочный лог для отслеживания запросов
server.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Обработка предварительных запросов OPTIONS
server.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.sendStatus(200);
});

// Применяем наш middleware для обработки кастомных маршрутов
server.use(middleware);

// Специфические маршруты auth обрабатываются в middleware
server.post('/api/auth/login', (req, res) => {
  // Обработка происходит в middleware
});

server.post('/api/auth/register', (req, res) => {
  // Обработка происходит в middleware
});

// Обработка основных CRUD операций через роутер json-server
server.use('/api', router);

// Добавляем обработку 404 для всех остальных маршрутов
server.use((req, res) => {
  res.status(404).jsonp({
    error: `Маршрут ${req.originalUrl} не найден`
  });
});

const PORT = 5119;

server.listen(PORT, () => {
  console.log(`Mock API сервер запущен на порту ${PORT}`);
  console.log(`Для доступа: http://localhost:${PORT}/api/reports`);
  console.log(`Пользователи для тестирования:`);
  console.log(`- admin / admin123`);
  console.log(`- user / user123`);
}); 