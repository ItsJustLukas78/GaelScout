import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
      <main>
        <div className="flex justify-center my-28">
           <SignIn
             signUpUrl={"/sign-up"}
           />
        </div>
      </main>
    )
}