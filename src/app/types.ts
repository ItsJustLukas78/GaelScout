export interface UserProfile {
  id: string
  firstName: string | null
  lastName: string | null
  username: string
  image_url: string
  has_image: boolean
  public_metadata: {
    verifiedTeamNumber: string
  }
  unsafe_metadata: {}
}

export interface NotesGroup {
  id: number;
  name: string;
  joinCode: string;
}

export enum RelavancyType {
  alliance = "Alliance",
  opponent = "Opponent",
  both = "Both",
  self = "Self",
}

export interface TeamProfile {
  teamId: number,
  teamName: string,
  teamNumber: string,
  robotName: string,
  teamGrade: string,
  teamOrg: string,
  teamCity: string,
  teamRegion: string,
  teamCountry: string,
  programCode: string,
  programId: number,
}

export interface TeamIdentifiers {
  teamId: number,
  teamNumber: string,
}

export interface EventMatch {
  id: number,
  eventId: number,
  started: Date,
  scheduled: Date,
  divisionId: number,
  round: number,
  instance: number,
  matchnum: number,
  field: string,
  name: string,
  blueTeams: TeamIdentifiers[],
  redTeams: TeamIdentifiers[],
  blueScore: number,
  redScore: number,
}

export interface EventRank {
  id: number,
  eventId: number,
  divisionId: number,
  rank: number,
  team: TeamIdentifiers,
  wins: number,
  losses: number,
  ties: number,
  wp: number,
  ap: number,
  sp: number,
  high_score: number,
  average_points: number,
  total_points: number,
}

export interface EventRankWithMetrics extends EventRank {
  opr: number,
  dpr: number,
  ccwm: number,
}

export interface EventAward {
  id: number,
  eventId: number,
  divisionId: number,
  name: string,
  qualification: string,
  team: TeamIdentifiers,
  order: number,
}

export interface SkillsRun {
  id: number,
  eventId: number,
  team: TeamIdentifiers,
  type: string,
  attempts: number,
  score: number,
  rank: number,
}

export interface CombinedTeamSkills {
  teamId: number,
  teamName: string,
  teamNumber: string,
  progSkills: number,
  driverSkills: number,
  totalSkills: number,
  rank: number,
}

export interface TeamSeasonProfile {
  teamId: number,
  teamName: string,
  teamNumber: string,
  opr: number,
  dpr: number,
  ccwm: number,
  openSkill: number,
  openSkillRank: number,
  eventCount: number,
  topProgSkills: number,
  topDriverSkills: number,
  topTotalSkills: number,
  skillsRank: number,
  qualMatchCount: number,
  elimMatchCount: number,
  qualMatchWins: number,
  elimMatchWins: number,
  qualMatchLosses: number,
  elimMatchLosses: number,
  qualMatchWinPercentage: number,
  elimMatchWinPercentage: number,
  totalMatchWinPercentage: number,
  qualToRegionals: boolean,
  awardQualToWorlds: boolean,
}

export interface ExtendedTeamSeasonProfile {
  id: number;
  teamId: number;
  teamName: string;
  teamNumber: string;
  seasonId: number;
  seasonName: string;
  mu: number;
  sigma: number;
  openSkill: number;
  openSkillRank: number;
  opr: number;
  dpr: number;
  ccwm: number;
  oprCum: number;
  dprCum: number;
  eventCount: number;
  topProgSkills: number;
  topDriverSkills: number;
  topTotalSkills: number;
  skillsRank: number;
  qualMatchCount: number;
  elimMatchCount: number;
  qualMatchWins: number;
  elimMatchWins: number;
  qualMatchLosses: number;
  elimMatchLosses: number;
  qualMatchWinPercentage: number;
  elimMatchWinPercentage: number;
  totalMatchWinPercentage: number;
  qualToRegionals: boolean;
  awardQualToWorlds: boolean;
}


export interface Division {
  id: number;
  name: string;
}

export interface Event {
  id: number;
  sku: string;
  name: string;
  start: string;
  end: string;
  season: {
    id: number;
    name: string;
  }
  program: {
    id: number;
    name: string;
    code: string;
  },
  location: {
    venue: string;
    address: string;
    city: string;
    region: string;
    country: string;
    coordinates: {
      lat: number;
      lon: number;
    }
  },
  divisions: Division[]
}

export interface Country {
  value: number;
  "data-code": string;
  name: string;
}

export interface Region {
  value: number;
  name: string;
}

export enum RankableStatistic {
  OPR = "opr",
  DPR = "dpr",
  CCWM = "ccwm",
  OPENSKILL = "openSkill",
  TOTALSKILLS = "topTotalSkills",
}



