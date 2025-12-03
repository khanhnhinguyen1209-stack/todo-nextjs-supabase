import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Danh Sách Công Việc",
  description: "Ứng dụng quản lý công việc cá nhân",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}