import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // 操作数据库
    // 读写文件
    // AI Agent 服务
    return 'Hello World!';
  }
}
