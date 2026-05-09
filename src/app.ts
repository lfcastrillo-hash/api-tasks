import express, { Application } from 'express';
import cors   from 'cors';
import helmet from 'helmet';

import { apiRouter }        from './routes';
import { errorHandler }     from './middleware/error.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';
import { apiLimiter }       from './middleware/rateLimiter';

export const createApp = (): Application => {
  const app = express();

  // ── Seguridad ─────────────────────────────────────────────────
  app.use(helmet());
  app.use(cors({
    origin:      process.env.ALLOWED_ORIGINS?.split(',') ?? '*',
    credentials: true,
  }));
  app.use('/api', apiLimiter);

  // ── Body parsing (integrado en Express 5, ya no instalar body-parser) ──
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: false }));

  // ── Logger ────────────────────────────────────────────────────
  app.use(loggerMiddleware);

  // ── Rutas de la API ───────────────────────────────────────────
  app.use('/api/v1', apiRouter);

  // ── Health check ──────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ── Ruta 404 ──────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Ruta no encontrada' });
  });

  // ── Error handler SIEMPRE al final ────────────────────────────
  // Express 5: recibe automáticamente los rejected promises de rutas async
  app.use(errorHandler);

  return app;
};
