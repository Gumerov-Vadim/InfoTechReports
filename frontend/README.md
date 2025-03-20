# InfoTechReports Frontend

Клиентская часть приложения InfoTechReports для отслеживания технических проверок и нарушений.

## Разработка

### Установка зависимостей

```bash
npm install
```

### Запуск приложения в режиме разработки

```bash
# Только фронтенд (требуется настоящий API)
npm run dev

# Фронтенд + моковый API
npm run dev:mock
```

### Сборка для продакшена

```bash
npm run build
```

## Моковый API

Для разработки и тестирования без настоящего бэкенда используется моковый API на базе json-server.

### Данные для входа

- Администратор: username: `admin`, password: `admin123`
- Пользователь: username: `user`, password: `user123`

### Доступные эндпоинты

- `POST /api/auth/login` - Авторизация
- `POST /api/auth/register` - Регистрация
- `GET /api/reports` - Получение списка отчетов
- `GET /api/reports/:id` - Получение отчета по ID
- `POST /api/reports` - Создание отчета
- `PUT /api/reports/:id/inspection-result` - Обновление результата проверки
- `DELETE /api/reports/:id` - Удаление отчета
- `GET /api/reports/generate-report` - Генерация отчета за период

### Запуск только мокового API

```bash
npm run mock-api
```
