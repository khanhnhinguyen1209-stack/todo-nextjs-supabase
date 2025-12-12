// app/sign-in/[[...sign-in]]/page.jsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#c084fc] to-[#6b21a8] p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <SignIn 
          redirectUrl="/"
          appearance={{
            elements: {
              formButtonPrimary: "bg-purple-600 hover:bg-purple-700",
            },
          }}
        />
      </div>
    </div>
  );
}