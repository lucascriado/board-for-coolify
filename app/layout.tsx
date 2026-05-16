import type { Metadata } from "next";
import { Fustat, Inter_Tight } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const fustat = Fustat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-fustat",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Board Coolify",
  description: "Dashboard visual para sua infraestrutura Coolify",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value === "light" ? "light" : "dark";

  return (
    <html lang="pt-BR" className={`${theme} ${fustat.variable} ${interTight.variable}`}>
      <body>{children}</body>
    </html>
  );
}
