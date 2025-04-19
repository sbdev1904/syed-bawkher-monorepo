"use client";

import { signIn, signOut } from "next-auth/react";

export const LoginButton = () => {
  return (
    <button
      onClick={() =>
        signIn(undefined, {
          callbackUrl: "/dashboard",
        })
      }
    >
      Sign in
    </button>
  );
};

export const LogoutButton = () => {
  return (
    <button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>
  );
};
