"use server";

import { signIn } from "next-auth/react"; // Import signIn desde next-auth/react

export async function signInWithGoogle() {
  await signIn("google", { callbackUrl: "/" }); // Especifica la callbackUrl
}