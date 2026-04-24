import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-16 lg:pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16 text-center sm:text-right">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-500/20 group-hover:border-amber-500 transition-colors shadow-xl bg-black">
                <Image
                  src="/images/logos/logo-v4.jpg"
                  alt="Saleh CNC Logo"
                  width={56}
                  height={56}
                  className="object-cover scale-110"
                />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                SALEH<span className="text-amber-500">CNC</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-8 leading-relaxed text-sm md:text-base max-w-xs">
              وجهتك الأولى لأرقى التصميمات الخشبية المشغولة بدقة الليزر. نجمع بين الفن والتكنولوجيا لنقدم لك قطعاً فريدة.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 rounded-xl hover:bg-amber-500 hover:text-black transition-all border border-white/10">
                <FacebookIcon />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 rounded-xl hover:bg-amber-500 hover:text-black transition-all border border-white/10">
                <InstagramIcon />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 rounded-xl hover:bg-amber-500 hover:text-black transition-all border border-white/10">
                <TwitterIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="hidden md:block">
            <h3 className="text-lg font-bold mb-6 text-white">روابط سريعة</h3>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/" className="hover:text-amber-500 transition-colors">الرئيسية</Link></li>
              <li><Link href="/products" className="hover:text-amber-500 transition-colors">جميع المنتجات</Link></li>
              <li><Link href="/categories" className="hover:text-amber-500 transition-colors">التصنيفات</Link></li>
              <li><Link href="/about" className="hover:text-amber-500 transition-colors">من نحن</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">اتصل بنا</h3>
            <ul className="space-y-4 text-gray-400 flex flex-col items-center md:items-start">
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-amber-500" />
                <span dir="ltr">+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-amber-500" />
                <span>info@saleh-cnc.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-amber-500" />
                <span>القاهرة، مصر</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="md:col-span-2 lg:col-span-1">
             <h3 className="text-lg font-bold mb-6 text-white">النشرة البريدية</h3>
             <p className="text-gray-400 text-sm mb-6">اشترك للحصول على أحدث التصميمات والعروض الحصرية.</p>
             <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 focus-within:border-amber-500/50 transition-all">
                <input 
                  type="email" 
                  placeholder="بريدك الإلكتروني" 
                  className="bg-transparent border-none outline-none px-4 py-2 flex-1 text-sm"
                />
                <button className="bg-amber-500 text-black font-bold px-4 py-2 rounded-lg text-sm transition-all hover:bg-amber-600">
                  اشترك
                </button>
             </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-gray-500 text-xs md:text-sm">
          <p>© {new Date().getFullYear()} SALEH CNC. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
