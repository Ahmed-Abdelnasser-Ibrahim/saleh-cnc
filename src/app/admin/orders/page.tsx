"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import { Search, Eye, Trash2, CheckCircle, Clock, X, Phone, User, MapPin, Package, FileSpreadsheet, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/lib/toast-context";
import { useAdminAuth } from "@/hooks/useAdminAuth";

import { Order } from "@/lib/data";

export default function AdminOrdersPage() {
  const { isLoading: authLoading } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast, confirm } = useToast();

  const fetchOrders = React.useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      showToast("خطأ في تحميل الطلبات", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        showToast("تم حذف الطلب بنجاح", "success");
        fetchOrders();
      }
    } catch {
      showToast("فشل حذف الطلب", "error");
    }
  };

  useEffect(() => {
    if (!authLoading) {
      Promise.resolve().then(() => fetchOrders());
    }
  }, [authLoading, fetchOrders]);

  const exportToPowerBI = () => {
    if (orders.length === 0) {
      showToast("لا توجد بيانات للتصدير", "info");
      return;
    }
    const headers = ["OrderID", "CustomerName", "Phone", "ItemCount", "TotalAmount", "Status", "OrderDate", "Address", "City"];
    const rows = orders.map(o => [
      o.id, 
      `"${o.customer}"`, 
      `'${o.phone}`, 
      Array.isArray(o.items) ? o.items.length : 0, 
      o.total, 
      o.status, 
      o.date, 
      `"${o.address}"`, 
      `"${o.city}"`
    ]);
    
    const csvContent = "\ufeff" + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `saleh_cnc_powerbi_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("تم تصدير تقرير Power BI بنجاح", "success");
  };

  const filteredOrders = orders.filter(o => 
    o.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.phone.includes(searchTerm)
  );

  // Conditional rendering AFTER all hooks
  if (authLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-bold">جاري التحقق...</div>;

  return (
    <div className="flex min-h-screen bg-[#050505]">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">إدارة الطلبات</h1>
            <p className="text-gray-400">تتبع طلبات العملاء الحقيقية وحالات التوصيل.</p>
          </div>
          <button 
            onClick={exportToPowerBI}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
          >
            <FileSpreadsheet size={20} />
            تصدير لـ Power BI
          </button>
        </header>

        <div className="bg-slate-900 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-white/[0.02]">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="ابحث في طلباتك الحالية..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-12 pl-4 outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-gray-500 text-sm bg-white/[0.01]">
                  <th className="p-6 font-medium">رقم الطلب</th>
                  <th className="p-6 font-medium">العميل</th>
                  <th className="p-6 font-medium">المنتجات</th>
                  <th className="p-6 font-medium">الإجمالي</th>
                  <th className="p-6 font-medium">الحالة</th>
                  <th className="p-6 font-medium">التاريخ</th>
                  <th className="p-6 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                   <tr>
                     <td colSpan={7} className="p-10 text-center text-gray-500">جاري تحميل البيانات...</td>
                   </tr>
                ) : filteredOrders.length > 0 ? (
                  <AnimatePresence>
                    {filteredOrders.map((order) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="p-6 font-bold text-amber-500">{order.id}</td>
                        <td className="p-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-white">{order.customer}</span>
                            <span className="text-xs text-gray-500">{order.phone}</span>
                          </div>
                        </td>
                        <td className="p-6 text-gray-400">{Array.isArray(order.items) ? order.items.length : 0} قطع</td>
                        <td className="p-6 font-bold text-white">{order.total} ج.م</td>
                        <td className="p-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${
                            order.status === "pending" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                            order.status === "completed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                            "bg-red-500/10 text-red-500 border-red-500/20"
                          }`}>
                            {order.status === "pending" ? <Clock size={12} /> : order.status === "completed" ? <CheckCircle size={12} /> : <X size={12} />}
                            {order.status === "pending" ? "قيد الانتظار" : order.status === "completed" ? "تم التوصيل" : "ملغي"}
                          </span>
                        </td>
                        <td className="p-6 text-gray-500 text-sm">{order.date}</td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={async () => {
                                if(await confirm("هل أنت متأكد؟")) handleDelete(order.id);
                              }}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                ) : (
                  <tr>
                    <td colSpan={7} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-gray-600">
                        <ShoppingBag size={48} />
                        <p className="text-xl font-bold">لا توجد طلبات حتى الآن</p>
                        <p className="text-sm">بمجرد قيام العملاء بطلب، ستظهر التفاصيل هنا.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Order Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedOrder(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-slate-900 border border-white/10 rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl"
              >
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <Package className="text-amber-500" />
                    <h2 className="text-2xl font-bold">تفاصيل الطلب {selectedOrder.id}</h2>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/5 rounded-full">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-8 space-y-8">
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="text-amber-500 font-bold text-sm uppercase tracking-widest">بيانات العميل</h4>
                        <div className="space-y-3">
                           <div className="flex items-center gap-3 text-gray-300">
                              <User size={18} className="text-gray-500" />
                              <span>{selectedOrder.customer}</span>
                           </div>
                           <div className="flex items-center gap-3 text-gray-300">
                              <Phone size={18} className="text-gray-500" />
                              <span dir="ltr">{selectedOrder.phone}</span>
                           </div>
                           <div className="flex items-center gap-3 text-gray-300">
                              <MapPin size={18} className="text-gray-500" />
                              <span>{selectedOrder.address}, {selectedOrder.city}</span>
                           </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-amber-500 font-bold text-sm uppercase tracking-widest">ملخص الحساب</h4>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
                           <div className="flex justify-between text-sm">
                              <span className="text-gray-500">عدد القطع</span>
                              <span className="text-white font-bold">{Array.isArray(selectedOrder.items) ? selectedOrder.items.length : 0}</span>
                           </div>
                           <div className="flex justify-between text-sm">
                              <span className="text-gray-500">حالة الدفع</span>
                              <span className="text-emerald-500 font-bold">عند الاستلام</span>
                           </div>
                           <div className="h-px bg-white/10 my-2" />
                           <div className="flex justify-between text-lg">
                              <span className="text-gray-300">الإجمالي</span>
                              <span className="text-amber-500 font-black">{selectedOrder.total} ج.م</span>
                           </div>
                        </div>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          showToast("تم تحديث حالة الطلب", "success");
                          setSelectedOrder(null);
                        }}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all"
                      >
                        تغيير الحالة لتم التوصيل
                      </button>
                      <button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl border border-white/10 transition-all">طباعة الفاتورة</button>
                   </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
