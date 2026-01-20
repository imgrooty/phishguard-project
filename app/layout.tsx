import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SessionProviderComponent } from "@/components/SessionProvider";
import { EmailProvider } from "@/components/EmailContext";

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
      <body className="antialiased">
        <EmailProvider>
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
