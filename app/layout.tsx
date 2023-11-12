import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { absoluteUrl } from "@/lib/utils";

const publicSans = Public_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OKeyXin",
  description: "OKeyXin",
  metadataBase: new URL(absoluteUrl('')),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={publicSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <NextTopLoader color="#16a34a" />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
