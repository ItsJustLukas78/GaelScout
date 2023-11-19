import { NextResponse, NextRequest } from "next/server";
import {getEventSkills} from "@/utils/RobotEventsAPI";
import {SkillsRun} from "@/app/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: number } }
) {
  const eventId = params.eventId;

  if (!eventId) {
    return NextResponse.json({ error: 'Event Id not provided' }, { status: 400 });
  }

  const RESkillsObjects = await getEventSkills(eventId);

  const skills: SkillsRun[] = RESkillsObjects.map((skill) => {
    return {
      id: skill.id,
      eventId: skill.event.id,
      team: {
        teamId: skill.team.id,
        teamNumber: skill.team.name,
      },
      type: skill.type,
      attempts: skill.attempts,
      score: skill.score,
      rank: skill.rank,
    }
  });

  return NextResponse.json({skills: skills}, {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    }
  });
}