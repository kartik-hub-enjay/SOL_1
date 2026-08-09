import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spark | Find Your Crowd",
  description: "Find your genuine interest crowd, join trusted circles, and climb toward the National Guild.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-paper font-body selection:bg-ember selection:text-ink">
        {children}
      </body>
    </html>
  );
}
