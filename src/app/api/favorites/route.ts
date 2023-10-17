import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import {getEvents, getTeamObject} from "@/utils/RobotEventsAPI";
import { getAuth } from "@clerk/nextjs/server";


export async function GET(
  request: NextRequest
) {
  const searchParams = new URL(request.url).searchParams;
  const favoriteType = searchParams.get('favoriteType');

  // @ts-ignore
  const { userId } = await getAuth(request);

  if (!userId) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }

  try {
    let favorites;

    switch (favoriteType) {
      case 'team':
        let teamId: any = searchParams.get('teamId');

        teamId = teamId ? parseInt(teamId) : undefined;

        favorites = await prisma.favoriteTeam.findMany({
          where: {
            userId: userId,
            teamId: teamId
          },
          include: {
            team: true
          }
        });

        favorites = favorites.map((favorite: any) => favorite.team);

        break;
      case 'event':
        let eventId: any = searchParams.get('eventId');

        eventId = eventId ? parseInt(eventId) : undefined;

        favorites = await prisma.favoriteEvent.findMany({
          where: {
            userId: userId,
            eventId: eventId
          }
        });

        favorites = await getEvents({eventIds: favorites.map((favorite: any) => favorite.eventId)});

        break;
      default:
        return NextResponse.json({error: 'Invalid favorite type'}, {status: 400});
    }

    return NextResponse.json({ favorites }, {
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

export async function POST(
  request: NextRequest
) {
  try {
    const data = await request.json();
    const favoriteType: string = data.favoriteType;

    // @ts-ignore
    const { userId } = await getAuth(request);

    if (!userId) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    switch (favoriteType) {
      case 'team':
        const teamId: number = data.teamId;
        const teamNumber: string = data.teamNumber;

        if (!teamId || !teamNumber) {
          return NextResponse.json({error: 'Team id or number not provided'}, {status: 404});
        }

        await prisma.favoriteTeam.create({
          data: {
            team: {
              connect: {
                teamId: teamId,
                teamNumber: teamNumber
              }
            },
            user: {
              connect: {
                id: userId
              }
            }
          }
        });

        break;
      case 'event':
        const eventId: number = data.eventId;

        if (!eventId) {
          return NextResponse.json({error: 'Event id not provided'}, {status: 404});
        }

        await prisma.favoriteEvent.create({
          data: {
            eventId: eventId,
            user: {
              connect: {
                id: userId
              }
            }
          }
        });

        break;
      default:
        return NextResponse.json({error: 'Invalid favorite type'}, {status: 400});
    }

    return NextResponse.json({ success: true }, {
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

export async function DELETE(
  request: NextRequest
) {
  try {
    const data = await request.json();
    const favoriteType: string = data.favoriteType;

    // @ts-ignore
    const { userId } = await getAuth(request);

    if (!userId) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    switch (favoriteType) {
      case 'team':
        const teamId: number = data.teamId;
        const teamNumber: string = data.teamNumber;

        if (!teamId || !teamNumber) {
          return NextResponse.json({error: 'Team id or number not provided'}, {status: 404});
        }

        await prisma.favoriteTeam.delete({
          where: {
            userId_teamNumber_teamId: {
              userId: userId,
              teamNumber: teamNumber,
              teamId: teamId
            }
          }
        });

        break;
      case 'event':
        const eventId: number = data.eventId;

        if (!eventId) {
          return NextResponse.json({error: 'Event id not provided'}, {status: 404});
        }

        await prisma.favoriteEvent.delete({
          where: {
            userId_eventId: {
              userId: userId,
              eventId: eventId
            }
          }
        });

        break;
      default:
        return NextResponse.json({error: 'Invalid favorite type'}, {status: 400});
    }

    return NextResponse.json({ success: true }, {
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