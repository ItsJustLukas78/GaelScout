import Link from 'next/link'

export default function TeamResult({ teamId, teamNumber, teamName, programCode, teamGrade, location, teamOrg } :
{ teamId: number, teamNumber: string, teamName: string, programCode: string, teamGrade: string, location: string, teamOrg: string }) {
  return (
    <Link
      href={`/teams/${teamNumber}`}
      className="flex h-auto w-full flex-col rounded-2xl bg-neutral-300 p-3 shadow-lg shadow-neutral-500 min-h-28"
    >
      <h1 className="mb-2 text-sm font-bold text-gray-900 md:text-lg">
        {teamNumber} - {teamName}
      </h1>
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-gray-900 md:text-sm">
          <strong>Program:</strong> {programCode} {teamGrade}
        </h2>
        <h2 className="text-xs font-semibold text-gray-900 md:text-sm">
          <strong>Location:</strong> {location}
        </h2>
        <h2 className="text-xs font-semibold text-gray-900 md:text-sm">
          <strong>Organization:</strong> {teamOrg}
        </h2>
      </div>
    </Link>
  )
}