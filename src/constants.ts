export const Paths = {
  Root: '/',
  WebSocket: '/ws',
  Health: '/health',
} as const;

export const Service = {
  name: 'api.settime.ru',
  description:
    'WebSocket-сервер точного времени. Синхронизируется с NTP и отдаёт Unix timestamp в миллисекундах.',
  docs: {
    readme: 'https://github.com/teplostanski/api.settime.ru',
    app: 'https://settime.ru',
  },
} as const;