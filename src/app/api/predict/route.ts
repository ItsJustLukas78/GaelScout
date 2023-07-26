import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { rating, predictWin } from 'openskill'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.nextUrl);

  const r1Team = searchParams.get('r1Team');
  const r2Team = searchParams.get('r2Team');
  const b1Team = searchParams.get('b1Team');
  const b2Team = searchParams.get('b2Team');

  const seasonId = parseInt(searchParams.get('seasonId') || '');

  if (!r1Team || !r2Team || !b1Team || !b2Team || !seasonId) {
    NextResponse.json({ error: 'Team ID or Season ID not provided' }, { status: 400 });
    return;
  }

  try {
    const r1TeamData = await prisma.teamSeasonProfile.findFirst({
      where: {
        teamNumber: r1Team,
      }
    });

    const r2TeamData = await prisma.teamSeasonProfile.findFirst({
      where: {
        teamNumber: r2Team,
      }
    });

    const b1TeamData = await prisma.teamSeasonProfile.findFirst({
      where: {
        teamNumber: b1Team,
      }
    });

    const b2TeamData = await prisma.teamSeasonProfile.findFirst({
      where: {
        teamNumber: b2Team,
      }
    });

    if (!r1TeamData || !r2TeamData || !b1TeamData || !b2TeamData) {
      const missingTeams = [r1TeamData, r2TeamData, b1TeamData, b2TeamData].filter(team => !team);
      return NextResponse.json({error: `Teams ${missingTeams.join(', ')} not found`}, {status: 404});
    }

    const rRatings = [r1TeamData, r2TeamData].map(t => (rating({
      mu: t.opr,
      sigma: t.sigma
    })));

    const bRatings = [b1TeamData, b2TeamData].map(t => (rating({
      mu: t.opr,
      sigma: t.sigma
    })));


    const prediction = predictWin([rRatings, bRatings]);

    const rChance = Math.round(prediction[0] * 100);
    const bChance = Math.round(prediction[1] * 100);

    console.log(rRatings, bRatings)
    console.log(rChance, bChance)
    console.log(prediction)

    return NextResponse.json({ rChance, bChance }, { status: 200 })
  } catch (e) {
    console.error(e);
    return NextResponse.json({error: 'An error occurred while processing your request'}, {status: 500});
  }
}