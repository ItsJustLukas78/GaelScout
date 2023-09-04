import Link from 'next/link'
import Image from 'next/image'
import { MdVerified } from 'react-icons/md'

export default function TeamResult({ username, firstName, lastName, image_url, has_image, public_metadata, unsafe_metadata } :
{ username: string, firstName: string | null, lastName: string | null, image_url: string | null, has_image: boolean, public_metadata: {}, unsafe_metadata: {} }) {
  console.log(public_metadata)
  // @ts-ignore
  // @ts-ignore
  return (
    <Link
      href={`/profiles/${username}`}
      className="rounded-2xl bg-neutral-300 w-full p-2 h-auto shadow-lg shadow-neutral-500 flex flex-col"
    >
      <div className="flex flex-row gap-2 items-center">
        <div className="sm:min-w-[50px] sm:min-h-[50px] min-w-[40px] min-h-[40px] relative">
          <Image
            className="rounded-full"
            src={has_image ? image_url as string : "/GS_logo.png"}
            fill
            alt="Profile Picture"
          />
        </div>
        <div className="flex flex-row w-full items-center justify-between">
          <div className="flex flex-col">
            <div className="flex flex-row items-center">
              <h2 className="sm:text-xl text-sm font-bold text-gray-900">
                @{username}
              </h2>
              {public_metadata.hasOwnProperty("verifiedTeamNumber") ? (
                <MdVerified className="text-blue-600 ml-2" />
              ) : (
                <></>
              )}
            </div>
            <h2 className="sm:text-sm text-xs font-semibold text-gray-900 mb-2">
              {firstName ? firstName : ""} {lastName ? lastName : ""}
            </h2>
          </div>
          <div className="flex mr-3 p-1">
            {public_metadata.hasOwnProperty("verifiedTeamNumber") ? (
              <h1 className="sm:text-lg text-sm font-bold text-blue-600">
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