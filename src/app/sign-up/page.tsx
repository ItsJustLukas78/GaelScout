import {SignUp} from "@clerk/nextjs";

export default function Page() {
  return (
      <main>
        <div className="flex justify-center my-28">
           <SignUp
             signInUrl={"/sign-in"}
           />
        </div>
      </main>
    )
}