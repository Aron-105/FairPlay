import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "FairPlay",
    template: "%s | FairPlay",
  },
  description:
    "Create balanced Spotify playlists with fair representation across your music.",
  metadataBase: new URL("https://fairplay.aaronalcalde.com"),
  openGraph: {
    title: "FairPlay",
    description:
      "Generate balanced Spotify playlists with fair representation.",
    url: "https://fairplay.aaronalcalde.com",
    siteName: "FairPlay",
    type: "website",
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
      >
        {children}
      </body>
    </html>
  );
}
