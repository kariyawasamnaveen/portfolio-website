import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://kariyawasamnaveen.github.io'),
  title: "Naveen Sandeepa | Lead Software Architect",
  description: "Elite Mobile (Flutter) & Backend Developer. Specializing in Clean Architecture, BLoC Pattern, and high-performance, scalable systems.",
  keywords: ["Software Architect", "Flutter Developer", "Backend Developer", "Clean Architecture", "Firebase", "Node.js", "Naveen Sandeepa", "Sri Lanka Developer"],
  openGraph: {
    title: "Naveen Sandeepa | Premium Software Architect",
    description: "Explore my cinematic portfolio powered by Voice AI and 3D WebGL.",
    url: "https://kariyawasamnaveen.github.io",
    siteName: "Naveen Sandeepa",
    images: [
      {
        url: "/profile_image.png", // We should have an OG image, for now using profile or fallback
        width: 1200,
        height: 630,
        alt: "Naveen Sandeepa Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naveen Sandeepa | Lead Software Architect",
    description: "Explore my cinematic portfolio powered by Voice AI and 3D WebGL.",
    images: ["/profile_image.png"],
  },
  robots: {
    index: true,
    follow: true,
  }
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