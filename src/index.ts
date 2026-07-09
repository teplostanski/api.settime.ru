import { createServer } from 'node:http';
import express from 'express';
import { config } from './config.js';
import { startNtp, stopNtp } from './ntp.js';
import { registerRoutes } from './routes.js';
import { attachWebSocketServer } from './ws.js';

const app = express();

registerRoutes(app);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const server = createServer(app);

attachWebSocketServer(server);

const start = async (): Promise<void> => {
  await startNtp(config.ntp);

  server.listen(config.port, () => {
    console.log(`[server] ws://0.0.0.0:${config.port}`);
  });
};

const shutdown = (signal: NodeJS.Signals): void => {
  console.log(`[server] ${signal}, останавливаемся...`);

  stopNtp();

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
