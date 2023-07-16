import prisma from "@/util/DataBase";
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

export async function GET(
  request: NextRequest, { params }: { params: { seasonId: string } }
) {
  const seasonId = parseInt(params.seasonId);

  if (!seasonId) {
    NextResponse.json({ error: 'Season ID not provided' }, { status: 400 });
    return;
  }

  console.log(typeof seasonId)


  const teams = await prisma.teamSeasonProfile.findMany({
    where: {
      seasonId: seasonId
    }
  });

  const formattedTeams = await Promise.all(teams.map(async (team: any) => {
    return await formatTeamSeasonProfile(team);
  }));

  formattedTeams.sort((a: any, b: any) => {
    return a.openSkillRank - b.openSkillRank;
  });

  const prettyJson: string = JSON.stringify(formattedTeams, null, 2);

  return new Response(prettyJson, {
    status: 200,
    headers: {
      'content-type': 'application/json',
    }
  });
}
