import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { RankableStatistic } from "@/app/types";

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

/**
 * @swagger
 * /api/seasons/{seasonId}/seasonProfiles:
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
  request: NextRequest, { params }: { params: Promise<{ seasonId: string }> }
) {
  const searchParams = new URL(request.url).searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '15') > 50 ? 50 : parseInt(searchParams.get('perPage') || '15');

  const { seasonId: rawSeasonId } = await params;
  const seasonId = Number(rawSeasonId);

  if (!Number.isInteger(seasonId)) {
    return NextResponse.json({ error: "Season ID is invalid" }, { status: 400 });
  }

  const isQualToRegionals = searchParams.get('qualToRegionals') as "true" | "false" | "all" | undefined;
  const isAwardQualToWorlds = searchParams.get('awardQualToWorlds') as "true" | "false" | "all" | undefined;

  const region = searchParams.get('region');
  const country = searchParams.get('country');
  const eventRegion = searchParams.get('eventRegion');

  let sortMethod = (searchParams.get('sort') ? searchParams.get('sort') : RankableStatistic.OPENSKILL) as string

  if (sortMethod) {
    if (!Object.values(RankableStatistic).includes(sortMethod as RankableStatistic)) {
      return NextResponse.json({ error: 'Invalid sort method' }, { status: 400 });
    }
  }

  const teamNumber: string[] = [];

  searchParams.forEach((value, key) => {
    if (key === 'teamNumber[]' || key === 'teamNumber') {
      teamNumber.push(value);
    }
  });

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: 'Page must be positive integer' }, { status: 400 });

  }

  if (!seasonId) {
    return NextResponse.json({ error: 'Season ID not provided' }, { status: 400 });
  }

  let teams;
  let count;

  const whereClause: any = {
    seasonId: seasonId
  }

  if (isQualToRegionals !== undefined && isQualToRegionals !== "all") {
    whereClause.qualToRegionals = isQualToRegionals === "true";
  }

  if (isAwardQualToWorlds !== undefined && isAwardQualToWorlds !== "all") {
    whereClause.awardQualToWorlds = isAwardQualToWorlds === "true";
  }

  if (eventRegion) {
    whereClause.TeamProfile = {
      teamEventRegion: eventRegion
    };
  } else {
    if (region) {
      whereClause.TeamProfile = {
        teamRegion: region
      };
    }

    if (country) {
      whereClause.TeamProfile ? whereClause.TeamProfile.teamCountry = country : whereClause.TeamProfile = {
        teamCountry: country
      }
    }
  }

  if (teamNumber.length === 0) {
    teams = await prisma.teamSeasonProfile.findMany({
      where: whereClause,
      include: {
        TeamProfile: true
      },
      orderBy: {
        [sortMethod]: (sortMethod === RankableStatistic.DPR ? 'asc' : 'desc')
      },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    count = await prisma.teamSeasonProfile.count({
      where: whereClause
    });
  } else {
    teams = await prisma.teamSeasonProfile.findMany({
      where: {
        seasonId: seasonId,
        teamNumber: {
          in: teamNumber
        }
      },
      include: {
        TeamProfile: true
      },
      orderBy: {
        [sortMethod]: (sortMethod === RankableStatistic.DPR ? 'asc' : 'desc')
      },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    count = await prisma.teamSeasonProfile.count({
      where: {
        seasonId: seasonId,
        teamNumber: {
          in: teamNumber
        }
      }
    });
  }

  const lastPage = Math.ceil(count / perPage);

  const meta = {
    currentPage: page,
    lastPage: lastPage,
    firstPageUrl: 'https://www.gaelscout.com/api/seasons/{seasonId}/seasonProfiles?page=1',
    nextPageUrl: page < lastPage ? `https://www.gaelscout.com/api/seasons/{seasonId}/seasonProfiles?page=${page + 1}` :
      'https://www.gaelscout.com/api/seasons/{seasonId}/seasonProfiles?page=1',
    total: count,
    perPage: 15,
  }

  const formattedResponse = {
    meta: meta,
    data: teams,
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
