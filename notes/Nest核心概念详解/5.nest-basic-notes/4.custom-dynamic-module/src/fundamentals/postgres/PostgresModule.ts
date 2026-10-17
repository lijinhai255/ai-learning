import { Module, DynamicModule, Global } from '@nestjs/common';
import { Pool } from 'pg';

export interface PostgresModuleOptions {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

@Global()
@Module({})
export class PostgresModule {
  static forRoot(options: PostgresModuleOptions): DynamicModule {
    const poolProvider = {
      provide: 'PG_POOL',
      useValue: new Pool(options),
    };

    return {
      module: PostgresModule,
      providers: [poolProvider],
      exports: [],
    };
  }
}