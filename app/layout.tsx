import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LipaFast",
  description:
    "Micro-export compliance & payment gateway for Ugandan artisans and freelancers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
