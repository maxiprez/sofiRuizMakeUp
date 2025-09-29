import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from "@supabase/supabase-js"
import { redirect } from 'next/navigation'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (token_hash && type) {
    const { data: { user }, error: verifyError } = await supabaseAdmin.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!verifyError && user) {
      const { error: updateError } = await supabaseAdmin.from("users").update({
        is_verified: true,
      }).eq("id", user.id);

      if (updateError) {
        console.error("Error al actualizar el usuario en la tabla 'users':", updateError);
        // Podrías redirigir a una página de error más específica si el problema es la base de datos
        redirect('/authCodeError?reason=db_update_failed');
      } else {
        redirect('/emailValidateOk');
      }
    } else {
      // Si hubo un error en la verificación del OTP o no se encontró el usuario
      console.error("❌ Error al verificar token o usuario no encontrado:", verifyError);
      redirect('/authCodeError?reason=otp_verification_failed');
    }
  } else {
    // Si faltan los parámetros esenciales en la URL
    console.error("❌ Faltan parámetros en la URL (token_hash o type).");
    redirect('/authCodeError?reason=missing_params');
  }
}
