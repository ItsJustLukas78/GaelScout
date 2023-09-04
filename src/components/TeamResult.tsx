import Link from 'next/link'

export default function TeamResult({ teamNumber, teamName, programCode, teamGrade, location, teamOrg } :
{ teamNumber: string, teamName: string, programCode: string, teamGrade: string, location: string, teamOrg: string }) {
  return (
    <Link
      href={`/teams/${teamNumber}`}
      className="rounded-2xl bg-neutral-300 w-full p-3 min-h-28 h-auto shadow-lg shadow-neutral-500 flex flex-col"
    >
      <h1 className="md:text-lg text-sm font-bold text-gray-900 mb-2">
        {teamNumber} - {teamName}
      </h1>
      <div className="flex flex-col gap-2">
        <h2 className="md:text-sm text-xs font-semibold text-gray-900">
          <strong>Program:</strong> {programCode} {teamGrade}
        </h2>
        <h2 className="md:text-sm text-xs font-semibold text-gray-900">
          <strong>Location:</strong> {location}
        </h2>
        <h2 className="md:text-sm text-xs font-semibold text-gray-900">
          <strong>Organization:</strong> {teamOrg}
        </h2>
      </div>
    </Link>
  )
}