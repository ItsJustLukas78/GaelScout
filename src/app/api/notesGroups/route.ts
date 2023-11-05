import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { Prisma } from '@prisma/client'

export async function GET(
  request: NextRequest
) {
  try {
    // @ts-ignore
    const { userId } = await getAuth(request);

    if (!userId) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const notesGroups = await prisma.notesGroup.findMany({
      where: {
        users: {
          some: {
            id: userId
          }
        }
      },
      include: {
        users: true
      }
    })

    return NextResponse.json({ success: true, notesGroups: notesGroups }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      }
    })
  } catch (e) {
    return NextResponse.json({error: "An error occurred while processing your request"}, {status: 500});
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const data = await request.json();
    const groupName: string = data.groupName;

    // @ts-ignore
    const { userId } = await getAuth(request);

    if (!userId) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    if (!groupName) {
      return NextResponse.json({error: 'Group name not provided'}, {status: 400});
    }

    if (groupName.length <= 0 || groupName.length > 40) {
      return NextResponse.json({error: 'Group name must be between 1 and 40 characters'}, {status: 400});
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

    const recursiveCreate = async () => {
      try {
        const newJoinCode = "gaelscout" + Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);

        return await prisma.notesGroup.create({
          data: {
            name: groupName,
            joinCode: newJoinCode,
            users: {
              connect: {
                id: userId
              }
            }
          }
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
          await recursiveCreate();
        } else {
          return undefined;
        }
      }
    }

    const newNoteGroup = await recursiveCreate();

    if (!newNoteGroup) {
      return NextResponse.json({error: 'An error occurred while processing your request'}, {status: 500});
    }

    return NextResponse.json({ success: true, notesGroup: newNoteGroup }, {
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