import type { Express } from 'express';
import { Paths, Service } from './constants.js';

const registerRoutes = (app: Express): void => {
  app.get(Paths.Root, (_req, res) => {
    res.status(200).json({
      name: Service.name,
      description: Service.description,
      endpoints: {
        websocket: Paths.WebSocket,
        health: Paths.Health,
      },
      docs: Service.docs,
    });
  });

  app.get(Paths.Health, (_req, res) => {
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: Date.now(),
    });
  });
};

export { registerRoutes };
