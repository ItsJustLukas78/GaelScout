import { NextResponse, NextRequest } from "next/server";
import { SeasonProfileDocumentType, SeasonProfileDocument } from "@/util/models/SeasonProfile";


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

  const teamNumber = searchParams.get('teamNumber');
  const seasonId = searchParams.get('seasonId');

  if (!teamNumber || !seasonId) {
    NextResponse.json({ error: 'Team ID or Season ID not provided' }, { status: 400 });
    return;
  }

 const team = await SeasonProfileDocument.findOne({ teamNumber: teamNumber, seasonId: seasonId });

  if (!team) {
    NextResponse.json({ error: 'Team not found' }, { status: 404 });
    return;
  }

  const formattedTeam = await formatTeamDocument(team);

  const prettyJson: string = JSON.stringify(formattedTeam, null, 2);

  return NextResponse.json(prettyJson, { headers: { 'Content-Type': 'application/json' } });
}