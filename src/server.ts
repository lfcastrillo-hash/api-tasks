import 'dotenv/config'; // cargar .env ANTES de importar cualquier otra cosa

import { validateEnv } from './config/env';
import { createApp }   from './app';

validateEnv();

const PORT = parseInt(process.env.PORT ?? '3000', 10);
const app  = createApp();

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server:  http://localhost:${PORT}`);
  console.log(`🌍 Env:     ${process.env.NODE_ENV ?? 'development'}`);
  console.log(`📋 Health:  http://localhost:${PORT}/health\n`);
});

// Graceful shutdown — permite que las peticiones en curso finalicen
const shutdown = (signal: string) => {
  console.log(`\n${signal} recibido. Cerrando servidor...`);
  server.close(() => {
    console.log('✓ Servidor cerrado correctamente');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
