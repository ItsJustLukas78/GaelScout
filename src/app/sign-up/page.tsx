import {SignUp} from "@clerk/nextjs";

export default function Page() {
  return (
    <main>
      <div className="my-28 flex justify-center">
        <SignUp
          signInUrl={"/sign-in"}
        />
      </div>
    </main>
  )
}