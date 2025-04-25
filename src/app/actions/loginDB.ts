"use server";

import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

export async function signInWithCredentials(formData: FormData) {
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Credenciales inválidas" };
  }

  try {
    const { data: user, error: supabaseError } = await supabaseClient
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (supabaseError || !user) {
      console.error("Error al buscar usuario:", supabaseError);
      return { error: "Credenciales inválidas" };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { error: "Credenciales inválidas" };
    }

    return { success: true }; // Devuelve un objeto con un indicador de éxito
  } catch (error) {
    console.error("Error durante la autenticación:", error);
    return { error: "Error al iniciar sesión" }; // Devuelve un objeto con un indicador de error
  }
}