import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service.js';

// import { AppService } from './app.service.js';

// const appserver = new AppService()

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get("heyi")
  getHeyi(): string {
    return "heyi"
  }

  @Post("heyi")
  saveHeyi() {
    return {
      success: true,
      status: 'ok'
    }
  }


}
