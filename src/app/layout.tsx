import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
