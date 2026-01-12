import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InterChange - AI Parts Cross-Reference",
  description: "AI-powered automotive and industrial parts cross-referencing system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
