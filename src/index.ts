import { createServer } from 'node:http';
import Sntp from 'nano-sntp';
import { config } from './config.js';
import { attachWebSocketServer } from './ws.js';

const server = createServer((_req, res) => {
  res.statusCode = 404;
  res.end();
});

attachWebSocketServer(server);

const start = async (): Promise<void> => {
  await Sntp.start({
    hosts: config.ntp.hosts,
    port: config.ntp.port,
    timeout: config.ntp.timeout,
    clockSyncRefresh: config.ntp.syncIntervalMs,
    startupAttempts: config.ntp.startupAttempts,
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'unknown error';
      console.warn(`[ntp] ${message}`);
    },
    onSync: (result) => {
      console.log(
        `[ntp] синхронизирован через ${result.host}, смещение ${result.offsetMs} мс`,
      );
    },
  });

  server.listen(config.port, () => {
    console.log(`[server] ws://0.0.0.0:${config.port}`);
  });
};

const shutdown = (signal: NodeJS.Signals): void => {
  console.log(`[server] ${signal}, останавливаемся...`);

  Sntp.stop();

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
