import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

// import rateLimit from "express-rate-limit";

// const allTeamsLimiter = rateLimit({
//   windowMs: 10 * 1000, // 10 seconds
//   max: 4
// });
//
// const teamLimiter = rateLimit({
//   windowMs: 5 * 1000, // 5 seconds
//   max: 10
// })


async function formatTeamSeasonProfile(teamSeasonProfile: any) {
  return {
    teamId: teamSeasonProfile.teamId,
    teamName: teamSeasonProfile.teamName,
    teamNumber: teamSeasonProfile.teamNumber,
    opr: teamSeasonProfile.opr,
    dpr: teamSeasonProfile.dpr,
    ccwm: teamSeasonProfile.ccwm,
    openSkill: teamSeasonProfile.openSkill,
    openSkillRank: teamSeasonProfile.openSkillRank,
    eventCount: teamSeasonProfile.eventCount,
    topProgSkills: teamSeasonProfile.topProgSkills,
    topDriverSkills: teamSeasonProfile.topDriverSkills,
    topTotalSkills: teamSeasonProfile.topTotalSkills,
    skillsRank: teamSeasonProfile.skillsRank,
    qualMatchCount: teamSeasonProfile.qualMatchCount,
    elimMatchCount: teamSeasonProfile.elimMatchCount,
    qualMatchWins: teamSeasonProfile.qualMatchWins,
    elimMatchWins: teamSeasonProfile.elimMatchWins,
    qualMatchLosses: teamSeasonProfile.qualMatchLosses,
    elimMatchLosses: teamSeasonProfile.elimMatchLosses,
    qualMatchWinPercentage: teamSeasonProfile.qualMatchWinPercentage,
    elimMatchWinPercentage: teamSeasonProfile.elimMatchWinPercentage,
    totalMatchWinPercentage: teamSeasonProfile.totalMatchWinPercentage,
    qualToRegionals: teamSeasonProfile.qualToRegionals,
    awardQualToWorlds: teamSeasonProfile.awardQualToWorlds,
  }
}

/**
 * @swagger
 * /api/seasons/{seasonId}/teams:
 *  get:
 *    tags:
 *      - Seasons
 *    description: Returns team season profiles in the given season
 *    parameters:
 *      - in: path
 *        name: seasonId
 *        required: true
 *        description: The season ID
 *        schema:
 *        type: integer
 *      - in: query
 *        name: page
 *        required: false
 *        description: The page number
 *        schema:
 *        type: integer
 *        default: 1
 *        minimum: 1
 *    responses:
 *      200:
 *        description: The team with the given team number in the given season
 *      400:
 *        description: Page is not a positive integer or Season ID not provided
 *      500:
 *        description: Internal server error
 */
export async function GET(
  request: NextRequest, { params }: { params: { seasonId: string } }
) {
  const searchParams = new URL(request.url).searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const seasonId = parseInt(params.seasonId);

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: 'Page must be positive integer' }, { status: 400 });

  }

  if (!seasonId) {
    return NextResponse.json({ error: 'Season ID not provided' }, { status: 400 });
  }

  const teams = await prisma.teamSeasonProfile.findMany({
    where: {
      seasonId: seasonId
    },
    skip: (page - 1) * 15,
    take: 15,
  });

  const count = await prisma.teamSeasonProfile.count({
    where: {
      seasonId: seasonId
    }
  });

  const lastPage = Math.ceil(count / 15);

  const meta = {
    currentPage: page,
    lastPage: lastPage,
    firstPageUrl: 'https://gaelscout.com/api/seasons/{seasonId}/teams?page=1',
    nextPageUrl: page < lastPage ? `https://gaelscout.com/api/seasons/{seasonId}/teams?page=${page + 1}` :
      'https://gaelscout.com/api/seasons/{seasonId}/teams?page=1',
    total: count,
    perPage: 15,
  }

  const formattedTeams = await Promise.all(teams.map(async (team: any) => {
    return await formatTeamSeasonProfile(team);
  }));

  formattedTeams.sort((a: any, b: any) => {
    return a.openSkillRank - b.openSkillRank;
  });

  const formattedResponse = {
    meta: meta,
    data: formattedTeams
  }

  const prettyJson: string = JSON.stringify(formattedResponse, null, 2);

  return new Response(prettyJson, {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    }
  });
}
