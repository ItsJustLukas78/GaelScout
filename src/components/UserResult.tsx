import Link from 'next/link'
import Image from 'next/image'

export default function TeamResult({ username, firstName, lastName, image_url, has_image, public_metadata, unsafe_metadata } :
{ username: string, firstName: string | null, lastName: string | null, image_url: string | null, has_image: boolean, public_metadata: {}, unsafe_metadata: {} }) {
  return (
    <Link
      href={`/profiles/${username}`}
      className="rounded-2xl bg-neutral-200 w-full p-3 min-h-28 h-auto shadow-lg shadow-neutral-500 flex flex-col"
    >
      <div className="flex flex-row gap-2 items-center">
        <div className="w-12 h-12 relative">
          <Image
            className="rounded-full"
            src={has_image ? image_url as string : "/GS_logo.png"}
            fill
            alt="Profile Picture"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="xs:text-md text-sm font-bold text-gray-900">
            @{username}
          </h1>
          <h2 className="xs:text-sm text-xs font-semibold text-gray-900">
            {firstName ? firstName : ""} {lastName ? lastName : ""}
          </h2>
        </div>
      </div>
    </Link>
  )
}