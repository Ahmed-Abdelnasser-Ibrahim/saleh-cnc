"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Box, ShoppingBag, Settings, LogOut, Home, Menu, X } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/lib/toast-context";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { confirm } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "الإحصائيات", icon: LayoutDashboard, href: "/admin" },
    { name: "المنتجات", icon: Box, href: "/admin/products" },
    { name: "الطلبات", icon: ShoppingBag, href: "/admin/orders" },
    { name: "الإعدادات", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-6 right-6 z-40 p-3 bg-amber-500 text-black rounded-xl shadow-lg shadow-amber-500/20"
      >
        <Menu size={24} />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-72 bg-slate-900 border-l border-white/5 flex flex-col p-6 transition-transform duration-300
        lg:sticky lg:translate-x-0 lg:w-64 h-screen
        ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500/20 shadow-lg shadow-amber-500/5 bg-black">
              <Image
                src="/images/logos/logo-v4.jpg"
                alt="Saleh CNC Logo"
                width={48}
                height={48}
                className="object-cover scale-110"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-amber-500">لوحة</span>
              <span className="text-sm font-bold text-white">التحكم</span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-2">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <Home size={20} />
            <span>المتجر</span>
          </Link>
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
            onClick={async () => {
              const confirmed = await confirm({
                title: "تسجيل الخروج",
                message: "هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة التحكم؟",
                confirmText: "نعم، خروج",
                cancelText: "إلغاء",
                type: "danger"
              });
              if (confirmed) {
                localStorage.removeItem("isAdmin");
                window.location.href = "/login";
              }
            }}
          >
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}
