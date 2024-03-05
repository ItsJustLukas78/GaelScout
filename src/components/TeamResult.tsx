import Link from 'next/link'
import {TeamProfile} from "@/app/types";

interface TeamResultProps {
  teamId: number,
  teamNumber: string,
  teamName: string,
  programCode: string,
  teamGrade: string,
  teamOrg: string,
  teamCity: string,
  teamRegion: string,
  teamCountry: string,
}

export default function TeamResult({ teamId, teamNumber, teamName, programCode, teamGrade, teamOrg, teamCity, teamRegion, teamCountry }: TeamResultProps) {
  const locationString = `${teamCity ? teamCity + ", " : ""}${teamRegion ? teamRegion + ", " : ""}${teamCountry}`;

  return (
    <Link
      href={`/teams/${teamNumber}`}
      className="flex h-auto w-full flex-col rounded-2xl p-2 shadow-lg shadow-neutral-900 transition-colors duration-200 bgColorSecondary min-h-[85px] hover:bgColorSecondaryHover"
    >
      <h1 className="mb-2 text-sm font-bold outlinedText md:text-lg">
        {teamNumber} - {teamName}
      </h1>
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-medium outlinedText md:text-sm">
          {locationString}
        </h2>
        <div className="flex flex-row justify-between">
          <h2 className="text-xs font-medium outlinedText line-clamp-1 max-w-[60%] md:text-sm">
            {teamOrg}
          </h2>
          <h2 className="text-xs font-medium outlinedText md:text-sm">
            {programCode} {teamGrade}
          </h2>
        </div>
      </div>
    </Link>
  )
}