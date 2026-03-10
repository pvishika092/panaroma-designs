import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/hooks/useSystemsTheme";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Supplier Hub",
  description: "By Panaroma Intelligence Solutions",
  icons: {
    // icon: [
    //   {
    //     media: "(prefers-color-scheme: dark)",
    //     url: "/logoHolmes.svg",
    //     href: "/logoHolmes.svg",
    //   },
    //   {
    //     media: "(prefers-color-scheme: light)",
    //     url: "/logoHolmes.svg",
    //     href: "/logoHolmes.svg",
    //   },
    // ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${publicSans.variable} antialiased select-none overflow-hidden`}
      >
        <ThemeProvider>
         {children}  
        </ThemeProvider>

      </body>
    </html>
  );
}
