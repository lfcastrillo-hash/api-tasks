import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

// Mock del módulo de base de datos para no necesitar Supabase real en tests
jest.mock('../config/database', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockResolvedValue({
      data: [
        {
          id:          'uuid-1',
          title:       'Tarea de prueba',
          description: null,
          completed:   false,
          priority:    'medium',
          user_id:     'user-1',
          created_at:  '2024-01-01T00:00:00Z',
          updated_at:  '2024-01-01T00:00:00Z',
        },
      ],
      error: null,
    }),
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'user-1', email: 'test@test.com' } },
        error: null,
      }),
    },
  },
}));

describe('Tasks API', () => {
  const AUTH_TOKEN = 'Bearer test-token-valido';

  // ── GET /api/v1/tasks ──────────────────────────────────────────
  describe('GET /api/v1/tasks', () => {
    it('devuelve 401 si no hay token de autorización', async () => {
      const res = await request(app).get('/api/v1/tasks');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('devuelve 401 si el header no tiene formato Bearer', async () => {
      const res = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', 'sin-bearer-prefix');
      expect(res.status).toBe(401);
    });

    it('devuelve lista de tareas con token válido', async () => {
      const res = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', AUTH_TOKEN);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.count).toBeGreaterThanOrEqual(0);
    });
  });

  // ── POST /api/v1/tasks ─────────────────────────────────────────
  describe('POST /api/v1/tasks', () => {
    it('devuelve 400 si el body está vacío', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', AUTH_TOKEN)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.title).toBeDefined();
    });

    it('devuelve 400 si el title supera 255 caracteres', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', AUTH_TOKEN)
        .send({ title: 'a'.repeat(256) });
      expect(res.status).toBe(400);
    });

    it('devuelve 400 si priority no es un valor válido', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', AUTH_TOKEN)
        .send({ title: 'Mi tarea', priority: 'urgente' });
      expect(res.status).toBe(400);
    });
  });

  // ── GET /health ────────────────────────────────────────────────
  describe('GET /health', () => {
    it('devuelve status ok sin autenticación', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.timestamp).toBeDefined();
    });
  });
});
