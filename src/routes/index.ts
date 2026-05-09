import { Router } from 'express';
import { taskRouter } from './task.routes';
import { authRouter } from './auth.routes';

export const apiRouter = Router();

apiRouter.use('/tasks', taskRouter);
apiRouter.use('/auth',  authRouter);
