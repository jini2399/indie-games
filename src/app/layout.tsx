import type { Metadata } from "next";
import { Cinzel, IM_Fell_English } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cinzel",
});

const imFellEnglish = IM_Fell_English({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-im-fell",
});

export const metadata: Metadata = {
  title: "카피바라 방치형 RPG 🦫",
  description: "도트 아트 스타일 방치형 RPG! 카피바라를 키워 최강이 되세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${cinzel.variable} ${imFellEnglish.variable}`} style={{ fontFamily: "var(--font-cinzel)" }}>
      <body style={{ fontFamily: "var(--font-cinzel)" }}>{children}</body>
    </html>
  );
}
