'use client'
import {useEffect, useState} from "react";
import UserResult from "@/components/UserResult";
import UserResultSkeleton from "@/components/UserResultSkeleton";

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
      <div className="w-full items-center justify-center flex md:flex-row flex-col my-44 lg:gap-20 md:gap-12 gap-16">
        <div className="h-auto items-left justify-center flex flex-col lg:max-w-min md:max-w-[250px] xs:max-w-min max-w-[300px]">
          <h1 className="lg:text-8xl md:text-6xl xs:text-8xl text-6xl font-bold mb-10">
            User Profiles
          </h1>
          <input
            className="p-1 h-8 text-black rounded-lg lg:min-w-[400px] md:min-w-[200px] s:min-w-[100px] xs:min-w-[100px] min-w-[200px]"
            type="text"
            placeholder="Search for a user..."
            onChange={(e) => setUsernameSearch(e.target.value)}
          />
        </div>
        <div className="h-auto items-center justify-center flex flex-col">
          <div className="overflow-auto rounded-2xl xl:w-144 lg:w-120 w-96 h-120 gap-4 flex flex-col items-center bg-neutral-800 p-8">
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