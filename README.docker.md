# Запуск базы данных PostgreSQL

## Docker Compose

Для запуска PostgreSQL в Docker контейнере выполните:

```bash
# Запуск контейнера в фоновом режиме
docker-compose up -d

# Просмотр логов
docker-compose logs postgres

# Остановка контейнера
docker-compose down

# Остановка с удалением volumes (осторожно - удалит все данные!)
docker-compose down -v
```

## Подключение к базе данных

После запуска контейнера база данных будет доступна на:

- **Host**: localhost
- **Port**: 5432
- **Database**: meditation_tracker
- **Username**: postgres
- **Password**: your_password

## Полезные команды

```bash
# Подключение к базе данных через psql
docker-compose exec postgres psql -U postgres -d meditation_tracker

# Перезапуск только postgres сервиса
docker-compose restart postgres

# Просмотр статуса контейнеров
docker-compose ps
```

## Переменные окружения

Убедитесь, что в вашем `.env` файле указаны правильные настройки подключения к базе данных.
