import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "News Hub",
  description: "A modern news hub built with Next.js",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: headers() });
  const isAuthenticated = Boolean(session?.user);
  return (
    <html lang="en">
      <body>
        <Navbar isAuthenticated={isAuthenticated} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
