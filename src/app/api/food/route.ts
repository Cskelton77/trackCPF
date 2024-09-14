import { v4 as uuidv4 } from 'uuid';
import { sql } from '@vercel/postgres';
import { DefinedFoodObject, FoodObject } from '@/interfaces/FoodObject';

interface FoodDatabase {
  fid: string;
  uid: string;
  foodobject: FoodObject;
}
/**
 * Add new items into the food database for ths current user
 */
export async function POST(request: Request) {
  const body = await request.json();
  const fid = uuidv4();
  const uid = body.user;
  const foodobject = JSON.stringify({ fid, ...body.food });
  await sql<FoodDatabase>`
        INSERT INTO fooddatabase(fid, uid, foodobject) 
        VALUES (${fid}, ${uid}, ${foodobject});`;
  return Response.json(foodobject);
}

/**
 * Retrieve selected items from the user's food database by search
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get('user');
  const query = searchParams.get('q');
  const data = await sql`
    SELECT foodobject
    FROM fooddatabase
    WHERE uid like ${user}`;
  const listOfFoods: DefinedFoodObject[] = [];
  data.rows.forEach((row) => {
    const rowName = row.foodobject.name.toLowerCase();
    const queryLower = query?.toLowerCase() || '';
    if (query && rowName.includes(queryLower)) {
      listOfFoods.push(row.foodobject);
    }
  });
  return Response.json(listOfFoods);
}

/**
 * Update selected item in the user's food database by search
 */
type Patch = {
  user: string;
  foodId: string;
  update: Partial<FoodObject>;
};
export async function PATCH(request: Request, context: { params: Patch }) {
  // const team = context.params.team // '1'
  return new Response('200');
}

/**
 * Delete selected item in the user's food database by search
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const foodId = searchParams.get('foodId');
  const data = await sql`
    DELETE FROM fooddatabase
    WHERE fid like ${foodId}
    RETURNING *`;
  if (data.rowCount !== 1) {
    return new Response('500');
  }
  return new Response('204');
}
