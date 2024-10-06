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
  const response = await sql<FoodDatabase>`
        INSERT INTO fooddatabase(fid, uid, foodobject) 
        VALUES (${fid}, ${uid}, ${foodobject});`;

  if (response.rowCount == 1) {
    return Response.json(foodobject);
  }

  return new Response('500');
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
  if (!query) {
    const listOfFoods: DefinedFoodObject[] = [];
    data.rows.forEach((row) => listOfFoods.push(row.foodobject));
    listOfFoods.sort((a, b) => {
      const itemA = a.name.toLowerCase();
      const itemB = b.name.toLowerCase();
      return itemA < itemB ? -1 : 1;
    });
    return Response.json(listOfFoods);
  }

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
  const body = await request.json();
  const uid = body.uid;
  const fid = body.food.fid;
  const foodobject = JSON.stringify({ ...body.food });
  const response = await sql<FoodDatabase>`
   UPDATE fooddatabase
   SET foodobject = ${foodobject}
   WHERE uid = ${uid}
   AND fid = ${fid}`;

  if (response.rowCount == 1) {
    return Response.json(foodobject);
  }

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
