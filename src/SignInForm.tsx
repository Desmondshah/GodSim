"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);
  const [anonymousLoading, setAnonymousLoading] = useState(false);

  const handleAnonymousSignIn = async () => {
    setAnonymousLoading(true);
    
    // Set a timeout to reset loading state if something goes wrong
    const timeout = setTimeout(() => {
      setAnonymousLoading(false);
      toast.error("[ERROR] AUTHENTICATION_TIMEOUT // PLEASE_TRY_AGAIN");
    }, 10000); // 10 second timeout

    try {
      await signIn("anonymous");
      clearTimeout(timeout);
      // Success - the auth state will change and trigger navigation
      // Don't reset loading here, let the auth state change handle it
    } catch (error) {
      clearTimeout(timeout);
      console.error("Anonymous sign-in failed:", error);
      toast.error("[ERROR] ANONYMOUS_ACCESS_DENIED // TRY_AGAIN");
      setAnonymousLoading(false);
    }
  };

  return (
    <div className="w-full brutal-container">
      <div className="mb-8 text-center">
        <h3 className="brutal-subheader mb-4">
          {flow === "signIn" ? "// DIVINE LOGIN PROTOCOL" : "// NEW GOD REGISTRATION"}
        </h3>
        <div className="brutal-text text-accent">
          &gt; {flow === "signIn" ? "AUTHENTICATE_DEITY" : "CREATE_NEW_ENTITY"}
        </div>
      </div>
      
      <form
        className="flex flex-col gap-brutal-gap"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            let toastTitle = "";
            if (error.message.includes("Invalid password")) {
              toastTitle = "[ERROR] INVALID_CREDENTIALS // ACCESS_DENIED";
            } else {
              toastTitle =
                flow === "signIn"
                  ? "[ERROR] LOGIN_FAILED // TRY_REGISTRATION_PROTOCOL"
                  : "[ERROR] REGISTRATION_FAILED // TRY_LOGIN_PROTOCOL";
            }
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <div className="relative">
          <label className="brutal-text text-secondary mb-2 block">EMAIL_ADDRESS:</label>
          <input
            className="auth-input-field"
            type="email"
            name="email"
            placeholder="DEITY@DIVINE.REALM"
            required
          />
        </div>
        
        <div className="relative">
          <label className="brutal-text text-secondary mb-2 block">ACCESS_CODE:</label>
          <input
            className="auth-input-field"
            type="password"
            name="password"
            placeholder="************"
            required
          />
        </div>
        
        <button 
          className="auth-button relative overflow-hidden" 
          type="submit" 
          disabled={submitting}
        >
          <span className={submitting ? "opacity-0" : ""}>
            {flow === "signIn" ? "INITIATE_SESSION" : "CREATE_DEITY"}
          </span>
          {submitting && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="brutal-loading border-neutral border-t-secondary"></div>
            </div>
          )}
        </button>
      </form>
      
      <div className="mt-8 pt-6 border-t-4 border-secondary">
        <button
          className="brutal-button w-full"
          type="button"
          onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          disabled={submitting}
        >
          {flow === "signIn" ? "NEW_DEITY_REGISTRATION" : "EXISTING_DEITY_LOGIN"}
        </button>
      </div>

      <div className="mt-6 flex items-center">
        <div className="flex-1 h-1 bg-secondary"></div>
        <div className="mx-4 brutal-text text-secondary">OR</div>
        <div className="flex-1 h-1 bg-secondary"></div>
      </div>

      <button 
        className="brutal-button-secondary w-full mt-6" 
        onClick={handleAnonymousSignIn}
        disabled={submitting || anonymousLoading}
      >
        {anonymousLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="brutal-loading border-neutral border-t-secondary w-4 h-4"></div>
            <span>ACCESSING_DIVINE_REALM...</span>
          </div>
        ) : (
          "ANONYMOUS_DEITY_MODE"
        )}
      </button>
      
      <div className="mt-6 p-4 bg-neutral border-l-8 border-accent">
        <div className="brutal-text text-accent text-xs">
          &gt; WARNING: DIVINE_POWERS_INCLUDE_REALITY_MANIPULATION<br/>
          &gt; USE_RESPONSIBLY // EXISTENCE_NOT_GUARANTEED<br/>
          &gt; [TERMS_OF_SERVICE] OMNIPOTENCE_MAY_CAUSE_MADNESS
        </div>
      </div>
    </div>
  );
}
