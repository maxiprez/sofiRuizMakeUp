import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/app/providers/AuthProvider";
import Header from "@/app/components/Header";

export const metadata: Metadata = {
  title: "Sofía Ruiz Make up",
  description: "App gestión de turnos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}