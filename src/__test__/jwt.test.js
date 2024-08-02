const { jwtSign, jwtVerify } = require('../utils/jwt');

describe('JWT Utility Functions', () => {
  const payload = { userId: 1 };
  let token;

  test('should sign a JWT token', () => {
    token = jwtSign(payload);
    expect(token).toBeDefined();
  });

  test('should verify a JWT token', () => {
    const decoded = jwtVerify(token);
    expect(decoded.userId).toBe(payload.userId);
  });
});
