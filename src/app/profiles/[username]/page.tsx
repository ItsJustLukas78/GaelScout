"use client"
import React, {useEffect, useState} from "react";
import Image from "next/image";
import {toast} from "react-toastify";
import {MdVerified} from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";
import { UserProfile } from "@/app/types";
import {useParams} from "next/navigation";

export default function UserProfile() {
  const params = useParams<{ username: string }>()

  const [userProfile, setUserProfile] = useState<null | UserProfile >(null);
 
  const getUserProfile = async() => {
    try {
      const response = await fetch(`/api/users/${username.toLowerCase()}`);

      const data = await response.json();

      if (data.error) {
        toast.error(data.error)
      }
      setUserProfile(data.user)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getUserProfile();
  }, []);

  // @ts-ignore
  return (
    <main>
      <div className="flex w-full flex-col items-center justify-center gap-16 py-32 sm:py-32">
        {userProfile ? <>
          <div className="flex h-auto flex-col justify-center rounded-2xl p-8 bgColorPrimary items-left max-w-[340px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px]">
            <div className="mb-5 flex flex-row items-center gap-5">
              <div className="relative h-11 w-11 xs:h-12 xs:w-12 md:h-16 md:w-16 lg:h-24 lg:w-24">
                <Image
                  className="rounded-full"
                  src={userProfile.has_image ? userProfile.image_url : "/GS_logo.png"}
                  fill
                  alt="Profile Picture"
                />
              </div>
              <div className="flex flex-row items-center">
                <h2 className="mb-2 text-2xl font-bold xs:text-3xl md:text-6xl lg:text-8xl">
                  @{userProfile.username}
                </h2>
                {userProfile.public_metadata.hasOwnProperty("verifiedTeamNumber") ? (
                  <MdVerified
                    className="ml-2 h-8 w-8 text-blue-600 sm:h-14 sm:w-14 md:h-20 md:w-20"
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-5 min-w-auto md:flex-row md:gap-14">
              <div className="flex min-w-fit flex-col gap-5">
                <h3 className="font-bold sm:text-lg md:text-xl lg:text-3xl">
                  {userProfile.firstName ? userProfile.firstName : ""} {userProfile.lastName ? userProfile.lastName : ""}
                </h3>
                <a
                  href={`/teams/${userProfile.public_metadata["verifiedTeamNumber"]}`}
                >
                  <div className="flex flex-row gap-2 font-bold sm:text-md md:text-lg lg:text-xl">
                    Team: {userProfile.public_metadata.hasOwnProperty("verifiedTeamNumber") ? userProfile.public_metadata["verifiedTeamNumber"] : "N/A"}
                  </div>
                </a>
              </div>
            </div>
          </div>
        </> : null}
      </div>
    </main>
  )
}