import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  user: 'heyi',
  host: '127.0.0.1',
  database: 'postgres',
  password: 'xiao123',
  port: 5432,
});

@Injectable()
export class AppService {
  // constructor(private readonly dsService: DsService) {}
  constructor(@Inject("PG_POOL") private readonly pool: Pool) {}

  async getHello() {
    // 操作数据库
    // 读写文件
    // AI Agent 服务

    // const res = await pool.query("SELECT * FROM detail")
    // console.log('🚀 ~ AppService ~ getHello ~ res:', res.rows)
    const res = await this.pool.query("SELECT * FROM detail")
    console.log('🚀 ~ AppService ~ getHello ~ res:', res.rows)

    // 新增数据
    // await pool.query("INSERT INTO detail (name, age) VALUES ($1, $2)", ['xheyi', 18])

    return 'Hello World!';
  }
}
