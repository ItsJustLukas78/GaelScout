'use client'
import {useEffect, useState} from "react";
import UserResult from "@/components/UserResult";
import UserResultSkeleton from "@/components/UserResultSkeleton";
import { UserProfile } from "@/app/types";

export default function Profiles() {

  const [usernameSearch, setUsernameSearch] = useState<string | null >(null);

  const [currentResults, setCurrentResults] = useState<UserProfile[]>([]);

  const [resultsLoading, setResultsLoading] = useState(false);

  const getProfiles = (e: any) => {
    if (e) {
      e.preventDefault();
    }

    if (usernameSearch === "" || usernameSearch === null) {
      setCurrentResults([]);
      return;
    }

    if (usernameSearch.length < 3) {
      return;
    }

    setResultsLoading(true);

    fetch(`/api/users?query=${usernameSearch}`).then((response) => {
      response.json().then((data) => {
        setCurrentResults(data.users);
        setResultsLoading(false);
      });
    }).catch((error) => {
      setResultsLoading(false)
      console.log(error);
    });
  }

  // debounce search when usernameSearch changes
  useEffect(() => {
    const timeoutId = setTimeout(() => getProfiles(null), 500);
    return () => clearTimeout(timeoutId);
  } , [usernameSearch]);

  return (
    <main>
      <div className="my-44 flex w-full flex-col items-center justify-center gap-16 md:flex-row md:gap-12 lg:gap-20">
        <div className="flex h-auto flex-col justify-center items-left max-w-[300px] xs:max-w-min md:max-w-[250px] lg:max-w-min">
          <h1 className="mb-10 text-6xl font-bold xs:text-8xl md:text-6xl lg:text-8xl">
            User Profiles
          </h1>
          <input
            className="h-8 rounded-lg p-1 text-black s:min-w-[100px] min-w-[200px] xs:min-w-[100px] md:min-w-[200px] lg:min-w-[400px]"
            type="text"
            placeholder="Search for a user..."
            onChange={(e) => setUsernameSearch(e.target.value)}
          />
        </div>
        <div className="flex h-auto flex-col items-center justify-center">
          <div className="flex w-80 flex-col items-center gap-4 overflow-auto rounded-2xl bg-neutral-800 p-8 h-120 sm:w-96 lg:w-120 xl:w-144">
            {resultsLoading &&
              <>
                <UserResultSkeleton />
                <UserResultSkeleton />
                <UserResultSkeleton />
                <UserResultSkeleton />
                <UserResultSkeleton />
                <UserResultSkeleton />
                <UserResultSkeleton />
                <UserResultSkeleton />
                <UserResultSkeleton />
                <UserResultSkeleton />
              </>
            }

            {currentResults.length !== 0 && currentResults.map((result) => {
              return (
                <UserResult
                  key={result.username}
                  username={result.username}
                  firstName={result.firstName}
                  lastName={result.lastName}
                  image_url={result.image_url}
                  has_image={result.has_image}
                  public_metadata={result.public_metadata}
                  unsafe_metadata={result.unsafe_metadata}
                />
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}