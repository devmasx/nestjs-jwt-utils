import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { JwtService } from '@nestjs/jwt';

const jwtService = new JwtService({ secret: 'secret' });

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('JwtDecode param decorator', () => {
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

    it('With wrong format JWT', async () => {
      const JWT = `NOT_VALID`;
      const response = await request(app.getHttpServer())
        .get('/')
        .set('Authorization', `Bearer ${JWT}`);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        message: 'Bad jwt token format',
        statusCode: 400,
      });
    });

    it('Without authorization header', async () => {
      const response = await request(app.getHttpServer()).get('/');
      expect(response.statusCode).toEqual(200);
      expect(response.body.jwtData).toEqual(null);
    });
  });

  describe('JwtGuard nestjs Guard', () => {
    [
      ['/admin', { role: 'user' }, 403],
      ['/admin', { role: 'admin' }, 200],
      ['/users/1', { scopes: 'users:read' }, 403],
      ['/users/1', { scopes: 'users:read users:admin' }, 200],
      [
        '/decode',
        { scopes: 'users:read users:admin' },
        200,
        'x-custom-authorization',
      ],
      ['/verify', { scopes: 'users:read' }, 403],
    ].forEach(
      ([endpoint, data, expectedStatus, header = 'Authorization']: any) => {
        it(`Guard ${endpoint}`, async () => {
          const jwt = jwtService.sign(data);
          const response = await request(app.getHttpServer())
            .get(endpoint)
            .set(header, `Bearer ${jwt}`);
          expect(response.statusCode).toEqual(expectedStatus);
        });
      },
    );
  });
});
