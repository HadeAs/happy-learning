import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🎈 幼儿英语单词匹配游戏",
  description: "幼儿英语单词与图片匹配游戏，在玩乐中学习英语",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
