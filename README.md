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

Push в `main` → GitHub Actions. **Repository secrets** / **variables** (не Environment).

| Secret | Значение |
|--------|----------|
| `SSH_HOST` | IP VPS |
| `SSH_USER` | пользователь VPS |
| `SSH_PRIVATE_KEY` | приватный SSH-ключ целиком (`BEGIN`…`END`), не `.pub` |

| Variable | Значение |
|----------|----------|
| `DOMAIN` | домен, напр. `time.example.com` |

VPS: Traefik `/opt/proxy`, app `/opt/<APP_DIR>`. Фронт: `wss://<DOMAIN>`

## WebSocket

```json
{ "type": "unix_timestamp", "value": 1740000000000 }
```

Переменные — см. `.env.example`.
