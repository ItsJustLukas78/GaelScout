import Link from 'next/link'

export default function TeamResult({ teamNumber, teamName, programCode, teamGrade, location, teamOrg } :
{ teamNumber: string, teamName: string, programCode: string, teamGrade: string, location: string, teamOrg: string }) {
  return (
    <Link
      href={`/teams/${teamNumber}`}
      className="rounded-2xl bg-neutral-200 w-full p-3 min-h-28 h-auto shadow-lg shadow-neutral-500 flex flex-col"
    >
      <h1 className="xs:text-md text-sm font-bold text-gray-900 mb-2">
        {teamNumber} - {teamName} | {programCode} {teamGrade}
      </h1>
      <div className="flex flex-col gap-2">
        <h2 className="xs:text-sm text-xs font-semibold text-gray-900">
          Location: {location}
        </h2>
        <h2 className="xs:text-sm text-xs font-semibold text-gray-900">
          Organization: {teamOrg}
        </h2>
      </div>
    </Link>
  )
}