"use server";

import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const tel = formData.get("tel") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !tel || !password) {
    return { error: "Todos los campos son obligatorios." };
  }

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) throw new Error("Falta definir NEXT_PUBLIC_SITE_URL en variables de entorno");

  // 1. Crear usuario en Supabase Auth
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/emailValidateOk`,
      data: { name, tel },
    },
  });

  if (signUpError) {
    console.error("Error al registrar usuario:", signUpError.message);
    return { error: "Error al crear la cuenta. " + signUpError.message };
  }

  // 2. Hashear la contraseña para guardarla en la tabla 'users'
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insertar en tabla 'users' con el id generado por Supabase Auth
  const { error } = await supabase.from("users").insert({
    id: data?.user?.id,
    name,
    email,
    tel,
    is_verified: false,
    password: hashedPassword,
  });

  if (error) {
    console.error("Error al insertar en users:", error.message);
    return { error: "Error al crear el perfil del usuario." };
  }

  return { success: true };
}
