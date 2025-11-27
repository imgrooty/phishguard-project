import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SessionProviderComponent } from "@/components/SessionProvider";
<<<<<<< HEAD
=======
import { EmailProvider } from "@/components/EmailContext";

>>>>>>> 94b66900742252551c618d17a6bedf5d5364d3f4

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PhishGuard",
  description: "Proctecting you always",
  icons: {
    icon: 'favicon.png', // Path to your favicon in the public directory
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><EmailProvider>
        <SessionProviderComponent>
          <Header />
          {children}
        </SessionProviderComponent>
        </EmailProvider>
        <Footer />
      </body>
    </html>
  );
}
