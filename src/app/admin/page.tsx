"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import { TrendingUp, ShoppingBag, DollarSign, ArrowUpRight, Package, Clock, FileSpreadsheet, Smartphone } from "lucide-react";
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

  // Top Products Calculation
  const productSales: Record<string, number> = {};
  orders.forEach(order => {
    order.items?.forEach(item => {
      productSales[item.name] = (productSales[item.name] || 0) + (item.quantity || 1);
    });
  });
  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Payment Stats
  const codSales = orders.filter(o => o.paymentMethod === "cash_on_delivery").reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  const digitalSales = totalSales - codSales;

  const stats = [
    { name: "إجمالي المبيعات", value: `${totalSales.toLocaleString()} ج.م`, change: orders.length > 0 ? "+100%" : "0%", trending: "up", icon: DollarSign, textColor: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { name: "إجمالي الطلبات", value: totalOrders.toString(), change: orders.length > 0 ? "+100%" : "0%", trending: "up", icon: ShoppingBag, textColor: "text-amber-500", bgColor: "bg-amber-500/10" },
    { name: "طلبات قيد الانتظار", value: pendingOrders.toString(), change: "", trending: "up", icon: Clock, textColor: "text-blue-500", bgColor: "bg-blue-500/10" },
    { name: "المنتجات المباعة", value: orders.reduce((acc, curr) => acc + (curr.items?.length || 0), 0).toString(), change: "", trending: "up", icon: Package, textColor: "text-purple-500", bgColor: "bg-purple-500/10" },
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
    <div className="flex min-h-screen bg-[#050505] text-white">
      <AdminSidebar />
      
      <main className="flex-1 p-4 sm:p-8 pt-20 lg:pt-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black mb-2 text-white">لوحة الإحصائيات</h1>
            <p className="text-gray-400">تابع نمو مشروعك وإحصائيات المبيعات لحظة بلحظة.</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={fetchOrders}
                className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl border border-white/10 transition-all"
                title="تحديث البيانات"
              >
                <Clock size={20} />
              </button>
             <button 
                onClick={exportForPowerBI}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 text-sm"
              >
                <FileSpreadsheet size={18} />
                تصدير التقرير
              </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/50 backdrop-blur-xl p-5 rounded-[24px] border border-white/5 shadow-xl hover:border-white/10 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.textColor} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <h3 className="text-gray-500 text-[10px] sm:text-xs font-bold mb-1 uppercase tracking-wider">{stat.name}</h3>
              <p className="text-lg sm:text-2xl font-black">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Activity Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Payment Distribution */}
            <div className="bg-slate-900/50 p-6 sm:p-8 rounded-[32px] border border-white/5">
               <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                 <DollarSign className="text-emerald-500" /> توزيع المبيعات
               </h3>
               <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                     <span className="text-gray-400 text-xs block mb-1">دفع عند الاستلام</span>
                     <div className="flex justify-between items-end">
                        <span className="text-xl font-bold">{codSales.toLocaleString()} ج.م</span>
                        <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">%{totalSales > 0 ? Math.round((codSales/totalSales)*100) : 0}</span>
                     </div>
                     <div className="w-full h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${totalSales > 0 ? (codSales/totalSales)*100 : 0}%` }} />
                     </div>
                  </div>
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                     <span className="text-gray-400 text-xs block mb-1">دفع إلكتروني (فودافون/إنستاباي)</span>
                     <div className="flex justify-between items-end">
                        <span className="text-xl font-bold">{digitalSales.toLocaleString()} ج.م</span>
                        <span className="text-[10px] text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">%{totalSales > 0 ? Math.round((digitalSales/totalSales)*100) : 0}</span>
                     </div>
                     <div className="w-full h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${totalSales > 0 ? (digitalSales/totalSales)*100 : 0}%` }} />
                     </div>
                  </div>
               </div>
            </div>

            {/* Last Activities */}
            <div className="bg-slate-900/50 rounded-[32px] border border-white/5 p-6 sm:p-8">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black flex items-center gap-2">
                    <Clock className="text-amber-500" size={20} /> آخر النشاطات
                  </h3>
                  <button onClick={() => window.location.href="/admin/orders"} className="text-xs text-amber-500 font-bold hover:underline">عرض الكل</button>
               </div>
               
               <div className="space-y-6">
                  {isLoading ? (
                     <p className="text-center py-10 text-gray-500">جاري التحميل...</p>
                  ) : orders.length > 0 ? (
                    orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center gap-4 group p-3 hover:bg-white/5 rounded-2xl transition-all">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/5 ${
                          order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                           <Package size={20} />
                        </div>
                        <div className="flex-1">
                           <h4 className="text-sm font-bold">{order.customer}</h4>
                           <p className="text-[10px] text-gray-500">#{order.id.slice(-6).toUpperCase()} • {order.city}</p>
                        </div>
                        <div className="text-right">
                           <div className="text-sm font-black">{order.total} ج.م</div>
                           <div className="text-[10px] text-gray-500">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-600">لا يوجد نشاطات مسجلة بعد.</div>
                  )}
               </div>
            </div>
          </div>

          {/* Right Sidebar Stats */}
          <div className="space-y-8">
            {/* Top Products */}
            <div className="bg-slate-900/50 rounded-[32px] border border-white/5 p-6 sm:p-8">
               <h3 className="text-xl font-black mb-8 flex items-center gap-2">
                 <TrendingUp className="text-purple-500" /> الأكثر مبيعاً
               </h3>
               <div className="space-y-6">
                  {topProducts.length > 0 ? topProducts.map(([name, count], index) => (
                    <div key={name} className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-black text-xs text-gray-400">{index + 1}</div>
                       <div className="flex-1">
                          <h4 className="text-xs font-bold line-clamp-1">{name}</h4>
                          <div className="w-full h-1 bg-white/5 rounded-full mt-2">
                             <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(count / (topProducts[0][1] as number)) * 100}%` }} />
                          </div>
                       </div>
                       <span className="text-xs font-black text-gray-400">{count} قطعة</span>
                    </div>
                  )) : (
                    <p className="text-center text-gray-600 text-sm">لا توجد بيانات كافية</p>
                  )}
               </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900/50 rounded-[32px] border border-white/5 p-6 sm:p-8">
               <h3 className="text-xl font-black mb-8">إجراءات سريعة</h3>
               <div className="space-y-4">
                  <button 
                    onClick={() => window.location.href = "/admin/products"}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 transition-all border border-white/5"
                  >
                     إضافة منتج جديد
                  </button>
                  <button 
                    onClick={() => window.location.href = "/admin/orders"}
                    className="w-full py-4 bg-amber-500 text-black hover:bg-amber-600 rounded-2xl text-sm font-black flex items-center justify-center gap-3 transition-all shadow-lg shadow-amber-500/20"
                  >
                     إدارة الطلبات
                  </button>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
