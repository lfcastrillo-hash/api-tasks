import { z } from 'zod';

export const createTaskSchema = z.object({
  title:       z.string().min(1, 'El título es requerido').max(255),
  description: z.string().max(1000).optional(),
  priority:    z.enum(['low', 'medium', 'high']).default('medium'),
});

// Para PATCH: todos los campos opcionales + campo 'completed'
export const updateTaskSchema = createTaskSchema
  .partial()
  .extend({ completed: z.boolean().optional() });

// Inferimos los tipos desde Zod (evita duplicar tipos)
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
