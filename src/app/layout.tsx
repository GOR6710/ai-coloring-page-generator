import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Coloring Page Generator - Free Printable Coloring Pages",
  description:
    "Generate custom coloring pages with AI! Just type what you want, choose a style and difficulty, and get a printable coloring page in seconds. Free for kids and adults.",
  keywords:
    "AI coloring page generator, free printable coloring pages, custom coloring pages, coloring page maker, kids coloring pages, adult coloring pages",
  openGraph: {
    title: "AI Coloring Page Generator - Free Custom Printable Pages",
    description: "Generate any coloring page you can imagine with AI. Free, instant, printable.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>{children}</body>
    </html>
  );
}
