import { hashPassword, comparePassword } from '../utils/password';

describe('Password Utils', () => {
  test('should hash password correctly', async () => {
    const password = 'testpassword123';
    const hashedPassword = await hashPassword(password);
    
    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword.length).toBeGreaterThan(50);
  });

  test('should compare password correctly', async () => {
    const password = 'testpassword123';
    const hashedPassword = await hashPassword(password);
    
    const isValid = await comparePassword(password, hashedPassword);
    expect(isValid).toBe(true);
    
    const isInvalid = await comparePassword('wrongpassword', hashedPassword);
    expect(isInvalid).toBe(false);
  });
});