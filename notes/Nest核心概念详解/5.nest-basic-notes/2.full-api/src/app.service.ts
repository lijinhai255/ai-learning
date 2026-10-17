import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// @Injectable()
export class AppService {
  getHello(): any {
    // 操作数据库
    // 读写文件
    // AI Agent 服务
    // throw new Error('人为错误...');

    // throw new HttpException("forbidden", HttpStatus.FORBIDDEN)
    
    // try {
      
    // throw new HttpException("forbidden", HttpStatus.FORBIDDEN)
    //   throw new Error('人为错误...');
    // } catch(e) {
    //   return {
    //     msg: '出错啦，稍后重试...',
    //     success: false
    //   }
    // }
    return 'Hello World!';
  }
  saveHello(): string {
    // 操作数据库
    return 'post Hello World!';
  }

  updateHello(): string {
    // 操作数据库
    return 'put Hello World!';
  }

  deleteHello(): string {
    // 操作数据库
    return 'delete Hello World!';
  }
}
