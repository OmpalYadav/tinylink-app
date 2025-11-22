// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // 👈 Google Font
import "./globals.css"; // Tailwind & global styles

// Configure Poppins Font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins", // CSS Variable for dynamic use
});

export const metadata: Metadata = {
  title: "TinyLink - URL Shortener",
  description: "Shorten your URLs with style and track clicks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the Poppins font variable globally */}
      <body className={`${poppins.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
