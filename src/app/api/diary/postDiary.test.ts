import { POST } from './route'; // Adjust the path as necessary
import { sql } from '@vercel/postgres';

// Mocking the sql function
jest.mock('@vercel/postgres', () => ({
  sql: jest.fn(),
}));

describe('POST /api/diary', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should insert a new diary entry and return 201', async () => {
    const request = {
      json: jest.fn().mockResolvedValue({
        uid: 'test-uid',
        date: '2024-10-09',
        foodEntry: { fid: 'food-1', plantPoints: 10 },
        serving: 2,
        isDirectEntry: false,
        isRecipe: false,
        ingredients: ['ingredient-1', 'ingredient-2'],
      }),
    } as unknown as Request;

    (sql as unknown as jest.Mock).mockResolvedValue({ rowCount: 1 });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(sql).toHaveBeenCalled();
  });
});
