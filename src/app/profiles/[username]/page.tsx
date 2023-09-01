"use client"
import React, {useEffect, useState} from "react";
import Image from "next/image";
import * as Form from "@radix-ui/react-form/dist";
import CorneredButton from "@/components/CorneredButton";
import TeamResultSkeleton from "@/components/TeamResultSkeleton";
import {AiOutlineDoubleLeft, AiOutlineDoubleRight, AiOutlineLeft, AiOutlineRight} from "react-icons/ai";

interface UserProfile {
  id: string
  firstName: string | null
  lastName: string | null
  username: string
  image_url: string
  has_image: boolean
  public_metadata: {}
  unsafe_metadata: {}
}

export default function Userprofile({ params }: { params: { username: string } }) {
  const username = params.username

  const [userProfile, setUserProfile] = useState<null | UserProfile >(null);
 
  const getUserProfile = () => {
    fetch(`/api/users/${username.toLowerCase()}`).then((response) => {
      response.json().then((data) => {
        console.log(data.user)
        setUserProfile(data.user)
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <main>
      <div className="w-full items-center justify-center flex flex-col my-44 gap-16">
        {userProfile ? <>
          <div className="h-auto items-left justify-center flex flex-col xl:min-w-[1200px] lg:min-w-[900px] md:min-w-[700px] sm:min-w-[500px] max-w-[340px] rounded-2xl bg-neutral-800 p-8">
            <div className="flex flex-row gap-5 items-center mb-10">
              <div className="w-24 h-24 relative">
                <Image
                  className="rounded-full"
                  src={userProfile.has_image ? userProfile.image_url : "/GS_logo.png"}
                  fill
                  alt="Profile Picture"
                />
              </div>
              <div className="lg:text-8xl md:text-5xl sm:text-8xl xs:text-5xl text-5xl font-bold min-w-fit">
                @{userProfile.username}
              </div>
            </div>
            <div className="md:gap-14 gap-5 flex md:flex-row flex-col min-w-auto">
              <div className="gap-5 flex md:flex-col flex-row min-w-fit">
                <h3 className="text-xl font-bold">
                  {userProfile.firstName ? userProfile.firstName : ""} {userProfile.lastName ? userProfile.lastName : ""}
                </h3>
              </div>
            </div>
          </div>
        </> : null}
      </div>
    </main>
  )
}