# api.settime.ru

WebSocket-сервер точного времени. Синхронизируется с NTP и отдаёт Unix timestamp в миллисекундах.

- Приложение: [settime.ru](https://settime.ru)
- WebSocket: [wss://api.settime.ru/ws](wss://api.settime.ru/ws)

## HTTP

### `GET /`

Справка по сервису и его эндпоинтам.

### `GET /health`

Проверка доступности сервиса.

## WebSocket (`/ws`)

### Подключение

При установке соединения сервер сразу отправляет текущее время.

### Запрос времени

Клиент может запросить повторную отправку:

```json
{ "type": "refresh" }
```

### Ответ сервера

```json
{ "type": "unix_timestamp", "value": 1740000000000 }
```

Поле `value` содержит Unix timestamp в миллисекундах, синхронизированный через NTP.

## Проверка в терминале

Подключиться и получить время при открытии соединения:

```bash
websocat wss://api.settime.ru/ws
```

Запросить время повторно:

```bash
echo '{"type":"refresh"}' | websocat wss://api.settime.ru/ws
```

## Локально

```bash
npm install
cp .env.example .env
npm run dev
```

- HTTP: `http://localhost:8080`
- WebSocket: `ws://localhost:8080/ws`

Порт задаётся через `PORT` в `.env` (по умолчанию `8080`).

## Docker

```bash
docker build -t api.settime.ru .
docker run --rm -p 8080:8080 api.settime.ru
```

- HTTP: `http://localhost:8080`
- WebSocket: `ws://localhost:8080/ws`
