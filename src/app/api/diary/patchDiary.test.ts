import { PATCH } from './route'; // Adjust the path as necessary
import { sql } from '@vercel/postgres';

jest.mock('@vercel/postgres', () => ({
  sql: jest.fn(),
}));

describe('PATCH /api/diary', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a diary entry and return 204', async () => {
    const request = {
      json: jest.fn().mockResolvedValue({
        did: 'diary-id',
        uid: 'test-uid',
        foodEntry: { fid: 'food-1', plantPoints: 5 },
        serving: 1,
      }),
    } as unknown as Request;

    (sql as unknown as jest.Mock).mockResolvedValue({ rowCount: 1 });

    const response = await PATCH(request);

    expect(response.status).toBe(204);
    expect(sql).toHaveBeenCalled();
  });
});
