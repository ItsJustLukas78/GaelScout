'use client'
import React, {useEffect, useState} from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { FaRegClipboard } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
import { toast } from 'react-toastify';


export default function Verify() {
  const { isSignedIn, user, isLoaded } = useUser();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [teamNumberInput, setTeamNumberInput] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");

  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((timeLeft) => {
        if (timeLeft <= 0) {
          return 0;
        }
        return timeLeft - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  const generateVerificationCode = (e: any) => {
    if (verificationCode !== "" && verificationCode !== null) {
      return;
    }

    if (!isSignedIn) {
      return;
    }

    fetch(`/api/verify/generate`,
      {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
        }),
      },
    ).then((response) => {
      response.json().then((data) => {
        setVerificationCode(data.verificationCode);
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  const confirmVerification = (e: any) => {
    if (e) {
      e.preventDefault();
    }

    if (verificationCode === "" || verificationCode === null) {
      return;
    }

    if (!isSignedIn) {
      return;
    }

    toast.info("Verifying...");

    fetch(`/api/verify`,
      {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          teamNumber: teamNumberInput,
        }),
      },
    ).then((response) => {
      response.json().then((data) => {
        if (data.error) {
          toast.error(data.error);

          // check X-RateLimit-Reset header
          if (response.headers.get("X-RateLimit-Reset")) {
            const resetTime = parseInt(response.headers.get("X-RateLimit-Reset") as string);

            const currentTime = Date.now()
            const timeToWait = resetTime - currentTime

            const timeToWaitSeconds = Math.floor(timeToWait / 1000) + 1

            setTimeLeft(timeToWaitSeconds);
          }

          if (data.error === "Verification code does not match") {
            // TODO: show error with toast
            return;
          } else {
            return;
          }
        } else {
          toast.success(`Verified with team: ${data.verifiedTeamNumber}!`);

          setDialogOpen(false);
        }
      });
    }).catch((error) => {
      console.log(error);
    });
  }
  return <>
    <main>
      <div className="w-full items-center justify-center flex md:flex-row flex-col my-44 lg:gap-20 md:gap-12 gap-16">
        <div className="h-auto lg:items-start items-center justify-center flex flex-col lg:flex-row max-w-min">
          <div className=" h-auto xl:min-w-[1000px] lg:min-w-[800px] sm:min-w-[400px] min-w-[350px]">
            <h1 className="text-8xl font-bold mb-10 max-w-min">
              Verify
            </h1>
            <p className="sm:text-xl text-base max-w-[400px]">
              Verify ownership of a team to verify other members and manage a team page where you can share more about your team, and communicate with others. You will need access to the account on robotevents.com associated with your team.
            </p>
            <AlertDialog.Root
              open={dialogOpen}
              onOpenChange={(open) => {}}
            >
              <AlertDialog.Trigger asChild>
                <button
                  className="mt-10 bg-white rounded-2xl whitespace-nowrap h-8 w-28 text-black text-xl font-semibold"
                  onClick={(e) => {
                    setDialogOpen(true);
                    generateVerificationCode(e)
                  }}
                >
                  Verify
                </button>
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Overlay className="z-40 bg-black opacity-70 data-[state=open]:animate-overlayShow fixed inset-0" />
                <AlertDialog.Content className="flex flex-col z-50 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[500px] w-[350px] translate-x-[-50%] translate-y-[-50%] rounded-[10px] bg-neutral-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                  <AlertDialog.Title className="text-xl font-bold mb-10">
                    Change Your Robot Name
                  </AlertDialog.Title>
                  <AlertDialog.Description asChild>
                    <div className="flex flex-col">
                      <p className="xs:text-md text-sm font-semibold">
                        Temporarily change your robot name to:
                      </p>
                      <p className="xs:text-md text-sm font-semibold mt-2 bg-neutral-600 rounded-md p-2 flex flex-row items-center">
                        <span className="text-green-500">
                          {verificationCode ? verificationCode : "Loading..."}
                        </span>
                        <button
                          className="ml-auto flex items-center"
                          onClick={(e) => {
                            navigator.clipboard.writeText(verificationCode ? verificationCode : "Loading...").then(() => {
                              toast.info("Copied to clipboard!");
                            });
                          }}
                        >
                          <FaRegClipboard className="inline-block mr-1" />
                        </button>
                      </p>
                      <p className="xs:text-md text-sm font-semibold mt-5">
                        Input the number of the team you are verifying ownership of:
                      </p>
                      <input
                        className="p-1 h-8 text-black rounded-lg mt-2"
                        type="text"
                        placeholder="Team Number"
                        onChange={(e) => setTeamNumberInput(e.target.value)}
                      />
                      <p className="xs:text-md text-sm font-semibold mt-5">
                        {"Click confirm once you have changed your robot name and it has been updated on your "}
                        <a
                          target={"_blank"}
                          href={`https://www.robotevents.com/teams/VRC/${teamNumberInput}`}
                          className="text-blue-500"
                        >
                          Team Page
                        </a>
                      </p>
                      {/* Timer for ratelimit */}
                      {timeLeft > 0 && (
                        <p className="xs:text-md text-sm font-semibold mt-5">
                          {`You can verify again in: ${timeLeft}`}
                        </p>
                      )}
                    </div>
                  </AlertDialog.Description>
                  <div className="flex justify-between mt-auto">
                    <AlertDialog.Cancel asChild>
                      <button
                        className="mt-10 mb-2 bg-red-300 rounded-md whitespace-nowrap h-8 w-28 text-black text-xl font-semibold"
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancel
                      </button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <button
                        className="mt-10 bg-green-300 rounded-md whitespace-nowrap h-8 w-28 text-black text-xl font-semibold disabled:opacity-50"
                        onClick={(e) => confirmVerification(e)}
                        disabled={timeLeft > 0 || (teamNumberInput === "")}
                      >
                        Verify
                      </button>
                    </AlertDialog.Action>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog.Root>
          </div>
        </div>
        <div className="h-auto items-center justify-center flex flex-col">

        </div>
      </div>
    </main>
  </>
}