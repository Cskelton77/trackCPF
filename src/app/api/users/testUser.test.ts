// src/app/api/users/route.test.ts

import { POST, DELETE } from './route';
import { sql } from '@vercel/postgres';

jest.mock('@vercel/postgres');

describe('Users API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should return the UID for an existing email', async () => {
      const req = new Request('http://localhost/api/users', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      });

      (sql as unknown as jest.Mock).mockReturnValueOnce({
        rowCount: 1,
        rows: [{ uid: 'test-uid' }],
      });

      const response = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json).toBe('test-uid');
    });

    it('should return 500 for non-existing email', async () => {
      const req = new Request('http://localhost/api/users', {
        method: 'POST',
        body: JSON.stringify({
          email: 'nonexistent@example.com',
        }),
      });

      (sql as unknown as jest.Mock).mockReturnValueOnce({
        rowCount: 0,
      });

      const response = await POST(req);
      expect(response.status).toBe(500);
    });
  });

  describe('DELETE', () => {
    it('should delete a user by email and return 204', async () => {
      const req = new Request('http://localhost/api/users?email=test@example.com', {
        method: 'DELETE',
      });

      (sql as unknown as jest.Mock).mockReturnValueOnce({
        rowCount: 1,
      });

      const response = await DELETE(req);
      expect(response.status).toBe(204);
    });

    it('should delete a user by uid and return 204', async () => {
      const req = new Request('http://localhost/api/users?uid=test-uid', {
        method: 'DELETE',
      });

      (sql as unknown as jest.Mock).mockReturnValueOnce({
        rowCount: 1,
      });

      const response = await DELETE(req);
      expect(response.status).toBe(204);
    });

    it('should return 500 if no user is found by email', async () => {
      const req = new Request('http://localhost/api/users?email=nonexistent@example.com', {
        method: 'DELETE',
      });

      (sql as unknown as jest.Mock).mockReturnValueOnce({
        rowCount: 0,
      });

      const response = await DELETE(req);
      expect(response.status).toBe(500);
    });

    it('should return 500 if no user is found by uid', async () => {
      const req = new Request('http://localhost/api/users?uid=nonexistent-uid', {
        method: 'DELETE',
      });

      (sql as unknown as jest.Mock).mockReturnValueOnce({
        rowCount: 0,
      });

      const response = await DELETE(req);
      expect(response.status).toBe(500);
    });

    it('should return 304 if neither email nor uid is provided', async () => {
      const req = new Request('http://localhost/api/users', {
        method: 'DELETE',
      });

      const response = await DELETE(req);
      expect(response.status).toBe(304);
    });
  });
});
