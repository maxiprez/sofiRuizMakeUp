"use server";

import bcrypt from "bcryptjs";
import { randomBytes } from 'crypto';
import { createClient } from "@supabase/supabase-js";
import ResetPasswordEmail from "@/app/components/emails/ResetPassword";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const resetToken = randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

  try {
    const { data: existingUser, error: emailError } = await supabase
      .from("users")
      .select("id, name")
      .eq("email", email)
      .maybeSingle();

    if (emailError) {
      console.error("Error al verificar el mail:", emailError);
      return { error: "Error al verificar el mail." };
    }
    if (!existingUser) {
      return { error: "El mail no está registrado." };
    }

    const { error: updateError } = await supabase.from("reset_password").upsert({
        user_id: existingUser.id,
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry,
    });

    if (updateError) {
      console.error("Error al actualizar el usuario en la base de datos:", updateError);
      return { error: "Error al actualizar el usuario." };
    }

    const frontendUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/resetPassword?token=${resetToken}`;
    const htmlContent = ResetPasswordEmail({ userFullName: existingUser.name, resetLink });

    await fetch(`${process.env.NEXTAUTH_URL}/api/sendEmail`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            toEmail: email,
            subject: 'Restablecé tu contraseña',
            htmlContent,
        }),
    });

    return { success: true, message: 'Email de reseteo enviado' };
  } catch (error: unknown) {
    console.error("Error inesperado durante el restablecimiento de la contraseña:", error);
    return { error, message: 'Error enviando el email' };
  }
}

export async function updatePassword(token: string, formData: FormData) {
  const password = formData.get("password") as string;
  const { data: userWithToken, error: userWithTokenError } = await supabase
  .from("reset_password")
  .select("*")
  .eq("reset_token", token)
  .maybeSingle();

  if (userWithTokenError) {
    console.error("Error al verificar el token:", userWithTokenError);
    return { error: "Error al verificar el token." };
  }

  if (!userWithToken || new Date(userWithToken.reset_token_expiry) < new Date()) {
    return { error: "Token inválido o expirado" };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const { error: updateError } = await supabase.from("users").update({
    password: hashedPassword,
  }).eq("id", userWithToken.user_id);

  if (updateError) {
    console.error("Error al actualizar el usuario en la base de datos:", updateError);
    return { error: "Error al actualizar el usuario." };
  }

  const { error: deleteError } = await supabase.from("reset_password").delete().eq("reset_token", token);

  if (deleteError) {
    console.error("Error al eliminar el token de restablecimiento:", deleteError);
    return { error: "Error al eliminar el token de restablecimiento." };
  }

  return { success: true, message: "¡Contraseña actualizada con éxito!" };
}