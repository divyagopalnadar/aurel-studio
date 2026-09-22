import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aurél Studio — Premium Audio, Wearables & Everyday Tech",
  description:
    "Thoughtfully engineered audio, wearables, and everyday electronics. A fictional premium e-commerce store built with Next.js.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k="aurel-theme";var t=localStorage.getItem(k);var d="dark";if(!t){var p=window.matchMedia("(prefers-color-scheme: light)");d=p.matches?"light":"dark";}else{d=t;}var r=document.documentElement;r.classList.toggle("dark",d==="dark");r.style.colorScheme=d;}catch(e){document.documentElement.classList.add("dark");}})();`,
          }}
        />
      </head>
      <body className="app-ambient min-h-full">
        <CartProvider>
          <Header />
          <main className="flex flex-col">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
