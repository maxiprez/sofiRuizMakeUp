import type { Metadata } from "next";
import "@/app/globals.css";
import AuthProvider from "@/app/providers/AuthProvider";
import HeaderWrapper from "@/app/components/HeaderWrapper";
import { auth } from "auth";
import { Session } from "next-auth";
import { getActiveNotification } from "@/app/_actions/getActiveNotification.action";
import AnnouncementModal from "@/app/components/modals/AnnouncementModal";

export const metadata: Metadata = {
  title: "Sofía Ruiz Make up",
  description: "App gestión de turnos"
};

export interface SessionProps {
  session: Session | null;
}

export default async function RootLayout({ children,}: {children: React.ReactNode; }) {
  const session = await auth();
  const notification = await getActiveNotification();

  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <HeaderWrapper session={session} />
          {notification && <AnnouncementModal announcement={notification} />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}