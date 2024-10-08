import { DELETE } from './route'; // Adjust the path as necessary
import { sql } from '@vercel/postgres';

jest.mock('@vercel/postgres', () => ({
  sql: jest.fn(),
}));

describe('DELETE /api/diary', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a diary entry and return 204', async () => {
    const request = {
      url: 'http://localhost/api/diary?did=diary-id',
    } as unknown as Request;

    (sql as unknown as jest.Mock).mockResolvedValue({ rowCount: 1 });

    const response = await DELETE(request);

    expect(response.status).toBe(204);
    expect(sql).toHaveBeenCalled();
  });

  it('should return 500 if diary entry is not found', async () => {
    const request = {
      url: 'http://localhost/api/diary?did=non-existent-id',
    } as unknown as Request;

    (sql as unknown as jest.Mock).mockResolvedValue({ rowCount: 0 });

    const response = await DELETE(request);

    expect(response.status).toBe(500);
  });
});
