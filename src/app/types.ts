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
  }
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


