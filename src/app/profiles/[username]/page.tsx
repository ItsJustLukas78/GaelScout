"use client"
import React, {useEffect, useState} from "react";
import Image from "next/image";
import * as Form from "@radix-ui/react-form/dist";
import CorneredButton from "@/components/CorneredButton";
import TeamResultSkeleton from "@/components/TeamResultSkeleton";
import {AiOutlineDoubleLeft, AiOutlineDoubleRight, AiOutlineLeft, AiOutlineRight} from "react-icons/ai";
import {toast} from "react-toastify";
import {MdVerified} from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";

interface UserProfile {
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

export default function Userprofile({ params }: { params: { username: string } }) {
  const username = params.username

  const [userProfile, setUserProfile] = useState<null | UserProfile >(null);
 
  const getUserProfile = () => {
    fetch(`/api/users/${username.toLowerCase()}`).then((response) => {
      response.json().then((data) => {
        if (data.error) {
          toast.error(data.error)
        }
        setUserProfile(data.user)
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    getUserProfile();
  }, []);

  // @ts-ignore
  return (
    <main>
      <div className="w-full items-center justify-center flex flex-col my-44 gap-16">
        {userProfile ? <>
          <div className="h-auto items-left justify-center flex flex-col xl:min-w-[1200px] lg:min-w-[900px] md:min-w-[700px] sm:min-w-[500px] max-w-[340px] rounded-2xl bg-neutral-800 p-8">
            <div className="flex flex-row gap-5 items-center mb-5">
              <div className="lg:w-24 lg:h-24 md:w-16 md:h-16 xs:w-12 xs:h-12 h-11 w-11 relative">
                <Image
                  className="rounded-full"
                  src={userProfile.has_image ? userProfile.image_url : "/GS_logo.png"}
                  fill
                  alt="Profile Picture"
                />
              </div>
              <div className="flex flex-row items-center">
                <h2 className="lg:text-8xl md:text-6xl xs:text-3xl text-2xl font-bold mb-2">
                  @{userProfile.username}
                </h2>
                {userProfile.public_metadata.hasOwnProperty("verifiedTeamNumber") ? (
                  <MdVerified
                    className="text-blue-600 ml-2 md:w-20 md:h-20 sm:w-14 sm:h-14 w-8 h-8"
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="md:gap-14 gap-5 flex md:flex-row flex-col min-w-auto">
              <div className="gap-5 flex md:flex-col flex-row min-w-fit">
                <h3 className="lg:text-3xl md:text-xl sm:text-lg font-bold">
                  {userProfile.firstName ? userProfile.firstName : ""} {userProfile.lastName ? userProfile.lastName : ""}
                </h3>
                <a
                  href={`/teams/${userProfile.public_metadata["verifiedTeamNumber"]}`}
                >
                  <div className="flex flex-row gap-2 lg:text-xl md:text-lg sm:text-md font-bold">
                    Team: {userProfile.public_metadata.hasOwnProperty("verifiedTeamNumber") ? userProfile.public_metadata["verifiedTeamNumber"] : "N/A"}
                    <AiOutlineLink className="text-blue-600 w-6 h-6" />
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