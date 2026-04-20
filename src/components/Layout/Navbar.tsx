"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import CartSidebar from "./CartSidebar";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "glass py-3" : "bg-transparent py-5"
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Desktop & Tablet: Logo on Right (RTL) */}
            <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-1 group">
              <span className="text-white group-hover:text-amber-500 transition-colors">SALEH</span>
              <span className="text-amber-500 group-hover:text-white transition-colors underline decoration-2 underline-offset-4 decoration-white/20">CNC</span>
            </Link>

            {/* Desktop & Tablet Links (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8 text-sm lg:text-base">
              <Link href="/" className="hover:text-amber-500 transition-colors">الرئيسية</Link>
              <Link href="/products" className="hover:text-amber-500 transition-colors">المنتجات</Link>
              <Link href="/categories" className="hover:text-amber-500 transition-colors">التصنيفات</Link>
              <Link href="/about" className="hover:text-amber-500 transition-colors">عن المتجر</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Desktop Search */}
              <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus-within:border-amber-500/50 transition-all group">
                <input
                  type="text"
                  placeholder="ابحث هنا..."
                  className="bg-transparent border-none outline-none text-sm w-24 lg:w-48 focus:w-32 lg:focus:w-64 transition-all"
                />
                <Search size={16} className="text-gray-500 group-focus-within:text-amber-500" />
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <Link href="/login" className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                  <User size={20} />
                </Link>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
                >
                  <ShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Mobile Menu Toggle (Left on RTL Mobile) */}
                <button
                  className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search Row */}
          <div className="mt-4 md:hidden">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-amber-500/50 transition-all">
              <input
                type="text"
                placeholder="ابحث عن تصميم..."
                className="bg-transparent border-none outline-none text-sm w-full"
              />
              <Search size={18} className="text-gray-500" />
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60]"
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
                  <span className="text-2xl font-black text-amber-500">SALEH CNC</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-full">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex flex-col gap-8 text-xl font-bold">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-500 transition-colors">الرئيسية</Link>
                  <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-500 transition-colors">المنتجات</Link>
                  <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-500 transition-colors">التصنيفات</Link>
                  <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-500 transition-colors">عن المتجر</Link>
                </div>

                <div className="mt-auto pt-8 border-t border-white/10 space-y-4">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-400">
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
