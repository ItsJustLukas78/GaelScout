import { NextResponse, NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs";


export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const userId = data.userId;

    if (!userId) {
      return NextResponse.json({error: 'User ID not provided'}, {status: 400});
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    if (!clerkUser) {
      return NextResponse.json({error: 'User not found'}, {status: 404});
    }

    const randomString = "gaelscout" + Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);

    await clerkClient.users.updateUserMetadata(clerkUser.id, {
      privateMetadata: {
        ...clerkUser.privateMetadata,
        verificationCode: randomString,
      }
    });

    return NextResponse.json({verificationCode: randomString}, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      }
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({error: 'An error occurred while processing your request'}, {status: 500});
  }
}