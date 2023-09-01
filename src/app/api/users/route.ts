import { NextResponse, NextRequest } from "next/server";
import axios from 'axios'

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams;

  const query = searchParams.get('query');
  const limit = 10;
  const offset = 0;

  if (!query) {
    return NextResponse.json({ error: 'Missing query value' }, { status: 400 });
  }

  try {
    const { data } = await axios.get(`https://api.clerk.com/v1/users?query=${query}&limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`
      }
    })

    const formattedUsers = data.map((user: any) => {
      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        image_url: user.image_url,
        has_image: user.has_image,
        public_metadata: user.public_metadata,
        unsafe_metadata: user.unsafe_metadata,
      }
    })

    return NextResponse.json(
      {
        users: formattedUsers,
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
        }
    })
  } catch (e) {
    console.error(e);
    return NextResponse.json({error: 'An error occurred while processing your request'}, {status: 500});
  }
}