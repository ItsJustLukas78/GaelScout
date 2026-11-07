import { NextResponse, NextRequest } from "next/server";
import axios from 'axios'

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {

  const { username } = await params;

  if (!username) {
    return NextResponse.json({ error: 'Username not provided' }, { status: 400 });
  }

  try {
    const { data } = await axios.get(`https://api.clerk.com/v1/users?username=${username}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`
      }
    })

    const users = data

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0]
    const formattedUser = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      image_url: user.image_url,
      has_image: user.has_image,
      public_metadata: user.public_metadata,
      unsafe_metadata: user.unsafe_metadata,
    }

    return NextResponse.json(
      {
        user: formattedUser,
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