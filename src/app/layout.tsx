import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AuthProvider } from "@/contexts/auth-context";

export const metadata: Metadata = {
  title: "News Hub",
  description: "A modern news hub built with Next.js",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
 
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
