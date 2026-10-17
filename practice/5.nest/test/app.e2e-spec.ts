import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, Controller, Get, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

@Controller('_test/errors')
class ErrorTestController {
  @Get('bad-request')
  badRequest(): never {
    throw new BadRequestException({ message: ['name is required'] });
  }

  @Get('unexpected')
  unexpected(): never {
    throw new Error('private failure details');
  }
}

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [ErrorTestController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) returns the welcome message', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/cats (GET) returns cats and logs the request', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    try {
      await request(app.getHttpServer())
        .get('/cats')
        .expect(200)
        .expect([]);
      expect(log).toHaveBeenCalledWith('Request...', 'GET', '/cats', 'LogMiddleware');
    } finally {
      log.mockRestore();
    }
  });

  it('formats a missing route as an HTTP error', async () => {
    const response = await request(app.getHttpServer()).get('/missing').expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Cannot GET /missing',
      path: '/missing',
      timestamp: expect.any(String),
    });
  });

  it('preserves validation messages in a bad request', async () => {
    const response = await request(app.getHttpServer())
      .get('/_test/errors/bad-request')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: ['name is required'],
      path: '/_test/errors/bad-request',
      timestamp: expect.any(String),
    });
  });

  it('hides internal details from unexpected errors', async () => {
    const response = await request(app.getHttpServer())
      .get('/_test/errors/unexpected')
      .expect(500);

    expect(response.body).toEqual({
      statusCode: 500,
      message: 'Internal server error',
      path: '/_test/errors/unexpected',
      timestamp: expect.any(String),
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
