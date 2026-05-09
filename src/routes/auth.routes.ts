import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.middleware';
import { authLimiter }  from '../middleware/rateLimiter';
import * as AC from '../controllers/auth.controller';

const authSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const authRouter = Router();

authRouter.post('/register', authLimiter, validateBody(authSchema), AC.register);
authRouter.post('/login',    authLimiter, validateBody(authSchema), AC.login);
