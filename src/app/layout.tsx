import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { metadataConfig } from "@/utils/metadata";
import { Analytics } from "@vercel/analytics/react";
import React, { type ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = metadataConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {children}
        {/* GitHub repo link */}
        <a
          href="https://github.com/MarcusHSmith/linear-top-issue"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
          className="fixed bottom-4 right-4 text-white opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path
              fillRule="evenodd"
              d="M12 0.297C5.373 0.297 0 5.67 0 12.297c0 5.28 3.438 9.754 8.205 11.325.6.113.82-.26.82-.577 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.083-.729.083-.729 1.204.085 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.774.42-1.304.763-1.604-2.665-.304-5.467-1.332-5.467-5.932 0-1.31.47-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.323 3.3 1.23a11.513 11.513 0 013.004-.403c1.02.005 2.046.137 3.004.403 2.29-1.553 3.295-1.23 3.295-1.23.653 1.652.242 2.873.118 3.176.768.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.921.432.372.817 1.102.817 2.222 0 1.604-.015 2.896-.015 3.287 0 .32.218.694.825.576C20.565 22.048 24 17.574 24 12.297 24 5.67 18.627.297 12 .297z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <Analytics />
      </body>
    </html>
  );
}
