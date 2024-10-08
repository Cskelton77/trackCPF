import { DiaryData } from '@/interfaces/DailyData';
import { sql } from '@vercel/postgres';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

/**
 * Add new items into the diary database for ths current user
 */
export async function POST(request: Request) {
  const body = await request.json();
  const did = uuidv4();
  const uid = body.uid;
  const date = body.date;
  const foodEntry = JSON.stringify(body.foodEntry);
  const serving = body.serving;
  const isDirectEntry = body.isDirectEntry;
  const isRecipe = body.isRecipe;
  const ingredients = JSON.stringify(body.ingredients);
  const timestamp = Date.now();
  await sql<DiaryData>`
          INSERT INTO diary(did, uid, date, serving, "foodEntry", "isDirectEntry", "isRecipe", ingredients, timestamp) 
          VALUES (${did}, ${uid}, ${date}, ${serving},${foodEntry}, ${isDirectEntry}, ${isRecipe}, ${ingredients}, ${timestamp});`;
  return new Response('201');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get('user');
  const date = searchParams.get('date');
  const data = await sql<DiaryData>`
        SELECT *
        FROM diary
        WHERE uid like ${user}
        AND date::text like ${date}
        ORDER BY timestamp ASC
        `;

  const weekStart = moment(date).startOf('isoWeek').toString();
  const weekEnd = moment(date).endOf('isoWeek').toString();
  const weeklyData = await sql<DiaryData>`
    SELECT *
    FROM diary
    WHERE uid like ${user}
   AND date >= ${weekStart}
    AND date <=  ${weekEnd}
    ORDER BY timestamp ASC
        `;

  const plantPointData = {
    foods: [''],
    points: 0.0,
  };
  weeklyData.rows.forEach((row) => {
    const hasPlantPoints =
      row.foodEntry.fid && row.foodEntry.plantPoints && row.foodEntry.plantPoints > 0;
    if (hasPlantPoints) {
      if (!plantPointData.foods.includes(row.foodEntry.fid)) {
        plantPointData.foods.push(row.foodEntry.fid);
        plantPointData.points += parseFloat(row.foodEntry.plantPoints?.toString() || '');
      }
    }
  });

  // Eventually this can be removed, this is a filter
  // to handle bad entries in the DB from early testing that
  // might not have all been removed.
  const filteredJunk: DiaryData[] = [];
  data.rows.forEach((row) => {
    if (row.foodEntry) {
      filteredJunk.push(row);
    }
  });

  const response = {
    dailyData: filteredJunk,
    weeklyPlantPoints: plantPointData.points,
  };
  return Response.json(response);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const did = body.did;
  const uid = body.uid;
  const serving = body.serving;
  const foodEntry = JSON.stringify(body.foodEntry);
  const data = await sql<DiaryData>`
          UPDATE diary
          SET "foodEntry"=${foodEntry}, serving=${serving}
          WHERE uid like ${uid}
          AND did like ${did}
          `;
  if (data.rowCount !== 1) {
    return new Response('304');
  }
  return new Response('204');
}

/**
 * Delete selected item in the user's food diary by Diary Id (DID)
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const did = searchParams.get('did');
  const data = await sql<DiaryData>`
      DELETE FROM diary
      WHERE did like ${did}
      RETURNING *`;
  if (data.rowCount !== 1) {
    return new Response('500');
  }
  return new Response('204');
}
