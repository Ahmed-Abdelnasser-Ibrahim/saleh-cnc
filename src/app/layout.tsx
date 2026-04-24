import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { ToastProvider } from "@/lib/toast-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import StructuredData from "@/components/SEO/StructuredData";


const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: {
    default: "صالح CNC | ليزر CNC ونجارة الأخشاب - تصنيع وتصميمات مبتكرة",
    template: "%s | صالح CNC"
  },
  description: "صالح CNC هو وجهتك الأولى لأعمال ليزر CNC ونجارة الأخشاب في مصر. نقدم خدمات حفر ليزر، تصميمات CNC خشب، ديكورات منزلية، وهدايا خشبية مخصصة بأعلى جودة.",
  keywords: [
    "ليزر CNC", "CNC خشب", "نجارة CNC", "ورشة CNC", "حفر ليزر مصر", 
    "تصميمات CNC", "ديكورات خشبية ليزر", "ساعات حائط خشب", "هدايا خشبية مخصصة",
    "ماكينات CNC", "أعمال خشبية فنية", "تصميمات ليزر جاهزة", "صالح CNC"
  ],
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
    title: "صالح CNC | أفضل أعمال ليزر CNC ونجارة الأخشاب في مصر",
    description: "اكتشف إبداع صالح CNC في تصميمات الخشب والليزر. خدمات احترافية، جودة عالمية، وأسعار تنافسية لكل احتياجات الديكور والهدايا.",
    url: "https://saleh-cnc.com",
    siteName: "صالح CNC",
    images: [
      {
        url: "/images/hero-cnc.jpg",
        width: 1200,
        height: 630,
        alt: "صالح CNC - رواد أعمال الليزر والخشب",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "صالح CNC | ليزر CNC ونجارة الأخشاب",
    description: "نحول الخشب إلى تحف فنية بدقة ماكينات CNC والليزر. اطلب تصميمك الخاص الآن.",
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
  verification: {
    google: "k2kse5ivOi3itDEo8bSkaO4HiYTb-PsyqAqhaibtACc",
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
      <head>
        <meta name="google-site-verification" content="k2kse5ivOi3itDEo8bSkaO4HiYTb-PsyqAqhaibtACc" />
      </head>
      <body className="min-h-full flex flex-col font-cairo bg-[#0a0a0a] text-white" suppressHydrationWarning>
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <StructuredData 
                type="Organization" 
                data={{
                  name: "صالح CNC",
                  url: "https://saleh-cnc.com",
                  logo: "https://saleh-cnc.com/images/logos/logo-v4.jpg",
                  contactPoint: {
                    "@type": "ContactPoint",
                    "telephone": "+201068256479",
                    "contactType": "customer service",
                    "areaServed": "EG",
                    "availableLanguage": "Arabic"
                  },
                  sameAs: [
                    "https://facebook.com/salehcnc",
                    "https://instagram.com/salehcnc"
                  ]
                }} 
              />
              {children}
              <FloatingWhatsApp />
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
