const request = require('supertest');
const app = require('../app');

describe('Auth Service Endpoints', () => {

const uniqueEmail = `test${Date.now()}@mail.com`;

test('POST /api/auth/register - debe registrar usuario', async () => {

const response = await request(app)
  .post('/api/auth/register')
  .send({
    email: uniqueEmail,
    password: '12345678'
  });

expect(response.statusCode).toBe(201);
expect(response.body.user).toBeDefined();
expect(response.body.user.email).toBe(uniqueEmail);

});

test('POST /api/auth/register - email inválido', async () => {

const response = await request(app)
  .post('/api/auth/register')
  .send({
    email: 'correoinvalido',
    password: '12345678'
  });

expect(response.statusCode).toBe(400);

});

test('POST /api/auth/register - password muy corta', async () => {

const response = await request(app)
  .post('/api/auth/register')
  .send({
    email: 'corta@test.com',
    password: '123'
  });

expect(response.statusCode).toBe(400);

});

test('POST /api/auth/login - credenciales válidas', async () => {

const response = await request(app)
  .post('/api/auth/login')
  .send({
    email: uniqueEmail,
    password: '12345678'
  });

expect(response.statusCode).toBe(200);
expect(response.body.token).toBeDefined();
expect(response.body.token.startsWith('AUTH-')).toBe(true);

});

test('POST /api/auth/login - password incorrecta', async () => {

const response = await request(app)
  .post('/api/auth/login')
  .send({
    email: uniqueEmail,
    password: 'incorrecta123'
  });

expect(response.statusCode).toBe(401);

});

test('POST /api/auth/login - usuario inexistente', async () => {

const response = await request(app)
  .post('/api/auth/login')
  .send({
    email: 'noexiste@test.com',
    password: '12345678'
  });

expect(response.statusCode).toBe(401);

});

});

//