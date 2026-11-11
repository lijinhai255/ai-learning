import { describe, expect, it } from 'vitest';
import { AppController } from './app.controller';

describe('健康检查控制器', () => {
  it('返回健康服务响应', () => {
    expect(new AppController().getHealth()).toEqual({ status: 'ok', service: 'todo-api' });
  });
});
