import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      async authorize(credentials) {
        const email = String(credentials?.email);
        const password = String(credentials?.password);

        if (!email || !password) {
          return null; // Indica un fallo de autenticación
        }

        try {
          const { data: user, error } = await supabaseClient
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

          if (error || !user) {
            return null; // Indica un fallo de autenticación
          }
         
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) {
            // Retorna la información del usuario para la sesión
            return { id: user.id, email: user.email, name: user.name };
          } else {
            return null; // Indica un fallo de autenticación (contraseña incorrecta)
          }
        } catch (error) {
          console.error("Error durante la autorización:", error);
          return null; // Indica un fallo de autenticación
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile?.email && profile?.name) {
        console.log("Inicio de sesión con Google detectado para:", profile.email);
        try {
          // Verificar si el usuario ya existe en Supabase por su email
          const { data: existingUser, error: selectError } = await supabaseClient
            .from('users')
            .select('id')
            .eq('email', profile.email)
            .maybeSingle();
    
          if (selectError && selectError.code !== 'PGRST116') {
            console.error('Error al verificar el usuario de Google en Supabase:', selectError);
            return false;
          }
    
          if (!existingUser && !selectError) {
            const { data: insertedUser, error: insertError } = await supabaseClient
              .from("users")
              .insert({
                name: profile.name,
                email: profile.email,
                tel: null,
                password: null,
              })
              .select("id")
              .single();

              if (insertError) {
                return false;
              }

            user.id = insertedUser.id;
          } else {
            user.id = existingUser?.id;
          }
    
          return true; // Permite el inicio de sesión
        } catch (error) {
          console.error('Error durante el signIn con Google:', error);
          return false;
        }
      }
      // Para otros proveedores, permite el inicio de sesión por defecto
      return true;
    },
  },
});