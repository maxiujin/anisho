import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ani-Sho",
  description: "A live anime topic forum with random discussion pairings."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
