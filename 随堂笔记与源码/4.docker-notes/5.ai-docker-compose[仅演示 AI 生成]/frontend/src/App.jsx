import { useEffect, useState } from 'react';

export default function App() {
  const [health, setHealth] = useState(null);
  const [visits, setVisits] = useState(null);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');

  const refresh = async () => {
    try {
      const [h, v, u] = await Promise.all([
        fetch('/health').then((r) => r.json()),
        fetch('/api/visits').then((r) => r.json()),
        fetch('/api/users').then((r) => r.json()),
      ]);
      setHealth(h);
      setVisits(v.visits);
      setUsers(u.users || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const addUser = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setName('');
    refresh();
  };

  const delUser = async (id) => {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    refresh();
  };

  return (
    <div className="container">
      <h1>AI Docker Compose Demo</h1>

      <section>
        <h2>服务健康</h2>
        <pre>{JSON.stringify(health, null, 2)}</pre>
        <p>
          累计访问次数（Redis 计数）：<b>{visits ?? '-'}</b>
        </p>
        <button onClick={refresh}>刷新</button>
      </section>

      <section>
        <h2>用户列表（PostgreSQL）</h2>
        <form onSubmit={addUser}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入用户名"
          />
          <button type="submit">添加</button>
        </form>
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              #{u.id} {u.name}{' '}
              <button onClick={() => delUser(u.id)}>删除</button>
            </li>
          ))}
        </ul>
      </section>

      <footer>
        <small>
          前端由 Caddy 作为 CDN 静态托管，/api/* 反代到 Node 后端
        </small>
      </footer>
    </div>
  );
}