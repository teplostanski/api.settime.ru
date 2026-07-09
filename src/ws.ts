import type { Server } from 'node:http';
import { now } from './ntp.js';
import { WebSocketServer, type WebSocket } from 'ws';
import { Paths } from './constants.js';

const attachWebSocketServer = (httpServer: Server): WebSocketServer => {
  const wss = new WebSocketServer({ server: httpServer, path: Paths.WebSocket });

  const sendTime = (ws: WebSocket): void => {
    ws.send(
      JSON.stringify({
        type: 'unix_timestamp',
        value: now(),
      }),
    );
  };

  wss.on('connection', (ws) => {
    console.log('[ws] клиент подключился');
    sendTime(ws);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === 'refresh') {
          console.log('[ws] клиент запросил обновление');
          sendTime(ws);
        }
      } catch (error) {
        console.error(`[ws] ошибка: ${error}`);
      }
    });

    ws.on('close', () => {
      console.log('[ws] клиент отключился');
    });
  });

  return wss;
};

export { attachWebSocketServer };
