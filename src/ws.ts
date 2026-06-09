import type { Server } from 'node:http';
import { WebSocketServer, type WebSocket } from 'ws';
import type { NtpSync } from './ntp.js';

const attachWebSocketServer = (httpServer: Server, ntp: NtpSync): WebSocketServer => {
  const wss = new WebSocketServer({ server: httpServer });

  const sendTime = (ws: WebSocket): void => {
    ws.send(
      JSON.stringify({
        type: 'unix_timestamp',
        value: ntp.getAccurateTimeMs(),
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
