import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

/**
 * Error personalizado con código HTTP.
 * Úsalo en los servicios para errores operacionales conocidos.
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly isOperational = true,
  ) {
    super(message);
    this.name = 'AppError';
    // Necesario para que instanceof funcione correctamente con TypeScript
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Manejador global de errores — debe tener exactamente 4 parámetros.
 * Express 5 envía aquí los rejected promises de rutas async automáticamente.
 */
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const isDev = process.env.NODE_ENV === 'development';

  // Error operacional controlado (ej: 404, 400, 401)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(isDev && { stack: err.stack }),
    });
    return;
  }

  // Error de Supabase / PostgREST
  if (err.message?.includes('PGRST')) {
    res.status(400).json({
      success: false,
      message: 'Error en la consulta a la base de datos',
    });
    return;
  }

  // Error no controlado — loggear en producción y devolver 500
  console.error('[UNHANDLED ERROR]', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    ...(isDev && { stack: err.stack, name: err.name }),
  });
};
