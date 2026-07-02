import { SignUp } from "@clerk/nextjs";
import { Flame } from "lucide-react";
import { isClerkConfigured } from "@/lib/clerk-config";

export default function Page() {
  if (!isClerkConfigured()) {
    return <AuthSetup />;
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <div className="brand auth-brand">
          <span className="brand-mark">
            <Flame size={23} strokeWidth={2.5} />
          </span>
          <span>Vies</span>
        </div>
        <SignUp />
      </div>
    </main>
  );
}

function AuthSetup() {
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <p className="eyebrow">Vies</p>
        <h1>Add your Clerk publishable key.</h1>
      </div>
    </main>
  );
}
