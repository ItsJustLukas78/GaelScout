import { NextResponse, NextRequest } from "next/server";
import { SeasonProfileDocumentType, SeasonProfileDocument } from "@/util/models/SeasonProfile";
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


async function formatTeamDocument(seasonProfile: SeasonProfileDocumentType) {
  return {
    teamId: seasonProfile.teamId,
    teamName: seasonProfile.teamName,
    teamNumber: seasonProfile.teamNumber,
    opr: seasonProfile.opr,
    dpr: seasonProfile.dpr,
    ccwm: seasonProfile.ccwm,
    openSkill: seasonProfile.openSkill,
    openSkillRank: seasonProfile.openSkillRank,
    eventCount: seasonProfile.eventCount,
    topProgSkills: seasonProfile.topProgSkills,
    topDriverSkills: seasonProfile.topDriverSkills,
    topTotalSkills: seasonProfile.topTotalSkills,
    skillsRank: seasonProfile.skillsRank,
    qualMatchCount: seasonProfile.qualMatchCount,
    elimMatchCount: seasonProfile.elimMatchCount,
    qualMatchWins: seasonProfile.qualMatchWins,
    elimMatchWins: seasonProfile.elimMatchWins,
    qualMatchLosses: seasonProfile.qualMatchLosses,
    elimMatchLosses: seasonProfile.elimMatchLosses,
    qualMatchWinPercentage: seasonProfile.qualMatchWinPercentage,
    elimMatchWinPercentage: seasonProfile.elimMatchWinPercentage,
    totalMatchWinPercentage: seasonProfile.totalMatchWinPercentage,
    qualToRegionals: seasonProfile.qualToRegionals,
    awardQualToWorlds: seasonProfile.awardQualToWorlds,
  }
}

export async function GET(request: NextRequest) {
  const searchParams = new URLSearchParams(request.url);

  const seasonId = searchParams.get('seasonId');

  if (!seasonId) {
    NextResponse.json({ error: 'Season ID not provided' }, { status: 400 });
    return;
  }

  const teams = await SeasonProfileDocument.find({ seasonId: seasonId });

  const formattedTeams = await Promise.all(teams.map(async (team: SeasonProfileDocumentType) => {
    return await formatTeamDocument(team);
  }));

  const prettyJson: string = JSON.stringify(formattedTeams, null, 2);

  return NextResponse.json(prettyJson, { headers: { 'Content-Type': 'application/json' } });
}
