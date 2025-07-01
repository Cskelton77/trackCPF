import { defaultSettings } from '@/context';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  const body = await request.json();
  const uid = body?.uid;
  const settings = body?.settings;
  const existingSettings = await sql`
  SELECT settings
  FROM settings
  WHERE uid like ${uid}
  LIMIT 1`;
  if (existingSettings.rowCount !== null && existingSettings.rowCount > 0) {
    const newSettings = {
      ...existingSettings.rows[0].settings,
      ...settings,
    };
    await sql`
        UPDATE settings
        SET "settings"=${newSettings}
        WHERE uid like ${uid}
    `;
    return new Response('201');
  } else {
    await sql`
        INSERT INTO settings(uid, settings)
        VALUES(${uid}, ${settings})
    `;
    return new Response('201');
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('user');

  const data = await sql`
        SELECT settings
        FROM settings
        WHERE uid like ${uid}
        LIMIT 1`;

  if (data.rowCount && data.rowCount > 0) {
    return Response.json(data.rows[0].settings);
  } else {
    const blankSettings = {}
    await sql`
        INSERT INTO settings(uid, settings)
        VALUES(${uid}, null)
    `;
    return Response.json(blankSettings);
  }
   
}
