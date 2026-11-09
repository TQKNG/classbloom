import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClassBloom | Soạn bài nhẹ nhàng hơn",
  description: "Không gian lập kế hoạch bài dạy dành cho giáo viên tiểu học Việt Nam.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
