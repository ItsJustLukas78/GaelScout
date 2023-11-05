import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { Prisma } from '@prisma/client'

export async function POST(
  request: NextRequest
) {
  try {
    const data = await request.json();
    const joinCode: string = data.joinCode;

    // @ts-ignore
    const { userId } = await getAuth(request);

    if (!userId) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    if (!joinCode) {
      return NextResponse.json({error: 'Join code not provided'}, {status: 400});
    }

    if (joinCode.length <= 0 || joinCode.length > 15 || !joinCode.startsWith('gaelscout')) {
      return NextResponse.json({error: 'Invalid join code'}, {status: 400});
    }

    let notesGroup = await prisma.notesGroup.findFirst({
      where: {
        joinCode: joinCode
      },
      include: {
        users: true
      }
    });

    if (!notesGroup) {
      return NextResponse.json({error: 'Invalid join code'}, {status: 400});
    }

    if (notesGroup.users.find((user: any) => user.id === userId)) {
      return NextResponse.json({error: 'You are already in this group'}, {status: 400});
    }

    // check if user is already in max of 10 groups
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      },
      include: {
        notesGroups: true
      }
    });

    if (!user) {
      return NextResponse.json({error: 'User not found'}, {status: 400});
    }

    if (user.notesGroups.length >= 10) {
      return NextResponse.json({error: 'You are already in the maximum number of groups'}, {status: 400});
    }

    notesGroup = await prisma.notesGroup.update({
      where: {
        id: notesGroup.id
      },
      data: {
        users: {
          connect: {
            id: userId
          }
        }
      },
      include: {
        users: true
      }
    });

    return NextResponse.json({ success: true, notesGroup }, {
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