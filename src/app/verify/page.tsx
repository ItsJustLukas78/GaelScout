'use client'
import React, {useEffect, useState} from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { FaRegClipboard } from "react-icons/fa";
import {useAuth, useUser} from "@clerk/nextjs";
import { toast } from 'react-toastify';


export default function Verify() {
  const { getToken } = useAuth();

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

    getToken().then((token) => {
      fetch(`/api/verify/generate`,
        {
          method: "POST",
        },
      ).then((response) => {
        response.json().then((data) => {
          if (data.error) {
            toast.error(data.error);
            if (response.headers.get("X-RateLimit-Reset")) {
              const resetTime = parseInt(response.headers.get("X-RateLimit-Reset") as string);

              const currentTime = Date.now()
              const timeToWait = resetTime - currentTime

              const timeToWaitSeconds = Math.floor(timeToWait / 1000) + 1

              toast.info(`Your code will generate in: ${timeToWaitSeconds}`);

              setTimeout(() => {
                return generateVerificationCode(e);
              } , timeToWaitSeconds * 1000);
            }
            return;
          }
          setVerificationCode(data.verificationCode);
        });
      }).catch((error) => {
        console.log(error);
      });
    })
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

    getToken().then((token) => {
      fetch(`/api/verify`,
        {
          method: "POST",
          body: JSON.stringify({
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
    })
  }
  return <>
    <main>
      <div className="sm:py-32 py-32 flex w-full flex-col items-center justify-center gap-16 md:flex-row md:gap-12 lg:gap-20">
        <div className="flex h-auto max-w-min flex-col items-center justify-center lg:flex-row lg:items-start">
          <div className="h-auto min-w-[350px] sm:min-w-[400px] lg:min-w-[800px] xl:min-w-[1000px]">
            <h1 className="mb-10 max-w-min text-8xl font-bold">
              Verify
            </h1>
            <p className="text-base max-w-[400px] sm:text-xl">
              Verify ownership of a team to verify other members and manage a team page where you can share more about your team, and communicate with others. You will need access to the account on robotevents.com associated with your team.
            </p>
            <AlertDialog.Root
              open={dialogOpen}
              onOpenChange={(open) => {}}
            >
              <AlertDialog.Trigger asChild>
                <button
                  className="mt-10 h-8 w-28 whitespace-nowrap rounded-2xl bg-white text-xl font-semibold text-black disabled:opacity-50"
                  onClick={(e) => {
                    setDialogOpen(true);
                    generateVerificationCode(e)
                  }}
                  disabled={isSignedIn && !isLoaded}
                >
                  Verify
                </button>
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Overlay className="z-40 bg-black opacity-70 data-[state=open]:animate-overlayShow fixed inset-0" />
                <AlertDialog.Content className="flex flex-col z-50 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[500px] w-[350px] translate-x-[-50%] translate-y-[-50%] rounded-[10px] bg-neutral-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                  <AlertDialog.Title className="mb-10 text-xl font-bold">
                    Change Your Robot Name
                  </AlertDialog.Title>
                  <AlertDialog.Description asChild>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold xs:text-md">
                        Input the number of the team you are verifying ownership of:
                      </p>
                      <input
                        className="mt-2 h-8 rounded-lg p-1 text-black"
                        type="text"
                        placeholder="Team Number"
                        onChange={(e) => setTeamNumberInput(e.target.value)}
                      />
                      <p className="mt-5 text-sm font-semibold xs:text-md">
                        Temporarily change your robot name to:
                      </p>
                      <p className="mt-2 flex flex-row items-center rounded-md bg-neutral-600 p-2 text-sm font-semibold xs:text-md">
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
                          <FaRegClipboard className="mr-1 inline-block" />
                        </button>
                      </p>
                      <p className="mt-5 text-sm font-semibold xs:text-md">
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
                        <p className="mt-5 text-sm font-semibold xs:text-md">
                          {`You can verify again in: ${timeLeft}`}
                        </p>
                      )}
                    </div>
                  </AlertDialog.Description>
                  <div className="mt-auto flex justify-between">
                    <AlertDialog.Cancel asChild>
                      <button
                        className="mt-10 mb-2 h-8 w-28 whitespace-nowrap rounded-md bg-red-300 text-xl font-semibold text-black"
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancel
                      </button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <button
                        className="mt-10 h-8 w-28 whitespace-nowrap rounded-md bg-green-300 text-xl font-semibold text-black disabled:opacity-50"
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
        <div className="flex h-auto flex-col items-center justify-center">

        </div>
      </div>
    </main>
  </>
}