// app/sign-up/[[...sign-up]]/page.jsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#c084fc] to-[#6b21a8] p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <SignUp 
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