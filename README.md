# Smart Home Catalog

## Описание
Простое веб-приложение для управления умными устройствами дома с использованием Spring Boot и H2.  
Позволяет добавлять, просматривать, обновлять и удалять устройства через REST API.

## Структура проекта
- `model/Device.java` — сущность устройства.
- `repository/DeviceRepository.java` — репозиторий для работы с базой.
- `controller/DeviceController.java` — REST API.
- `resources/application.properties` — настройки базы данных H2.

## Запуск
1. Клонировать проект.
2. Открыть в IntelliJ IDEA.
3. Запустить `SmartHomeCatalogApplication.java`.
4. API доступно по адресу: `http://localhost:8080/api/devices`.
5. Веб-консоль H2: `http://localhost:8080/h2-console`
    - JDBC URL: `jdbc:h2:mem:smarthomedb`
    - Username: `sa`
    - Password: (оставить пустым)

## Примеры запросов

### Получить все устройства
POST /register
Body: { "username": "user1", "password": "1234" }

POST /login
Body: { "username": "user1", "password": "4321" }
Response: { "token": "<JWT token>" }

GET /me
Headers: Authorization: Bearer <token>
