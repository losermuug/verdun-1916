import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

const forum = localFont({
  src: "../public/forum/Forum-Regular.ttf",
  variable: "--font-forum",
  weight: "400",
  display: "swap",
});

const vinqueAntique = localFont({
  src: [
    {
      path: "../public/vinque-antique/vinque antique bd.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/vinque-antique/vinque antique bd it.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-vinque",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
  title: "Вердуны там: Энхийн үнэ цэнэ | 1916",
  description:
    "1916 оны Вердуны тулалдааны түүхэн архивын үзэсгэлэн, 14 байршлын газрын зураг, сүйрсэн есөн тосгон ба харьцуулсан тоо баримт.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="mn"
      className={cn(
        "dark h-full antialiased",
        forum.variable,
        vinqueAntique.variable,
        jetbrainsMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-brass/30 selection:text-foreground">
        {children}
      </body>
    </html>
  );
}
