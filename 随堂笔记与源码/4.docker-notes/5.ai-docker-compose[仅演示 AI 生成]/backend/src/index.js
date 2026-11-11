// 后端服务入口
// 演示：Express + PostgreSQL + Redis 的容器化编排
const express = require('express');
const { Pool } = require('pg');
const Redis = require('ioredis');

const app = express();
app.use(express.json());

// ---------- 配置 ----------
const PORT = parseInt(process.env.PORT || '3000', 10);
const PG_HOST = process.env.PG_HOST || 'db';
const PG_PORT = parseInt(process.env.PG_PORT || '5432', 10);
const PG_USER = process.env.POSTGRES_USER || 'heyi';
const PG_PASSWORD = process.env.POSTGRES_PASSWORD || 'heyi_pwd';
const PG_DB = process.env.POSTGRES_DB || 'heyi_app';
const REDIS_HOST = process.env.REDIS_HOST || 'cache';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);

// ---------- PostgreSQL ----------
const pool = new Pool({
  host: PG_HOST,
  port: PG_PORT,
  user: PG_USER,
  password: PG_PASSWORD,
  database: PG_DB,
  max: 10,
  idleTimeoutMillis: 30000,
});

// ---------- Redis ----------
const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  lazyConnect: false,
});

// ---------- 启动时初始化表结构 ----------
async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('[db] users table ready');
  } finally {
    client.release();
  }
}

pool.on('error', (err) => console.error('[db] unexpected error:', err));
redis.on('error', (err) => console.error('[redis] error:', err));

// ---------- 路由 ----------
app.get('/health', async (_req, res) => {
  let pgOk = false;
  let redisOk = false;
  try {
    await pool.query('SELECT 1');
    pgOk = true;
  } catch (e) {
    console.error('[health] pg error:', e.message);
  }
  try {
    const pong = await redis.ping();
    redisOk = pong === 'PONG';
  } catch (e) {
    console.error('[health] redis error:', e.message);
  }
  res.json({
    status: pgOk && redisOk ? 'ok' : 'degraded',
    pg: pgOk,
    redis: redisOk,
    time: new Date().toISOString(),
  });
});

// 用 Redis 累加访问次数
app.get('/api/visits', async (_req, res) => {
  try {
    const count = await redis.incr('site:visits');
    res.json({ visits: count });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/users', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, created_at FROM users ORDER BY id DESC LIMIT 50'
    );
    res.json({ users: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/users', async (req, res) => {
  const name = (req.body && req.body.name || '').trim();
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO users(name) VALUES($1) RETURNING id, name, created_at',
      [name]
    );
    res.status(201).json({ user: rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: 'invalid id' });
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ deleted: result.rowCount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- 启动 ----------
(async () => {
  // 简单重试：等待 db 准备就绪
  let retries = 30;
  while (retries > 0) {
    try {
      await pool.query('SELECT 1');
      break;
    } catch (e) {
      console.log(`[db] waiting... (${retries})`);
      retries -= 1;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  try {
    await initDb();
  } catch (e) {
    console.error('[db] init failed:', e.message);
  }
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[api] listening on http://0.0.0.0:${PORT}`);
  });
})();