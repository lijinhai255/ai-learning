import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import { ValidationPipe } from './pipes/heyi-id-params.js';
import UserGuard from './guards/user.js';

@Controller('heyi')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(new UserGuard())
  getHello(): string {
    for (let index = 0; index < 100000; index++) {
      
      
    }
    return this.appService.getHello();
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  getHelloDetail(
    @Param('id') id: string,
    @Query('name') name: string,
    @Body() body: any,
  ): string {
    console.log('🚀 ~ AppController ~ getHelloDetail ~ id:', id, name, body);

    return this.appService.getHello();
  }

  @Post()
  saveHello(): string {
    return this.appService.saveHello();
  }

  @Put()
  updateHello(): string {
    return this.appService.updateHello();
  }

  @Delete()
  deleteHello(): string {
    return this.appService.deleteHello();
  }
}
