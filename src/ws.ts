import type { Server } from 'node:http';
import Sntp from 'nano-sntp';
import { WebSocketServer, type WebSocket } from 'ws';

const attachWebSocketServer = (httpServer: Server): WebSocketServer => {
  const wss = new WebSocketServer({ server: httpServer });

  const sendTime = (ws: WebSocket): void => {
    ws.send(
      JSON.stringify({
        type: 'unix_timestamp',
        value: Sntp.now(),
      }),
    );
  };

  wss.on('connection', (ws) => {
    console.log('[ws] клиент подключился');
    sendTime(ws);

    ws.on('close', () => {
      console.log('[ws] клиент отключился');
    });
  });

  return wss;
};

export { attachWebSocketServer };
