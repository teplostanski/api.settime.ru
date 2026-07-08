# api.settime.ru

WebSocket-сервер точного времени. Синхронизируется с NTP и отдаёт Unix timestamp в миллисекундах.

- Приложение: [settime.ru](https://settime.ru)
- WebSocket: [wss://api.settime.ru](wss://api.settime.ru)

## Протокол

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

`value` — Unix timestamp в миллисекундах (синхронизирован через NTP).

## Проверка в терминале

Подключиться и получить время при открытии соединения:

```bash
websocat wss://api.settime.ru
```

Запросить время повторно:

```bash
echo '{"type":"refresh"}' | websocat wss://api.settime.ru
```

## Локально

```bash
npm install
npm run dev
```

WebSocket: `ws://localhost:8080`

## Docker

```bash
docker build -t api.settime.ru .
docker run --rm -p 8080:8080 api.settime.ru
```

WebSocket: `ws://localhost:8080`
