import {EventAward, TeamProfile} from '@/app/types'
import Link from "next/link";

interface AwardResultProps {
  award: EventAward,
  team: TeamProfile
}

export default function AwardResult(
  { award: {id, eventId, divisionId, name, qualification, team: teamIdentifiers, order}, team } : AwardResultProps
)
{
  return (
    <Link
      href={`/teams/${team.teamNumber}`}
      className="flex h-auto w-full flex-col rounded-2xl bg-neutral-700 p-3 shadow-lg shadow-neutral-900 transition-colors duration-200 min-h-28 hover:bg-gray-400"
    >
      <h1 className="mb-2 text-sm font-semibold md:text-lg">
        {name}
      </h1>
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-medium md:text-sm">
          Winner: {team.teamNumber} - {team.teamName}
        </h2>
        <h2 className="text-xs font-medium md:text-sm">
          Qualifications: {qualification ?? 'N/A'}
        </h2>
      </div>
    </Link>
  )
}