import { GET } from './route'; // Adjust the path as necessary
import { sql } from '@vercel/postgres';
import moment from 'moment';

jest.mock('@vercel/postgres', () => ({
  sql: jest.fn(),
}));

describe('GET /api/diary', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return daily and weekly data', async () => {
    const request = {
      url: 'http://localhost/api/diary?user=test-uid&date=2024-10-09',
    } as unknown as Request;

    (sql as unknown as jest.Mock)
      .mockResolvedValueOnce({ rows: [{ foodEntry: { fid: 'food-1', plantPoints: 10 } }] }) // Daily data
      .mockResolvedValueOnce({ rows: [{ foodEntry: { fid: 'food-1', plantPoints: 10 } }] }); // Weekly data

    const response = await GET(request);
    const responseData = await response.json();

    expect(responseData.dailyData.length).toBe(1);
    expect(responseData.weeklyPlantPoints).toBe(10);
  });
});
