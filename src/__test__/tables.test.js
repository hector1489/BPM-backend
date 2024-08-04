const request = require('supertest');
const app = require('../server/index');

describe('Tabla Endpoints', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'testuser@example.com', password: 'password123' });
    token = res.body.token;
  });

  test('should receive table details', async () => {
    const res = await request(app)
      .post('/tabla-details')
      .set('Authorization', `Bearer ${token}`)
      .send({
        column1: 'value1',
        column2: 'value2',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Datos de la tabla recibidos correctamente');
  });

  test('should get table details', async () => {
    const res = await request(app)
      .get('/tabla-details')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test('should receive table warning', async () => {
    const res = await request(app)
      .post('/tabla-warning')
      .set('Authorization', `Bearer ${token}`)
      .send({
        column1: 'value1',
        column2: 'value2',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Datos de la tabla recibidos correctamente');
  });

  test('should get table warning', async () => {
    const res = await request(app)
      .get('/tabla-warning')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
