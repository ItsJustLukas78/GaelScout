import { NextResponse, NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";


export async function POST(request: NextRequest) {
  try {
    // @ts-ignore
    const { userId } = await getAuth(request);

    if (!userId) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }
    const client = await clerkClient()

    const clerkUser = await client.users.getUser(userId);
    // const userObject = prisma.user.findUnique({
    //   where: {
    //     id: userId
    //   }
    // });

    if (!clerkUser) {
      return NextResponse.json({error: 'User not found'}, {status: 404});
    }

    const randomString = "gaelscout" + Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);

    await client.users.updateUserMetadata(clerkUser.id, {
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