import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/users (POST)', () => {
    const createUserDto = {
      username: 'testuser',
      name: 'Test',
      surname: 'User',
      password: 'password123',
    };

    return request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.username).toBe(createUserDto.username);
        expect(res.body.name).toBe(createUserDto.name);
        expect(res.body.surname).toBe(createUserDto.surname);
        expect(res.body).toHaveProperty('createdAt');
        expect(res.body).toHaveProperty('updatedAt');
      });
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/users/:id (GET)', async () => {
    // First create a user
    const createUserDto = {
      username: 'testuser2',
      name: 'Test2',
      surname: 'User2',
      password: 'password123',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    const userId = createResponse.body.id;

    // Then get the user by ID
    return request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(userId);
        expect(res.body.username).toBe(createUserDto.username);
      });
  });

  it('/users/:id (PUT)', async () => {
    // First create a user
    const createUserDto = {
      username: 'testuser3',
      name: 'Test3',
      surname: 'User3',
      password: 'password123',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    const userId = createResponse.body.id;

    // Then update the user
    const updateUserDto = {
      name: 'Updated Name',
    };

    return request(app.getHttpServer())
      .put(`/users/${userId}`)
      .send(updateUserDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(userId);
        expect(res.body.name).toBe(updateUserDto.name);
        expect(res.body.username).toBe(createUserDto.username);
      });
  });

  it('/users/:id (DELETE)', async () => {
    // First create a user
    const createUserDto = {
      username: 'testuser4',
      name: 'Test4',
      surname: 'User4',
      password: 'password123',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    const userId = createResponse.body.id;

    // Then delete the user
    return request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .expect(204);
  });
}); 