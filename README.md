# api.settime.ru

WebSocket-сервер точного времени (NTP).

## Локально

```bash
npm install
npm run dev
```

`ws://localhost:8080`

## Docker

```bash
npm run docker:dev
```

## Деплой

Push в `main` -> GitHub Actions. **Repository secrets** / **variables** (не Environment).

| Secret | Значение |
|--------|----------|
| `SSH_HOST` | IP VPS |
| `SSH_USER` | пользователь VPS |
| `SSH_PRIVATE_KEY` | приватный SSH-ключ целиком (`BEGIN`…`END`), не `.pub` |

| Variable | Значение |
|----------|----------|
| `DOMAIN` | домен, напр. `time.example.com` |
| `SSH_PORT` | SSH-порт VPS (необяз., по умолчанию `22`) |

VPS: Traefik `/opt/proxy`, app `/opt/<APP_DIR>`. Фронт: `wss://<DOMAIN>`

## Переменные

Значения по умолчанию (NTP, PORT и остальное) заданы в `src/config.ts` в объекте `Defaults`. При отсутствии переменной окружения приложение использует значение из этого объекта.

В `.env` указываются только параметры, зависящие от среды: `DOMAIN` (домен для Traefik) и `IMAGE` (образ из GHCR). Остальные настройки в `.env` не дублируются.

Локально: `cp .env.example .env`. На VPS GitHub Action перезаписывает `/opt/<APP_DIR>/.env` при каждом деплое. `docker-compose.yml` подключает файл через `env_file`; при отсутствии `.env` compose стартует, приложение работает на `Defaults`.

Переопределение настроек приложения на VPS: ключи `PORT`, `NTP_HOST`, `NTP_PORT`, `NTP_TIMEOUT_MS`, `NTP_SYNC_INTERVAL_MS`, `NTP_STARTUP_ATTEMPTS` в `.env` (см. `src/config.ts` -> `Defaults`).

## WebSocket

```json
{ "type": "unix_timestamp", "value": 1740000000000 }
```
