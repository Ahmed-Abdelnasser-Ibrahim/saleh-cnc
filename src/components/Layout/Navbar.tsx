"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, Heart } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const CartSidebar = dynamic(() => import("./CartSidebar"), { ssr: false });

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
    let lastScrollY = 0;
    let ticking = false;

    const handleScroll = () => {
      lastScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(lastScrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    requestAnimationFrame(() => {
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
    });
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const adminLink = mounted ? (isAdmin ? "/admin" : "/login") : "/login";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isSearchOpen ? "bg-black/95 border-b border-white/5 py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group relative">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 transition-transform duration-500 group-hover:scale-105 will-change-transform">
                {/* Golden Glow Effect - Optimized opacity for performance */}
                <div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-amber-500/30 group-hover:border-amber-500 transition-colors shadow-2xl bg-black">
                  <Image
                    src="/images/logos/logo-1.png"
                    alt="صالح CNC لوجو"
                    fill
                    sizes="(max-width: 640px) 48px, 64px"
                    className="object-cover scale-110"
                    priority
                  />
                </div>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8 font-bold">
              <Link href="/" title="الرئيسية" className="text-gray-200 hover:text-amber-500 transition-colors text-sm lg:text-base">الرئيسية</Link>
              <Link href="/products" title="المنتجات" className="text-gray-200 hover:text-amber-500 transition-colors text-sm lg:text-base">المنتجات</Link>
              <Link href="/track-order" title="تتبع طلبك" className="text-amber-500 hover:text-amber-400 transition-colors text-sm lg:text-base flex items-center gap-2">
                <Search size={16} /> تتبع طلبك
              </Link>
              <Link href="/about" title="عن المتجر" className="text-gray-200 hover:text-amber-500 transition-colors text-sm lg:text-base">عن المتجر</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-amber-500/50 transition-all group">
                <input
                  type="text"
                  aria-label="بحث عن منتجات"
                  placeholder="ابحث هنا..."
                  className="bg-transparent border-none outline-none text-sm w-24 lg:w-48 focus:w-32 lg:focus:w-64 transition-all text-white placeholder:text-gray-400"
                />
                <Search size={16} className="text-gray-400 group-focus-within:text-amber-500" aria-hidden="true" />
              </div>

              <div className="flex items-center gap-0.5 sm:gap-1.5">
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  aria-label="فتح البحث"
                  className="lg:hidden p-3 hover:bg-white/10 rounded-full transition-colors text-gray-200 hover:text-white shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <Search size={20} aria-hidden="true" />
                </button>

                <Link 
                  href={adminLink} 
                  aria-label="حسابي"
                  title="حسابي"
                  className="p-3 hover:bg-white/10 rounded-full transition-colors text-gray-200 hover:text-white shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <User size={20} className="sm:w-6 sm:h-6" aria-hidden="true" />
                </Link>

                <Link
                  href="/wishlist"
                  aria-label="المفضلة"
                  title="المفضلة"
                  className="p-3 hover:bg-white/10 rounded-full transition-colors relative text-gray-200 hover:text-amber-500 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <Heart size={20} className={`sm:w-6 sm:h-6 ${wishlist.length > 0 ? "fill-current text-amber-500" : ""}`} aria-hidden="true" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-amber-500 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-black">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => setIsCartOpen(true)}
                  aria-label="سلة المشتريات"
                  title="سلة المشتريات"
                  className="p-3 hover:bg-white/10 rounded-full transition-colors relative text-gray-200 hover:text-white shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <ShoppingCart size={20} className="sm:w-6 sm:h-6" aria-hidden="true" />
                  {totalItems > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-amber-500 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-black">
                      {totalItems}
                    </span>
                  )}
                </button>

                <button
                  aria-label="القائمة"
                  className="md:hidden p-3 hover:bg-white/10 rounded-full transition-colors text-white shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu size={24} className="sm:w-7 sm:h-7" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search Input Row */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden mt-4 pt-4 border-t border-white/5 overflow-hidden"
              >
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="ابحث عن منتج..."
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-12 pl-4 outline-none focus:border-amber-500 transition-all text-sm"
                  />
                  <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/95 z-[60]"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-slate-950 z-[70] p-8 shadow-2xl flex flex-col"
              >
                <div className="flex justify-between items-center mb-12">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500/30 bg-black">
                      <Image
                        src="/images/logos/logo-1.png"
                        alt="Saleh CNC Logo"
                        width={48}
                        height={48}
                        sizes="48px"
                        className="object-cover scale-110"
                      />
                    </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-full text-white">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex flex-col gap-8 text-xl font-bold">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-amber-500 transition-colors">الرئيسية</Link>
                  <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-amber-500 transition-colors">المنتجات</Link>
                  <Link href="/track-order" onClick={() => setIsMobileMenuOpen(false)} className="text-amber-500 font-black flex items-center gap-2">
                    <Search size={20} /> تتبع طلبك
                  </Link>
                  <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-amber-500 transition-colors">التصنيفات</Link>
                  <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-amber-500 transition-colors">عن المتجر</Link>
                  <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-amber-500 transition-colors">المفضلة</Link>
                </div>

                <div className="mt-auto pt-8 border-t border-white/10 space-y-4">
                  <Link href={adminLink} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-400">
                    <User size={20} />
                    <span>لوحة التحكم</span>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
