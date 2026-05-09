import { Request, Response, NextFunction } from 'express';

/**
 * Logger de peticiones HTTP con colores por código de estado.
 * Se ejecuta después de que la respuesta es enviada (evento 'finish').
 */
export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const start = Date.now();
  const { method, path } = req;

  res.on('finish', () => {
    const ms     = Date.now() - start;
    const status = res.statusCode;

    const color =
      status >= 500 ? '\x1b[31m' // rojo
      : status >= 400 ? '\x1b[33m' // amarillo
      : status >= 200 ? '\x1b[32m' // verde
      : '\x1b[0m';

    console.log(`${color}${method}\x1b[0m ${path} → ${status} (${ms}ms)`);
  });

  next();
};
