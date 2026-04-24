import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { ToastProvider } from "@/lib/toast-context";
import { WishlistProvider } from "@/lib/wishlist-context";


const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: {
    default: "صالح CNC | أرقى تصميمات ماكينات الليزر والأخشاب",
    template: "%s | صالح CNC"
  },
  description: "اكتشف عالم الإبداع مع صالح CNC. نوفر لك أرقى وأجمل تصميمات ماكينات الليزر والأخشاب، ديكورات منزلية، ساعات حائط، وهدايا خشبية متميزة بجودة استثنائية وأسعار تنافسية.",
  keywords: ["CNC", "ليزر", "أخشاب", "تصميمات خشبية", "ديكورات", "ساعات حائط", "هدايا", "حفر ليزر", "مصر", "تصميم داخلي"],
  authors: [{ name: "Saleh CNC" }],
  creator: "Saleh CNC",
  publisher: "Saleh CNC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://saleh-cnc.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "صالح CNC | أرقى تصميمات ماكينات الليزر والأخشاب",
    description: "اكتشف عالم الإبداع مع صالح CNC. نوفر لك أرقى وأجمل تصميمات ماكينات الليزر والأخشاب بجودة استثنائية.",
    url: "https://saleh-cnc.com",
    siteName: "صالح CNC",
    images: [
      {
        url: "/images/hero-cnc.jpg",
        width: 1200,
        height: 630,
        alt: "صالح CNC - تصميمات خشبية متقنة",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "صالح CNC | أرقى تصميمات ماكينات الليزر والأخشاب",
    description: "اكتشف عالم الإبداع مع صالح CNC. نوفر لك أرقى وأجمل تصميمات ماكينات الليزر والأخشاب بجودة استثنائية.",
    images: ["/images/hero-cnc.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

import dynamic from "next/dynamic";

const FloatingWhatsApp = dynamic(() => import("@/components/UI/FloatingWhatsApp"));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-cairo bg-[#0a0a0a] text-white" suppressHydrationWarning>
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
              <FloatingWhatsApp />
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
