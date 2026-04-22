"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import { TrendingUp, ShoppingBag, DollarSign, ArrowUpRight, Package, Clock, FileSpreadsheet } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/lib/toast-context";
import { useAdminAuth } from "@/hooks/useAdminAuth";

import { Order } from "@/lib/data";

export default function AdminDashboard() {
  const { isLoading: authLoading } = useAdminAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = React.useCallback(async () => {
    try {
      const res = await fetch("/api/orders", {
        headers: { "x-admin-auth": "true" }
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      showToast("خطأ في تحميل البيانات", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!authLoading) {
      Promise.resolve().then(() => fetchOrders());
    }
  }, [authLoading, fetchOrders]);

  if (authLoading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-bold">جاري التحقق...</div>;
  }

  // Safe Calculation
  const totalSales = orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const completedOrders = orders.filter(o => o.status === "completed").length;

  const stats = [
    { name: "إجمالي المبيعات", value: `${totalSales.toLocaleString()} ج.م`, change: orders.length > 0 ? "+100%" : "0%", trending: "up", icon: DollarSign, textColor: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { name: "إجمالي الطلبات", value: totalOrders.toString(), change: orders.length > 0 ? "+100%" : "0%", trending: "up", icon: ShoppingBag, textColor: "text-amber-500", bgColor: "bg-amber-500/10" },
    { name: "طلبات قيد الانتظار", value: pendingOrders.toString(), change: "", trending: "up", icon: Clock, textColor: "text-blue-500", bgColor: "bg-blue-500/10" },
    { name: "طلبات مكتملة", value: completedOrders.toString(), change: "", trending: "up", icon: TrendingUp, textColor: "text-purple-500", bgColor: "bg-purple-500/10" },
  ];

  const exportForPowerBI = () => {
    if (orders.length === 0) {
      showToast("لا توجد بيانات للتصدير", "info");
      return;
    }
    const headers = ["MetricName", "Value"];
    const summaryRows = [
      ["TotalSales", totalSales],
      ["TotalOrders", totalOrders],
      ["PendingOrders", pendingOrders],
      ["CompletedOrders", completedOrders]
    ];
    
    const csvContent = "\ufeff" + headers.join(",") + "\n" + summaryRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `saleh_cnc_real_analytics_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("تم تصدير تقرير الإحصائيات لـ Power BI", "success");
  };

  return (
    <div className="flex min-h-screen bg-[#050505]">
      <AdminSidebar />
      
      <main className="flex-1 p-4 sm:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">لوحة الإحصائيات</h1>
            <p className="text-gray-400">إحصائيات حقيقية بناءً على طلبات عملائك الفعلية.</p>
          </div>
          <button 
            onClick={exportForPowerBI}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
          >
            <FileSpreadsheet size={20} />
            تصدير إحصائيات Power BI
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-[32px] border border-white/5 shadow-xl hover:border-white/10 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bgColor} ${stat.textColor} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
                {stat.change && (
                  <div className={`flex items-center gap-1 text-xs font-bold ${stat.trending === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stat.change}
                    <ArrowUpRight size={14} />
                  </div>
                )}
              </div>
              <h3 className="text-gray-500 text-sm mb-1">{stat.name}</h3>
              <p className="text-2xl font-black">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Real Activity List */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl sm:rounded-[32px] border border-white/5 p-4 sm:p-8 shadow-xl">
             <div className="flex items-center gap-2 mb-8">
                <Clock className="text-amber-500" size={20} />
                <h3 className="text-xl font-bold">آخر النشاطات</h3>
             </div>
             
             <div className="space-y-6">
                {isLoading ? (
                   <p className="text-center py-10 text-gray-500">جاري التحميل...</p>
                ) : orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                         <Package size={18} className="text-gray-500" />
                      </div>
                      <div className="flex-1">
                         <h4 className="text-sm font-bold">{order.customer}</h4>
                         <p className="text-[10px] text-gray-500">رقم الطلب: {order.id}</p>
                      </div>
                      <div className="text-right">
                         <div className="text-sm font-black">{order.total} ج.م</div>
                         <div className="text-[10px] text-gray-500">{order.date}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-600">لا يوجد نشاطات مسجلة بعد.</div>
                )}
             </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900 rounded-2xl sm:rounded-[32px] border border-white/5 p-4 sm:p-8 shadow-xl">
             <h3 className="text-xl font-bold mb-8">إجراءات سريعة</h3>
             <div className="space-y-4">
                <button 
                  onClick={() => window.location.href = "/admin/products"}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 transition-all border border-white/5"
                >
                   إضافة منتج جديد
                </button>
                <button 
                  onClick={() => window.location.href = "/admin/orders"}
                  className="w-full py-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 transition-all border border-amber-500/10"
                >
                   إدارة الطلبات
                </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
