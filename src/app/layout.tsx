import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { getClerkPublishableKey, isClerkConfigured } from "@/lib/clerk-config";
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
  const publishableKey = getClerkPublishableKey();
  const content =
    isClerkConfigured() && publishableKey ? (
      <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>
    ) : (
      children
    );

  return (
    <html lang="en">
      <body>{content}</body>
    </html>
  );
}
