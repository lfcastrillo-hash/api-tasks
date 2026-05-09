-- ================================================================
-- Schema SQL para el proyecto api-tasks
-- Ejecutar en el SQL Editor del dashboard de Supabase
-- ================================================================

-- Tabla principal de tareas
CREATE TABLE tasks (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  description TEXT,
  completed   BOOLEAN     DEFAULT FALSE,
  priority    TEXT        CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Índice para acelerar consultas filtradas por usuario
CREATE INDEX idx_tasks_user_id ON tasks(user_id);

-- Row Level Security: cada usuario solo ve y modifica sus propias tareas
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tasks" ON tasks
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Función para auto-actualizar updated_at en cada UPDATE
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
