import type { Metadata } from "next";
import {Manrope} from "next/font/google";
import "./globals.css";

const manRope = Manrope({
  variable: "--font-manrope",
  subsets: ["cyrillic"],
});

export const metadata: Metadata = {
  title: "coffeit"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${manRope.variable}`}>
        {children}
      </body>
    </html>
  );
}
