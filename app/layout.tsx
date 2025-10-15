import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "KiwiMarket - 내 근처 미개봉 상품 거래",
  description: "내 근처에서 미개봉 상품을 사고팔 수 있는 로컬 마켓플레이스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-white text-black">
        <Header />
        {children}
      </body>
    </html>
  );
}

