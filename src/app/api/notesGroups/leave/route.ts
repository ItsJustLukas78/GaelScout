import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { Prisma } from '@prisma/client'

export async function POST(
  request: NextRequest
) {
  try {
    const data = await request.json();
    const notesGroupId: string = data.notesGroupId;

    // @ts-ignore
    const { userId } = await getAuth(request);

    if (!userId) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    if (!notesGroupId) {
      return NextResponse.json({error: 'Notes group id not provided'}, {status: 400});
    }

    let notesGroup = await prisma.notesGroup.findFirst({
      where: {
        id: parseInt(notesGroupId)
      },
      include: {
        users: true
      }
    });

    if (!notesGroup) {
      return NextResponse.json({error: 'Invalid notes group id'}, {status: 400});
    }

    if (!notesGroup.users.find((user: any) => user.id === userId)) {
      return NextResponse.json({error: 'You are not in this group'}, {status: 400});
    }

    notesGroup = await prisma.notesGroup.update({
      where: {
        id: notesGroup.id
      },
      data: {
        users: {
          disconnect: {
            id: userId
          }
        }
      },
      include: {
        users: true
      }
    });

    // if last user, delete group (and notes)

    if (notesGroup.users.length === 0) {
      await prisma.notesGroup.delete({
        where: {
          id: notesGroup.id
        }
      });

      await prisma.teamNote.deleteMany({
        where: {
          notesGroupId: notesGroup.id
        }
      });
    }

    return NextResponse.json({ success: true, notesGroup}, {
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