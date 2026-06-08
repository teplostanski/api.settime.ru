import { WebSocketServer } from 'ws';

const attachWebSocketServer = (httpServer, ntp) => {
  const wss = new WebSocketServer({ server: httpServer });

  const sendTime = (ws) => {
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
