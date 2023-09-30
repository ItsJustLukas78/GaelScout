import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs";
import { getTeamObject } from "@/utils/RobotEventsAPI";

export async function POST(
  request: NextRequest,
  { params }: { params: { seasonId: string} }
) {
  const seasonId = parseInt(params.seasonId);
  const { userId } = await auth();

  const data = await request.json();

  // [{
  //   teamNumber: string;
  //   notes: json
  // }]
  const newTeamsToNotes = data.notes as { [key: string]: object | null };

  try {
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!seasonId) {
      return NextResponse.json({ error: 'Season ID not provided' }, { status: 400 });
    }

    if (!newTeamsToNotes) {
      return NextResponse.json({ error: 'Notes not provided' }, { status: 400 });
    }

    if (Object.keys(newTeamsToNotes).length === 0) {
      return NextResponse.json({ error: 'Notes not provided' }, { status: 400 });
    }

    const notes = await Promise.all(Object.keys(newTeamsToNotes).map(async (teamNumber: string) => {
      const newNotes = newTeamsToNotes[teamNumber];

      let team: any = await prisma.teamProfile.findFirst({
        where: {
          teamNumber: teamNumber,
        }
      });

      if (!team) {
        team = await getTeamObject({teamNumber: teamNumber, onlyActive: true});

        if (!team) {
          return NextResponse.json({ error: 'A team does not exist' }, { status: 400 });
        }

        team = await prisma.teamProfile.create({
          data: {
            teamId: team.id,
            teamName: team.team_name,
            teamNumber: team.number,
            robotName: team.robot_name,
            teamGrade: team.grade,
            teamOrg: team.organization,
            teamCity: team.location.city,
            teamRegion: team.location.region,
            teamCountry: team.location.country,
            programCode: team.program.code,
            programId: team.program.id,
          }
        });
      }

      if (!newNotes) {
        const existingNote = await prisma.teamNote.findFirst({
          where: {
            userId: userId,
            seasonId: seasonId,
            teamNumber: teamNumber,
            teamId: team.teamId,
          }
        });

        if (!existingNote) {
          return null;
        }

        return prisma.teamNote.delete({
          where: {
            userId_seasonId_teamNumber_teamId : {
              userId: userId,
              seasonId: seasonId,
              teamNumber: teamNumber,
              teamId: team.teamId,
            }
          }
        });
      } else {
        return prisma.teamNote.upsert({
          where: {
            userId_seasonId_teamNumber_teamId : {
              userId: userId,
              seasonId: seasonId,
              teamNumber: teamNumber,
              teamId: team.teamId,
            }
          },
          update: {
            note: newNotes,
          },
          create: {
            teamId: team.teamId,
            teamNumber: teamNumber,
            seasonId: seasonId,
            userId: userId,
            note: newNotes,
          }
        })
      }
    }));

    return NextResponse.json({notes}, {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      }
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { seasonId: string } }
) {
  const seasonId = parseInt(params.seasonId);
  const { userId } = await auth();

  const searchParams = new URL(request.url).searchParams;

  const teamNumbers: string[] = [];

  searchParams.forEach((value, key) => {
    if (key === 'teamNumber[]' || key === 'teamNumber') {
      teamNumbers.push(value);
    }
  });

  try {
    if (!userId) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    if (!seasonId) {
      return NextResponse.json({error: 'Season ID not provided'}, {status: 400});
    }

    if (teamNumbers.length === 0) {
      return NextResponse.json({error: 'Team numbers not provided'}, {status: 400});
    }

    let notes = await Promise.all(teamNumbers.map(async (teamNumber: string) => {
      return prisma.teamNote.findFirst({
        where: {
          teamNumber: teamNumber,
          seasonId: seasonId,
          userId: userId,
        }
      });
    }));

    notes = notes.filter((note) => note !== null);

    return NextResponse.json({notes}, {
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
