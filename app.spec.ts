import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('With valid JWT', async () => {
    const JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY3MjE3NjYxNywiZXhwIjoxNjcyMTc2Njc3fQ._CNliq2v7CsOu_pQnD89XhECnXvFCVAm2Wfm5vJuOKA`;
    const response = await request(app.getHttpServer())
      .get('/')
      .set('Authorization', `Bearer ${JWT}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.jwtData).toEqual({
      exp: 1672176677,
      iat: 1672176617,
      sub: 1,
    });
  });

  it('Without authorization header', async () => {
    const response = await request(app.getHttpServer()).get('/');
    expect(response.statusCode).toEqual(200);
    expect(response.body.jwtData).toEqual(null);
  });
});
