import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IT Legend | منصة الكورسات الاحترافية",
  description: "منصة تعليمية رائدة في تطوير الويب والبرمجيات بأحدث التقنيات",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#070b19] text-slate-100 font-sans selection:bg-amber-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
