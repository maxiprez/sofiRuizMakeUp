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

  console.log("🚀 Entró a /auth/confirm");

  if (token_hash && type) {
    const { data: { user }, error: verifyError } = await supabaseAdmin.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!verifyError && user) {
      if (type === 'signup') {
        console.log("✔️ Usuario verificado:", user.email);

        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({ is_verified: true })
          .eq('id', user.id);

        if (updateError) {
          console.error("❌ Error al actualizar is_verified:", updateError);
        } else {
          console.log("✅ Usuario marcado como verificado.");
        }
      }
      redirect("/login");
    } else {
      console.error("❌ Error al verificar token:", verifyError?.message);
      redirect('/auth/auth-code-error');
    }
  }

  redirect('/auth/auth-code-error');
}
