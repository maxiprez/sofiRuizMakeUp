"use server";

import { signIn } from "../../../auth";

export async function signInGoogleAction() {
  await signIn("google", { redirectTo: "/" });
}