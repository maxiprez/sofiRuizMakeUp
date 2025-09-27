import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import { AdapterUser } from 'next-auth/adapters';
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

interface ExtendedUser extends AdapterUser {
  tel?: string;
  role: string;
}
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      tel?: string;
      role: string;
      email?: string | null;
      name?: string | null;
    }
  }
  interface User {
    id: string;
    tel?: string;
    role: string;
    email?: string;
    name?: string;
  }
}
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
      async authorize(credentials: Record<string, unknown> | undefined) {
        const { email, password } = credentials as { email: string; password: string };

        if (!email || !password) {
          return null;
        }
    
        try {
          const { data: user, error } = await supabaseClient
            .from("users")
            .select("*")
            .eq("email", email)
            .single();
    
          if (error || !user) {
            return null;
          }
    
          // Validar is_verified SOLO para Credentials
          if (!user.is_verified) {
            throw new Error("USER_NOT_VERIFIED");
          }
    
          const passwordMatch = await bcrypt.compare(password, user.password);
    
          if (!passwordMatch) {
            return null;
          }    
          return { 
            id: user.id, 
            email: user.email, 
            name: user.name, 
            tel: user.tel,
            role: user.role,
            is_verified: user.is_verified 
          };
        } catch (error) {
          console.error("Error durante la autorización:  ", error);
          return null;
        }
      },
    }),
  ],
  
  callbacks: {
    async session({ session, token }) {
     if (session?.user) { //Verifico que exista session.user
        session.user.id = token.id as string;
        const { data: dbUser, error } = await supabaseClient
          .from('users')
          .select('tel, role')
          .eq('id', token.id as string)
          .single();
          if (error) {
            console.error("Error al obtener el teléfono del usuario desde Supabase:", error);
            // Decide cómo quieres manejar el error.  Puedes:
            // 1.  No hacer nada (el teléfono será undefined en la sesión).
            // 2.  Lanzar un error para que el usuario lo vea.
            // 3.  Devolver la sesión sin el teléfono.
          } else {
            (session.user as ExtendedUser).tel = dbUser?.tel;
            (session.user as ExtendedUser).role = dbUser?.role;
          }
        }
        return session;
    },
    async jwt({ token, user, account }) {
      // El 'profile' viene del proveedor de OAuth (Google, en este caso).
      // El 'user' viene de la base de datos (cuando se usa Credentials)
      // Quieres agregar cosas del 'profile' al token, para que estén disponibles
      // en el callback 'session'. En este caso, no obtenemos el teléfono de google.
      if (account?.provider === 'google') {
        token.accessToken = account.access_token;
        token.id = user.id;
      }
      
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    
    async signIn({ user, account, profile }) {

      if (account?.provider === 'google' && profile?.email && profile?.name) {

        try {
          const { data: existingUser, error: selectError } = await supabaseClient
            .from('users')
            .select('id')
            .eq('email', profile.email)
            .maybeSingle();
    
          if (selectError && selectError.code !== 'PGRST116') {
            console.error('Error al verificar el usuario de Google en Supabase:', selectError);
            return false;
          }

          // 1. Correct the type of signedInUser (or dbUserInfo)
          let dbUserInfo: { id: string };

          if (!existingUser && !selectError) {
            const { data: insertedUser, error: insertError } = await supabaseClient
              .from("users")
              .insert({
                name: profile.name,
                email: profile.email,
                tel: null, 
                password: null,
                is_verified: true,
              })
              .select("id, tel") // Only selecting id and tel
              .single();

              if (insertError) {
                console.error('Error al insertar nuevo usuario de Google:', insertError);
                return false;
              }
             
              if (!insertedUser) { // Should not happen if insertError is null, but good practice
                console.error('No se pudo obtener el usuario insertado.');
                return false;
              }
              dbUserInfo = insertedUser;
          } else if (existingUser) {
            dbUserInfo = existingUser;
          } else {
            // This case should ideally not be reached if selectError is handled
            console.error('Usuario de Google no encontrado y no se pudo crear.');
            return false;
          }

          // Augment the user object that NextAuth will use
          user.id = dbUserInfo.id; // Use the database ID

          // 2. Populate user.emailVerified
          // AdapterUser expects emailVerified to be Date | null
          // profile.email_verified is typically a boolean
          if (profile.email_verified !== undefined) { // Check if profile has email_verified
            (user as ExtendedUser).emailVerified = profile.email_verified ? new Date() : null;
          } else {
            (user as ExtendedUser).emailVerified = null; // Default if not provided
          }
          
          // 3. Type-safe assignment for user.tel
          // The 'user' object in signIn is of type User from next-auth, which doesn't have 'tel'
          // We cast to ExtendedUser to add custom properties like 'tel'.
          //(user as ExtendedUser).tel = dbUserInfo.tel ? dbUserInfo.tel : undefined;
          
          return true; // Allow sign-in
        } catch (error) {
          console.error('Error durante el signIn con Google:', error);
          return false;
        }
      }
      return true; // For other providers or scenarios, allow by default
    },
  },
});