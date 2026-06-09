import { createServer } from 'node:http';
import { config } from './config.js';
import { createNtpSync } from './ntp.js';
import { attachWebSocketServer } from './ws.js';

const ntp = createNtpSync();
const server = createServer((_req, res) => {
  res.statusCode = 404;
  res.end();
});

attachWebSocketServer(server, ntp);

const start = async (): Promise<void> => {
  await ntp.start();

  server.listen(config.port, () => {
    console.log(`[server] ws://0.0.0.0:${config.port}`);
  });
};

const shutdown = (signal: NodeJS.Signals): void => {
  console.log(`[server] ${signal}, останавливаемся...`);

  ntp.stop();

  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start().catch((err: unknown) => {
  console.error('[server] не удалось запуститься:', err);
  process.exit(1);
});
