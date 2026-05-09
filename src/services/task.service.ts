import { supabase } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import type { Task, CreateTaskDTO, UpdateTaskDTO } from '../models/task.model';

/**
 * TaskService: toda la lógica de negocio para las tareas.
 * Los controllers solo orquestan; la lógica vive aquí.
 */
export class TaskService {
  /**
   * Devuelve todas las tareas del usuario ordenadas por fecha de creación (más recientes primero).
   */
  async findAll(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError(500, error.message);
    return data ?? [];
  }

  /**
   * Busca una tarea por ID verificando que pertenezca al usuario.
   * Lanza 404 si no existe o no es del usuario.
   */
  async findById(id: string, userId: string): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) throw new AppError(404, 'Tarea no encontrada');
    return data;
  }

  /**
   * Crea una nueva tarea y la asocia al usuario autenticado.
   */
  async create(dto: CreateTaskDTO, userId: string): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...dto, user_id: userId })
      .select()
      .single();

    if (error) throw new AppError(400, error.message);
    return data!;
  }

  /**
   * Actualiza parcialmente una tarea (PATCH).
   * Primero verifica que existe y pertenece al usuario.
   */
  async update(id: string, dto: UpdateTaskDTO, userId: string): Promise<Task> {
    // Verificación de propiedad antes de actualizar
    await this.findById(id, userId);

    const { data, error } = await supabase
      .from('tasks')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(400, error.message);
    return data!;
  }

  /**
   * Elimina una tarea verificando que pertenezca al usuario.
   */
  async delete(id: string, userId: string): Promise<void> {
    await this.findById(id, userId); // garantiza propiedad

    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) throw new AppError(500, error.message);
  }
}
