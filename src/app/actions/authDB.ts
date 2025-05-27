"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs"; 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

  try {
    const { data: existingUserByEmail, error: emailError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (emailError) {
      console.error("Error al verificar el mail:", emailError);
      return { error: "Error al verificar el mail." };
    }

    if (existingUserByEmail) {
      return { error: "El mail ya está registrado." };
    }

    const { data: existingUserByTel, error: telError } = await supabase
      .from("users")
      .select("tel")
      .eq("tel", tel)
      .maybeSingle();

    if (telError) {
      console.error("Error al verificar el teléfono:", telError);
      return { error: "Error al verificar el número de teléfono." };
    }

    if (existingUserByTel) {
      return { error: "Este número de teléfono ya está registrado." };
    }

    const { error: authError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone: tel },
      },
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { error: insertError } = await supabase.from("users").insert({
      id: data.user?.id,
      name,
      email,
      tel,
      password: hashedPassword,
      is_verified: false,
    });

    if (insertError) {
        return { error: "Error al crear la cuenta." };
    }

    if (authError) {
      return { error: "Error al crear la cuenta." };
    }

    revalidatePath("/login");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error inesperado durante el registro:", error);
    return { error: "Ocurrió un error inesperado." };
  }
}