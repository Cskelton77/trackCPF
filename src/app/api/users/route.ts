import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

interface Users {
  email: string;
  uid: string;
}

/*
* Attempt to retreive a UID for the user's email address
* If the email address is not found, create a UID for them
*/
export async function POST(request: Request) {
  const body = await request.json();
  const email = body.email.toLowerCase();
  const data = await sql<Users>`
      SELECT uid
      FROM users
      WHERE email like ${email}
      LIMIT 1`;

  if (data.rowCount !== 1) {
    const uid = uuidv4();
    const data = await sql<Users>`
        INSERT INTO users(email, uid) 
        VALUES (${email}, ${uid})
        RETURNING *;`;
    return Response.json(data.rows[0].uid);
  }

  return Response.json(data.rows[0].uid);
}
/*
* Delete an email address/user account
* This functionality is not exposed through the app
* and exists primarily for testing database maintenance
*/
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const uid = searchParams.get('uid');
  if (email) {
    const data = await sql<Users>`
        DELETE FROM users
        WHERE email like ${email}
        RETURNING *
        `;
    if (data.rowCount !== 1) {
      return new Response('500');
    }
    return new Response('204');
  }
  if (uid) {
    const data = await sql<Users>`
        DELETE FROM users
        WHERE uid like ${uid}
        RETURNING *`;
    if (data.rowCount !== 1) {
      return new Response('500');
    }
    return new Response('204');
  }
  return new Response('304');
}

