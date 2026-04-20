"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Box, ShoppingBag, Settings, LogOut, Home } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "الإحصائيات", icon: LayoutDashboard, href: "/admin" },
    { name: "المنتجات", icon: Box, href: "/admin/products" },
    { name: "الطلبات", icon: ShoppingBag, href: "/admin/orders" },
    { name: "الإعدادات", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-l border-white/5 h-screen sticky top-0 flex flex-col p-6">
      <div className="flex items-center gap-2 mb-10">
        <span className="text-xl font-bold text-amber-500">لوحة</span>
        <span className="text-xl font-bold text-white">التحكم</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
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
          onClick={() => {
            localStorage.removeItem("isAdmin");
            window.location.href = "/login";
          }}
        >
          <LogOut size={20} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
