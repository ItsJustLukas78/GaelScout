import { NextResponse, NextRequest } from "next/server";
import { getEventMatches } from "@/utils/RobotEventsAPI";
import { EventMatch } from "@/app/types";
import prisma from "@/lib/db";
import {getAuth} from "@clerk/nextjs/server";
import { phone } from 'phone';


export async function POST(
 request: NextRequest,
  { params }: { params: { eventId: string, divId: string } }
) {
  const eventId = parseInt(params.eventId);
  const divId = parseInt(params.divId);

  const data = await request.json();

  const matchnum = data.matchnum;
  const round = data.round;
  const instance = data.instance;

  const phoneNumber = data.phoneNumber;

  const validPhoneNumber = phone(phoneNumber);

  // @ts-ignore
  const { userId } = await getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!phoneNumber) {
    return NextResponse.json({ error: 'Phone number not provided' }, { status: 400 });
  }

  if (!validPhoneNumber.isValid) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
  }

  if (!eventId || !divId) {
    return NextResponse.json({ error: 'Event or div id not provided' }, { status: 400 });

  }
  if (!matchnum || !round || !instance) {
    return NextResponse.json({ error: 'Matchnum, round, or instance not provided' }, { status: 400 });

  }

  try {
    const REMatchObjects = await getEventMatches(eventId, divId);

    const matches: EventMatch[] = REMatchObjects.map((match) => {
      return {
        id: match.id,
        eventId: match.event.id,
        started: match.started,
        scheduled: match.scheduled,
        divisionId: match.division.id,
        round: match.round,
        instance: match.instance,
        matchnum: match.matchnum,
        field: match.field,
        name: match.name,
        blueTeams: match.alliances.at(0).teams?.map((team: any) => {
          return {
            teamId: team.team.id,
            teamNumber: team.team.name,
          }
        }),
        redTeams: match.alliances.at(1).teams?.map((team: any) => {
          return {
            teamId: team.team.id,
            teamNumber: team.team.name,
          }
        }),
        blueScore: match.alliances.at(0).score,
        redScore: match.alliances.at(1).score,
      }
    });

    const match = matches.filter((match) => {
      return match.matchnum === parseInt(matchnum) && match.round === parseInt(round) && match.instance === parseInt(instance);
    })[0];

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    const customSort = (a: EventMatch, b: EventMatch) => {
      const roundOrder: Record<number, number> = {
        1: 1, // Practice
        2: 2, // Qualification
        6: 3, // Round of 16
        3: 4, // Quarter-Finals
        4: 5, // Semi-Finals
        5: 6, // Finals
      };

      if (roundOrder[a.round] !== roundOrder[b.round]) {
        return roundOrder[a.round] - roundOrder[b.round];
      }

      if (a.matchnum !== b.matchnum) {
        return a.matchnum - b.matchnum;
      }

      if (a.instance !== b.instance) {
        return a.instance - b.instance;
      }

      return 0;
    }

    const sortedMatches: EventMatch[] = matches.sort(customSort);

    const notifyMatchIndex = sortedMatches.findIndex((match) => {
      return match.matchnum === parseInt(matchnum) && match.round === parseInt(round) && match.instance === parseInt(instance);
    });

    const precedingMatch: EventMatch = sortedMatches[Math.max(notifyMatchIndex - 5, 0)];

    const matchNotification = await prisma.matchNotification.create({
      data: {
        userId: userId,
        eventId: eventId,
        divisionId: divId,
        checkRound: precedingMatch.round,
        checkInstance: precedingMatch.instance,
        checkMatchnum: precedingMatch.matchnum,
        checkMatchName: precedingMatch.name,
        matchName: match.name,
        phoneNumber: validPhoneNumber.phoneNumber,
        estimatedDate: match.scheduled,
      }
    });

    return NextResponse.json({ matchNotification }, { status: 201 });
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: 'Error fetching event matches' }, { status: 500 });
  }
}