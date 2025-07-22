"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className="brutal-button-danger text-sm px-4 py-2"
      onClick={() => void signOut()}
    >
      LOGOUT_DEITY
    </button>
  );
}
