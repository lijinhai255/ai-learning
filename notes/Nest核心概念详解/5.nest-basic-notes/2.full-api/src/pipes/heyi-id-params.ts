import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('🚀 ~ ValidationPipe ~ transform ~ value:', value);

    // if (typeof value.count !== "number") {
    //     // throw new BadRequestException('validation failed');
    //     throw new BadRequestException('请求参数校验失败');
    
    // }
        // throw new BadRequestException('请求参数校验失败');

    return value;
  }
}
