import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/app/providers/AuthProvider";
import HeaderWrapper from "@/app/components/HeaderWrapper";
import { auth } from "../../auth";

export const metadata: Metadata = {
  title: "Sofía Ruiz Make up",
  description: "App gestión de turnos"
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;  
}) {
  const session = await auth();

  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <HeaderWrapper user={session?.user} />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}