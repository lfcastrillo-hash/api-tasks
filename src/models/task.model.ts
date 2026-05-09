export interface Task {
  id:          string;
  title:       string;
  description: string | null;
  completed:   boolean;
  priority:    'low' | 'medium' | 'high';
  user_id:     string;
  created_at:  string;
  updated_at:  string;
}

// DTO para crear una tarea (solo los campos que envía el cliente)
export type CreateTaskDTO = Pick<Task, 'title' | 'description' | 'priority'>;

// DTO para actualizar una tarea (todos los campos son opcionales)
export type UpdateTaskDTO = Partial<CreateTaskDTO & { completed: boolean }>;

// Respuesta genérica de la API
export interface ApiResponse<T> {
  success:  boolean;
  data?:    T;
  message?: string;
  count?:   number;
}
