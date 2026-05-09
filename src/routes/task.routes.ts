import { Router } from 'express';
import * as TC from '../controllers/task.controller';
import { authMiddleware }                      from '../middleware/auth.middleware';
import { validateBody }                        from '../middleware/validate.middleware';
import { createTaskSchema, updateTaskSchema }  from '../schemas/task.schema';

export const taskRouter = Router();

// Todas las rutas de tareas requieren autenticación
taskRouter.use(authMiddleware);

taskRouter
  .route('/')
  .get(TC.getAllTasks)                             // GET  /tasks
  .post(validateBody(createTaskSchema), TC.createTask); // POST /tasks

taskRouter
  .route('/:id')
  .get(TC.getTaskById)                                   // GET    /tasks/:id
  .patch(validateBody(updateTaskSchema), TC.updateTask)  // PATCH  /tasks/:id
  .delete(TC.deleteTask);                                // DELETE /tasks/:id
