import Link from 'next/link'
import Image from 'next/image'
import { MdVerified } from 'react-icons/md'

export default function TeamResult({ username, firstName, lastName, image_url, has_image, public_metadata, unsafe_metadata } :
{ username: string, firstName: string | null, lastName: string | null, image_url: string | null, has_image: boolean, public_metadata: {}, unsafe_metadata: {} }) {
  // @ts-ignore
  return (
    <Link
      href={`/profiles/${username}`}
      className="flex h-auto w-full flex-col rounded-2xl p-2 shadow-lg shadow-neutral-500 transition-colors duration-200 bgColorSecondary hover:bgColorSecondaryHover"
    >
      <div className="flex flex-row items-center gap-2">
        <div className="relative min-w-[40px] min-h-[40px] sm:min-w-[50px] sm:min-h-[50px]">
          <Image
            className="rounded-full"
            src={has_image ? image_url as string : "/GS_logo.png"}
            fill
            alt="Profile Picture"
          />
        </div>
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-col">
            <div className="flex flex-row items-center">
              <h2 className="text-sm font-bold text-gray-900 sm:text-xl">
                @{username}
              </h2>
              {public_metadata.hasOwnProperty("verifiedTeamNumber") ? (
                <MdVerified className="ml-2 text-blue-600" />
              ) : (
                <></>
              )}
            </div>
            <h2 className="mb-2 text-xs font-semibold text-gray-900 sm:text-sm">
              {firstName ? firstName : ""} {lastName ? lastName : ""}
            </h2>
          </div>
          <div className="mr-3 flex p-1">
            {public_metadata.hasOwnProperty("verifiedTeamNumber") ? (
              <h1 className="text-sm font-bold text-blue-600 sm:text-lg">
                {/*@ts-ignore*/}
                {public_metadata["verifiedTeamNumber"]}
              </h1>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}