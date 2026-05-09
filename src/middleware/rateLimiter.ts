import { rateLimit } from 'express-rate-limit';

/**
 * Límite general para la API: 100 peticiones cada 15 minutos por IP.
 * Se aplica a todas las rutas bajo /api.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas solicitudes, intenta nuevamente en 15 minutos',
  },
});

/**
 * Límite estricto para autenticación: 10 intentos por hora por IP.
 * Protege contra ataques de fuerza bruta en login/register.
 */
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiados intentos de autenticación, intenta en 1 hora',
  },
});
