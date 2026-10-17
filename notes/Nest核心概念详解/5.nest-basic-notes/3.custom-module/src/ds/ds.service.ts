import { Injectable, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import pg, { Pool } from 'pg';

const dsConfig = {
      user: 'heyi',
      host: '127.0.0.1',
      database: 'postgres',
      password: 'xiao123',
      port: 5432,
    }

// nest 对于完整模块和服务有完整的生命周期管理
// 实现OnModuleInit和OnModuleDestroy接口，实现onModuleInit和onModuleDestroy方法
@Injectable()
export class DsService implements OnModuleInit, OnModuleDestroy {
  private pool: pg.Pool;
  constructor() {
    this.pool = new pg.Pool(dsConfig);
  }
  getHello(): string {
    return 'Hello World!';
  }

  async query(sql: string) {
    try {
      const result = await this.pool.query(sql);
      return result;
    } catch (error) {
      // 异常要不要处理
      // 要处理的话就直接处理掉，把异常吞掉
      // 不处理的话就将异常抛出
      throw error;
    }
  }

  //   模块初始化的时候，连接数据库
  async onModuleInit() {
    await this.pool.connect();
    console.log('ds service onModuleInit');
  }

  //   模块销毁的时候，断开数据库连接
  async onModuleDestroy() {
    await this.pool.end();
    console.log('ds service onModuleDestroy');
  }
}
