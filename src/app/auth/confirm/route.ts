import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from "@supabase/supabase-js"
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null;

  if (token_hash && type) {
    try {
      // Verificar el token OTP
      const { data: { user, session: authSession }, error: verifyError } = await supabaseAdmin.auth.verifyOtp({
        type,
        token_hash,
      });

      if (verifyError || !user) {
        console.error("❌ Error al verificar token o usuario no encontrado:", verifyError);
        return redirect('/authCodeError?reason=otp_verification_failed');
      }

      // Actualizar el estado de verificación
      const { error: updateError } = await supabaseAdmin.from("users").update({
        is_verified: true,
      }).eq("id", user.id);

      if (updateError) {
        console.error("Error al actualizar el usuario en la tabla 'users':", updateError);
        return redirect('/authCodeError?reason=db_update_failed');
      }

      // Si el tipo es 'signup', crear una nueva sesión
      if (type === 'signup' || type === 'email') {
        // Crear una cookie de sesión manualmente
        if (authSession) {
          const { access_token, refresh_token } = authSession;
          
          // Get cookies instance - must be awaited
          const cookieStore = await cookies();
          
          // Set access token cookie
          cookieStore.set('sb-access-token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 semana
          });
          
          // Set refresh token cookie
          cookieStore.set('sb-refresh-token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 semana
          });
        }
      }

      // Redirigir a la página de éxito
      return redirect('/emailValidateOk');
    } catch (error) {
      console.error('Error en la verificación de correo:', error);
      return redirect('/authCodeError?reason=verification_error');
    }
  } else {
    // Si faltan los parámetros esenciales en la URL
    console.error("❌ Faltan parámetros en la URL (token_hash o type).");
    return redirect('/authCodeError?reason=missing_params');
  }
}
