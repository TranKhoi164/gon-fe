import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-serif-display",
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Gọn Web — Tối ưu thời gian, tập trung việc quan trọng mỗi ngày",
  description:
    "Gọn tâm trí, tỏ mục tiêu. Bám sát mục tiêu, ưu tiên việc quan trọng trong ngày, khóa khung giờ tập trung sâu và biến kiến thức học được thành kết quả thực tế.",
};

import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/shadcn/tooltip";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
