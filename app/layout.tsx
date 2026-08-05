import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naveen Sandeepa | Mobile & Backend Developer",
  description: "Portfolio of Naveen Sandeepa. Specializing in scalable mobile applications, clean architecture, and high-performance engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} text-white selection:bg-blue-600/30`}>
        <ClientWrapper>
            {children}
        </ClientWrapper>
      </body>
    </html>
  );
}